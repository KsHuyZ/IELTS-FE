import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextEditorImage from "@/components/TextEditor/TextEditor";
import { useEditPassage } from "../hooks/useEditPassage";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  passageData: { id: string; title: string; passage: string } | null;
  refetch: () => void;
}
const DialogEditPassage = ({
  passageData,
  openDia,
  setOpenDia,
  refetch,
}: IProps) => {
  const { mutateAsync: editPassage, isPending } = useEditPassage();
  const [formData, setFormData] = useState({
    id: passageData?.id || "",
    title: passageData?.title || "",
    passage: passageData?.passage || "",
  });
  useEffect(() => {
    if (passageData) {
      setFormData({
        id: passageData.id,
        title: passageData.title,
        passage: passageData.passage,
      });
    }
  }, [passageData]);
  const handleContentChange = (passage: string) => {
    setFormData((prev) => ({
      ...prev,
      passage,
    }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    try {
      if (passageData?.title && passageData.passage) {
        await editPassage({
          id: formData.id,
          data: { title: formData.title, passage: formData.passage },
        });
      }
      setOpenDia(false);
      setFormData({ id: passageData?.id || "", title: "", passage: "" });
    } catch (error) {
      console.error("Error editing passage:", error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white max-w-full w-fit border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Create New Passage</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Title"
            className="w-full border-[#164C7E] text-[#164C7E]"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="passage" className="block text-sm font-medium mb-1">
            Passage
          </label>
          <TextEditorImage
            content={formData.passage}
            onChange={handleContentChange}
          />
        </div>
        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66]"
        >
          Update Passage
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditPassage;
