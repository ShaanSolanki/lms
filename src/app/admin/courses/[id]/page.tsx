import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, ArrowLeft } from 'lucide-react'
import { CourseThumbnail } from '@/components/ui/course-thumbnail'
import { formatPrice } from '@/lib/utils/currency'

async function getCourse(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/courses/${id}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            return null
        }

        return response.json()
    } catch (error) {
        console.error('Error fetching course:', error)
        return null
    }
}

export default async function CourseDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const course = await getCourse(id)

    if (!course) {
        notFound()
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

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <Link href="/admin/courses">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Button>
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                        <p className="text-muted-foreground">{course.smallDescription}</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge className={getStatusColor(course.status)}>
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </Badge>
                        <Link href={`/admin/courses/${course._id}/edit`}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Course
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: course.description }}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Course lessons and MCQ tests will be managed here.
                            </p>
                            <div className="mt-4">
                                <Button variant="outline">
                                    Add Lessons & Tests
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Category</label>
                                <p className="text-sm">{course.category}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Level</label>
                                <p className="text-sm capitalize">{course.level}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                                <p className="text-sm">{course.duration} hours</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Price</label>
                                <p className="text-sm font-semibold">{formatPrice(course.price)}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Slug</label>
                                <p className="text-sm font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                    {course.slug}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Created</label>
                                <p className="text-sm">
                                    {new Date(course.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Course Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CourseThumbnail
                                fileKey={course.fileKey}
                                title={course.title}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}