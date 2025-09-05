import mongoose, { Document, Schema } from "mongoose";
import { ProjectSubmissionStatus } from "./course";

// Interface for test results
export interface ITestResult {
    testId: string; // Reference to the test in the course
    score: number; // Percentage score
    passed: boolean;
    completedAt: Date;
    answers: Array<{
        questionIndex: number;
        selectedAnswer: number;
        isCorrect: boolean;
    }>;
}

// Interface for Enrollment document
export interface IEnrollment extends Document {
    _id: string;
    userId: string; // Reference to User
    courseId: string; // Reference to Course
    enrolledAt: Date;
    completedAt?: Date;
    progress: number; // Percentage of course completed (0-100)
    testResults: ITestResult[];
    finalProjectSubmission?: {
        status: ProjectSubmissionStatus;
        submittedAt?: Date;
        reviewedAt?: Date;
        feedback?: string;
        fileKeys?: string[]; // References to submitted files
        grade?: number; // Optional grade for the project
    };
    isActive: boolean; // Whether the enrollment is active
    createdAt: Date;
    updatedAt: Date;
}

// Test result schema
const testResultSchema = new Schema<ITestResult>({
    testId: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    passed: {
        type: Boolean,
        required: true,
    },
    completedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    answers: [{
        questionIndex: {
            type: Number,
            required: true,
        },
        selectedAnswer: {
            type: Number,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
    }],
});

// Enrollment schema
const enrollmentSchema = new Schema<IEnrollment>(
    {
        userId: {
            type: String,
            required: true,
            ref: "User",
        },
        courseId: {
            type: String,
            required: true,
            ref: "Course",
        },
        enrolledAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        progress: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 100,
        },
        testResults: [testResultSchema],
        finalProjectSubmission: {
            status: {
                type: String,
                enum: Object.values(ProjectSubmissionStatus),
                default: ProjectSubmissionStatus.IN_REVIEW,
            },
            submittedAt: {
                type: Date,
            },
            reviewedAt: {
                type: Date,
            },
            feedback: {
                type: String,
                trim: true,
            },
            fileKeys: [{
                type: String,
                trim: true,
            }],
            grade: {
                type: Number,
                min: 0,
                max: 100,
            },
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "enrollments",
    }
);

// Compound index to ensure one enrollment per user per course
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Other indexes for better performance
enrollmentSchema.index({ userId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ isActive: 1 });
enrollmentSchema.index({ progress: 1 });

// Virtual populate for user and course details
enrollmentSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

enrollmentSchema.virtual('course', {
    ref: 'Course',
    localField: 'courseId',
    foreignField: '_id',
    justOne: true,
});

// Ensure virtual fields are serialized
enrollmentSchema.set('toJSON', { virtuals: true });
enrollmentSchema.set('toObject', { virtuals: true });

// Export the model
export const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);