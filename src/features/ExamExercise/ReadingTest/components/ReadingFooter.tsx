import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { memo, useState } from "react";
import DialogSubmitConfirm from "../../components/DialogSubmitConfirm";
import { Route } from "@/constant/route";
import { ExamPassage } from "@/types/ExamType/exam";
interface IProps {
  passages: ExamPassage[];
  answers: Record<string, string>;
  passageParam: string;
  flaggedQuestions: Record<string, boolean>;
  totalQuestions: number;
  setCurrentPassage: React.Dispatch<React.SetStateAction<number>>;
  // setCurrentQuestionPage: React.Dispatch<React.SetStateAction<number>>;
  // questions: ReadingQuestion[];
  id: string | undefined;
}
const ReadingFooter = ({
  passages,
  passageParam,
  totalQuestions,
  setCurrentPassage,
  flaggedQuestions,
  // setCurrentQuestionPage,
  // questions,
  answers,
  id,
}: IProps) => {
  const [openDia, setOpenDia] = useState<boolean>(false);
  const answeredQuestionsCount = (passageId: string) => {
    const passage = passages.find((p) => p.id === passageId);
    if (!passage) return 0;

    return passage.types.reduce((total, type) => {
      return total + type.questions.filter((q) => answers[q.id])?.length;
    }, 0);
  };
  const hasFlaggedQuestions = (passageId: string) => {
    const passage = passages.find((p) => p.id === passageId);
    if (!passage) return false;

    return passage.types.some((type) =>
      type.questions.some((question) => flaggedQuestions[question.id])
    );
  };
  const countQuestionsInPassage = (passageId: string) => {
    const passage = passages.find((p) => p.id === passageId);
    if (!passage) return 0;

    return passage.types.reduce(
      (total, type) => total + type.questions.length,
      0
    );
  };
  const allQuestions = passages.flatMap((passage) =>
    passage.types.flatMap((type) => type.questions)
  );
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white h-28 px-6">
      <DialogSubmitConfirm
        openDia={openDia}
        setOpenDia={setOpenDia}
        totalQuestion={totalQuestions}
        answers={answers}
        id={id}
        route={Route.ExamReadingResult}
      />
      <div className="flex h-full items-center justify-between gap-20">
        <div className="flex items-center gap-10 w-1/3 overflow-x-auto">
          {passages?.map((passage, idx) => (
            <div className="flex flex-col items-center gap-3" key={passage.id}>
              <Button
                onClick={() => {
                  setCurrentPassage(idx + 1);
                }}
                className={cn(
                  "px-8 py-5 font-bold",
                  hasFlaggedQuestions(passage.id)
                    ? "bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-600"
                    : Number(passageParam) === idx + 1
                    ? "bg-white border-2 border-[#164C7E] text-[#164C7E] hover:bg-[#164C7E] hover:text-white"
                    : answeredQuestionsCount(passage.id) ===
                      countQuestionsInPassage(passage.id)
                    ? "bg-white border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white"
                    : "bg-white border-2 hover:bg-[#164C7E] hover:text-white"
                )}
              >
                Passage {idx + 1}
              </Button>
              <span>
                {answeredQuestionsCount(passage.id)}/
                {countQuestionsInPassage(passage.id)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center w-1/3">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 py-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const question = allQuestions[idx];
              const questionId = question ? question.id : "";
              const isAnswered = !!answers[questionId];
              const isFlagged = flaggedQuestions[questionId] || false;
              return (
                <Button
                  key={questionId || idx}
                  className={cn(
                    "h-8 w-8 rounded-full p-0 font-bold transition-colors flex-shrink-0",
                    isFlagged
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : isAnswered
                      ? "bg-[#3C64CE] text-white"
                      : "bg-[#D9D9D9] hover:bg-[#3C64CE] hover:text-white"
                  )}
                >
                  {idx + 1}
                </Button>
              );
            })}
          </div>
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

export default memo(ReadingFooter);
