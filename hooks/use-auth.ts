'use client';
import { useEffect, useState } from "react";

const authFromCookie = () => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const jwtCookie = cookies.find((c) => c.startsWith("authjs.session-token="));

    return !!jwtCookie;
  }
};

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(
    authFromCookie() || false
  );

  console.log("authenticated", authenticated);
  useEffect(() => {

    setAuthenticated(authFromCookie() || false);
  }, []);

   // Function to remove the jwt cookie
  const logout = () => {
    if (typeof document !== "undefined") {
      document.cookie =
        "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
      setAuthenticated(false);
    }
  };

  return {authenticated, logout};
}
