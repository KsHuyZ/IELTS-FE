import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Skeleton } from "@/components/ui/skeleton";
import { EQuestionType } from "@/types/ExamType/exam";
import BlankSpace from "./components/BlankSpace";
import { DndProvider } from "react-dnd";
import { Card } from "@/components/ui/card";
import ReadingFooter from "./components/ReadingFooter";
import SingleChoice from "../components/SingleChoice";
import { Checkbox } from "@/components/ui/checkbox";
import Word from "../components/Word";
import QuestionHeader from "../components/QuestionHeader";
import { useExamPassage } from "../hooks/useExamPassage";

const ReadingTest = () => {
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const { data, refetch, isLoading } = useExamPassage(id ?? "");
  const [usedWordsByQuestion, setUsedWordsByQuestion] = useState<string[][]>(
    []
  );
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  const questionNumberMap = useMemo(() => {
    if (!data?.exam?.examPassage) return {};
    const map: Record<string, number> = {};
    let currentNumber = 1;
    data.exam.examPassage.forEach((passage) => {
      passage.types.forEach((type) => {
        type.questions.forEach((question) => {
          map[question.id] = currentNumber++;
        });
      });
    });
    return map;
  }, [data?.exam]);

  const [filledWordsByQuestion, setFilledWordsByQuestion] = useState<
    string[][]
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const passageParam = searchParams.get("passage") ?? "1";
  const [currentPassage, setCurrentPassage] = useState(
    passageParam ? parseInt(passageParam) : 1
  );
  useEffect(() => {
    setSearchParams({ passage: currentPassage.toString() });
  }, [currentPassage, setSearchParams]);

  const timeLeft = data?.remainingTime;

  const questionType = useMemo(
    () => data?.exam?.examPassage[currentPassage - 1]?.types,
    [currentPassage, data?.exam]
  );
  const calculateTotalQuestions = useCallback(() => {
    if (!data?.exam) return 0;

    return data?.exam?.examPassage.reduce((total, passage) => {
      return (
        total +
        passage.types.reduce((typeTotal, type) => {
          return typeTotal + type.questions.length;
        }, 0)
      );
    }, 0);
  }, [data]);
  const totalQuestions = useMemo(
    () => calculateTotalQuestions(),
    [calculateTotalQuestions]
  );

  useEffect(() => {
    if (data?.exam) {
      const initialAnswers: Record<string, string> = {};

      data?.exam?.examPassage.forEach((passage) => {
        passage?.types.forEach((type) => {
          type?.questions.forEach((question) => {
            const answer = question.answer;
            initialAnswers[question.id] =
              typeof answer === "string" ? answer : answer?.answer || "";
          });
        });
      });

      setAnswers(initialAnswers);
    }
  }, [data]);

  const handleDrop = useCallback(
    (blankIndex: number, word: string, questionTypeIndex: number) => {
      // Cập nhật ô trống đã được điền
      setFilledWordsByQuestion((prev) => {
        const newFilledWordsByPassage = [...prev];
        const currentFilledWords = [
          ...(newFilledWordsByPassage[currentPassage - 1] || []),
        ];
        currentFilledWords[blankIndex] = word;
        newFilledWordsByPassage[currentPassage - 1] = currentFilledWords;
        return newFilledWordsByPassage;
      });

      // Cập nhật danh sách đáp án đã sử dụng
      setUsedWordsByQuestion((prev) => {
        const newUsedWordsByPassage = [...prev];
        const currentUsedWords = [
          ...(newUsedWordsByPassage[currentPassage - 1] || []),
        ];
        if (!currentUsedWords.includes(word)) {
          currentUsedWords.push(word);
        }
        newUsedWordsByPassage[currentPassage - 1] = currentUsedWords;
        return newUsedWordsByPassage;
      });

      // Cập nhật câu trả lời
      const questionId =
        questionType?.[questionTypeIndex]?.questions?.[blankIndex]?.id;
      if (questionId) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: word,
        }));
      }
    },
    [currentPassage, questionType]
  );
  useEffect(() => {
    if (!questionType || !data?.exam) return;

    setFilledWordsByQuestion((prev) => {
      const newFilledWordsByPassage =
        prev.length > 0
          ? [...prev]
          : Array(data.exam.examPassage.length)
              .fill([])
              .map(() => []);

      const currentFilledWords =
        newFilledWordsByPassage[currentPassage - 1]?.length > 0
          ? [...newFilledWordsByPassage[currentPassage - 1]]
          : [];

      questionType.forEach((type) => {
        if (type.type === EQuestionType.BlankPassageDrag) {
          const answers =
            type.questions?.map((q) =>
              typeof q.answer === "string" ? q.answer : q.answer?.answer || ""
            ) || [];

          answers.forEach((answer, answerIndex) => {
            if (!currentFilledWords[answerIndex]) {
              currentFilledWords[answerIndex] = answer;
              const questionId = type.questions[answerIndex]?.id;
              if (questionId) {
                setAnswers((prev) => ({
                  ...prev,
                  [questionId]: answer,
                }));
              }
            }
          });
        }
      });

      newFilledWordsByPassage[currentPassage - 1] = currentFilledWords;
      return newFilledWordsByPassage;
    });

    // Khởi tạo usedWordsByQuestion
    setUsedWordsByQuestion((prev) => {
      return prev.length > 0
        ? [...prev]
        : Array(data?.exam?.examPassage.length)
            .fill([])
            .map(() => []);
    });
  }, [questionType, currentPassage, data?.exam]);

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
        [questionId]: prev[questionId].includes(answer)
          ? ((prev[questionId] as string[]) || []).filter((a) => a !== answer)
          : [...prev[questionId], answer],
      };
    });
  };
  const filledWords = filledWordsByQuestion[currentPassage - 1] || [];
  const questionPassageContent = (index: number, isDrag: boolean) => {
    if (!questionType || !questionType[index]) return null;

    const contentParts = questionType[index].content?.split("{blank}");

    const questions = questionType[index].questions || [];
    const blankLength = contentParts?.length - 1;

    return (
      <React.Fragment>
        <p className="mt-4 leading-loose">
          {contentParts.map((part, idx) => {
            if (idx >= blankLength) return <span key={idx}>{part}</span>;
            const questionId = questions[idx]?.id;
            const questionNumber = questionNumberMap[questionId] || 0;
            const limitAnswer = questionType[index]?.limitAnswer;
            return (
              <React.Fragment key={idx}>
                {isDrag ? (
                  <>
                    <span className="font-bold">{questionNumber}. </span>
                    {part}
                    <BlankSpace
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
                      onChange={handleInput(questionId, limitAnswer)}
                      className="w-36 border-b-4 border-2 px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                    />
                  </>
                )}{" "}
              </React.Fragment>
            );
          })}
        </p>
      </React.Fragment>
    );
  };
  const handleSelectSingleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };
  const getQuestionRange = (questionType: any[], currentIndex: number) => {
    if (!questionType || !questionType[currentIndex])
      return { start: 1, end: 1 };

    const questions = questionType[currentIndex].questions || [];
    if (questions.length === 0) return { start: 1, end: 1 };

    const start = questionNumberMap[questions[0].id] || 1;
    const end = questionNumberMap[questions[questions.length - 1].id] || start;

    return { start, end };
  };
  return (
    <div className="min-h-screen flex flex-col overflow-y-hidden bg-white">
      {timeLeft !== undefined && timeLeft !== null ? (
        <Header
          answers={answers as Record<string, string>}
          timeLeft={timeLeft}
          title="Reading Test"
          isLoading={isLoading}
          id={id}
        />
      ) : (
        <div className="h-20 w-full border-b bg-white shadow-lg flex justify-between p-4">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-12 w-32" />
        </div>
      )}
      <DndProvider backend={HTML5Backend}>
        <div className="my-20 h-1/2 overflow-y-hidden">
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <Card className="p-6 h-[65vh] overflow-y-auto">
              {data?.exam && data.exam.examPassage.length > 0 ? (
                <>
                  <h2 className="mb-4 text-2xl font-bold">
                    {data.exam.examPassage[currentPassage - 1].title ?? ""}
                  </h2>
                  <p className="mb-4">
                    <p className="mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            data.exam.examPassage[currentPassage - 1].passage ||
                            "",
                        }}
                      />
                    </p>
                  </p>
                </>
              ) : (
                <p>Loading passage...</p>
              )}
            </Card>
            <Card className="p-6 h-[65vh] overflow-y-auto scroll-smooth">
              {questionType?.map((types, index) => {
                const { start, end } = getQuestionRange(questionType, index);
                const isSingleChoiceQuestion =
                  types.type === EQuestionType.SingleChoice;
                const isTextBox = types.type === EQuestionType.TextBox;
                const isBlankPassageDrag =
                  types.type === EQuestionType.BlankPassageDrag;
                const isBlankPassageTextbox =
                  types.type === EQuestionType.BlankPassageTextbox;
                const isBlankPassageImageTextbox =
                  types.type === EQuestionType.BlankPassageImageTextbox;
                const isMultipleChoiceQuestion =
                  types.type === EQuestionType.MultipleChoice;
                if (isBlankPassageDrag || isBlankPassageTextbox) {
                  return (
                    <div key={index}>
                      {isBlankPassageDrag ? (
                        <QuestionHeader
                          start={start}
                          end={end}
                          instruction="Drag in the CORRECT position"
                        />
                      ) : (
                        <QuestionHeader
                          start={start}
                          end={end}
                          instruction="Write the CORRECT answer"
                        />
                      )}
                      <div className="flex justify-between">
                        {questionPassageContent(index, isBlankPassageDrag)}
                        {isBlankPassageDrag && (
                          <div className="flex flex-col space-x-2 h-fit rounded-lg shadow">
                            {questionType[index].questions.flatMap((question) =>
                              question.answers
                                .filter(
                                  (answer) =>
                                    !usedWordsByQuestion[
                                      currentPassage - 1
                                    ]?.includes(answer.answer)
                                )
                                .map((answer, idx) => (
                                  <Word key={idx} answer={answer} />
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
                      <QuestionHeader
                        start={start}
                        end={end}
                        instruction="Choose the CORRECT answer"
                      />
                      {questionType[index].questions.map((question, index) => {
                        const questionNumber =
                          questionNumberMap[question.id] || index + 1;
                        return (
                          <SingleChoice
                            question={question}
                            questionNumber={questionNumber}
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
                      <QuestionHeader
                        start={start}
                        end={end}
                        instruction="Write the CORRECT answer"
                      />
                      {questionType[index].questions.map((question, index) => {
                        const questionNumber =
                          questionNumberMap[question.id] || index + 1;
                        return (
                          <div
                            className="border rounded-md p-2"
                            key={question.id}
                          >
                            <div className="flex items-center gap-3">
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
                                className="w-36 border-b-4 border-2 px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else if (isMultipleChoiceQuestion) {
                  <div className="space-y-4">
                    {questionType[index].questions.map((question, index) => {
                      const questionNumber =
                        questionNumberMap[question.id] || index + 1;
                      return (
                        <div className="border rounded-md p-2">
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
                                    checked={answers[question.id]?.includes(
                                      answer.answer
                                    )}
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
                      <QuestionHeader
                        start={start}
                        end={end}
                        instruction="Complete the labels on the diagrams below with ONE or TWO WORDS taken from the reading passage.  "
                      />
                      <div className="flex gap-5">
                        <img
                          src={questionType[index].image}
                          alt="image type"
                          className="w-2/3"
                        />
                        <div className="flex flex-col gap-4 items-center">
                          {questionType[index].questions.map((question) => {
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
                                    types?.limitAnswer
                                  )}
                                  className="w-36 border-b-4 px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                }
              })}
            </Card>
          </div>
        </div>
      </DndProvider>
      <ReadingFooter
        setCurrentPassage={setCurrentPassage}
        passages={data?.exam.examPassage ?? []}
        answers={answers as Record<string, string>}
        passageParam={passageParam}
        totalQuestions={totalQuestions}
        id={id}
      />
    </div>
  );
};

export default ReadingTest;
