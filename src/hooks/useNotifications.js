import { useState, useCallback } from "react";

export default function useNotifications(initial = []) {
  const [notifications, setNotifications] = useState(initial);

  // Placeholder for real API call
  const fetchNotifications = useCallback(async () => {
    // const data = await api.get('/notifications');
    // setNotifications(data);
  }, []);

  return { notifications, setNotifications, fetchNotifications };
} 