import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">User Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-900">{user.id}</p>
                </div>
                {user.firstName && (
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="text-gray-900">{user.firstName}</p>
                  </div>
                )}
                {user.lastName && (
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="text-gray-900">{user.lastName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
