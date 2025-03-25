import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useWritingPracticeAnswers } from "./hooks/useWritingPracticeAnswer";
import { useWritingPracticeById } from "./hooks/useWritingPracticeById";
import { Textarea } from "@/components/ui/textarea";
import WritingPracticeFooter from "./components/WritingPracticeFooter";

const PracticeWriting = () => {
  const { id } = useParams<{ id: string }>();
  // const { mutateAsync: writingAnswers } = useWritingPracticeAnswers();
  const { data, refetch, isLoading } = useWritingPracticeById(id ?? "");
  const [answers, setAnswers] = useState<string>();
  useEffect(() => {
    if (data) {
      setAnswers(data.answer);
    }
  }, [data]);

  const [wordCount, setWordCount] = useState<number>(0);
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setAnswers(text);
    setWordCount(text.length);
  };
  return (
    <div className="flex h-full flex-col pt-10 items-center">
      <div className="flex-1 h-full w-11/12 overflow-y-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Panel - Task Description */}
          <div className="border flex flex-col justify-between h-[70vh] border-black rounded-lg overflow-auto bg-white p-6 shadow-sm">
            <span>
              <h2 className="text-xl font-bold mb-4">
                WRITING PRACTICE
              </h2>
              <span>{data?.content}</span>
            </span>

            {data?.image && (
              <div className="flex justify-center mb-4">
                <img
                  src={data?.image}
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
                  value={answers}
                  onChange={handleInput}
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
        <WritingPracticeFooter id={id} />
      </div>
    </div>
  );
};

export default PracticeWriting;
