export default function OilDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header Section Skeleton */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Image Skeleton */}
          <div className="relative aspect-[4/5] bg-[#141218] overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-[#262228] to-[#0a080c]" />
          </div>

          {/* Info Skeleton */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Technical Name */}
            <div className="space-y-3">
              <div className="w-32 h-3 bg-[#262228] rounded animate-pulse" />
              <div className="w-64 h-8 bg-[#262228] rounded animate-pulse" />
            </div>

            {/* Title */}
            <div className="w-3/4 h-16 bg-[#262228] rounded animate-pulse" />

            {/* Properties */}
            <div className="space-y-4">
              <div className="w-48 h-3 bg-[#262228] rounded animate-pulse" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-[#262228] rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-[#262228] rounded animate-pulse" />
                <div className="w-4/5 h-4 bg-[#262228] rounded animate-pulse" />
                <div className="w-full h-4 bg-[#262228] rounded animate-pulse" />
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <div className="w-32 h-10 bg-[#262228] rounded animate-pulse" />
              <div className="w-24 h-4 bg-[#262228] rounded animate-pulse" />
            </div>

            {/* Crystal Preview */}
            <div className="p-6 border border-[#262228] bg-[#141218]/50">
              <div className="w-32 h-3 bg-[#262228] rounded animate-pulse mb-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#262228] animate-pulse" />
                <div className="w-24 h-4 bg-[#262228] rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Crystal Synergy Section */}
        <div className="border-t border-[#1c181f] pt-20">
          <div className="w-64 h-10 bg-[#262228] rounded animate-pulse mb-12" />
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border border-[#262228] bg-[#141218]/50">
                <div className="w-12 h-12 rounded-full bg-[#262228] animate-pulse mb-4" />
                <div className="w-32 h-6 bg-[#262228] rounded animate-pulse mb-2" />
                <div className="w-48 h-4 bg-[#262228] rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="w-full h-3 bg-[#262228] rounded animate-pulse" />
                  <div className="w-5/6 h-3 bg-[#262228] rounded animate-pulse" />
                  <div className="w-4/5 h-3 bg-[#262228] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
