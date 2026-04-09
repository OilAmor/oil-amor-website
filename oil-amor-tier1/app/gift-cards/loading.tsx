export default function GiftCardsLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="w-12 h-12 bg-[#262228] rounded-full animate-pulse mx-auto mb-6" />
          <div className="w-64 h-16 bg-[#262228] rounded animate-pulse mx-auto mb-6" />
          <div className="w-full h-6 bg-[#262228] rounded animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-8 bg-[#141218] border border-[#262228] animate-pulse">
              <div className="w-24 h-8 bg-[#262228] rounded mb-2" />
              <div className="w-32 h-4 bg-[#262228] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
