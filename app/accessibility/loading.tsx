export default function AccessibilityLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-[#262228] rounded-full animate-pulse mx-auto mb-6" />
          <div className="w-64 h-16 bg-[#262228] rounded animate-pulse mx-auto mb-6" />
          <div className="w-full h-6 bg-[#262228] rounded animate-pulse mx-auto" />
        </div>
        <div className="p-8 border border-[#262228] bg-[#141218]/30 mb-16">
          <div className="w-48 h-8 bg-[#262228] rounded animate-pulse mb-4" />
          <div className="w-full h-4 bg-[#262228] rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 border border-[#262228] animate-pulse">
              <div className="w-8 h-8 bg-[#262228] rounded mb-4" />
              <div className="w-32 h-6 bg-[#262228] rounded mb-3" />
              <div className="w-full h-4 bg-[#262228] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
