import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import WritingTestFooter from "./components/WritingTestFooter";
import Header from "../components/Header";
import { useParams, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useExamPassage } from "../hooks/useExamPassage";

export default function WritingTest() {
  const { id } = useParams<{ id: string }>();
  const { data, refetch, isLoading } = useExamPassage(id ?? "");
  const [searchParams, setSearchParams] = useSearchParams();
  const taskParam = searchParams.get("task") ?? "1";
  const [currentTask, setCurrentTask] = useState(
    taskParam ? parseInt(taskParam) : 1
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data?.exam) {
      const initialAnswers: Record<string, string> = {};

      data?.exam?.examPassage.forEach((passage) => {
        initialAnswers[passage.id] = passage?.answer?.answer || "";
      });

      setAnswers(initialAnswers);
    }
  }, [data]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (currentTask) newSearchParams.set("task", currentTask.toString());
    setSearchParams(newSearchParams);
  }, [currentTask, setSearchParams]);

  const [wordCount, setWordCount] = useState<number>(0);
  const task = data?.exam?.examPassage[currentTask - 1];
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);
  useEffect(() => {
    if (task?.id && answers[task.id]) {
      const text = answers[task.id];
      const wordArray = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(wordArray.length);
    } else {
      setWordCount(0);
    }
  }, [task, answers]);
  const handleInput =
    (taskId: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setAnswers((prev) => ({
        ...prev,
        [taskId]: e.target.value,
      }));

      const wordArray = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(wordArray.length);
    };
  const timeLeft = data?.remainingTime;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-green-50">
      {timeLeft !== undefined && timeLeft !== null ? (
        <Header
          answers={answers}
          timeLeft={timeLeft}
          title="Writing Test"
          isLoading={isLoading}
          id={id}
        />
      ) : (
        <div className="h-20 w-full border-b bg-white shadow-lg flex justify-between p-4">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-12 w-32" />
        </div>
      )}
      <div className="flex-1 my-20 h-full w-11/12 overflow-y-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Panel - Task Description */}
          <div className="border flex flex-col justify-between h-[75vh] border-black rounded-lg overflow-auto bg-white p-6 shadow-sm">
            <span>
              <h2 className="text-xl font-bold mb-4">
                WRITING TASK {currentTask}
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.exam?.examPassage[currentTask - 1]?.content || "",
                }}
              />
            </span>

            {data?.exam?.examPassage[currentTask - 1]?.image && (
              <div className="flex justify-center mb-4">
                <img
                  src={data?.exam?.examPassage[currentTask - 1]?.image}
                  alt="Diagram showing flood protection methods"
                  className="border border-gray-200 rounded w-11/12 h-72 object-contain
                "
                />
              </div>
            )}
          </div>

          {/* Right Panel - Text Editor */}
          <div className="border border-black rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col h-full w-full">
              <div className="flex-grow mb-4">
                <Textarea
                  id={task?.id}
                  value={answers[task?.id ?? ""]}
                  onChange={handleInput(task?.id ?? "")}
                  className="w-full h-full p-4 border border-black rounded-lg resize-none"
                  placeholder="Start writing here..."
                />
              </div>
              <div className="text-left">
                <p className="text-gray-700">Words count: {wordCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <WritingTestFooter
          setCurrentTask={setCurrentTask}
          currentTask={currentTask}
          tasks={data?.exam?.examPassage}
          answers={answers}
          id={id}
        />
      </div>
    </div>
  );
}
