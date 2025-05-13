import Header from "../components/Header";
import { useParams, useSearchParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ListeningFooter from "./components/ListeningFooter";
import { getStorage, setStorage } from "@/utils/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { EQuestionType } from "@/types/ExamType/exam";
import { Checkbox } from "@/components/ui/checkbox";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card } from "@/components/ui/card";
import QuestionHeader from "../components/QuestionHeader";
import Word from "../components/Word";
import BlankSpace from "../ReadingTest/components/BlankSpace";
import SingleChoice from "../components/SingleChoice";
import { useExamPassage } from "../hooks/useExamPassage";

const ListeningTest = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDia, setOpenDia] = useState(false);
  const [usedWordsByQuestion, setUsedWordsByQuestion] = useState<string[][]>(
    []
  );
  const sectionParam = searchParams.get("section") ?? "1";
  const [currentSection, setCurrentSection] = useState(
    sectionParam ? parseInt(sectionParam) : 1
  );
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const { data, refetch, isLoading } = useExamPassage(id ?? "");
  const [filledWordsByQuestion, setFilledWordsByQuestion] = useState<
    string[][]
  >([]);
  const questionNumberMap = useMemo(() => {
    if (!data?.exam.examPassage) return {};
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
  useEffect(() => {
    const isTesting = getStorage("isTesting");
    if (isTesting === "false") {
      setOpenDia(true);
      setStorage("isTesting", "true");
    }
  }, []);
  const questionType = useMemo(
    () => data?.exam.examPassage[currentSection - 1]?.types,
    [currentSection, data?.exam]
  );
  useEffect(() => {
    if (data?.exam) {
      const initialAnswers: Record<string, string> = {};

      data.exam.examPassage.forEach((passage) => {
        passage.types.forEach((type) => {
          type.questions.forEach((question) => {
            const answer = question.answer;
            initialAnswers[question.id] =
              typeof answer === "string" ? answer : answer?.answer || "";
          });
        });
      });

      setAnswers(initialAnswers);
    }
  }, [data]);
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
        newFilledWordsByPassage[currentSection - 1]?.length > 0
          ? [...newFilledWordsByPassage[currentSection - 1]]
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

      newFilledWordsByPassage[currentSection - 1] = currentFilledWords;
      return newFilledWordsByPassage;
    });
    setUsedWordsByQuestion((prev) => {
      return prev.length > 0
        ? [...prev]
        : Array(data.exam.examPassage.length)
            .fill([])
            .map(() => []);
    });
  }, [questionType, currentSection, data?.exam]);
  useEffect(() => {
    setSearchParams({ passage: currentSection.toString() });
  }, [currentSection, setSearchParams]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  const calculateTotalQuestions = useCallback(() => {
    if (!data?.exam) return 0;

    return data.exam.examPassage.reduce((total, passage) => {
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
  const handleInput =
    (questionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: e.target.value,
      }));
    };
  const timeLeft = data?.remainingTime;
  const handleDrop = useCallback(
    (blankIndex: number, word: string, questionTypeIndex: number) => {
      setFilledWordsByQuestion((prev) => {
        const newFilledWordsByPassage = [...prev];
        const currentFilledWords = [
          ...(newFilledWordsByPassage[currentSection - 1] || []),
        ];
        currentFilledWords[blankIndex] = word; // Cập nhật từ tại vị trí blankIndex
        newFilledWordsByPassage[currentSection - 1] = currentFilledWords;
        return newFilledWordsByPassage;
      });
      setUsedWordsByQuestion((prev) => {
        const newUsedWordsByPassage = [...prev];
        const currentUsedWords = [
          ...(newUsedWordsByPassage[currentSection - 1] || []),
        ];
        if (!currentUsedWords.includes(word)) {
          currentUsedWords.push(word);
        }
        newUsedWordsByPassage[currentSection - 1] = currentUsedWords;
        return newUsedWordsByPassage;
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
    [currentSection, questionType]
  );
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
  const filledWords = filledWordsByQuestion[currentSection - 1] || [];
  const questionPassageContent = (index: number, isDrag: boolean) => {
    if (!questionType || !questionType[index]) return null;

    const contentParts = questionType[index].content?.split("{blank}");

    const questions = questionType[index].questions || [];
    const blankLength = contentParts?.length - 1;

    return (
      <React.Fragment>
        <p className="mt-4 leading-loose">
          {contentParts.map((part, idx) => {
            if (idx >= blankLength) return <span key={idx}>{part}</span>; // Không thêm input nếu vượt quá 8
            const questionId = questions[idx]?.id;
            const questionNumber = questionNumberMap[questionId] || 0;
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
                      id={questions[idx]?.id}
                      value={answers[questions[idx]?.id] || ""}
                      onChange={handleInput(questions[idx]?.id)}
                      className="w-36 h-8 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
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
  // const handleAnswerChange = (id: number, value: string) => {
  //   setQuestions(
  //     questions.map((question) =>
  //       question.id === id ? { ...question, answer: value } : question
  //     )
  //   );
  // };
  // useEffect(() => {
  //   if (id) {
  //     refetch();
  //   }
  // }, [id]);

  const handleSelectSingleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };
  const getQuestionRange = (questionType: any[], currentIndex: number) => {
    let start = 1;
    for (let i = 0; i < currentIndex; i++) {
      start += questionType[i]?.questions?.length || 0;
    }
    const end =
      start + (questionType[currentIndex]?.questions?.length || 0) - 1;
    return { start, end };
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-hidden bg-white">
      {timeLeft !== undefined && timeLeft !== null ? (
        <Header
          answers={answers as Record<string, string>}
          timeLeft={timeLeft}
          title="Listening Test"
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
        <div className="flex-1 my-24 h-full overflow-y-hidden">
          <Card className="p-6 overflow-y-auto">
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
                                    currentSection - 1
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
                              onChange={handleInput(question.id)}
                              className="w-36 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              } else if (isSingleChoiceQuestion) {
                return (
                  <div className="space-y-4">
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
                                onChange={handleInput(question.id)}
                                className="w-36 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
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
      </DndProvider>
      <ListeningFooter
        audio={data?.exam.audio}
        section={data?.exam.examPassage ?? []}
        totalQuestions={totalQuestions}
        answers={answers as Record<string, string>}
        sectionParam={sectionParam}
        id={id}
      />
    </div>
  );
};

export default ListeningTest;
