import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { ICreatePassage } from "@/types/AdminType/exam";
import { createPassage } from "@/api/AdminAPI/exam";
export const useCreatePassage = () => {
  return useMutation({
    mutationFn: (data: ICreatePassage) => createPassage(data),
    onSuccess() {
      toast.success("Create Passage Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
