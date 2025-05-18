import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePracticeSpeaking } from "../hooks/useCreatePracticeSpeaking";
import { useEditPracticeSpeaking } from "../hooks/useEditPracticeSpeaking";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  selectedPart: {
    id: string;
    question: string;
    audio: string;
  } | null;
  refetch: () => void;
}
const DialogEditSpeakingPart = ({
  openDia,
  setOpenDia,
  selectedPart,
  refetch,
}: IProps) => {
  const { mutateAsync: createPart, isPending } = useEditPracticeSpeaking(
    selectedPart?.id ?? ""
  );
  const [previewAudio, setPreviewAudio] = useState<string | null>(selectedPart?.audio ?? '');
  const [formData, setFormData] = useState({
    question: "",
    audio: null as File | null,
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      question: selectedPart?.question || "",
    }));
    setPreviewAudio(selectedPart?.audio ?? "");
  }, [selectedPart]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      audio: file,
    }));
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setPreviewAudio(audioUrl);
      return () => URL.revokeObjectURL(audioUrl);
    }
  };
  const handleSubmit = async () => {
    const data = new FormData();
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
            onChange={handleAudioChange}
            className="border-[#164C7E] text-[#164C7E]"
          />
        </div>
        {previewAudio && (
          <div className="mt-4 w-full">
            <audio controls src={previewAudio} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
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

export default DialogEditSpeakingPart;
