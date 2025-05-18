import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EQuestionType } from "@/types/ExamType/exam";
import { useCreatePracticeListeningType } from "../hooks/useCreateListeningType";
import { Input } from "@/components/ui/input";
import { useEditPracticeListeningType } from "../hooks/useEditListeningType";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  selectedType: {
    id: string;
    content: string;
    type: EQuestionType;
    limitAnswer: number;
  } | null;
  refetch: () => void;
}
const contentEnabledTypes = [
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SummaryCompletion,
];
const limitAnswerEnabledTypes = [
  EQuestionType.DiagramLabelCompletion,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SentenceCompletion,
  EQuestionType.ShortAnswerQuestion,
  EQuestionType.SummaryCompletion,
];
const DialogEditPracticeListeningType = ({
  openDia,
  setOpenDia,
  selectedType,
  refetch,
}: IProps) => {
  const { mutateAsync: editType, isPending } = useEditPracticeListeningType(
    selectedType?.id ?? ""
  );
  const [formData, setFormData] = useState({
    content: "",
    limitAnswer: 2,
  });
  useEffect(() => {
    setFormData(() => ({
      content: selectedType?.content || "",
      limitAnswer: selectedType?.limitAnswer || 2,
    }));
  }, [selectedType]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "limitAnswer" ? Number(value) || 2 : value,
    }));
  };
  const handleSubmit = async () => {
    try {
      await editType(formData);
      setFormData({
        content: "",
        limitAnswer: 2,
      });
    } catch (error) {
      console.error(error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  const isLimitEnabled =
    selectedType?.type && limitAnswerEnabledTypes.includes(selectedType.type as EQuestionType);
  const isContentEnabled =
    selectedType?.type && contentEnabledTypes.includes(selectedType.type as EQuestionType);
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Edit Type Section</h2>
        {isContentEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder={
                isContentEnabled
                  ? "Enter Content"
                  : "Content is disabled for this type"
              }
              className="border-[#164C7E] h-80 text-[#164C7E]"
            />
          </div>
        )}
        {isLimitEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Limit Word Answer
            </label>
            <Input
              name="limitAnswer"
              value={formData.limitAnswer}
              onChange={handleInputChange}
              type="number"
              min={1}
              className="border-[#164C7E] w-32 text-center text-[#164C7E]"
            />
          </div>
        )}
        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66]"
        >
          Edit Type
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditPracticeListeningType;
