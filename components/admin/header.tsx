'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin-auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Use window.location.replace() to prevent back button navigation
        // This replaces the current page in browser history
        window.location.replace('/admin-login')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="bg-slate-800 text-white px-8 py-6 border-b border-slate-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome to Admission Campus Admin Panel</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Admin User</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                <AvatarImage src="/admin-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-blue-600 text-white">AD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[60] bg-slate-800 border-slate-700 text-white">
              <DropdownMenuItem className="flex items-center gap-2 hover:bg-slate-700">
                <User className="h-4 w-4" />
                <span>Admin User</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 hover:bg-slate-700 text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
