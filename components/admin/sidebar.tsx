'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Globe, 
  Building, 
  Folder, 
  GraduationCap, 
  FileText, 
  BookOpen, 
  MessageSquare,
  Library,
  Newspaper,
  Briefcase
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const sidebarItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/countries', label: 'Countries', icon: Globe },
  { href: '/admin/cities', label: 'Cities', icon: Building },
  { href: '/admin/categories', label: 'Categories', icon: Folder },
  { href: '/admin/colleges', label: 'Colleges', icon: GraduationCap },
  { href: '/admin/exams', label: 'Exams', icon: FileText },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/courses', label: 'Courses', icon: Library },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/job-applications', label: 'Job Applications', icon: Briefcase },
]

export function Sidebar() {

  const pathname = usePathname()


  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <div className="flex items-center justify-center rounded-lg p-2 mb-8">
        <Image className='bg-white p-2 rounded' src={"/logo.png"} alt="Vidya Vriddhi" width={100} height={100}/>
      </div>
      
      <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                pathname === item.href 
                  ? "bg-teal-600 text-white" 
                  : "hover:bg-slate-800 text-gray-300 hover:text-white"
              )}
            >
              <Icon className="mr-4 h-6 w-6" />
              <span className="text-base">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
