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

export async function getTickets() {
  try {
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets",
      {
        headers: {
          host: "ticketing.dev",
        },

        validateStatus: () => true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

export async function getTicket(ticketId: string) {
  try {
    const response = await axios.get(
      `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets/${ticketId}`,
      {
        headers: {
          host: "ticketing.dev",
        },
        validateStatus: () => true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return null;
  }
}

export async function getOrders() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders",
      {
        headers: {
          host: "ticketing.dev",
          Cookie: allCookies,
        },

        validateStatus: () => true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}
