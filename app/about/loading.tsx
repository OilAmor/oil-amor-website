export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="w-24 h-3 bg-[#262228] rounded mb-6 animate-pulse" />
        <div className="w-64 h-12 bg-[#262228] rounded mb-8 animate-pulse" />
        <div className="space-y-4">
          <div className="w-full h-32 bg-[#262228] rounded animate-pulse" />
          <div className="w-full h-32 bg-[#262228] rounded animate-pulse" />
          <div className="w-3/4 h-32 bg-[#262228] rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
