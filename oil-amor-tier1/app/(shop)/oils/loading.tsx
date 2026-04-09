export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Skeleton */}
        <div className="mb-20 lg:mb-32">
          <div className="w-24 h-3 bg-[#262228] rounded mb-6 animate-pulse" />
          <div className="w-64 h-12 bg-[#262228] rounded mb-4 animate-pulse" />
          <div className="w-48 h-12 bg-[#262228] rounded mb-8 animate-pulse" />
          <div className="w-full max-w-xl h-20 bg-[#262228] rounded animate-pulse" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="space-y-32">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative aspect-[4/5] bg-[#141218] animate-pulse" />
              <div className="space-y-6">
                <div className="w-48 h-6 bg-[#262228] rounded animate-pulse" />
                <div className="w-64 h-12 bg-[#262228] rounded animate-pulse" />
                <div className="w-full h-32 bg-[#262228] rounded animate-pulse" />
                <div className="w-40 h-12 bg-[#262228] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
