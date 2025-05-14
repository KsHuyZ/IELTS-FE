import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextEditorImage from "@/components/TextEditor/TextEditor";
import { useEditReadingPassage } from "../hooks/useEditReadingPassage";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  refetch: () => void;
  id?: string;
  title?: string;
  content?: string;
  image?: string;
}
const DialogEditPassage = ({
  openDia,
  setOpenDia,
  refetch,
  id,
  content,
  title,
  image,
}: IProps) => {
  const { mutateAsync: editType, isPending } = useEditReadingPassage(id ?? "");
  const [formData, setFormData] = useState({
    content: content || "",
    title: title || "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    image || null
  );
  useEffect(() => {
    setFormData({
      content: content || "",
      title: title || "",
      image: null,
    });
    setImagePreview(image || null);
  }, [id, content, image]);
  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };
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
      setImagePreview(image || null);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    if (formData.content) data.append("content", formData.content);
    if (formData.title) data.append("title", formData.title);
    if (formData.image) data.append("image", formData.image);

    try {
      await editType(data);
      setFormData({
        content: "",
        title: "",
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
      <DialogContent className="max-w-full w-fit p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Edit Type Passage</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter the title"
            className="border-[#164C7E]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Content</label>
          <TextEditorImage
            content={formData.content}
            onChange={handleContentChange}
          />
        </div>
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
        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66]"
        >
          Edit Reading Passage
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditPassage;
