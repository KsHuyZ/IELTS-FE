import { Button } from "@/components/ui/button";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { ExamPassage, IExamResult } from "@/types/ExamType/exam";
import { Badge } from "@/components/ui/badge";
interface IProps {
  section: ExamPassage[];
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  totalQuestions: number;
  sectionParam: string;
  result: IExamResult | undefined;
  idResult: string | undefined;
}
const ListeningFooterResult = ({
  section,
  totalQuestions,
  setCurrentSection,
  sectionParam,
  result,
}: IProps) => {
  const allQuestions = section.flatMap((s) =>
    s.types.flatMap((type) => type.questions)
  );
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white h-28 px-6">
      <div className="flex h-full items-center justify-between gap-20">
        <div className="flex gap-10 w-1/3 overflow-x-auto">
          {section?.map((s, idx) => (
            <div className="flex flex-col items-center gap-3 py-3" key={s.id}>
              <Button
                key={s.id}
                onClick={() => {
                  setCurrentSection(idx + 1);
                }}
                className={cn(
                  Number(sectionParam) === idx + 1
                    ? "bg-white border-2 border-[#66B032] text-[#66B032] font-bold px-8 py-5 hover:bg-[#66B032] hover:text-white"
                    : "bg-white border-2 px-8 py-5 hover:bg-[#66B032] hover:text-white"
                )}
              >
                Passage {idx + 1}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 w-1/3">
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 py-2">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              // Tìm kết quả theo questionId
              const question = allQuestions[idx];
              // Tìm kết quả theo questionId
              const questionSummary = result?.summary.find(
                (q) => q.questionId === question?.id
              );

              return (
                <Button
                  key={question.id}
                  className={cn(
                    "h-8 w-8 rounded-full p-0 font-bold transition-colors flex-shrink-0",
                    questionSummary?.isCorrect
                      ? "bg-[#66B032] hover:bg-[#66B032]/80 text-white"
                      : "bg-red-600 hover:bg-red-600/70 text-white",
                    !questionSummary?.isCorrect &&
                      questionSummary?.userAnswer === "" &&
                      "bg-yellow-500 text-white hover:bg-yellow-400"
                  )}
                >
                  {idx + 1}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="w-1/6 flex justify-end">
          <Badge className="ml-4 bg-[#66B032] py-2 px-4 hover:bg-[#66B032]/80 text-base text-white font-bold rounded-xl">
            Score: {result?.score.toFixed(2)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default memo(ListeningFooterResult);
