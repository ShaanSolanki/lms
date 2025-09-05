import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'
import { CourseThumbnail } from '@/components/ui/course-thumbnail'

async function getCourses() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/courses?limit=50`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Failed to fetch courses:', response.status)
      return []
    }

    const data = await response.json()
    return data.courses || []
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800'
      case 'intermediate':
        return 'bg-orange-100 text-orange-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and create new ones
          </p>
        </div>
        <Link href="/admin/courses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first course
              </p>
              <Link href="/admin/courses/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <CourseThumbnail
                  fileKey={course.fileKey}
                  title={course.title}
                  className="rounded-none"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <div className="flex gap-1 flex-shrink-0">
                    <Badge className={getStatusColor(course.status)}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.smallDescription}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {course.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {formatPrice(course.price)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/courses/${course._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/${course._id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Created {new Date(course.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}