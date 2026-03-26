import { notFound } from "next/navigation";

import { ChatPanel } from "@/components/chat-panel";
import { Navbar } from "@/components/navbar";
import { VideoPlayer } from "@/components/video-player";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLecture } from "@/lib/api/services";

export default async function LecturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lecture = await getLecture(id);

  if (!lecture) {
    notFound();
  }

  return (
    <div>
      <Navbar />
      <main className="page-wrap space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Lecture</p>
          <h1 className="mt-3 font-display text-4xl font-semibold">{lecture.title}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{lecture.summary}</p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
          <div className="space-y-6">
            <VideoPlayer title={lecture.title} src={lecture.videoUrl} />
            <Card>
              <CardHeader>
                <CardTitle>Lecture Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                This page intentionally keeps the student focused on the video and the tutor. Transcript inspection,
                claim validation, and confidence tooling stay in the admin portal only.
              </CardContent>
            </Card>
          </div>
          <ChatPanel lectureId={lecture.id} />
        </section>
      </main>
    </div>
  );
}
