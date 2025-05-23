import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateType } from "../hooks/useCreateType";
import { Input } from "@/components/ui/input";
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FaRegQuestionCircle } from "react-icons/fa";
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
  [EQuestionType.MatchingInformation]: "Matching Information",
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
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SummaryCompletion,
];
const limitAnswerEnabledTypes = [
  EQuestionType.DiagramLabelCompletion,
  EQuestionType.SentenceCompletion,
  EQuestionType.ShortAnswerQuestion,
  EQuestionType.SummaryCompletion,
];
const DialogCreateType = ({ openDia, setOpenDia, id, refetch }: IProps) => {
  const { mutateAsync: createType, isPending } = useCreateType();
  const [formData, setFormData] = useState({
    examPassageId: id || "",
    type: "",
    content: "",
    limitAnswer: 2,
    image: null as File | null,
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      examPassageId: id || "",
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.examPassageId || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    const data = new FormData();
    data.append("examPassageId", formData.examPassageId);
    data.append("type", formData.type);
    if (formData.content) data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);
    if (formData.limitAnswer)
      data.append("limitAnswer", formData.limitAnswer.toString());

    try {
      await createType(data);
      setFormData({
        examPassageId: id || "",
        type: "",
        content: "",
        limitAnswer: 2,
        image: null,
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
  const isImageEnabled =
    formData.type && formData.type === EQuestionType.DiagramLabelCompletion;

  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Create New Type Passage</h2>
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
            <div className="flex items-center">
              <label className="block text-sm font-medium">Content</label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button className="bg-transparent hover:bg-transparent">
                    <FaRegQuestionCircle className="size-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <h1 className="text-2xl font-bold mb-4">
                    How to Create Fill-in-the-Blank Content
                  </h1>
                  <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
                    <p className="text-gray-700 mb-2">
                      To create a fill-in-the-blank passage, write a paragraph
                      normally and use{" "}
                      <code className="bg-white px-1 py-0.5 rounded border text-sm">
                        {"{blank}"}
                      </code>{" "}
                      where you want the user to fill in a word.
                    </p>
                    <p className="text-gray-700">
                      Example:
                      <br />
                      <code className="block bg-white p-3 mt-2 border rounded text-gray-800">
                        Every morning, I drink a cup of {`{blank}`} before going
                        to {`{blank}`}.
                      </code>
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder={
                isContentEnabled
                  ? "Enter Content"
                  : "Content is disabled for this type"
              }
              className="border-[#164C7E] h-56 text-[#164C7E]"
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

        {isImageEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            <Input
              type="file"
              accept="image/*"
              disabled={!isImageEnabled}
              onChange={handleImageChange}
              className="border-[#164C7E] text-[#164C7E]"
            />
          </div>
        )}
        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66]"
        >
          Create Type Passage
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateType;
