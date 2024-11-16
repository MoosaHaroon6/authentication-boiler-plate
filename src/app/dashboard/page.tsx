"use client";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { user } = useAuthContext()!;
    const router = useRouter();

    if (!user) {
        router.push("/login");
        return null;
    }

    return <h1>Welcome {user.username} to your dashboard</h1>;
}
