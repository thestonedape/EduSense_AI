export function VideoPlayer({ title, src }: { title: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-[#0d1b22] shadow-panel">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
