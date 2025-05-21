import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateQuestion } from "../hooks/useCreateQuestion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EQuestionType } from "@/types/ExamType/exam";
import { MinusCircle } from "lucide-react";
import toast from "react-hot-toast";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
  type: string;
  refetch: () => void;
}
const DialogCreateQuestion = ({
  openDia,
  setOpenDia,
  id,
  refetch,
  type,
}: IProps) => {
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
  const fixedAnswerTypes = [
    EQuestionType.TrueFalseNotGiven,
    EQuestionType.YesNoNotGiven,
  ];
  const { mutateAsync: createQuestion, isPending } = useCreateQuestion();
  const getInitialAnswers = () => {
    if (type === EQuestionType.TrueFalseNotGiven) {
      return [
        { answer: "True", isCorrect: false, id: "" },
        { answer: "False", isCorrect: false, id: "" },
        { answer: "Not Given", isCorrect: false, id: "" },
      ];
    } else if (type === EQuestionType.YesNoNotGiven) {
      return [
        { answer: "Yes", isCorrect: false, id: "" },
        { answer: "No", isCorrect: false, id: "" },
        { answer: "Not Given", isCorrect: false, id: "" },
      ];
    }
    return [{ answer: "", isCorrect: true, id: "" }];
  };
  const [questionData, setQuestionData] = useState({
    question: "",
    examReadingTypeId: id || "",
    answers: getInitialAnswers(),
  });
  useEffect(() => {
    setQuestionData((prev) => ({
      ...prev,
      examReadingTypeId: id || "",
      answers: getInitialAnswers(),
    }));
  }, [id, type]);
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
    field: string,
    value: string | boolean
  ) => {
    setQuestionData((prev) => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = { ...newAnswers[index], [field]: value };
      return { ...prev, answers: newAnswers };
    });
  };
  const handleAddAnswer = () => {
    setQuestionData((prev) => ({
      ...prev,
      answers: [...prev.answers, { answer: "", isCorrect: false, id: "" }],
    }));
  };
  const handleRemoveAnswer = (index: number) => {
    if (questionData.answers.length > 1) {
      setQuestionData((prev) => ({
        ...prev,
        answers: prev.answers.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    if (questionData.answers.length === 0) {
      toast.error("Please enter a answer.");
      return;
    }
    if (questionData.answers.some((ans) => !ans.answer.trim())) {
      toast.error("Please enter content for all answers.");
      return;
    }
    if (
      (type === EQuestionType.MultipleChoice ||
        type === EQuestionType.SingleChoice ||
        type === EQuestionType.TrueFalseNotGiven ||
        type === EQuestionType.YesNoNotGiven) &&
      !questionData.question.trim()
    ) {
      toast.error("Please enter the question.");
      return;
    }
    if (
      (type === EQuestionType.MultipleChoice ||
        type === EQuestionType.SingleChoice ||
        type === EQuestionType.TrueFalseNotGiven ||
        type === EQuestionType.YesNoNotGiven) &&
      !questionData.answers.some((ans) => ans.isCorrect)
    ) {
      toast.error("Please select at least one correct answer.");
      return;
    }
    try {
      await createQuestion({
        question: questionData.question,
        examReadingTypeId: id || "",
        answers: questionData.answers,
      });
      setQuestionData({
        question: "",
        examReadingTypeId: id || "",
        answers: getInitialAnswers(),
      });
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  const isFixedAnswerType = fixedAnswerTypes.includes(type as EQuestionType);
  const isSingleAnswerType = singleAnswerTypes.includes(type as EQuestionType);
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
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  value={answer.answer}
                  onChange={(e) =>
                    handleAnswerChange(index, "answer", e.target.value)
                  }
                  placeholder={`Answer ${index + 1}`}
                  className="border-[#164C7E]"
                  disabled={isFixedAnswerType}
                />
                {(type === EQuestionType.MultipleChoice ||
                  type === EQuestionType.SingleChoice ||
                  type === EQuestionType.TrueFalseNotGiven ||
                  type === EQuestionType.YesNoNotGiven) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`isCorrect-${index}`}
                      checked={answer.isCorrect}
                      onCheckedChange={(checked) =>
                        handleAnswerChange(index, "isCorrect", checked)
                      }
                    />
                    <Label htmlFor={`isCorrect-${index}`}>Correct</Label>
                  </div>
                )}
                {!isSingleAnswerType &&
                  !isFixedAnswerType &&
                  questionData.answers.length > 1 && (
                    <Button
                      onClick={() => handleRemoveAnswer(index)}
                      className="bg-transparent text-red-500 hover:bg-transparent hover:text-red-300 rounded-full"
                    >
                      <MinusCircle />
                    </Button>
                  )}
              </div>
            ))}

            {!isSingleAnswerType && !isFixedAnswerType && (
              <Button
                onClick={handleAddAnswer}
                className="mt-2 bg-transparent border-[#123d66] border-2 text-[#123d66] hover:bg-[#123d66] hover:text-white rounded-full"
              >
                Add Answer
              </Button>
            )}
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

export default DialogCreateQuestion;
