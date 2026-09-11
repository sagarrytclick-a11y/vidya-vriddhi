function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className ?? ''}`} />
}

export function CollegeHeroSkeleton() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Pulse className="h-4 w-64" />
        </div>
      </div>

      <div className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-1 items-start gap-4 sm:gap-6">
              <Pulse className="h-20 w-20 shrink-0 rounded-2xl sm:h-24 sm:w-24" />
              <div className="min-w-0 flex-1 space-y-3">
                <Pulse className="h-8 w-full max-w-xl sm:h-9" />
                <div className="flex flex-wrap gap-2">
                  <Pulse className="h-8 w-36 rounded-full" />
                  <Pulse className="h-8 w-40 rounded-full" />
                  <Pulse className="h-8 w-28 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Pulse className="h-7 w-24 rounded-full" />
                  <Pulse className="h-7 w-20 rounded-full" />
                  <Pulse className="h-7 w-16 rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:w-64">
              <Pulse className="h-12 w-full rounded-md" />
              <Pulse className="h-12 w-full rounded-md" />
              <Pulse className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function CollegeTabsSkeleton() {
  return (
    <div className="sticky top-20 z-30 border-b border-slate-200 bg-white lg:top-[7.5rem]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Pulse key={i} className="h-9 w-24 shrink-0 rounded-full sm:w-28" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CollegeContentSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Pulse className="h-7 w-40" />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <Pulse className="mb-3 h-4 w-full" />
          <Pulse className="mb-3 h-4 w-full" />
          <Pulse className="h-4 w-2/3" />
        </div>
      </div>

      <div className="space-y-3">
        <Pulse className="h-7 w-48" />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Pulse className="h-12 w-full rounded-none" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-t border-slate-100 px-4 py-4">
              <Pulse className="h-9 w-9 rounded-lg" />
              <Pulse className="h-4 flex-1" />
              <Pulse className="h-4 w-16" />
              <Pulse className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CollegeSidebarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <Pulse className="mb-4 h-6 w-40" />
        <Pulse className="mb-3 h-10 w-full rounded-md" />
        <Pulse className="mb-3 h-10 w-full rounded-md" />
        <Pulse className="h-10 w-full rounded-md" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <Pulse className="mb-4 h-6 w-36" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-3 flex gap-3 last:mb-0">
            <Pulse className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Pulse className="h-4 w-full" />
              <Pulse className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CollegeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CollegeHeroSkeleton />
      <CollegeTabsSkeleton />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <CollegeContentSkeleton />
          </div>
          <div className="w-full shrink-0 lg:w-80">
            <CollegeSidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
