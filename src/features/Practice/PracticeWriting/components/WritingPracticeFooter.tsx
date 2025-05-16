import { Button } from "@/components/ui/button";
import { Route } from "@/constant/route";
import { useState } from "react";
import DialogSubmitWritingPractice from "./DialogSubmitWritingPractice";
interface IProps {
  id: string | undefined;
  answers: string;
  setAnswers: React.Dispatch<React.SetStateAction<string>>
}
const WritingPracticeFooter = ({ id, answers, setAnswers }: IProps) => {
  const [openDia, setOpenDia] = useState<boolean>(false);
  return (
    <div className="h-10 w-11/12 flex justify-end items-center">
      <DialogSubmitWritingPractice
        openDia={openDia}
        setOpenDia={setOpenDia}
        answers={answers}
        setAnswers = {setAnswers}
        id={id}
        route={Route.PracticeWritingResult}
      />
      <Button
        className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
        onClick={() => {setOpenDia(true)}}
      >
        SUBMIT
      </Button>
    </div>
  );
};

export default WritingPracticeFooter;
