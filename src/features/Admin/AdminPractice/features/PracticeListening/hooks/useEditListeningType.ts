import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editPracticeListeningType } from "@/api/AdminAPI/practice";
import { IEditPracticeListeningType } from "@/types/AdminType/practice";
export const useEditPracticeListeningType = (id: string) => {
  return useMutation({
    mutationFn: (data: IEditPracticeListeningType) =>
      editPracticeListeningType(data, id),
    onSuccess() {
      toast.success("Edit Type Listening Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
