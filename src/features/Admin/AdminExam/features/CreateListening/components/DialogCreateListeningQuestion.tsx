import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateListeningQuestion } from "../hooks/useCreateListeningQuestion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EQuestionType } from "@/types/ExamType/exam";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
  type: string;
  refetch: () => void;
}
const DialogCreateListeningQuestion = ({
  openDia,
  setOpenDia,
  id,
  refetch,
  type,
}: IProps) => {
  const { mutateAsync: createQuestion, isPending } = useCreateListeningQuestion();
  const getInitialAnswers = () => {
    const singleAnswerTypes = [
      EQuestionType.TextBox,
      EQuestionType.TexBoxPosition,
      EQuestionType.BlankPassageDrag,
      EQuestionType.BlankPassageTextbox,
      EQuestionType.BlankPassageImageTextbox,
    ];

    if (singleAnswerTypes.includes(type as EQuestionType)) {
      return [{ answer: "", isCorrect: true }];
    }

    return [
      { answer: "", isCorrect: false },
      { answer: "", isCorrect: false },
      { answer: "", isCorrect: false },
      { answer: "", isCorrect: false },
    ];
  };
  const [questionData, setQuestionData] = useState({
    question: "",
    examListenTypeId: id || "",
    answers: [{ answer: "", isCorrect: false }],
  });
  useEffect(() => {
    setQuestionData((prev) => ({
      ...prev,
      examListenTypeId: id || "",
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
  const handleSubmit = async () => {
    try {
      await createQuestion({
        question: questionData.question,
        examListenTypeId: id || "",
        answers: questionData.answers,
      });
      setQuestionData({
        question: "",
        examListenTypeId: id || "",
        answers: getInitialAnswers(),
      });
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      refetch();
      setOpenDia(false);
    }
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent className="p-6 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E]">
        <h2 className="text-lg font-semibold mb-4">Create New Question</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              name="question"
              value={questionData.question}
              onChange={handleInputChange}
              placeholder="Enter the question"
              className="border-[#164C7E]"
            />
          </div>
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
                />
                {(type === EQuestionType.MultipleChoice ||
                  type === EQuestionType.SingleChoice) && (
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

export default DialogCreateListeningQuestion;
