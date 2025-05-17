import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EQuestionType } from "@/types/ExamType/exam";
import { useCreateListeningType } from "../hooks/useCreateListeningType";
import { Input } from "@/components/ui/input";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
  refetch: () => void;
}
const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.DiagramLabelCompletion]: "Diagram Label Completion",
  [EQuestionType.MatchingFeatures]: "Matching Features",
  [EQuestionType.MatchingHeadings]: "Matching Headings",
  [EQuestionType.MatchingInfomation]: "Matching Information",
  [EQuestionType.MatchingSentencesEnding]: "Matching Sentences Ending",
  [EQuestionType.MultipleChoice]: "Multiple Choice",
  [EQuestionType.SentenceCompletion]: "Sentence Completion",
  [EQuestionType.ShortAnswerQuestion]: "Short Answer Question",
  [EQuestionType.SummaryCompletion]: "Summary Completion",
  [EQuestionType.TrueFalseNotGiven]: "True/False/Not Given",
  [EQuestionType.YesNoNotGiven]: "Yes/No/Not Given",
};
const contentEnabledTypes = [
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInfomation,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SummaryCompletion,
];
const limitAnswerEnabledTypes = [
  EQuestionType.DiagramLabelCompletion,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInfomation,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SentenceCompletion,
  EQuestionType.ShortAnswerQuestion,
  EQuestionType.SummaryCompletion
];
const DialogCreateListeningType = ({
  openDia,
  setOpenDia,
  id,
  refetch,
}: IProps) => {
  const { mutateAsync: createListeningType, isPending } =
    useCreateListeningType();
  const [formData, setFormData] = useState({
    examSectionId: id || "",
    type: "",
    limitAnswer: 2,
    content: "",
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      examSectionId: id || "",
    }));
  }, [id]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "limitAnswer" ? Number(value) || 2 : value,
    }));
  };
  const handleTypeChange = (value: string) => {
    const newType = value as EQuestionType;
    setFormData((prev) => ({
      ...prev,
      type: value as EQuestionType,
      content: contentEnabledTypes.includes(newType) ? prev.content : "",
    }));
  };
  const handleSubmit = async () => {
    if (!formData.examSectionId || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await createListeningType(formData);
      setFormData({
        examSectionId: id || "",
        type: "",
        limitAnswer: 2,
        content: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  const isContentEnabled =
    formData.type &&
    contentEnabledTypes.includes(formData.type as EQuestionType);
  const isLimitEnabled =
    formData.type &&
    limitAnswerEnabledTypes.includes(formData.type as EQuestionType);
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Create New Type Section</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <Select
            name="type"
            value={formData.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="border-[#164C7E] text-[#164C7E]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(questionTypeDisplayNames).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

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
              className="border-[#164C7E] text-[#164C7E] h-56"
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
          Create Type Section
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateListeningType;
