import { CreateCourseForm } from "./_components/CreateCourseForm";

export default function CreateCoursePage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">
                    Fill in the details below to create a new course
                </p>
            </div>
            <CreateCourseForm />
        </div>
    );
}