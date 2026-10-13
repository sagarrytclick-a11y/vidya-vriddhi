'use client'

import Link from 'next/link'
import { LogOut, UserRound } from 'lucide-react'
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserAccountMenuProps {
  name?: string | null
  email?: string | null
}

export function UserAccountMenu({ name, email }: UserAccountMenuProps) {
  const label = name || email || 'Account'
  const initials = (name || email || 'U')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Open account menu for ${label}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white ring-2 ring-white/20 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[120] min-w-[220px] rounded-xl border border-gray-200 bg-white p-1 text-gray-900 shadow-xl"
      >
        <DropdownMenuLabel className="max-w-[260px] px-3 py-2">
          <span className="block truncate text-sm font-semibold">{name || 'Your account'}</span>
          {email && <span className="mt-0.5 block truncate text-xs font-normal text-gray-500">{email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2 focus:bg-orange-50 focus:text-orange-700">
          <Link href="/profile">
            <UserRound className="mr-2 h-4 w-4" />
            My profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => { void signOut({ redirectTo: '/' }) }}
          className="cursor-pointer rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
