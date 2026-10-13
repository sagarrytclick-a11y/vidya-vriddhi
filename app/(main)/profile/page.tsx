import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, GraduationCap, Mail, ShieldCheck, UserRound } from 'lucide-react'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const name = session.user.name || 'Student'
  const initials = (session.user.name || session.user.email || 'S')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <main className="min-h-[70vh] bg-[linear-gradient(145deg,#fff7ed_0%,#f8fafc_42%,#f1f5f9_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-orange-700">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-800">My account</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-700">Student account</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">Your profile</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Your account details and shortcuts for your next step.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white ring-4 ring-white/10">
              {initials}
            </div>
            <h2 className="mt-5 break-words text-2xl font-semibold">{name}</h2>
            <p className="mt-1 break-all text-sm text-slate-300">{session.user.email || 'Email not provided'}</p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <BadgeCheck className="h-4 w-4" />
              Signed in with Google
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-sm font-semibold text-white">Where to next?</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/colleges"
                  className="inline-flex min-h-11 items-center justify-between rounded-lg bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-orange-50"
                >
                  Explore colleges <ArrowRight className="h-4 w-4 text-orange-600" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-between rounded-lg border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Talk to a counselor <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="account-details-title">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 id="account-details-title" className="text-lg font-semibold text-slate-950">
                  Account Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">Information associated with your sign-in.</p>
              </div>
            </div>

            <dl className="divide-y divide-slate-100">
              <div className="flex items-start gap-4 py-5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email address</dt>
                  <dd className="mt-1 break-all text-sm font-medium text-slate-900">{session.user.email || 'Not provided'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full name</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">{session.user.name || 'Not provided'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sign-in method</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">Google</dd>
                </div>
              </div>
            </dl>

            <div className="mt-2 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
              <p className="text-sm leading-6 text-slate-600">
                Your profile is ready. Browse colleges or connect with a counselor for personalized admission guidance.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}