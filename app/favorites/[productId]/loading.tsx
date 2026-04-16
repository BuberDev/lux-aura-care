export default function LoadingProductPage() {
  return (
    <section className="mx-auto w-full max-w-6xl animate-pulse px-6 py-20">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/5] rounded-[2rem] bg-white/10" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-white/10" />
          <div className="h-5 w-full rounded bg-white/10" />
          <div className="h-5 w-5/6 rounded bg-white/10" />
          <div className="h-12 w-44 rounded-xl bg-white/10" />
        </div>
      </div>
    </section>
  );
}
