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
  totalQuestions: number | undefined;
  answers: Record<string, string>;
  sectionParam: string;
  id: string | undefined;
}
const ListeningFooter = ({
  audio,
  section,
  totalQuestions,
  answers,
  sectionParam,
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
  const countQuestionsInPassage = (sectionId: string) => {
    const sections = section.find((p) => p.id === sectionId);
    if (!sections) return 0;

    return sections.types.reduce(
      (total, type) => total + type.questions.length,
      0
    );
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white h-32 px-6">
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
        <div className="grid grid-cols-5 gap-10 min-w-1/3">
          {section.map((sectionitem, idx) => (
            <div
              className="flex flex-col items-center gap-3"
              key={sectionitem.id}
            >
              <Button
                className={cn(
                  Number(sectionParam) === idx + 1
                    ? "bg-white border-2 border-[#164C7E] text-[#164C7E] font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white"
                    : "bg-white border-2 font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white",
                  answeredQuestionsCount(sectionitem.id) ===
                    countQuestionsInPassage(sectionitem.id) &&
                    "border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09]"
                )}
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
        <div className="flex flex-col items-center gap-3">
          <Button className="bg-white border-2 border-[#164C7E] text-[#164C7E] font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white">
            REVIEW TIME
          </Button>
          <span>10 minutes</span>
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
