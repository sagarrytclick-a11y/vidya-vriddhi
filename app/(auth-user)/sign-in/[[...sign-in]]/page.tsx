import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { Home } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* Left Side - Visual Section */}
      <div className="relative hidden lg:flex lg:w-[55%] xl:w-[60%] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/modern-architecture.jpg"
          alt="Modern Architecture"
          fill
          className="object-cover"
          priority
        />

        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Brand Logo */}
        <div className="absolute bg-white p-3 rounded top-10 left-10 flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="VidyaVriddhi Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </div>

      {/* Right Side - Authentication Section */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col bg-zinc-950">
        {/* Mobile Logo Only */}
        <div className="lg:hidden p-6 flex items-center gap-2">
          <Home className="w-6 h-6 text-zinc-100" />
          <span className="font-bold text-xl text-zinc-100">VidyaVriddhi</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[440px]">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              forceRedirectUrl="/"
              appearance={{
                layout: {
                  socialButtonsPlacement: "bottom",
                  shimmer: true,
                },
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-none bg-transparent w-full",
                  headerTitle: "text-3xl font-bold text-zinc-100",
                  headerSubtitle: "text-zinc-400 text-base mb-6",
                  formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white text-sm normal-case py-3 rounded-xl",
                  socialButtonsBlockButton: "border-zinc-700 hover:bg-zinc-800 rounded-xl py-3 transition-all bg-zinc-900",
                  socialButtonsBlockButtonText: "font-medium text-zinc-300",
                  formFieldInput: "border-zinc-700 bg-zinc-900 rounded-xl focus:ring-orange-500 py-3 text-zinc-100",
                  formFieldLabel: "text-zinc-400 font-medium mb-1.5",
                  footerActionLink: "text-orange-500 hover:text-orange-400 font-semibold",
                  dividerLine: "bg-zinc-800",
                  dividerText: "text-zinc-500 text-xs uppercase tracking-widest"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
