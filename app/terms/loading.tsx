export default function TermsLoading() {
  return (
    <div className="min-h-screen bg-[#0a080c] pt-32 pb-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="w-12 h-12 bg-[#262228] rounded-full animate-pulse mx-auto mb-6" />
          <div className="w-64 h-16 bg-[#262228] rounded animate-pulse mx-auto mb-6" />
          <div className="w-32 h-4 bg-[#262228] rounded animate-pulse mx-auto" />
        </div>
        <div className="space-y-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-[#262228] rounded animate-pulse" />
                <div className="w-56 h-8 bg-[#262228] rounded animate-pulse" />
              </div>
              <div className="w-full h-4 bg-[#262228] rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-[#262228] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
