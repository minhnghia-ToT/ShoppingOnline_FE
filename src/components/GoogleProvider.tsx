"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="111570897583-e8s74564fjq1ulf5b9sbkgpeq7e61m0h.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}