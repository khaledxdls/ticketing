"use client";

import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  currentUser: any | null;
}

export default function Header({ currentUser }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Links to show based on authentication status
  const links = [
    // Always show this link
    { label: "Home", href: "/" },

    // Show only when NOT signed in
    ...(!currentUser
      ? [
          { label: "Sign In", href: "/auth/signin" },
          { label: "Sign Up", href: "/auth/signup" },
        ]
      : []),

    // Show only when signed in
    ...(currentUser
      ? [
          { label: "Sell Tickets", href: "/tickets/new" },
          { label: "My Orders", href: "/orders" },
          { label: "Sign Out", href: "/auth/signout" },
        ]
      : []),
  ];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl text-blue-600">
              Ticketing
            </Link>
          </div>

          {/* User info - visible on desktop */}
          <div className="hidden md:block">
            {currentUser && (
              <span className="text-sm text-gray-500 mr-4">
                {currentUser.email}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-md text-sm font-medium
                  ${
                    label === "Sign Up" || label === "Sell Tickets"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* X icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser && (
              <div className="px-3 py-2 text-sm font-medium text-gray-500">
                {currentUser.email}
              </div>
            )}
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-md text-base font-medium 
                  ${
                    label === "Sign Up" || label === "Sell Tickets"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
