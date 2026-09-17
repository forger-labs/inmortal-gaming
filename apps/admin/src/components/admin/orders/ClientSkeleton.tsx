export default function ClientSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 gap-4 rounded-xl border border-white/5 bg-bg-primary/60 p-4 sm:grid-cols-3">
      <div className="flex flex-col gap-1  bg-white/5"/>
      <div className="flex flex-col gap-1  bg-white/5"/>
      <div className="flex flex-col gap-1  bg-white/5"/>
    </div>
  );
}
