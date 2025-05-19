import { IUser } from "./user";
export enum ESubcription {
  Free = "free",
  Plus = "plus",
  Pro = "pro",
}
export interface IUserSignUp {
  name: string;
  email: string;
  password: string;
}
export interface IResetPassword {
  password: string;
  hash: string;
}
export interface IUserSignIn {
  email: string;
  password: string;
}
export interface IUserSignInResponse {
  user: IUser;
  token: string;
  refreshToken: string;
  tokenExpires: number;
  subscription: ESubcription;
}
export interface IUserLogout {
  refreshToken: string;
}