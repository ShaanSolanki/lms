"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OTPInput } from "@/components/ui/otp-input";
import { Mail, Loader, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
}

export function OTPVerification({ email, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [verifyPending, startVerifyTransition] = useTransition();
  const [resendPending, startResendTransition] = useTransition();
  const router = useRouter();

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    startVerifyTransition(async () => {
      try {
        await authClient.emailOtp.verifyEmail({
          email,
          otp,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Email verified successfully!");
              router.push("/");
            },
            onError: (error) => {
              toast.error(error.error.message || "Invalid verification code");
              setOtp(""); // Clear OTP on error
            },
          },
        });
      } catch (error) {
        toast.error("Failed to verify email");
        setOtp("");
      }
    });
  };

  const handleResendOTP = async () => {
    startResendTransition(async () => {
      try {
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "email-verification",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Verification code sent!");
              setOtp(""); // Clear current OTP
            },
            onError: (error) => {
              toast.error(error.error.message || "Failed to send verification code");
            },
          },
        });
      } catch (error) {
        toast.error("Failed to resend verification code");
      }
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold">Verify your email</CardTitle>
        <CardDescription className="text-muted-foreground">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block text-center">
              Enter verification code
            </label>
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              disabled={verifyPending}
            />
          </div>

          <Button
            onClick={handleVerifyOTP}
            className="w-full h-11 font-medium"
            disabled={verifyPending || otp.length !== 6}
          >
            {verifyPending ? (
              <>
                <Loader className="size-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={resendPending}
            className="w-full"
          >
            {resendPending ? (
              <>
                <Loader className="size-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to signup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}