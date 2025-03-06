import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/context/record";
import { cn } from "@/lib/utils";
import { IExam } from "@/types/exam";
import { ExamQuestion } from "@/types/speakingExam";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { memo, useState } from "react";
import toast from "react-hot-toast";
import DialogNextQuestion from "../../ReadingTest/components/DialogNextQuestion";
interface IProps {
  questions: ExamQuestion[] | undefined;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IExam<ExamQuestion>, Error>>;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<string, string>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}
const SpeakingFooter = ({
  questions,
  refetch,
  currentQuestion,
  setCurrentQuestion,
  setProgress,
  setIsPlaying,
}: IProps) => {
  const [openDiaCon, setOpenDiaCon] = useState(false);
  const [title, setTitle] = useState<string>("");
  const { handleSaveAnswer, stopRecording } = useAudioRecorder();
  const handleAnswer = async (
    examSpeakId: string,
    examId: string,
    index: number
  ) => {
    if (!questions || index < 0 || index >= questions.length) {
      console.log("Invalid question index");
      return;
    }
    const question = questions[index];
    console.log({ question });
    if (question?.answer) {
      setTitle("YOU CANNOT GO BACK TO A COMPLETED QUESTION.");
    } else {
      stopRecording();
      await handleSaveAnswer(examSpeakId, examId);
      refetch();
      setCurrentQuestion(index + 1);
      setIsPlaying(false);
      setProgress(0);
      setTitle(
        `YOU HAVE COMPLETED QUESTION ${index}. MAKE SURE TO CONTINUE WITH QUESTION ${
          index + 1
        }.`
      );
    }
    setOpenDiaCon(true);
  };
  return (
    <div className="h-20 px-6 flex justify-between items-center">
      {/* <DialogSubmitConfirm
      openDia={openDia}
      setOpenDia={setOpenDia}
      totalQuestion={totalQuestion}
      answers={answers}
      id={id}
    /> */}

      <DialogNextQuestion
        openDiaCon={openDiaCon}
        setOpenDiaCon={setOpenDiaCon}
        setIsPlaying={setIsPlaying}
        title={title}
      />
      <div className="flex h-full items-center justify-between gap-20">
        <div className="grid grid-cols-5 gap-10 min-w-1/3">
          {questions?.map((question, index) => (
            <div className="flex flex-col items-center gap-3" key={question.id}>
              <Button
                onClick={() =>
                  handleAnswer(
                    questions[currentQuestion - 1].id,
                    questions[currentQuestion - 1].exam.id,
                    index
                  )
                }
                className={cn(
                  Number(currentQuestion) === index + 1
                    ? "bg-white border-2 border-[#164C7E] text-[#164C7E] font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white"
                    : "bg-white border-2 px-8 py-5 hover:bg-[#164C7E] hover:text-white"
                )}
              >
                QUESTION {index + 1}
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/6 flex justify-end">
        <Button
          className="ml-4 bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
          // onClick={() => {
          //   setOpenDia(true);
          // }}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default memo(SpeakingFooter);
