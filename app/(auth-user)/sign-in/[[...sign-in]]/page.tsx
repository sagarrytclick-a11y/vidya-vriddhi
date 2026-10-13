import Image from 'next/image'
import Link from 'next/link'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(145deg,#fff7ed_0%,#f8fafc_48%,#ffffff_100%)] px-4 py-10">
      <section aria-labelledby="sign-in-title" className="w-full max-w-[440px] rounded-2xl border border-orange-100 bg-white px-6 py-8 shadow-[0_24px_70px_-32px_rgba(124,45,18,0.32)] sm:px-10 sm:py-10">
        <div className="mb-7 flex justify-center">
          <Link href="/" aria-label="VidyaVriddhi home" className="inline-flex rounded-lg bg-white p-1.5 ring-1 ring-gray-100">
            <Image src="/logo.png" alt="VidyaVriddhi" width={140} height={56} className="h-10 w-auto" priority />
          </Link>
        </div>
        <div className="text-center">
          <span className="inline-flex rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-700">
            Student account
          </span>
          <h1 id="sign-in-title" className="mt-4 text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">Sign in to continue exploring colleges and admissions.</p>
        </div>

        <div className="mt-8">
          <GoogleSignInButton />
          <p className="mt-5 text-center text-xs leading-5 text-gray-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="font-medium text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-orange-700">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-orange-700">Privacy Policy</Link>.
          </p>
        </div>
        <div className="mt-7 border-t border-gray-100 pt-5 text-center text-sm text-gray-600">
          New to VidyaVriddhi?{' '}
          <Link href="/sign-up" className="font-semibold text-orange-600 hover:text-orange-700">
            Create an account
          </Link>
        </div>
      </section>
    </main>
  )
}
