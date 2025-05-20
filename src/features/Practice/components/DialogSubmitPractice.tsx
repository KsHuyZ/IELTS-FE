import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { setStorage } from "@/utils/storage";
import { usePracticeSubmit } from "../PracticeReading/hooks/usePracticeReadingSubmit";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  answers: Record<string, string | string[]>;
  totalQuestion: number | undefined;
  id: string | undefined;
  route: string;
}
const DialogSubmitPractice = ({
  openDia,
  setOpenDia,
  answers,
  totalQuestion,
  id,
  route,
}: IProps) => {
  const { mutateAsync: submit } = usePracticeSubmit(id ?? "");
  const nav = useNavigate();
  const totalAnswered = Object.values(answers).filter((answer) =>
    Array.isArray(answer) ? answer.length : answer?.trim() !== ""
  ).length;
  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        questionId,
        answer: answer as string,
      })
    );

    try {
      const res = await submit(formattedAnswers);
      // setStorage("isTesting", "false");
      nav(`${route}/${id}/${res}`);
    } catch (error) {
      console.error("Failed to submit answers:", error);
    }
  };

  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="md:w-full w-96 flex flex-col items-center md:h-40 h-80 bg-[#3C64CE] text-white font-bold md:p-4 p-6 text-center">
        <span>
          YOU HAVE COMPLETED {totalAnswered} / {totalQuestion} QUESTIONS.
        </span>
        <span>ARE YOU SURE YOU WANT TO SUBMIT?</span>
        <div className="flex justify-between items-center w-2/3">
          <Button className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl">
            Review
          </Button>
          <Button
            className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSubmitPractice;
