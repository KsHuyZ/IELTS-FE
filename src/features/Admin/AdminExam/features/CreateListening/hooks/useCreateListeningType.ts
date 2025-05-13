import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createListeningType } from "@/api/AdminAPI/exam";
import { ICreateListeningType } from "@/types/AdminType/exam";
export const useCreateListeningType = () => {
  return useMutation({
    mutationFn: (data: ICreateListeningType) => createListeningType(data),
    onSuccess() {
      toast.success("Create Type Section Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
