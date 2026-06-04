import { Loader2 } from 'lucide-react'

export default function CollegeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading college details...</p>
      </div>
    </div>
  )
}
