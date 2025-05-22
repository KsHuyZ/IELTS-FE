import { useEffect, useState } from "react";
import SpeakingFooter from "./components/SpeakingFooter";
import Header from "../components/Header";
import { useParams, useSearchParams } from "react-router-dom";
import Recording from "./components/Recording";
import { Skeleton } from "@/components/ui/skeleton";
import { useExamPassage } from "../hooks/useExamPassage";
import AudioPlayer from "./components/AudioPlayer";
import { cn } from "@/lib/utils";

const SpeakingTest = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const questionParam = searchParams.get("part") ?? "1";
  const [currentPart, setCurrentPart] = useState(
    questionParam ? parseInt(questionParam) : 1
  );
  const { data, refetch, isLoading } = useExamPassage(id ?? "");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [completedAudio, setCompletedAudio] = useState<string[]>([]);
  useEffect(() => {
    if (data?.exam) {
      const initialAnswers: Record<string, string> = {};
      data?.exam?.examPassage.forEach((passage) => {
        passage?.questions.forEach((question) => {
          initialAnswers[question.id] = (question?.answer as string) || "";
        });
      });
      setAnswers(initialAnswers);
    }
  }, [data]);

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
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (currentPart) newSearchParams.set("part", currentPart.toString());
    setSearchParams(newSearchParams);
  }, [currentPart, setSearchParams]);

  useEffect(() => {
    if (id) refetch();
  }, [id]);

  const timeLeft = data?.remainingTime;

  const isPartCompleted = (partIndex: number) => {
    const part = data?.exam?.examPassage[partIndex - 1];
    if (!part) return false;
    return part.questions.every((question) => answers[question.id]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F1FFEF] overflow-y-hidden">
      {timeLeft !== undefined && timeLeft !== null ? (
        <Header
          timeLeft={timeLeft}
          answers={answers as Record<string, string>}
          title="Speaking Test"
          isLoading={isLoading}
          id={id}
        />
      ) : (
        <div className="h-20 fixed top-0 w-full border-b bg-white shadow-lg flex justify-between p-4">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-12 w-32" />
        </div>
      )}
      <div className="flex-1 p-6 h-full my-24 overflow-y-hidden">
        <div className="p-6 overflow-y-auto">
          <div className="mb-6 bg-[#164C7E] h-20 text-white flex gap-10 items-center justify-center rounded-lg">
            <h1 className="text-xl font-semibold">SPEAKING TEST</h1>
            <div className="font-medium">
              <p>Listen the question and record your answer.</p>
              <p>You have 10 seconds for preparing.</p>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            {data?.exam?.examPassage[currentPart - 1]?.questions.map(
              (question, index) => {
                const globalIndex =
                  (currentPart - 1) *
                    data?.exam?.examPassage[currentPart - 1]?.questions.length +
                  index;
                const prevQuestionId =
                  index > 0
                    ? data?.exam?.examPassage[currentPart - 1]?.questions[
                        index - 1
                      ]?.id
                    : null;

                return (
                  <div
                    className={cn(
                      "flex flex-col gap-5 border-2 bg-white shadow rounded-lg p-5",
                      activeQuestionId === question.id ? "border-[#188F09]" : ""
                    )}
                    key={question.id}
                  >
                    <div className="flex items-center gap-16">
                      <div className="border-2 border-black font-bold rounded-lg p-4">
                        QUESTION {globalIndex + 1}
                      </div>
                      <div className="w-2/3">
                        <AudioPlayer
                          setActiveQuestionId={setActiveQuestionId}
                          src={question.question}
                          questionId={question.id}
                          disabled={index > 0 && !answers[prevQuestionId!]}
                          onComplete={() => handleAudioComplete(question.id)}
                        />
                      </div>
                    </div>
                    <Recording
                      questionId={question.id}
                      answers={answers as Record<string, string>}
                      canRecord={
                        index === 0
                          ? completedAudio.includes(question.id)
                          : prevQuestionId
                          ? completedAudio.includes(question.id) &&
                            !!answers[prevQuestionId]
                          : false
                      }
                      handleAudioUploaded={handleAudioUploaded}
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
      <SpeakingFooter
        questions={data?.exam?.examPassage}
        currentPart={currentPart}
        setCurrentPart={setCurrentPart}
        answers={answers as Record<string, string>}
        id={id}
        isLoading={isLoading}
        isPartCompleted={isPartCompleted}
      />
    </div>
  );
};

export default SpeakingTest;
