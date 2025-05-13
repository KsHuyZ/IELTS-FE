import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createPracticeListeningType } from "@/api/AdminAPI/practice";
import { ICreatePracticeListeningType } from "@/types/AdminType/practice";
export const useCreatePracticeListeningType = () => {
  return useMutation({
    mutationFn: (data: ICreatePracticeListeningType) =>
      createPracticeListeningType(data),
    onSuccess() {
      toast.success("Create Type Listening Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
