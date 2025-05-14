import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useCreatePracticeType } from "../hooks/useCreateType";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
  refetch: () => void;
}
const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.TextBox]: "Text Box",
  [EQuestionType.SingleChoice]: "Single Choice",
  [EQuestionType.BlankPassageDrag]: "Blank Passage Drag",
  [EQuestionType.BlankPassageTextbox]: "Blank Passage Textbox",
  [EQuestionType.BlankPassageImageTextbox]: "Blank Passage Image Textbox",
};
const contentEnabledTypes = [
  EQuestionType.BlankPassageDrag,
  EQuestionType.BlankPassageTextbox,
  EQuestionType.BlankPassageImageTextbox,
];
const DialogCreatePracticeType = ({
  openDia,
  setOpenDia,
  id,
  refetch,
}: IProps) => {
  const { mutateAsync: createType, isPending } = useCreatePracticeType();
  const [formData, setFormData] = useState({
    practiceReadingId: id || "",
    type: "",
    content: "",
    image: null as File | null,
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      practiceReadingId: id || "",
    }));
  }, [id]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!formData.practiceReadingId || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    const data = new FormData();
    data.append("practiceReadingId", formData.practiceReadingId);
    data.append("type", formData.type);
    if (formData.content) data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      await createType(data);
      setFormData({
        practiceReadingId: id || "",
        type: "",
        content: "",
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
  const isImageEnabled =
    formData.type && formData.type === EQuestionType.BlankPassageImageTextbox;
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
              className="border-[#164C7E] h-56 text-[#164C7E]"
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

export default DialogCreatePracticeType;
