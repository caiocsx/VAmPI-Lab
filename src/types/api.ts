import type { User } from "./user";

export interface MeResponse {
  data: User;
  status: string;
}

export interface LoginResponse {
  auth_token?: string;
  message: string;
  status: "success" | "fail";
}

export interface RegisterResponse {
  message: string;
  status: "success" | "fail";
}
