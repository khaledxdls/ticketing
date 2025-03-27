"use client";

import { createContext, useContext } from "react";

type User = {
  id: string;
  email: string;
} | null;

export const UserContext = createContext<User>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
