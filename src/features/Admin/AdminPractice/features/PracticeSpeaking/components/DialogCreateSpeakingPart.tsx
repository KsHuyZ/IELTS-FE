import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePracticeSpeaking } from "../hooks/useCreatePracticeSpeaking";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
  refetch: () => void;
}
const DialogCreateSpeakingPart = ({
  openDia,
  setOpenDia,
  id,
  refetch,
}: IProps) => {
  const { mutateAsync: createPart, isPending } = useCreatePracticeSpeaking();
  const [formData, setFormData] = useState({
    practiceId: id || "",
    question: "",
    audio: null as File | null,
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      practiceId: id || "",
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
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      audio: file,
    }));
  };
  const handleSubmit = async () => {
    const data = new FormData();
    data.append("practiceId", formData.practiceId);
    if (formData.question) data.append("question", formData.question);
    if (formData.audio) data.append("audio", formData.audio);
    try {
      await createPart(data);
      setOpenDia(false);
    } catch (error) {
      console.error("Error creating section:", error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Create New Part</h2>
        <h1 className="font-semibold mb-4">
          Are you sure you want to create Part?
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Question</label>
          <Input
            name="question"
            value={formData.question}
            onChange={handleInputChange}
            placeholder="Enter Question"
            className="border-[#164C7E] text-[#164C7E]"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Audio</label>
          <Input
            type="file"
            onChange={handleImageChange}
            className="border-[#164C7E] text-[#164C7E]"
          />
        </div>
        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66]"
        >
          Create Part
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateSpeakingPart;
