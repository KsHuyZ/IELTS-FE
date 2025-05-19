import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EQuestionType } from "@/types/ExamType/exam";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReadingAnswer } from "@/types/PracticeType/readingPractice";
import { useEditListeningPracticeQuestion } from "../hooks/useEditListeningPracticeQuestion";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  questions: {
    id: string;
    question: string;
    answers: ReadingAnswer[];
    type: EQuestionType;
  } | null;
  refetch: () => void;
}
const fixedAnswerTypes = [
  EQuestionType.TrueFalseNotGiven,
  EQuestionType.YesNoNotGiven,
];
const singleAnswerTypes = [
  EQuestionType.DiagramLabelCompletion,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SentenceCompletion,
  EQuestionType.ShortAnswerQuestion,
  EQuestionType.SummaryCompletion,
];
const DialogEditListeningQuestion = ({
  openDia,
  setOpenDia,
  questions,
  refetch,
}: IProps) => {
  const { mutateAsync: editQuestion, isPending } =
    useEditListeningPracticeQuestion(questions?.id ?? "");
  const getInitialAnswers = () => {
    if (questions?.answers?.length) {
      return questions.answers;
    }
    return [
      {
        answer: "",
        isCorrect: true,
        id: "",
      },
    ];
  };
  const [questionData, setQuestionData] = useState({
    question: questions?.question || "",
    answers: getInitialAnswers(),
  });
  useEffect(() => {
    if (questions) {
      setQuestionData({
        question: questions.question,
        answers: getInitialAnswers(),
      });
    }
  }, [questions]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAnswerChange = (
    index: number,
    field: keyof ReadingAnswer,
    value: string
  ) => {
    setQuestionData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      return { ...prev, answers: newAnswers };
    });
  };
  const handleCorrectAnswerChange = (selectedIndex: string) => {
    const index = parseInt(selectedIndex, 10);
    setQuestionData((prev) => {
      const newAnswers = prev.answers.map((answer, i) => ({
        ...answer,
        isCorrect: i === index,
      }));
      return { ...prev, answers: newAnswers };
    });
  };
  const handleSubmit = async () => {
    try {
      const formattedAnswers = questionData.answers.map((answer) => ({
        answer: answer.answer,
        isCorrect: answer.isCorrect,
        id: answer.id,
      }));
      await editQuestion({
        question: questionData.question,
        answers: formattedAnswers,
      });
      setQuestionData({
        question: "",
        answers: getInitialAnswers(),
      });
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  const isFixedAnswerType = fixedAnswerTypes.includes(
    questions?.type as EQuestionType
  );
  const isSingleAnswerType = singleAnswerTypes.includes(
    questions?.type as EQuestionType
  );
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Create New Question</h2>
        <div className="space-y-4">
          {!isSingleAnswerType && (
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                name="question"
                value={questionData.question}
                onChange={handleInputChange}
                placeholder="Enter the question"
                className="border-[#164C7E] h-20"
              />
            </div>
          )}

          <div>
            <Label>Answers</Label>
            {questionData.answers.map((answer, index) => (
              <div key={answer.id} className="flex items-center space-x-2 mt-2">
                <Input
                  value={answer.answer}
                  onChange={(e) =>
                    handleAnswerChange(index, "answer", e.target.value)
                  }
                  placeholder={`Answer ${index + 1}`}
                  className="border-[#164C7E]"
                  disabled={isFixedAnswerType}
                />
                {(questions?.type === EQuestionType.MultipleChoice ||
                  questions?.type === EQuestionType.SingleChoice ||
                  questions?.type === EQuestionType.TrueFalseNotGiven ||
                  questions?.type === EQuestionType.YesNoNotGiven) && (
                  <div className="flex items-center space-x-2">
                    <RadioGroup
                      value={questionData.answers
                        .findIndex((a) => a.isCorrect)
                        .toString()}
                      onValueChange={handleCorrectAnswerChange}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={index.toString()}
                          id={`isCorrect-${index}`}
                        />
                        <Label htmlFor={`isCorrect-${index}`}>Correct</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          isLoading={isPending}
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#164C7E] text-white hover:bg-[#123d66] mt-4"
        >
          Create Question
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditListeningQuestion;
