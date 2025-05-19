import { cn } from "@/lib/utils";
import { EQuestionType, QUESTION_INSTRUCTIONS } from "@/types/ExamType/exam";
import React from "react";

interface QuestionHeaderProps {
  start: number;
  end: number;
  limitAnswer?: number;
  questionType: EQuestionType;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  start,
  end,
  questionType,
  limitAnswer
}) => {
  const instruction =
    QUESTION_INSTRUCTIONS[questionType]?.(limitAnswer) ||
    "Follow the instructions";
  return (
    <div
      className={cn(
        start === 1 ? "" : "my-6",
        "rounded-lg bg-blue-900 w-full p-4 flex gap-5 items-center text-white"
      )}
    >
      <p className="text-lg font-semibold w-fit max-w-40">
        QUESTION {start} - {end}
      </p>
      <p className="max-w-xs">{instruction}</p>
    </div>
  );
};

export default QuestionHeader;
