import { useState, useMemo } from "react";

export default function useSearch(data, keys = ["name", "username"]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) =>
      keys.some((k) => item[k]?.toLowerCase().includes(q))
    );
  }, [query, data, keys]);

  return { query, setQuery, filtered };
} 