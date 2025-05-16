import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPracticeSpeaking } from "./hooks/useSpeakingPractice";
import AudioPlayer from "./components/AudioPlayer";
import Recording from "./components/Recording";
import { ArrowLeft } from "lucide-react";
import DialogPracticeSpeakingExit from "./components/DialogPracticeSpeakingExit";
import SpeakingPracticeFooter from "./components/SpeakingPracticeFooter";
import PracticeHeader from "../components/PracticeHeader";

const PracticeSpeaking = () => {
  const [openDia, setOpenDia] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      refetch();
    }
    if (data) {
      setCompletedAudio([]);
      setShowQuestions(new Array(data.length).fill(false));
    }
  }, [id]);
  const { data, refetch } = useGetPracticeSpeaking(id ?? "");
  const [completedAudio, setCompletedAudio] = useState<string[]>([]);
  useEffect(() => {
    if (data) {
      const initialAnswers: Record<string, string> = {};
      data.forEach((question) => {
        initialAnswers[question.id] = question.answer || "";
      });
      setAnswers(initialAnswers);
    }
  }, [data]);
  const [showQuestions, setShowQuestions] = useState<boolean[]>([]);
  const handleAudioComplete = (questionId: string) => {
    if (!completedAudio.includes(questionId)) {
      setCompletedAudio([...completedAudio, questionId]);
    }
  };
  const handleAudioUploaded = (questionId: string, url: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: url,
    }));
  };
  const handleShowQuestion = (index: number) => {
    const newShowQuestions = [...showQuestions];
    newShowQuestions[index] = true;
    setShowQuestions(newShowQuestions);
  };
  return (
    <div className="h-full w-full flex justify-between gap-3">
      <DialogPracticeSpeakingExit
        openDia={openDia}
        setOpenDia={setOpenDia}
        answers={answers}
        id={id}
      />
      {/* <Button
        variant="ghost"
        className="mb-4 w-fit hover:bg-[#F1FFEF] hover:border-0"
        size="sm"
        onClick={() => setOpenDia(true)}
      >
        <ArrowLeft className="text-[#164C7E]" />
      </Button> */}
      <PracticeHeader setOpenDia = {setOpenDia}/>
      <div className="flex flex-1 flex-col gap-4 pt-20 pb-4 justify-between">
        <div className="h-[73vh] bg-white border border-black rounded-lg overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 p-6">
            <div className="mb-6 bg-[#164C7E] h-20 text-white flex gap-10 items-center justify-center rounded-lg">
              <h1 className="text-xl font-semibold">SPEAKING TEST</h1>
              <div className="font-medium">
                <p>Listen the question and record your answer.</p>
                <p>You have 10 seconds for preparing.</p>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              {data?.map((item, index) => {
                const prevQuestionId = index > 0 ? data[index - 1].id : null;
                return (
                  <div
                    className={cn(
                      "flex flex-col gap-5 border-2 shadow rounded-lg p-5",
                      activeQuestionId === item.id ? "border-[#188F09]" : ""
                    )}
                    key={item.id}
                  >
                    <div className="flex items-center gap-16">
                      <div className="border-2 border-black font-bold rounded-lg p-4">
                        QUESTION {index + 1}
                      </div>
                      <div className="w-2/3">
                        <AudioPlayer
                          src={item.audio}
                          questionId={item.id}
                          setActice={setActiveQuestionId}
                          disabled={index > 0 && !answers[prevQuestionId!]}
                          onComplete={() => handleAudioComplete(item.id)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <Button
                        className={cn(
                          " border-2 font-bold bg-[#F5F5F5]",
                          showQuestions[index]
                            ? "text-[#188F09] border-[#188F09] hover:bg-[#188F09] hover:text-white"
                            : "text-[#164C7E] border-[#164C7E] hover:bg-[#164C7E] hover:text-white"
                        )}
                        onClick={() => handleShowQuestion(index)}
                        disabled={!completedAudio.includes(item.id)}
                      >
                        SHOW QUESTION
                      </Button>
                      {showQuestions[index] && <span>{item.question}</span>}
                    </div>
                    <Recording
                      answers={answers}
                      questionId={item.id}
                      canRecord={completedAudio.includes(item.id)}
                      handleAudioUploaded={handleAudioUploaded}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <SpeakingPracticeFooter id={id} answers={answers} />
      </div>

    </div>
  );
};

export default PracticeSpeaking;
