import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signIn } from "@/api/auth";
import { setStorage } from "@/utils/storage";
import { validateError } from "@/utils/validate";
import { IUserSignIn } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { Route } from "@/constant/route";
import { useAuthStore } from "@/store/auth";
export const useLogin = () => {
  const nav = useNavigate();
  const { setAuthStatus } = useAuthStore();
  return useMutation({
    mutationFn: (values: IUserSignIn) => signIn(values),
    async onSuccess(data) {
      const token = data.token;
      const userName = data.user.name;
      const role = data.user.account.role;
      const idUser = data.user.id;
      const subscription = data.subscription;
      setStorage("idUser", idUser);
      setStorage("subscription", subscription);
      setStorage("token", token);
      // setStorage("isTesting", "false");
      setStorage("role", role);
      setStorage("userName", userName);
      setAuthStatus({
        isAuthenticated: true,
        role: role,
        subscription: subscription,
      });
      toast.success("Login Success!");
      nav(Route.Home);
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
