export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="w-32 h-3 bg-[#262228] rounded mx-auto mb-6 animate-pulse" />
          <div className="w-64 h-12 bg-[#262228] rounded mx-auto mb-4 animate-pulse" />
          <div className="w-48 h-12 bg-[#262228] rounded mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-8 border border-[#262228] bg-[#141218]/30">
              <div className="w-16 h-16 rounded-full bg-[#262228] mx-auto mb-6 animate-pulse" />
              <div className="w-32 h-6 bg-[#262228] rounded mx-auto mb-2 animate-pulse" />
              <div className="w-24 h-3 bg-[#262228] rounded mx-auto mb-4 animate-pulse" />
              <div className="w-full h-20 bg-[#262228] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
