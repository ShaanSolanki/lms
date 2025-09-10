import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <ShieldX className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Access Denied
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        You don't have permission to access the admin area. Only administrators can view this content.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button asChild className="w-full">
                        <Link href="/">
                            Return to Home
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}