import Link from 'next/link'
import { GraduationCap, Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative mb-8">
          <div className="text-[10rem] font-bold text-orange-200 leading-none select-none">
            4<span className="text-orange-400">0</span>4
          </div>
          <GraduationCap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-orange-500/30" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
          >
            <Home size={18} />
            Go Home
          </Link>
          <Link
            href="/btech"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:border-orange-200 hover:text-orange-500 transition-colors"
          >
            <Search size={18} />
            Browse Colleges
          </Link>
        </div>

        <Link
          href="javascript:history.back()"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={14} />
          Go back
        </Link>
      </div>
    </div>
  )
}
