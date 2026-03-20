"use client";
import { useState, useEffect } from "react";
import { fetchOrders } from "@/utils/api";

export default function useOrderData() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error };
}
