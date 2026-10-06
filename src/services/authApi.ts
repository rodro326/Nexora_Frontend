import api from "./api";


export type RegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);

  return response.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post("/auth/login", payload);

  return response.data;
};