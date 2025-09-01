import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-3xl" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
            
            {/* Footer */}
            <div className="relative z-10 mt-8 text-center text-xs text-muted-foreground">
                <p>© 2024 LMS Platform. All rights reserved.</p>
            </div>
        </div>
    );
}
