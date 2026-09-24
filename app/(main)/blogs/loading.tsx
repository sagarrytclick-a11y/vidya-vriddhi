export default function BlogsLoading() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-56 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 h-12 w-3/4 max-w-2xl animate-pulse rounded-xl bg-white/10 sm:h-16" />
          <div className="mt-6 h-5 w-1/2 max-w-xl animate-pulse rounded bg-white/10" />
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-12 w-full max-w-md animate-pulse rounded-xl bg-slate-100" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
                <div className="mt-5 space-y-3">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}