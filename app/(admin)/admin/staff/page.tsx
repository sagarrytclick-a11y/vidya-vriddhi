'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AdminPageHeader,
  adminPagePadClass,
  adminCardClass,
  adminCardTitleClass,
  AdminPageSkeleton,
} from '@/components/admin/page-ui'
import {
  adminFieldClass,
  adminLabelClass,
  adminPrimaryBtnClass,
  adminCancelBtnClass,
  adminDangerBtnClass,
} from '@/components/admin/modal-ui'
import { useAdminContext } from '@/contexts/admin-context'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Plus, Trash2, UserPlus, ShieldOff, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react'

type StaffRow = {
  id: string
  username: string
  role: 'admin' | 'content_writer'
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminStaffPage() {
  const router = useRouter()
  const { role, isLoading: sessionLoading } = useAdminContext()
  const [staff, setStaff] = useState<StaffRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'content_writer' as 'admin' | 'content_writer',
  })
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null)
  const [resetPassword, setResetPassword] = useState('')
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    staff: StaffRow | null
  }>({ isOpen: false, staff: null })
  const [isDeleting, setIsDeleting] = useState(false)

  const loadStaff = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/staff', { credentials: 'include' })
      if (res.status === 403 || res.status === 401) {
        toast.error('Only superadmin can manage staff')
        router.replace('/admin/dashboard')
        return
      }
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setStaff(data.staff || [])
    } catch {
      toast.error('Failed to load staff accounts')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (sessionLoading) return
    if (role !== 'superadmin') {
      toast.error('Only superadmin can manage staff')
      router.replace('/admin/dashboard')
      return
    }
    loadStaff()
  }, [sessionLoading, role, router, loadStaff])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.error || 'Could not create account')
        return
      }
      toast.success(`Created ${data.staff.username}`)
      setForm({ username: '', password: '', role: 'content_writer' })
      await loadStaff()
    } catch {
      toast.error('Could not create account')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (row: StaffRow) => {
    try {
      const res = await fetch(`/api/admin/staff/${row.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !row.active }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Update failed')
        return
      }
      toast.success(row.active ? 'Account deactivated' : 'Account activated')
      await loadStaff()
    } catch {
      toast.error('Update failed')
    }
  }

  const changeRole = async (row: StaffRow, nextRole: 'admin' | 'content_writer') => {
    if (row.role === nextRole) return
    try {
      const res = await fetch(`/api/admin/staff/${row.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Role update failed')
        return
      }
      toast.success('Role updated')
      await loadStaff()
    } catch {
      toast.error('Role update failed')
    }
  }

  const submitPasswordReset = async (id: string) => {
    if (resetPassword.length < 12) {
      toast.error('Password must be at least 12 characters')
      return
    }
    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Password reset failed')
        return
      }
      toast.success('Password updated')
      setResetPasswordId(null)
      setResetPassword('')
    } catch {
      toast.error('Password reset failed')
    }
  }

  const openDeleteModal = (row: StaffRow) => {
    setDeleteModal({ isOpen: true, staff: row })
  }

  const confirmDeleteStaff = async () => {
    if (!deleteModal.staff) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/staff/${deleteModal.staff.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Delete failed')
        return
      }
      toast.success('Account deleted')
      setDeleteModal({ isOpen: false, staff: null })
      await loadStaff()
    } catch {
      toast.error('Delete failed')
    } finally {
      setIsDeleting(false)
    }
  }

  if (sessionLoading || (role !== 'superadmin' && loading)) {
    return (
      <AdminLayout>
        <div className={adminPagePadClass}>
          <AdminPageSkeleton />
        </div>
      </AdminLayout>
    )
  }

  if (role !== 'superadmin') return null

  return (
    <AdminLayout>
      <div className={adminPagePadClass}>
        <AdminPageHeader
          title="Staff accounts"
          subtitle="Create username/password for admin or content writers"
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className={adminCardClass}>
            <CardHeader>
              <CardTitle className={cn(adminCardTitleClass, 'flex items-center gap-2')}>
                <UserPlus className="h-4 w-4 text-[#ea580c]" />
                Create account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label className={adminLabelClass}>Username</Label>
                  <Input
                    value={form.username}
                    onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                    className={adminFieldClass}
                    placeholder="e.g. writer2"
                    autoComplete="off"
                    required
                    minLength={3}
                  />
                </div>
                <div>
                  <Label className={adminLabelClass}>Password</Label>
                  <div className="relative">
                    <Input
                      type={showCreatePassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className={cn(adminFieldClass, 'pr-10')}
                      placeholder="Min 12 characters"
                      autoComplete="new-password"
                      required
                      minLength={12}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6b7280] transition hover:text-[#9ca3af]"
                      aria-label={showCreatePassword ? 'Hide password' : 'Show password'}
                    >
                      {showCreatePassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className={adminLabelClass}>Role</Label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        role: e.target.value as 'admin' | 'content_writer',
                      }))
                    }
                    className={cn(adminFieldClass, 'h-10 w-full')}
                  >
                    <option value="content_writer">Content Writer (no delete)</option>
                    <option value="admin">Admin (full access + delete)</option>
                  </select>
                </div>
                <Button type="submit" disabled={saving} className={adminPrimaryBtnClass}>
                  <Plus className="mr-2 h-4 w-4" />
                  {saving ? 'Creating…' : 'Create account'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className={adminCardClass}>
            <CardHeader>
              <CardTitle className={adminCardTitleClass}>Database staff</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-[#9ca3af]">Loading…</p>
              ) : staff.length === 0 ? (
                <p className="text-sm text-[#9ca3af]">
                  No UI-created accounts yet. Create one on the left — they can log in at Admin Login.
                </p>
              ) : (
                <ul className="space-y-3">
                  {staff.map((row) => (
                    <li
                      key={row.id}
                      className="rounded-xl border border-white/[0.06] bg-[#12161e] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{row.username}</p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <Badge
                              className={
                                row.role === 'admin'
                                  ? 'bg-sky-500/15 text-sky-300'
                                  : 'bg-amber-500/15 text-amber-300'
                              }
                            >
                              {row.role === 'admin' ? 'Admin' : 'Content Writer'}
                            </Badge>
                            <Badge
                              className={
                                row.active
                                  ? 'bg-emerald-500/15 text-emerald-300'
                                  : 'bg-rose-500/15 text-rose-300'
                              }
                            >
                              {row.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={row.role}
                            onChange={(e) =>
                              changeRole(row, e.target.value as 'admin' | 'content_writer')
                            }
                            className="h-8 rounded-lg border border-white/10 bg-[#0c0f14] px-2 text-xs text-white"
                          >
                            <option value="content_writer">Content Writer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={adminCancelBtnClass}
                            onClick={() => toggleActive(row)}
                          >
                            {row.active ? (
                              <>
                                <ShieldOff className="mr-1 h-3.5 w-3.5" /> Deactivate
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Activate
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={adminCancelBtnClass}
                            onClick={() => {
                              setResetPasswordId(row.id)
                              setResetPassword('')
                              setShowResetPassword(false)
                            }}
                          >
                            <KeyRound className="mr-1 h-3.5 w-3.5" /> Password
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className={adminDangerBtnClass}
                            onClick={() => openDeleteModal(row)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {resetPasswordId === row.id && (
                        <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-white/[0.06] pt-3">
                          <div className="min-w-[180px] flex-1">
                            <Label className={adminLabelClass}>New password</Label>
                            <div className="relative">
                              <Input
                                type={showResetPassword ? 'text' : 'password'}
                                value={resetPassword}
                                onChange={(e) => setResetPassword(e.target.value)}
                                className={cn(adminFieldClass, 'pr-10')}
                                minLength={12}
                                autoComplete="new-password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowResetPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6b7280] transition hover:text-[#9ca3af]"
                                aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                              >
                                {showResetPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <Button
                            type="button"
                            className={adminPrimaryBtnClass}
                            onClick={() => submitPasswordReset(row.id)}
                          >
                            Save password
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className={adminCancelBtnClass}
                            onClick={() => {
                              setResetPasswordId(null)
                              setResetPassword('')
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => {
          if (!isDeleting) setDeleteModal({ isOpen: false, staff: null })
        }}
        onConfirm={confirmDeleteStaff}
        title="Delete account"
        message={`Are you sure you want to delete the account "${deleteModal.staff?.username ?? ''}"?`}
        confirmText="Delete account"
        cancelText="Cancel"
        type="delete"
        isLoading={isDeleting}
        details={
          deleteModal.staff
            ? [
                { label: 'Username', value: deleteModal.staff.username },
                {
                  label: 'Role',
                  value:
                    deleteModal.staff.role === 'admin' ? 'Admin' : 'Content Writer',
                },
              ]
            : undefined
        }
      />
    </AdminLayout>
  )
}
