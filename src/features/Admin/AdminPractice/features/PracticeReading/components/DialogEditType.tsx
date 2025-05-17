import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EQuestionType } from "@/types/ExamType/exam";
import { useEditReadingType } from "../hooks/useEditReadingType";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  selectedType: {
    id: string;
    content: string;
    limitAnswer: number;
    type: EQuestionType;
    image: string;
  } | null;
  refetch: () => void;
}
const contentEnabledTypes = [
  EQuestionType.BlankPassageDrag,
  EQuestionType.BlankPassageTextbox,
];
const limitAnswerEnabledTypes = [
  EQuestionType.TextBox,
  EQuestionType.BlankPassageImageTextbox,
  EQuestionType.BlankPassageTextbox,
  EQuestionType.TexBoxPosition,
];
const DialogEditType = ({
  openDia,
  setOpenDia,
  selectedType,
  refetch,
}: IProps) => {
  const { mutateAsync: editType, isPending } = useEditReadingType(
    selectedType?.id ?? ""
  );
  const [formData, setFormData] = useState({
    content: "",
    limitAnswer: 2,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    selectedType?.image || null
  );
  useEffect(() => {
    setFormData({
      content: selectedType?.content || "",
      limitAnswer: selectedType?.limitAnswer || 2,
      image: null,
    });
    setImagePreview(selectedType?.image || null);
  }, [selectedType]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(selectedType?.image || null);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    if (formData.content) data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);
    if (formData.limitAnswer)
      data.append("limitAnswer", formData.limitAnswer.toString());
    try {
      await editType(data);
      setFormData({
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
    selectedType?.type &&
    contentEnabledTypes.includes(selectedType?.type as EQuestionType);
  const isLimitEnabled =
    selectedType?.type &&
    limitAnswerEnabledTypes.includes(selectedType?.type as EQuestionType);
  const imageEnabled =
    selectedType?.type &&
    selectedType.type === EQuestionType.BlankPassageImageTextbox;
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Edit Type Passage</h2>
        {isContentEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter Content"
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
        {imageEnabled && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-full h-auto max-h-48 object-contain"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
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
          Edit Type Passage
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditType;
