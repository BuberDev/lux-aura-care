export default function LoadingArticlePage() {
  return (
    <section className="mx-auto w-full max-w-6xl animate-pulse px-6 py-20">
      <div className="h-10 w-2/3 rounded-xl bg-white/10" />
      <div className="mt-4 h-5 w-full rounded bg-white/10" />
      <div className="mt-2 h-5 w-5/6 rounded bg-white/10" />
      <div className="mt-10 grid gap-4">
        <div className="h-44 rounded-3xl bg-white/10" />
        <div className="h-44 rounded-3xl bg-white/10" />
        <div className="h-44 rounded-3xl bg-white/10" />
      </div>
    </section>
  );
}
