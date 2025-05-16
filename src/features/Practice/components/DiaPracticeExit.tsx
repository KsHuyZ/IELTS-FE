import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Route } from "@/constant/route";
import { setStorage } from "@/utils/storage";
import { practiceExit } from "@/api/PracticeAPI/practice";
import { IPracticeAnswerSubmit } from "@/types/PracticeType/practice";
import toast from "react-hot-toast";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
  answers: Record<string, string | string[]>;
}
const DialogPracticeExit = ({ openDia, setOpenDia, id, answers }: IProps) => {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleExit = async (id: string) => {
    setIsLoading(true);
    try {
      const answersToSubmit: IPracticeAnswerSubmit[] = Object.entries(
        answers
      ).map(([questionId, answer]) => ({
        questionId,
        answer: Array.isArray(answer) ? answer.join(",") : answer,
      }));
      await practiceExit(answersToSubmit, id);
      toast.success('You have left the practice.')
      nav(Route.Practice);
      setStorage("isTesting", false);
    } catch (error) {
      console.error("Error while exiting practice:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="[&>button]:hidden md:w-full w-96 gap-10 flex flex-col items-center justify-center md:h-40 h-56 bg-[#3C64CE] text-white font-bold md:p-4 p-6 text-center"
      >
        <DialogTitle>
          Are you sure you want to exit the practice session?
        </DialogTitle>
        <div className="flex justify-between items-center w-2/3">
          <Button
            className="bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl"
            onClick={() => setOpenDia(false)}
          >
            Cancle
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => handleExit(id ?? "")}
            className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
          >
            Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPracticeExit;
