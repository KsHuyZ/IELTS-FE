import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useCreatePracticeListening } from "../hooks/useCreatePracticeListening";
import { Input } from "@/components/ui/input";
import { useEditPracticeListening } from "../hooks/useEditPracticeListening";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id?: string;
  audio?: string;
  refetch: () => void;
}
const DialogEditListening = ({
  openDia,
  setOpenDia,
  id,
  audio,
  refetch,
}: IProps) => {
  const { mutateAsync: editPractice, isPending } = useEditPracticeListening(
    id ?? ""
  );
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    audio: null as File | null,
  });
  useEffect(() => {
    setPreviewAudio(audio || "");
  }, [id, audio]);

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
    if (!formData.audio) {
      toast.error("Please fill in all required fields");
      return;
    }
    const data = new FormData();
    if (formData.audio) data.append("audio", formData.audio);

    try {
      await editPractice(data);
      setFormData({
        audio: null,
      });
      setPreviewAudio(null);
    } catch (error) {
      console.error(error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Edit Audio</h2>
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
          Edit Audio
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditListening;
