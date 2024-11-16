"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
    const { user, resendVerificationEmail } = useAuthContext()!;
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (user?.emailVerified) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleResendVerification =  () => {
        try {
            resendVerificationEmail();
            setResendSuccess(true);
            setTimeout(() => setResendSuccess(false), 3000);
        } catch (err) {
            setError("Failed to resend verification email. Please try again.");
            setTimeout(() => setError(""), 3000);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h1 className="text-xl font-bold mb-4">Verify Your Email</h1>
                {!user.emailVerified ? (
                    <>
                        <p className="text-gray-700 mb-4">
                            A verification link has been sent to <b>{user.email}</b>. Please check your email and verify your account.
                        </p>
                        <button
                            className="btn btn-primary w-full mb-4"
                            onClick={handleResendVerification}
                        >
                            Resend Verification Email
                        </button>
                        {resendSuccess && (
                            <p className="text-green-500">Verification email resent!</p>
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                    </>
                ) : (
                    <p className="text-green-500">
                        Your email is verified! Redirecting...
                    </p>
                )}
            </div>
        </div>
    );
}
