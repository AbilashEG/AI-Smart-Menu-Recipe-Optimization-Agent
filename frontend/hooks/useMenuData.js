"use client";
import { useState, useEffect } from "react";
import { fetchMenuItems } from "@/utils/api";

export default function useMenuData() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuItems()
      .then(setMenuItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { menuItems, loading, error };
}
