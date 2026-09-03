import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'
import { clerkAuthAppearance } from '@/lib/clerk-appearance'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="VidyaVriddhi" width={140} height={56} className="mx-auto mb-4" priority />
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1.5">Join thousands of students finding their perfect college</p>
        </div>

        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/"
          appearance={clerkAuthAppearance}
        />
      </div>
    </div>
  )
}
