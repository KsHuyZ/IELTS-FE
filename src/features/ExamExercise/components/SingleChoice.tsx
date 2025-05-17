import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReadingQuestion } from "@/types/ExamType/exam";
import React from "react";
import { FaFlag } from "react-icons/fa";

interface Props {
  question: ReadingQuestion;
  onClick: (questionId: string, answer: string) => void;
  currentAnswer: string;
  questionNumber: number;
  toggleFlag: (questionId: string) => void;
  isFlagged: boolean;
}

const AnswerList = ["A", "B", "C", "D", "E"];

const SingleChoice: React.FC<Props> = ({
  question,
  onClick,
  currentAnswer,
  toggleFlag,
  isFlagged,
  questionNumber,
}) => {
  return (
    <div className="border rounded-md p-2 flex gap-3">
      <Button
        size="sm"
        onClick={() => toggleFlag(question.id)}
        className={cn(
          "bg-transparent hover:bg-transparent border-0",
          isFlagged ? " text-gray-500" : "text-red-500"
        )}
      >
        <FaFlag className="h-5 w-5" />
      </Button>
      <div className="flex flex-col space-y-3 w-full">
        <p>
          <span className="font-bold">{questionNumber}</span>,{" "}
          {question.question}
        </p>
        <div className="grid grid-cols-2 w-full gap-2">
          {question.answers.map((answer, index) => (
            <div key={answer.id} className="flex space-x-2 items-center">
              <Button
                className={cn(
                  "rounded-full bg-[#D9D9D9] font-bold hover:bg-[#3C64CE]/70",
                  currentAnswer === answer.answer && "bg-[#3C64CE] text-white"
                )}
                onClick={() => onClick(question.id, answer.answer)}
              >
                {AnswerList[index]}
              </Button>
              <span>{answer.answer}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleChoice;
