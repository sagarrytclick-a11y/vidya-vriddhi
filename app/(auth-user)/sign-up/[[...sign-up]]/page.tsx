import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'

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
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-white shadow-sm border border-gray-200 rounded-2xl p-8 w-full",
                headerTitle: "text-xl font-bold text-gray-900",
                headerSubtitle: "text-gray-500 text-sm mb-6",
                socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium text-gray-700",
                socialButtonsBlockButtonText: "font-medium text-gray-700",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-400 text-xs",
                formFieldInput: "border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 py-3 text-sm",
                formFieldLabel: "text-gray-700 text-sm font-medium mb-1.5",
                formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold normal-case py-3 rounded-xl w-full",
                footerActionLink: "text-orange-600 hover:text-orange-700 font-semibold text-sm",
                identityPreviewText: "text-sm text-gray-600",
                identityPreviewEditButton: "text-orange-600 text-sm",
              }
            }}
          />
      </div>
    </div>
  )
}
