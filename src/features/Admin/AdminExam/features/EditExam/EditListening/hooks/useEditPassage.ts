import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { IEditPassage } from "@/types/AdminType/exam";
import { editPassage } from "@/api/AdminAPI/exam";
export const useEditPassage = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IEditPassage }) =>
      editPassage(id, data),
    onSuccess() {
      toast.success("Edit Passage Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
