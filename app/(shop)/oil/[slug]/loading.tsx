export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c]">
      {/* Nav Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a080c]/95 backdrop-blur-sm border-b border-[#1c181f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="w-24 h-4 bg-[#262228] rounded animate-pulse" />
          <div className="w-32 h-6 bg-[#262228] rounded animate-pulse" />
          <div className="w-20 h-4 bg-[#262228] rounded animate-pulse" />
        </div>
      </div>

      <div className="pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* Image Skeleton */}
            <div className="relative aspect-[4/5] bg-[#141218] animate-pulse" />
            
            {/* Info Skeleton */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="w-32 h-4 bg-[#262228] rounded animate-pulse" />
              <div className="w-64 h-12 bg-[#262228] rounded animate-pulse" />
              <div className="w-full h-40 bg-[#262228] rounded animate-pulse" />
              <div className="w-48 h-6 bg-[#262228] rounded animate-pulse" />
              <div className="w-32 h-10 bg-[#262228] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
