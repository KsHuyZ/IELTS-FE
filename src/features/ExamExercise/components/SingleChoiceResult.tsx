import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReadingQuestion } from "@/types/ExamType/exam";
import React from "react";

interface Props {
  index: number;
  question: ReadingQuestion;
  userAnswer: string | undefined;
  correctAnswer: string | undefined;
  isCorrect: boolean | undefined;
  questionNumber: number
}

const AnswerList = ["A", "B", "C", "D", "E"];

const SingleChoiceResult: React.FC<Props> = ({
  question,
  userAnswer,
  questionNumber,
  correctAnswer,
  isCorrect,
}) => {

  return (
    <div className="border rounded-md p-2">
      <div className="flex flex-col space-y-2">
        <p>
          <span className="font-bold">{questionNumber}</span>, {question.question}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {question.answers.map((answer, index) => (
            <div key={answer.id} className="flex space-x-2 items-center">
              <Button
                className={cn(
                  "rounded-full bg-[#D9D9D9] hover:bg-[#D9D9D9]/70 font-bold",
                  answer.answer === userAnswer &&
                    !isCorrect &&
                    "bg-red-500 text-white hover:bg-red-300",
                  isCorrect &&
                    answer.answer === userAnswer &&
                    "bg-[#66B032] text-white hover:bg-[#66B032]/70",
                  !isCorrect &&
                    answer.answer.toLowerCase() ===
                      correctAnswer?.toString().toLowerCase() &&
                    "bg-[#66B032] text-white hover:bg-[#66B032]/70",
                  !isCorrect &&
                    answer.answer.toLowerCase() ===
                      correctAnswer?.toString().toLowerCase() &&
                    userAnswer === "" &&
                    "bg-yellow-500 text-white hover:bg-yellow-300"
                )}
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

export default SingleChoiceResult;
