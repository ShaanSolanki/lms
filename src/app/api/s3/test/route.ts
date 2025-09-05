import { ListBucketsCommand, HeadBucketCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        console.log('Testing S3 connection...');

        // Test 1: List buckets
        try {
            const listCommand = new ListBucketsCommand({});
            const listResult = await S3.send(listCommand);
            console.log('Available buckets:', listResult.Buckets?.map(b => b.Name));
        } catch (error) {
            console.error('Failed to list buckets:', error);
        }

        // Test 2: Check if our bucket exists
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!;
        console.log('Checking bucket:', bucketName);

        try {
            const headCommand = new HeadBucketCommand({ Bucket: bucketName });
            await S3.send(headCommand);
            console.log('Bucket exists and is accessible:', bucketName);

            return NextResponse.json({
                success: true,
                message: 'S3 connection successful',
                bucket: bucketName,
                status: 'exists'
            });
        } catch (error: any) {
            console.log('Bucket check failed:', error.name, error.$metadata?.httpStatusCode);

            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                // Try to create the bucket
                try {
                    console.log('Attempting to create bucket:', bucketName);
                    const createCommand = new CreateBucketCommand({ Bucket: bucketName });
                    await S3.send(createCommand);
                    console.log('Bucket created successfully:', bucketName);

                    return NextResponse.json({
                        success: true,
                        message: 'S3 connection successful, bucket created',
                        bucket: bucketName,
                        status: 'created'
                    });
                } catch (createError) {
                    console.error('Failed to create bucket:', createError);
                    return NextResponse.json({
                        success: false,
                        error: 'Failed to create bucket',
                        details: createError
                    }, { status: 500 });
                }
            } else {
                return NextResponse.json({
                    success: false,
                    error: 'Bucket access denied',
                    details: error.message
                }, { status: 403 });
            }
        }

    } catch (error) {
        console.error('S3 test error:', error);
        return NextResponse.json({
            success: false,
            error: 'S3 connection failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}