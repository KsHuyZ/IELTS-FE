import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditPart } from "../hooks/useEditPart";
import TextEditorImage from "@/components/TextEditor/TextEditor";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  refetch: () => void;
  selectedPart: {
    id: string;
    content: string;
    image: string;
  } | null;
}
const DialogEditWriting = ({
  openDia,
  setOpenDia,
  refetch,
  selectedPart,
}: IProps) => {
  const { mutateAsync: editPart, isPending } = useEditPart(
    selectedPart?.id ?? ""
  );
  const [formData, setFormData] = useState({
    content: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    selectedPart?.image || null
  );
  useEffect(() => {
    setFormData({
      content: selectedPart?.content || "",
      image: null,
    });
    setImagePreview(selectedPart?.image || null);
  }, [selectedPart]);
  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
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
      setImagePreview(selectedPart?.image || null);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    if (formData.content) data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      await editPart(data);
      setFormData({
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
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 max-w-full w-fit bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Edit Writing Part</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Content</label>
          <TextEditorImage
            content={formData.content}
            onChange={handleContentChange}
          />
        </div>
        <div className="mb-4 space-y-4">
          <label className="block text-sm font-medium mb-1">Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border-[#164C7E] text-[#164C7E]"
          />
          {imagePreview && (
            <div className="mb-2">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="max-w-full h-auto max-h-48 object-contain"
              />
            </div>
          )}
        </div>
        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66]"
        >
          Edit Part
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditWriting;
