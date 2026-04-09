export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <div className="w-32 h-3 bg-[#262228] rounded mx-auto mb-6 animate-pulse" />
          <div className="w-64 h-12 bg-[#262228] rounded mx-auto mb-4 animate-pulse" />
          <div className="w-full max-w-2xl h-16 bg-[#262228] rounded mx-auto animate-pulse" />
        </div>
        <div className="space-y-20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#262228] animate-pulse" />
                <div className="w-48 h-8 bg-[#262228] rounded animate-pulse" />
                <div className="w-full h-32 bg-[#262228] rounded animate-pulse" />
              </div>
              <div className="aspect-square bg-[#141218] border border-[#262228] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
