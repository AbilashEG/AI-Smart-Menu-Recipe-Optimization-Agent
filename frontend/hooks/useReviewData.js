"use client";
import { useState, useEffect } from "react";
import { fetchReviews } from "@/utils/api";

export default function useReviewData() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { reviews, loading, error };
}
