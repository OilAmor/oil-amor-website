export default function BestsellersLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="w-32 h-4 bg-[#262228] rounded animate-pulse mx-auto mb-6" />
          <div className="w-64 h-16 bg-[#262228] rounded animate-pulse mx-auto mb-6" />
          <div className="w-full h-6 bg-[#262228] rounded animate-pulse" />
        </div>
        <div className="space-y-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="aspect-[4/5] bg-[#141218] animate-pulse" />
              <div className="space-y-6">
                <div className="w-48 h-6 bg-[#262228] rounded animate-pulse" />
                <div className="w-3/4 h-12 bg-[#262228] rounded animate-pulse" />
                <div className="w-full h-4 bg-[#262228] rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-[#262228] rounded animate-pulse" />
                <div className="p-6 border border-[#262228] bg-[#141218]/50">
                  <div className="w-32 h-4 bg-[#262228] rounded animate-pulse mb-4" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#262228] animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-[#262228] rounded animate-pulse" />
                      <div className="w-32 h-3 bg-[#262228] rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
