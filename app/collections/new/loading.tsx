export default function NewArrivalsLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="w-32 h-4 bg-[#262228] rounded animate-pulse" />
            <div className="w-64 h-16 bg-[#262228] rounded animate-pulse" />
            <div className="w-96 h-6 bg-[#262228] rounded animate-pulse" />
          </div>
          <div className="w-32 h-6 bg-[#262228] rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-[#141218] animate-pulse mb-6" />
              <div className="w-32 h-4 bg-[#262228] rounded animate-pulse mb-2" />
              <div className="w-48 h-6 bg-[#262228] rounded animate-pulse mb-2" />
              <div className="w-full h-4 bg-[#262228] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
