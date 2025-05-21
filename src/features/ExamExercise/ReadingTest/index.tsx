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
import Word from "../components/Word";
import QuestionHeader from "../components/QuestionHeader";
import { useExamPassage } from "../hooks/useExamPassage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaFlag } from "react-icons/fa";

const ReadingTest = () => {
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const { data, refetch, isLoading } = useExamPassage(id ?? "");
  const [flaggedQuestions, setFlaggedQuestions] = useState<
    Record<string, boolean>
  >({});
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  const questionNumberMap = useMemo(() => {
    if (!data?.exam?.examPassage) return {};
    const map: Record<string, number> = {};
    let currentNumber = 1;
    data?.exam?.examPassage.forEach((passage) => {
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
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
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
      setFilledWordsByQuestion((prev) => {
        const newFilledWordsByPassage = [...prev];
        const currentFilledWords = [
          ...(newFilledWordsByPassage[currentPassage - 1] || []),
        ];
        currentFilledWords[blankIndex] = word;
        newFilledWordsByPassage[currentPassage - 1] = currentFilledWords;
        return newFilledWordsByPassage;
      });
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
          : Array(data?.exam?.examPassage.length)
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
  }, [questionType, currentPassage, data?.exam]);

  const handleInput =
    (questionId: string, limitAnswer?: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const words = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (!limitAnswer || words.length <= limitAnswer) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: value,
        }));
      }
    };
  const filledWords = filledWordsByQuestion[currentPassage - 1] || [];
  const questionPassageContent = (index: number, isDrag: boolean) => {
    if (!questionType || !questionType[index]) return null;

    const contentParts = questionType[index]?.content?.split("{blank}");

    const questions = questionType[index]?.questions || [];
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
              const limitAnswer = questionType[index]?.limitAnswer;
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
                        className="w-36 h-8 border-b-4 border-2 px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                      />
                    </>
                  )}{" "}
                </React.Fragment>
              );
            })}
          </p>
        </>
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
              {data?.exam && data?.exam?.examPassage.length > 0 ? (
                <>
                  <h2 className="mb-4 text-2xl font-bold">
                    {data?.exam?.examPassage[currentPassage - 1].title ?? ""}
                  </h2>
                  <p className="mb-4">
                    <p className="mb-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            data?.exam?.examPassage[currentPassage - 1]?.passage ||
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
                const isTrueFalseNotGiven =
                  types.type === EQuestionType.TrueFalseNotGiven;
                const isYesNoNotGiven =
                  types.type === EQuestionType.YesNoNotGiven;
                const isMatchingHeadings =
                  types.type === EQuestionType.MatchingHeadings;
                const isMatchingInformation =
                  types.type === EQuestionType.MatchingInformation;
                const isMatchingFeatures =
                  types.type === EQuestionType.MatchingFeatures;
                const isMatchingSentencesEnding =
                  types.type === EQuestionType.MatchingSentencesEnding;
                const isSentenceCompletion =
                  types.type === EQuestionType.SentenceCompletion;
                const isSummaryCompletion =
                  types.type === EQuestionType.SummaryCompletion;
                const isDiagramLabelCompletion =
                  types.type === EQuestionType.DiagramLabelCompletion;
                const isShortAnswerQuestion =
                  types.type === EQuestionType.ShortAnswerQuestion;
                const isDragAndDropType =
                  isBlankPassageDrag ||
                  isMatchingHeadings ||
                  isMatchingInformation ||
                  isMatchingFeatures ||
                  isMatchingSentencesEnding;
                const isBlankTextbox =
                  isBlankPassageTextbox || isSummaryCompletion;
                const isSingleChoice =
                  isSingleChoiceQuestion ||
                  isYesNoNotGiven ||
                  isMultipleChoiceQuestion ||
                  isTrueFalseNotGiven;
                const isTextBoxType =
                  isTextBox || isShortAnswerQuestion || isSentenceCompletion;
                const isImageType =
                  isDiagramLabelCompletion || isBlankPassageImageTextbox;
                if (isDragAndDropType || isBlankTextbox) {
                  return (
                    <div key={index}>
                      {isDragAndDropType ? (
                        <QuestionHeader
                          start={start}
                          end={end}
                          questionType={types.type}
                          limitAnswer={types.limitAnswer}
                        />
                      ) : (
                        <QuestionHeader
                          start={start}
                          end={end}
                          questionType={types.type}
                          limitAnswer={types.limitAnswer}
                        />
                      )}
                      <div className="flex justify-between">
                        {questionPassageContent(index, isDragAndDropType)}
                        {isDragAndDropType && (
                          <div className="flex flex-col space-x-2 h-fit border-2 sticky top-0 border-[#164C7E] rounded-lg shadow">
                            {shuffleArray(
                              questionType[index]?.questions.flatMap(
                                (question) => question.answers
                              )
                            ).map((answer, idx) => (
                              <Word key={idx} answer={answer} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else if (isSingleChoice) {
                  return (
                    <div className="space-y-4" key={types.id}>
                      <QuestionHeader
                        start={start}
                        end={end}
                        questionType={types.type}
                        limitAnswer={types.limitAnswer}
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
                            toggleFlag={toggleFlag}
                            isFlagged={flaggedQuestions[question.id] || false}
                          />
                        );
                      })}
                    </div>
                  );
                } else if (isTextBoxType) {
                  return (
                    <div className="space-y-4">
                      <QuestionHeader
                        start={start}
                        end={end}
                        questionType={types.type}
                        limitAnswer={types.limitAnswer}
                      />
                      {questionType[index].questions.map((question, index) => {
                        const questionNumber =
                          questionNumberMap[question.id] || index + 1;
                        return (
                          <div
                            className="border rounded-md p-2"
                            key={question.id}
                          >
                            <div className="flex gap-3">
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
                                className="w-36 h-8 border-b-4 border-2 px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else if (isImageType) {
                  return (
                    <>
                      <QuestionHeader
                        start={start}
                        end={end}
                        questionType={types.type}
                        limitAnswer={types.limitAnswer}
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
                                  className="w-36 border-b-4 border-2 px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
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
            </Card>
          </div>
        </div>
      </DndProvider>
      <ReadingFooter
        setCurrentPassage={setCurrentPassage}
        passages={data?.exam?.examPassage ?? []}
        answers={answers as Record<string, string>}
        passageParam={passageParam}
        totalQuestions={totalQuestions}
        flaggedQuestions={flaggedQuestions}
        id={id}
      />
    </div>
  );
};

export default ReadingTest;
