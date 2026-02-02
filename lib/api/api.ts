

import axios from "axios";

const origin = process.env.NEXT_PUBLIC_API_URL;
if (!origin) {
  throw new Error("Missing NEXT_PUBLIC_API_URL");
}

export const api = axios.create({
  baseURL: `${origin}/api`,
  withCredentials: true,
});



export async function getSession() {
  const { data } = await api.get("/auth/session");
  return data;
}

// логін
export async function login(values: {
  email: string;
  password: string;
}) {
  const { data } = await api.post("/auth/login", values);
  return data;
}

// реєстрація
export async function register(values: {
  email: string;
  password: string;
}) {
  const { data } = await api.post("/auth/register", values);
  return data;
}

// логаут
export async function logout() {
  await api.post("/auth/logout");
}