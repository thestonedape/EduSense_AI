import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTranscript } from "@/lib/api/services";
import { TranscriptSentence } from "@/types";
import { TranscriptEditor } from "./transcript-editor";

export default async function TranscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = ((await getTranscript(id)) as TranscriptSentence[]) || [];

  return <TranscriptEditor initialRows={rows} />;
}
