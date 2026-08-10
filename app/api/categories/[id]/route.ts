import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { categoryUpdateSchema } from '@/lib/validations/schema'
import { requireAdmin, activeContentFilter } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await db.category.findFirst({
      where: {
        id,
        ...activeContentFilter(request),
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    const body = await request.json()

    // Validate input using Zod schema
    const validatedData = categoryUpdateSchema.safeParse({ ...body, id })
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validatedData.error.issues },
        { status: 400 }
      )
    }

    const { name, slug, description, categoryImageUrl, active } = validatedData.data

    // Check if category with same name or slug already exists (excluding current category)
    const existingCategory = await db.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ],
        NOT: {
          id
        }
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 409 }
      )
    }

    const category = await db.category.update({
      where: {
        id
      },
      data: {
        name,
        slug,
        description,
        categoryImageUrl,
        active
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = requireAdmin(request)
    if (authError) return authError

    const { id } = await params
    // Check if category has associated colleges
    const collegesCount = await db.college.count({
      where: {
        categories: {
          some: {
            id
          }
        }
      }
    })

    if (collegesCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category. It has associated colleges.' },
        { status: 400 }
      )
    }

    await db.category.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
