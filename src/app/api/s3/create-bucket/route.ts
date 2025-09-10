import { CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/S3Client";
import { NextResponse } from "next/server";
import { requireAdminAPI } from "@/app/data/admin/require-admin-api";

export async function POST(request: Request) {
    try {
        // Check admin authentication
        const sessionOrError = await requireAdminAPI()
        if (sessionOrError instanceof NextResponse) {
            return sessionOrError
        }

        const { bucketName } = await request.json();
        const finalBucketName = bucketName || process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

        console.log('Creating bucket:', finalBucketName);

        // Create the bucket
        const createCommand = new CreateBucketCommand({
            Bucket: finalBucketName,
        });

        await S3.send(createCommand);
        console.log('Bucket created successfully:', finalBucketName);

        // Set a public read policy for the bucket (optional, for serving images)
        const bucketPolicy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicReadGetObject",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:GetObject",
                    Resource: `arn:aws:s3:::${finalBucketName}/*`
                }
            ]
        };

        try {
            const policyCommand = new PutBucketPolicyCommand({
                Bucket: finalBucketName,
                Policy: JSON.stringify(bucketPolicy)
            });
            await S3.send(policyCommand);
            console.log('Bucket policy set successfully');
        } catch (policyError) {
            console.log('Could not set bucket policy (this is optional):', policyError);
        }

        return NextResponse.json({
            success: true,
            message: 'Bucket created successfully',
            bucketName: finalBucketName
        });

    } catch (error: any) {
        console.error('Bucket creation error:', error);

        if (error.name === 'BucketAlreadyExists' || error.name === 'BucketAlreadyOwnedByYou') {
            return NextResponse.json({
                success: true,
                message: 'Bucket already exists',
                bucketName: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Failed to create bucket',
            details: error.message,
            errorCode: error.name
        }, { status: 500 });
    }
}