"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "../../../hooks/useRequest";

export default function SignoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Use the custom hook for sign out
  const { doRequest, errors, isLoading } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      // Refresh the current route to update server components
      router.refresh();
      // Then navigate to home page
      router.push("/");
    },
  });

  // Prevent hydration errors by only rendering once mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Automatically trigger sign out when the component mounts
  useEffect(() => {
    if (isMounted) {
      doRequest();
    }
  }, [isMounted, doRequest]);

  // Don't render anything until client-side
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Signing Out</h2>

        {errors && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {errors}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-600">Please wait while we sign you out...</p>
        ) : (
          <p className="text-gray-600">
            You have been signed out successfully.
          </p>
        )}
      </div>
    </div>
  );
}
