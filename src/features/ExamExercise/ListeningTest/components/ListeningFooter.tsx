import { Button } from "@/components/ui/button";
import { memo, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { cn } from "@/lib/utils";
import DialogSubmitConfirm from "../../components/DialogSubmitConfirm";
import { Route } from "@/constant/route";
import { ExamPassage } from "@/types/ExamType/exam";
interface IProps {
  audio: string | undefined;
  section: ExamPassage[];
  totalQuestions: number;
  answers: Record<string, string>;
  flaggedQuestions: Record<string, boolean>;
  sectionParam: string;
  id: string | undefined;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
}
const ListeningFooter = ({
  audio,
  section,
  totalQuestions,
  setCurrentSection,
  answers,
  sectionParam,
  flaggedQuestions,
  id,
}: IProps) => {
  const [progress, setProgress] = useState(0);
  const [openDia, setOpenDia] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const answeredQuestionsCount = (sectionId: string) => {
    const sections = section.find((p) => p.id === sectionId);
    if (!sections) return 0;

    return sections.types.reduce((total, type) => {
      return total + type.questions.filter((q) => answers[q.id])?.length;
    }, 0);
  };
  const hasFlaggedQuestions = (passageId: string) => {
    const passage = section.find((p) => p.id === passageId);
    if (!passage) return false;

    return passage.types.some((type) =>
      type.questions.some((question) => flaggedQuestions[question.id])
    );
  };
  const countQuestionsInPassage = (sectionId: string) => {
    const sections = section.find((p) => p.id === sectionId);
    if (!sections) return 0;

    return sections.types.reduce(
      (total, type) => total + type.questions.length,
      0
    );
  };
  const allQuestions = section.flatMap((passage) =>
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
        route={Route.ExamListeningResult}
      />
      {audio && (
        <div className="absolute -top-5 left-0 right-0 w-full px-6">
          <AudioPlayer
            src={audio ?? ""}
            setIsPlaying={setIsPlaying}
            isPlaying={isPlaying}
            progress={progress}
            setProgress={setProgress}
            section={section.length}
          />
        </div>
      )}
      <div className="flex h-full items-center pt-5 justify-between gap-20">
        <div className="flex items-center gap-10 w-1/3 overflow-x-auto">
          {section.map((sectionitem, idx) => (
            <div
              className="flex flex-col items-center gap-3"
              key={sectionitem.id}
            >
              <Button
                className={cn(
                  "px-8 py-5 font-bold",
                  hasFlaggedQuestions(sectionitem.id)
                    ? "bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-600"
                    : Number(sectionParam) === idx + 1
                    ? "bg-white border-2 border-[#164C7E] text-[#164C7E] hover:bg-[#164C7E] hover:text-white"
                    : answeredQuestionsCount(sectionitem.id) ===
                      countQuestionsInPassage(sectionitem.id)
                    ? "bg-white border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white"
                    : "bg-white border-2 hover:bg-[#164C7E] hover:text-white"
                )}
                onClick={() => {
                  setCurrentSection(idx + 1);
                }}
              >
                SECTION {idx + 1}
              </Button>
              <span>
                {answeredQuestionsCount(sectionitem.id)}/
                {countQuestionsInPassage(sectionitem.id)}
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
        <div className="flex flex-col w-fit items-center gap-3">
          <Button className="bg-white border-2 border-[#164C7E] text-[#164C7E] font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white">
            REVIEW TIME
          </Button>
          <span>2 minutes</span>
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

export default memo(ListeningFooter);
