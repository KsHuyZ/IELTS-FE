import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";
import { Route } from "@/constant/route";
import DialogSubmitPractice from "../../components/DialogSubmitPractice";
import { TypesReading } from "@/types/PracticeType/readingPractice";
interface IProps {
  types: TypesReading[];
  answers: Record<string, string>;
  totalQuestions: number
  id: string | undefined;
}
const ReadingPracticeFooter = ({
  types,
  totalQuestions,
  // setCurrentQuestionPage,
  // questions,
  answers,
  id,
}: IProps) => {
  const [openDia, setOpenDia] = useState<boolean>(false);
  return (
    <div className="absolute bottom-0 left-10 right-0 h-20 px-6">
      <DialogSubmitPractice
        openDia={openDia}
        setOpenDia={setOpenDia}
        totalQuestion={totalQuestions}
        answers={answers}
        id={id}
        route={Route.PracticeReadingResult}
      />
      <div className="flex h-full items-center justify-between gap-20">
        <div className="flex items-center gap-5 w-2/3 p-2 overflow-x-auto ">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            // Tìm passage và question tương ứng với index hiện tại
            let questionId = "";
            let currentIndex = idx;
            let found = false;
            for (const type of types) {
              if (currentIndex < type.questions.length) {
                questionId = type.questions[currentIndex].id;
                found = true;
                break;
              }
              currentIndex -= type.questions.length;
            }

            const isAnswered = !!answers[questionId];

            return (
              <Button
                key={questionId}
                className={cn(
                  "h-8 w-8 rounded-full p-4 font-bold transition-colors",
                  isAnswered
                    ? "bg-[#3C64CE] text-white"
                    : "bg-[#D9D9D9] hover:bg-[#3C64CE] hover:text-white"
                )}
              >
                {idx + 1}
              </Button>
            );
          })}
        </div>
        <div className="w-1/6 flex justify-end">
          <Button
            className="ml-4 bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
            onClick={() => {
              setOpenDia(true);
            }}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ReadingPracticeFooter);
