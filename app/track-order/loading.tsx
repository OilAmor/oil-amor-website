export default function TrackOrderLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-12 h-12 bg-[#262228] rounded-full animate-pulse mx-auto mb-6" />
          <div className="w-64 h-16 bg-[#262228] rounded animate-pulse mx-auto mb-6" />
          <div className="w-full h-6 bg-[#262228] rounded animate-pulse" />
        </div>
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-3">
            <div className="w-32 h-4 bg-[#262228] rounded animate-pulse" />
            <div className="w-full h-14 bg-[#262228] rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="w-32 h-4 bg-[#262228] rounded animate-pulse" />
            <div className="w-full h-14 bg-[#262228] rounded animate-pulse" />
          </div>
          <div className="w-full h-14 bg-[#262228] rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
