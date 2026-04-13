export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a080c] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-[#c9a227]/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-[#c9a227] border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-display text-lg text-[#f5f3ef] animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}
