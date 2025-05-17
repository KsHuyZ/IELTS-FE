import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useReadingPracticePassage } from "./hooks/useReadingPracticePassage";
import { Checkbox } from "@/components/ui/checkbox";
import SingleChoicePractice from "../components/SingleChoicePractice";
import WordPractice from "../components/WordPractice";
import QuestionPracticeHeader from "../components/QuestionPracticeHeader";
import { EQuestionType } from "@/types/ExamType/exam";
import BlankPracticeSpace from "../components/BlankPracticeSpace";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReadingPracticeFooter from "./components/ReadingPracticeFooter";
import DialogPracticeExit from "../components/DiaPracticeExit";
import PracticeHeader from "../components/PracticeHeader";
import { cn } from "@/lib/utils";
import { FaFlag } from "react-icons/fa";
export default function PracticeReading() {
  const [openDia, setOpenDia] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = React.useState<
    Record<string, string | string[]>
  >({});
  // const { mutateAsync: examAnswers } = usePracticeAnswers();
  const { data, refetch } = useReadingPracticePassage(id ?? "");
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<
    Record<string, boolean>
  >({});
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };
  const [filledWords, setFilledWords] = useState<string[]>([]);
  const questionTypes = useMemo(() => data?.types || [], [data?.types]);
  const calculateTotalQuestions = useCallback(() => {
    if (!data?.types) return 0;
    return data.types.reduce((total, type) => {
      return total + type.questions.length;
    }, 0);
  }, [data]);
  const totalQuestions = useMemo(
    () => calculateTotalQuestions(),
    [calculateTotalQuestions]
  );

  useEffect(() => {
    if (data?.types) {
      const initialAnswers: Record<string, string> = {};
      data.types.forEach((type) => {
        type.questions.forEach((question) => {
          initialAnswers[question.id] = question.answer || "";
        });
      });
      setAnswers(initialAnswers);
    }
  }, [data]);
  const handleDrop = useCallback(
    (blankIndex: number, word: string, questionTypeIndex: number) => {
      setFilledWords((prev) => {
        const newFilledWords = [...prev];
        newFilledWords[blankIndex] = word;
        return newFilledWords;
      });

      const questionId =
        questionTypes[questionTypeIndex]?.questions[blankIndex]?.id;
      if (questionId) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: word,
        }));
      }
    },
    [questionTypes]
  );
  useEffect(() => {
    if (!questionTypes || !data?.types) return;

    setFilledWords((prev) => {
      // Tính tổng số ô trống chỉ cho BlankPassageDrag
      const totalDragBlanks = questionTypes.reduce((acc, type) => {
        if (type.type === EQuestionType.BlankPassageDrag) {
          return acc + (type.questions?.length || 0);
        }
        return acc;
      }, 0);

      // Khởi tạo mảng với kích thước chính xác nếu chưa có hoặc không khớp
      const newFilledWords =
        prev.length === totalDragBlanks
          ? [...prev]
          : Array(totalDragBlanks).fill("");

      // Chỉ cập nhật cho BlankPassageDrag
      let blankIndex = 0;
      questionTypes.forEach((type) => {
        if (type.type === EQuestionType.BlankPassageDrag) {
          type.questions.forEach((question) => {
            // Ưu tiên lấy giá trị từ answers, nếu không có thì dùng question.answer
            newFilledWords[blankIndex] =
              answers[question.id] || question.answer || "";
            blankIndex++;
          });
        }
      });

      return newFilledWords;
    });
  }, [questionTypes, data?.types, answers]);

  const handleInput =
    (questionId: string, limitAnswer?: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const words = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      // Nếu không có limitAnswer hoặc số từ hợp lệ, cập nhật giá trị
      if (!limitAnswer || words.length <= limitAnswer) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: value,
        }));
      }
    };
  const handleCheckedChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      return {
        ...prev,
        [questionId]: prev[questionId]?.includes(answer)
          ? ((prev[questionId] as string[]) || []).filter((a) => a !== answer)
          : [...((prev[questionId] as string[]) || []), answer],
      };
    });
  };
  const questionPassageContent = (index: number, isDrag: boolean) => {
    if (!questionTypes[index]) return null;

    const contentParts = questionTypes[index].content?.split("{blank}");
    const questions = questionTypes[index].questions || [];
    const blankLength = contentParts?.length - 1;
    const questionIds = questions.map((q) => q.id);
    const toggleAllFlags = () => {
      setFlaggedQuestions((prev) => {
        const areAllFlagged = questionIds.every((id) => prev[id]);
        const newState = { ...prev };
        questionIds.forEach((id) => {
          newState[id] = !areAllFlagged;
        });
        return newState;
      });
    };
    const areAllFlagged = questionIds.every((id) => flaggedQuestions[id]);
    return (
      <React.Fragment>
        <>
          {!isDrag && (
            <Button
              size="sm"
              onClick={toggleAllFlags}
              className={cn(
                "bg-transparent hover:bg-transparent border-0 mb-2",
                areAllFlagged ? "text-gray-500" : "text-red-500"
              )}
            >
              <FaFlag className="h-5 w-5" />
            </Button>
          )}
          <p className="leading-loose">
            {contentParts?.map((part, idx) => {
              if (idx >= blankLength) return <span key={idx}>{part}</span>;
              const questionId = questions[idx]?.id;
              const questionNumber = questionNumberMap[questionId] || 0;
              const limitAnswer = questionTypes[index]?.limitAnswer;
              return (
                <React.Fragment key={idx}>
                  {isDrag ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => toggleFlag(questionId)}
                        className={cn(
                          "bg-transparent hover:bg-transparent border-0",
                          flaggedQuestions[questionId]
                            ? "text-gray-500"
                            : "text-red-500"
                        )}
                      >
                        <FaFlag className="h-5 w-5" />
                      </Button>
                      <span className="font-bold">{questionNumber}. </span>
                      {part}
                      <BlankPracticeSpace
                        idx={idx}
                        index={index}
                        onDrop={handleDrop}
                        word={filledWords[idx]}
                      />
                    </>
                  ) : (
                    <>
                      {part}
                      <span className="font-bold">{questionNumber}. </span>
                      <input
                        id={questionId}
                        value={answers[questionId] || ""}
                        onChange={handleInput(
                          questionId,
                          questionTypes[index].limitAnswer
                        )}
                        className="w-36 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </p>
        </>
      </React.Fragment>
    );
  };
  const questionNumberMap = useMemo(() => {
    if (!data?.types) return {};
    const map: Record<string, number> = {};
    let currentNumber = 1;
    data.types.forEach((type) => {
      type.questions.forEach((question) => {
        map[question.id] = currentNumber++;
      });
    });
    return map;
  }, [data?.types]);
  const handleSelectSingleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };
  const getQuestionRange = (questionTypes: any[], currentIndex: number) => {
    if (!questionTypes[currentIndex]) return { start: 1, end: 1 };

    const questions = questionTypes[currentIndex].questions || [];
    if (questions.length === 0) return { start: 1, end: 1 };

    const start = questionNumberMap[questions[0].id] || 1;
    const end = questionNumberMap[questions[questions.length - 1].id] || start;

    return { start, end };
  };
  return (
    <div className="h-full w-full flex flex-col gap-3 justify-between">
      <DialogPracticeExit
        openDia={openDia}
        setOpenDia={setOpenDia}
        answers={answers}
        id={id}
      />
      <PracticeHeader setOpenDia={setOpenDia} />
      <div className="flex flex-1 pt-20 pb-3 flex-col gap-3">
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Section */}
              <Card className="px-8 py-2 h-[73vh] w-full overflow-y-auto">
                {data?.practiceReading ? (
                  <>
                    <h2 className="mb-4 text-2xl text-center font-bold">
                      {data.practiceReading.title ?? ""}
                    </h2>
                    <img
                      src="/images/writing.png"
                      alt="images"
                      className="object-contain"
                    />
                    <p className="mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data.practiceReading.content || "",
                        }}
                      />
                    </p>
                  </>
                ) : (
                  <p className="text-center">Loading passage...</p>
                )}
              </Card>

              {/* Right Section */}
              <Card className="px-8 py-2 h-[73vh] w-full overflow-y-auto">
                <CardContent className="pt-6 px-0">
                  <div className="space-y-8">
                    {questionTypes?.map((types, index) => {
                      const { start, end } = getQuestionRange(
                        questionTypes,
                        index
                      );

                      const isTextBox = types.type === EQuestionType.TextBox;
                      const isSingleChoiceQuestion =
                        types.type === EQuestionType.SingleChoice;
                      const isBlankPassageDrag =
                        types.type === EQuestionType.BlankPassageDrag;
                      const isBlankPassageImageTextbox =
                        types.type === EQuestionType.BlankPassageImageTextbox;
                      const isBlankPassageTextbox =
                        types.type === EQuestionType.BlankPassageTextbox;
                      const isMultipleChoiceQuestion =
                        types.type === EQuestionType.MultipleChoice;
                      if (isBlankPassageDrag || isBlankPassageTextbox) {
                        return (
                          <div key={index}>
                            {isBlankPassageDrag ? (
                              <QuestionPracticeHeader
                                start={start}
                                end={end}
                                instruction="Drag in the CORRECT position"
                              />
                            ) : (
                              <QuestionPracticeHeader
                                start={start}
                                end={end}
                                instruction="Write the CORRECT answer"
                              />
                            )}
                            <div className="flex justify-between">
                              {questionPassageContent(
                                index,
                                isBlankPassageDrag
                              )}
                              {isBlankPassageDrag && (
                                <div className="flex flex-col space-x-2 h-fit rounded-lg shadow">
                                  {types.questions.map((question) =>
                                    question.answers.map((answer, idx) => (
                                      <WordPractice key={idx} answer={answer} />
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      } else if (isSingleChoiceQuestion) {
                        return (
                          <div className="space-y-4">
                            <QuestionPracticeHeader
                              start={start}
                              end={end}
                              instruction="Choose the CORRECT answer"
                            />
                            {types.questions.map((question, index) => {
                              const questionNumber =
                                questionNumberMap[question.id] || index + 1;
                              return (
                                <SingleChoicePractice
                                  question={question}
                                  questionNumber={questionNumber}
                                  toggleFlag={toggleFlag}
                                  isFlagged={
                                    flaggedQuestions[question.id] || false
                                  }
                                  onClick={handleSelectSingleAnswer}
                                  currentAnswer={answers[question.id] as string}
                                />
                              );
                            })}
                          </div>
                        );
                      } else if (isTextBox) {
                        return (
                          <div className="space-y-4">
                            <QuestionPracticeHeader
                              start={start}
                              end={end}
                              instruction="Write the CORRECT answer"
                            />
                            {types.questions.map((question, index) => {
                              const questionNumber =
                                questionNumberMap[question.id] || index + 1;
                              return (
                                <div
                                  className="border rounded-md p-2"
                                  key={question.id}
                                >
                                  <div className="flex items-center gap-3">
                                    <Button
                                      size="sm"
                                      onClick={() => toggleFlag(question.id)}
                                      className={cn(
                                        "bg-transparent hover:bg-transparent border-0",
                                        flaggedQuestions[question.id]
                                          ? "text-gray-500"
                                          : "text-red-500"
                                      )}
                                    >
                                      <FaFlag className="h-5 w-5" />
                                    </Button>
                                    <p>
                                      {questionNumber}. {question.question}
                                    </p>
                                    <input
                                      id={question.id}
                                      value={answers[question.id] || ""}
                                      onChange={handleInput(
                                        question.id,
                                        types.limitAnswer
                                      )}
                                      className="w-36 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else if (isMultipleChoiceQuestion) {
                        <div className="space-y-4">
                          {types.questions.map((question, index) => {
                            const questionNumber =
                              questionNumberMap[question.id] || index + 1;
                            return (
                              <div
                                className="border rounded-md p-2"
                                key={question.id}
                              >
                                <div className="flex flex-col space-y-2">
                                  <p>
                                    {questionNumber}, {question.question}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {question.answers.map((answer) => (
                                      <div
                                        key={answer.id}
                                        className="flex space-x-2 items-center"
                                      >
                                        <Checkbox
                                          checked={answers[
                                            question.id
                                          ]?.includes(answer.answer)}
                                          onCheckedChange={() =>
                                            handleCheckedChange(
                                              question.id,
                                              answer.answer
                                            )
                                          }
                                        />
                                        <span>{answer.answer}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>;
                      } else if (isBlankPassageImageTextbox) {
                        return (
                          <>
                            <QuestionPracticeHeader
                              start={start}
                              end={end}
                              instruction="Complete the labels on the diagrams below with ONE or TWO WORDS taken from the reading passage.  "
                            />
                            <div className="flex gap-5">
                              <img
                                src={types.image}
                                alt="image type"
                                className="w-2/3"
                              />
                              <div className="flex flex-col gap-4 items-center">
                                {types.questions.map((question) => {
                                  const questionNumber =
                                    questionNumberMap[question.id] || index + 1;
                                  return (
                                    <div className="flex gap-2 items-center">
                                      <span className="font-bold">
                                        {questionNumber}
                                      </span>
                                      <input
                                        id={question.id}
                                        value={answers[question.id] || ""}
                                        onChange={handleInput(
                                          question.id,
                                          types.limitAnswer
                                        )}
                                        className="w-36 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() => toggleFlag(question.id)}
                                        className={cn(
                                          "bg-transparent hover:bg-transparent border-0",
                                          flaggedQuestions[question.id]
                                            ? "text-gray-500"
                                            : "text-red-500"
                                        )}
                                      >
                                        <FaFlag className="h-5 w-5" />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        );
                      }
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pagination */}
          </div>
        </DndProvider>
        <ReadingPracticeFooter
          types={data?.types || []}
          answers={answers as Record<string, string>}
          totalQuestions={totalQuestions}
          id={id}
          flaggedQuestions={flaggedQuestions}
        />
      </div>
    </div>
  );
}
