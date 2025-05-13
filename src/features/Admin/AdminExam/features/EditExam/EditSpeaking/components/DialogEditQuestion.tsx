import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEditSpeakingQuestion } from "../hooks/useEditSpeakingQuestion";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  questions: {
    idQuestion: string;
    partId: string;
    question: string;
  } | null;
  refetch: () => void;
}
const DialogEditQuestion = ({
  openDia,
  setOpenDia,
  questions,
  refetch,
}: IProps) => {
  const { mutateAsync: editQuestion, isPending } = useEditSpeakingQuestion(
    questions?.idQuestion ?? ""
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewAudio, setPreviewAudio] = useState<string | null>(
    questions?.question || ""
  );
  const [partId, setPartId] = useState<string>(questions?.partId || "");
  useEffect(() => {
    setPartId(questions?.partId || "");
    setPreviewAudio(questions?.question || "");
  }, [questions]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setPreviewAudio(audioUrl);
      setSelectedFile(file);
      return () => URL.revokeObjectURL(audioUrl);
    }
  };
  const handleSubmit = async () => {
    if (!selectedFile || !partId) {
      console.error("Missing file or partId");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("question", selectedFile);
      formData.append("partId", partId);

      await editQuestion(formData);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Edit Audio Question</h2>
        <div className="space-y-4">
          <Label htmlFor="questionFile">Question</Label>
          <Input
            type="file"
            id="questionFile"
            onChange={handleFileChange}
            className="border-[#164C7E] w-full p-2 border rounded"
          />
          {previewAudio && (
            <div className="mt-4 w-full">
              <audio controls src={previewAudio} className="w-full">
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66] mt-4"
        >
          Edit Question
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditQuestion;
