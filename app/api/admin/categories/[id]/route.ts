import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, requireCanDelete } from '@/lib/auth'

// PUT /api/admin/categories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const { name, slug, description, categoryImageUrl, active } = body

    // Check if category exists
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check for duplicates if name/slug changed
    if (name && name !== existing.name) {
      const nameExists = await db.category.findFirst({
        where: { name, NOT: { id } }
      })
      if (nameExists) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 409 }
        )
      }
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await db.category.findFirst({
        where: { slug, NOT: { id } }
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 409 }
        )
      }
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        description: description !== undefined ? description : existing.description,
        categoryImageUrl: categoryImageUrl !== undefined ? categoryImageUrl : existing.categoryImageUrl,
        active: active !== undefined ? active : existing.active
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireCanDelete(request)
    if (authError) return authError

    const { id } = await params

    // Check if category exists
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    await db.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
