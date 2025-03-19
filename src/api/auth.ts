import { api } from "@/lib/api";
import { IUserSignIn, IUserSignInResponse, IUserSignUp } from "@/types/auth";
import { IToken } from "@/types/token";

export const signUp = (user: IUserSignUp) => api.post('/auth/register', user);
export const signIn = (user: IUserSignIn): Promise<IUserSignInResponse> =>
  api.post('/auth/login', user);
export const logOut = () => api.post('/auth/logout');
export const refreshTokenApi = (
  refreshToken: string,
): Promise<IToken> =>
  api.post('/auth/refresh', {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });