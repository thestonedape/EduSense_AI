"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getAcademicCatalog, uploadLecture } from "@/lib/api/services";

type CatalogDepartment = {
  department: string;
  programs: Array<{
    name: string;
    subjects: Array<{ code: string; name: string }>;
  }>;
};

export default function UploadManagerPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [catalog, setCatalog] = useState<CatalogDepartment[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [programName, setProgramName] = useState("");
  const [subjectValue, setSubjectValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const data = await getAcademicCatalog();
        if (cancelled) return;
        setCatalog(data);
        if (!data.length) {
          setCatalogError("The academic catalog is empty right now. Add at least one department, program, and subject on the backend.");
        }
        const firstDepartment = data[0];
        const firstProgram = firstDepartment?.programs[0];
        const firstSubject = firstProgram?.subjects[0];
        setDepartmentName(firstDepartment?.department ?? "");
        setProgramName(firstProgram?.name ?? "");
        setSubjectValue(firstSubject ? `${firstSubject.code}|||${firstSubject.name}` : "");
      } catch {
        if (!cancelled) {
          setCatalog([]);
          setCatalogError("We could not load departments, programs, and subjects from the backend.");
        }
      } finally {
        if (!cancelled) {
          setCatalogLoading(false);
        }
      }
    }

    void loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDepartment = useMemo(
    () => catalog.find((item) => item.department === departmentName) ?? null,
    [catalog, departmentName],
  );
  const programs = selectedDepartment?.programs ?? [];
  const selectedProgram = programs.find((item) => item.name === programName) ?? null;
  const subjects = selectedProgram?.subjects ?? [];
  const catalogReady = Boolean(catalog.length) && !catalogLoading && !catalogError;

  useEffect(() => {
    if (!programs.length) {
      setProgramName("");
      setSubjectValue("");
      return;
    }
    if (!programs.some((item) => item.name === programName)) {
      const nextProgram = programs[0];
      setProgramName(nextProgram.name);
      const nextSubject = nextProgram.subjects[0];
      setSubjectValue(nextSubject ? `${nextSubject.code}|||${nextSubject.name}` : "");
    }
  }, [programs, programName]);

  useEffect(() => {
    if (!subjects.length) {
      setSubjectValue("");
      return;
    }
    if (!subjects.some((item) => `${item.code}|||${item.name}` === subjectValue)) {
      const nextSubject = subjects[0];
      setSubjectValue(nextSubject ? `${nextSubject.code}|||${nextSubject.name}` : "");
    }
  }, [subjects, subjectValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isUploading) return;
    const formData = new FormData(event.currentTarget);
    const [subjectCode, subjectName] = subjectValue.split("|||");
    if (departmentName) formData.set("department_name", departmentName);
    if (programName) formData.set("program_name", programName);
    if (subjectCode) formData.set("subject_code", subjectCode);
    if (subjectName) formData.set("subject_name", subjectName);
    setIsUploading(true);
    setMessage("Uploading lecture and preparing the live workspace...");
    try {
      const response = await uploadLecture(formData);
      setMessage(response.message ?? "Lecture created. Opening live workspace...");
      if (response.lecture_id) {
        router.push(`/admin/lectures/${response.lecture_id}`);
      }
    } catch (error) {
      const value = error as AxiosError<{ detail?: string }> | undefined;
      setMessage(value?.response?.data?.detail ?? "Lecture upload failed. Check storage setup and try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Create Lecture</p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Create a lecture record</h1>
        <p className="mt-2 text-muted-foreground">
          Upload the primary lecture recording, add trusted references or supporting lecture assets, and continue into the review workflow.
        </p>
      </div>

      <Card className="max-w-3xl bg-white">
        <CardHeader>
          <CardTitle>Lecture files and details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Main lecture recording</label>
              <Input name="file" type="file" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Reference files (optional)</label>
              <Input name="reference_files" type="file" accept=".pdf,.ppt,.pptx" multiple />
              <p className="text-xs text-muted-foreground">
                Attach the PPT, PDF notes, or class reference material if you have them. We’ll use these later for validation and safer KB gating.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800">Extra lecture files (optional)</label>
              <Input name="additional_content_files" type="file" accept=".mp3,.mp4,.wav,.m4a,.aac,.mov,.mkv,.webm,.pdf,.ppt,.pptx" multiple />
              <p className="text-xs text-muted-foreground">
                Use this for extra lecture recordings, handouts, alternate media, or supplemental reference files tied to the same lecture.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={departmentName}
                onChange={(event) => setDepartmentName(event.target.value)}
                className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none"
                required
                disabled={!catalogReady}
              >
                <option value="">{catalogLoading ? "Loading departments..." : "Department"}</option>
                {catalog.map((item) => (
                  <option key={item.department} value={item.department}>
                    {item.department}
                  </option>
                ))}
              </select>
              <select
                value={programName}
                onChange={(event) => setProgramName(event.target.value)}
                className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none"
                required
                disabled={!catalogReady}
              >
                <option value="">Program</option>
                {programs.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={subjectValue}
                onChange={(event) => setSubjectValue(event.target.value)}
                className="h-12 rounded-xl border border-input bg-background px-4 text-sm outline-none"
                required
                disabled={!catalogReady}
              >
                <option value="">Subject</option>
                {subjects.map((item) => (
                  <option key={item.code} value={`${item.code}|||${item.name}`}>
                    {item.code} - {item.name}
                  </option>
                ))}
              </select>
              <Input name="lecture_number" type="number" min="1" placeholder="Lecture number" />
            </div>
            {catalogError ? (
              <p className="text-sm font-medium text-danger">{catalogError}</p>
            ) : catalogReady ? (
              <p className="text-sm text-muted-foreground">
                Loaded {catalog.length} department{catalog.length === 1 ? "" : "s"} and {subjects.length} subject
                {subjects.length === 1 ? "" : "s"} for the selected program.
              </p>
            ) : null}
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="lecture_date" type="date" defaultValue={today} />
              <Input name="faculty_name" placeholder="Faculty name" />
            </div>
            <Input name="lecture_name" placeholder="Lecture title" />
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Creating Lecture..." : "Create Lecture"}
            </Button>
          </form>
          <div className="mt-6 space-y-3">
            <Progress value={isUploading ? 45 : message ? 100 : 0} className={isUploading ? "animate-pulse" : undefined} />
            {message ? (
              <p className={`text-sm font-medium ${message.toLowerCase().includes("failed") ? "text-danger" : "text-success"}`}>
                {message}
              </p>
            ) : null}
            {isUploading ? (
              <p className="text-sm text-muted-foreground">
                You&apos;ll be redirected to the lecture workspace automatically. That page now refreshes itself while transcription and validation are running.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
