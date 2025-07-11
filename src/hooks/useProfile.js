import { useEffect, useState, useRef } from "react";
import { getProfileByUserId } from "@/services/profileService";

// Simple in-memory cache for profiles
const profileCache = {};

export default function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    if (profileCache[userId]) {
      setProfile(profileCache[userId]);
      setLoading(false);
    } else {
      getProfileByUserId(userId)
        .then((data) => {
          profileCache[userId] = data;
          if (isMounted.current) setProfile(data);
        })
        .catch((err) => {
          if (isMounted.current) setError(err);
        })
        .finally(() => {
          if (isMounted.current) setLoading(false);
        });
    }
    return () => {
      isMounted.current = false;
    };
  }, [userId]);

  return { profile, loading, error };
} 