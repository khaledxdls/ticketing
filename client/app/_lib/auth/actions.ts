"use server";

import axios from "axios";
import { cookies } from "next/headers";

/**
 * Server action to check if a user is currently signed in
 * @returns The current user object or null if not authenticated
 */
export async function getCurrentUser() {
  try {
    // Get the cookie from the request
    const cookieStore = await cookies();
    const allCookies = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Make request to authentication service with cookies
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          host: "ticketing.dev",
          // Forward cookies to maintain session
          Cookie: allCookies,
        },
        // Needed for Node.js server environment
        validateStatus: () => true,
      }
    );

    // If request failed or user is not signed in
    if (!response.data?.currentUser) {
      return null;
    }

    return response.data.currentUser;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Server action to check if user is authenticated
 * Simpler boolean version of getCurrentUser
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}
