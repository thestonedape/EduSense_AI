import { getLectureDetail } from "@/lib/api/services";
import { TranscriptEditor } from "./transcript-editor";

export default async function TranscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lecture = await getLectureDetail(id);

  return <TranscriptEditor lecture={lecture} />;
}
