import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resetPassword } from "@/api/auth";
import { validateError } from "@/utils/validate";
import { IResetPassword } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { Route } from "@/constant/route";
export const useResetPassword = () => {
  const nav = useNavigate();
  return useMutation({
    mutationFn: (values: IResetPassword) => resetPassword(values),
    onSuccess() {
      toast.success("Reset Password Success!");
      nav(Route.Home);
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
