export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header Skeleton */}
        <div className="mb-20 lg:mb-32 text-center">
          <div className="w-24 h-3 bg-[#262228] rounded mx-auto mb-6 animate-pulse" />
          <div className="w-64 h-12 bg-[#262228] rounded mx-auto mb-4 animate-pulse" />
          <div className="w-48 h-12 bg-[#262228] rounded mx-auto mb-6 animate-pulse" />
          <div className="w-full max-w-xl h-16 bg-[#262228] rounded mx-auto animate-pulse" />
        </div>

        {/* Entries Skeleton */}
        <div className="space-y-16">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="md:w-32 flex-shrink-0 space-y-2">
                <div className="w-20 h-3 bg-[#262228] rounded animate-pulse" />
                <div className="w-24 h-3 bg-[#262228] rounded animate-pulse" />
              </div>
              <div className="flex-1 border-b border-[#262228] pb-12 space-y-4">
                <div className="w-full h-8 bg-[#262228] rounded animate-pulse" />
                <div className="w-full h-20 bg-[#262228] rounded animate-pulse" />
                <div className="w-32 h-4 bg-[#262228] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
