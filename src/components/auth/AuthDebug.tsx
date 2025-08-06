"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export default function AuthDebug() {
  const auth = useSelector((state: RootState) => state.auth);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>Authenticated: {auth.isAuthenticated ? "✅" : "❌"}</div>
        <div>Loading: {auth.isLoading ? "🔄" : "✅"}</div>
        <div>User: {auth.user?.username || "None"}</div>
        <div>Email: {auth.user?.email || "None"}</div>
        <div>Token: {auth.accessToken ? "✅ Present" : "❌ Missing"}</div>
      </div>
    </div>
  );
}
