import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editListeningType } from "@/api/AdminAPI/exam";
export const useEditType = (id: string) => {
  return useMutation({
    mutationFn: (data: {content: string}) => editListeningType(data, id),
    onSuccess() {
      toast.success("Edit Type Section Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
