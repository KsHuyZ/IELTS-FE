import { Button } from "@/components/ui/button";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Route } from "@/constant/route";
import AudioPlayer from "./AudioPlayer";
import DialogSubmitPractice from "../../components/DialogSubmitPractice";
import { TypesListening } from "@/types/PracticeType/listeningPractice";
interface IProps {
  audio: string | undefined;
  types: TypesListening[];
  totalQuestions: number;
  flaggedQuestions: Record<string, boolean>;
  answers: Record<string, string | string[]>;
  id: string | undefined;
}
const ListeningPracticeFooter = ({
  audio,
  types,
  totalQuestions,
  flaggedQuestions,
  answers,
  id,
}: IProps) => {
  const [openDia, setOpenDia] = useState<boolean>(false);
  return (
    <div className="h-14 w-full px-6">
      <DialogSubmitPractice
        openDia={openDia}
        setOpenDia={setOpenDia}
        totalQuestion={totalQuestions}
        answers={answers}
        id={id}
        route={Route.PracticeListeningResult}
      />
      <div className="flex h-full items-center justify-between">
        {audio && (
          <div className="w-1/3 px-6">
            <AudioPlayer src={audio ?? ""} />
          </div>
        )}
        <div className="grid grid-cols-10 gap-2 w-fit py-2">
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
            const isFlagged = flaggedQuestions[questionId] || false;
            const isAnswered = !!answers[questionId];

            return (
              <Button
                key={questionId}
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
        <div className="w-1/6 flex justify-end">
          <Button
            onClick={() => {
              setOpenDia(true);
            }}
            className="ml-4 bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ListeningPracticeFooter);
