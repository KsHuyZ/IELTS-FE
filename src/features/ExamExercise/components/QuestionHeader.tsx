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
        "rounded-lg bg-blue-900 p-4 flex gap-3 items-center text-white"
      )}
    >
      <h3 className="text-lg font-semibold">
        QUESTION {start} - {end}
      </h3>
      <p>{instruction}</p>
    </div>
  );
};

export default QuestionHeader;
