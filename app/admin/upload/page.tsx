"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { uploadLecture } from "@/lib/api/services";

export default function UploadManagerPage() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setProgress(18);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setProgress(52);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const response = await uploadLecture(formData);
    setProgress(100);
    setMessage(response.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Upload Manager</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Queue new lecture processing jobs</h1>
      </div>

      <Card className="max-w-3xl bg-white">
        <CardHeader>
          <CardTitle>Upload lecture asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input name="video" type="file" required />
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="course" placeholder="Course name" defaultValue="Machine Learning Foundations" required />
              <Input name="module" placeholder="Module" defaultValue="Optimization" required />
            </div>
            <Button type="submit">Submit Job</Button>
          </form>
          <div className="mt-6 space-y-3">
            <Progress value={progress} />
            {message ? <p className="text-sm font-medium text-success">{message}</p> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
