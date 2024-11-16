"use client";
import { useAuthContext } from "@/context/authContext";

export default function Dashboard() {
    const { user } = useAuthContext()!;

    return <h1>Welcome <b className="text-blue-400 bg-[lightgray]"> {user?.username}</b>  to your dashboard</h1>;
}
