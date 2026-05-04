import { User } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

import { getOrCreateUserProfile, listenAuth } from "../services/authService";
import { UserProfile } from "../types/user";
import { isFutureDate } from "../utils/date";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userProfile = await getOrCreateUserProfile(firebaseUser);
      setProfile(userProfile);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = profile?.role === "admin";
  const isAgency = profile?.role === "agency" || isFutureDate(profile?.agencyUntil);

  return useMemo(
    () => ({
      user,
      profile,
      loading,
      isLoggedIn: !!user,
      isAdmin,
      isAgency,
    }),
    [user, profile, loading, isAdmin, isAgency]
  );
}