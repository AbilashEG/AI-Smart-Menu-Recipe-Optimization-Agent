import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchMenuItems() {
  try {
    const res = await axios.get(`${BASE_URL}/data/menu`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch menu:", err);
    throw err;
  }
}

export async function fetchOrders() {
  try {
    const res = await axios.get(`${BASE_URL}/data/orders`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    throw err;
  }
}

export async function fetchReviews() {
  try {
    const res = await axios.get(`${BASE_URL}/data/reviews`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    throw err;
  }
}

export async function askQuestion(question) {
  try {
    const res = await axios.post(`${BASE_URL}/analyze`, { question });
    return res.data;
  } catch (err) {
    console.error("Failed to ask question:", err);
    throw err;
  }
}

export async function checkHealth() {
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    return res.data;
  } catch (err) {
    console.error("Health check failed:", err);
    throw err;
  }
}
