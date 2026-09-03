import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { clerkAuthAppearance } from '@/lib/clerk-appearance'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 px-4 py-12">
      <div className="w-full flex flex-col items-center max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="VidyaVriddhi" width={140} height={56} className="mx-auto mb-4" priority />
          <h1 className="text-2xl font-bold text-gray-900">Welcome to VidyaVriddhi</h1>
          <p className="text-gray-500 mt-1.5">Your complete guide to college admissions and career growth</p>
        </div>

        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
          appearance={clerkAuthAppearance}
        />
      </div>
    </div>
  )
}
