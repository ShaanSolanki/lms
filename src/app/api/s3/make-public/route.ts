import { PutBucketPolicyCommand, GetBucketPolicyCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!;

        console.log('Making bucket public:', bucketName);

        // Create a public read policy for the bucket
        const bucketPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicReadGetObject",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }
            ]
        };

        const policyCommand = new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(bucketPolicy)
        });

        await S3.send(policyCommand);
        console.log('Bucket policy set successfully');

        return NextResponse.json({
            success: true,
            message: 'Bucket made public successfully',
            bucketName: bucketName
        });

    } catch (error: any) {
        console.error('Error making bucket public:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to make bucket public',
            details: error.message,
            errorCode: error.name
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!;

        console.log('Getting bucket policy:', bucketName);

        const getPolicyCommand = new GetBucketPolicyCommand({
            Bucket: bucketName
        });

        const result = await S3.send(getPolicyCommand);

        return NextResponse.json({
            success: true,
            bucketName: bucketName,
            policy: result.Policy ? JSON.parse(result.Policy) : null
        });

    } catch (error: any) {
        console.error('Error getting bucket policy:', error);

        if (error.name === 'NoSuchBucketPolicy') {
            return NextResponse.json({
                success: true,
                bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
                policy: null,
                message: 'No bucket policy exists (bucket is private)'
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to get bucket policy',
            details: error.message,
            errorCode: error.name
        }, { status: 500 });
    }
}