import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function requireAdminAPI() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== "admin") {
        return NextResponse.json({
            error: 'Forbidden - Admin access required'
        }, { status: 403 });
    }

    return session;
}