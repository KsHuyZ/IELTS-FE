import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useListeningPracticeSection } from "./hooks/useListeningPracticeSection";
import { getStorage, setStorage } from "@/utils/storage";
import BlankPracticeSpace from "../components/BlankPracticeSpace";
import { EQuestionType } from "@/types/ExamType/exam";
import QuestionPracticeHeader from "../components/QuestionPracticeHeader";
import WordPractice from "../components/WordPractice";
import SingleChoicePractice from "../components/SingleChoicePractice";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ListeningPracticeFooter from "./components/ListeningPracticeFooter";
import DialogPracticeExit from "../components/DiaPracticeExit";
import PracticeHeader from "../components/PracticeHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaFlag } from "react-icons/fa";

const ListeningPractice = () => {
  const { id } = useParams<{ id: string }>();
  const [openDia, setOpenDia] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<
    Record<string, boolean>
  >({});
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };
  const [answers, setAnswers] = React.useState<
    Record<string, string | string[]>
  >({});
  const { data, refetch } = useListeningPracticeSection(id ?? "");
  const [filledWords, setFilledWords] = useState<string[]>([]);

  useEffect(() => {
    const isTesting = getStorage("isTesting");
    if (isTesting === "false") {
      setOpenDia(true);
      setStorage("isTesting", "true");
    }
  }, []);
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
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);
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
  }, [questionTypes, data?.types, answers]); // Thêm answers vào dependencies
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
  const questionPassageContent = (index: number, isDrag: boolean) => {
    if (!questionTypes[index]) return null;

    const contentParts = questionTypes[index]?.content?.split("{blank}");
    const questions = questionTypes[index]?.questions || [];
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
                        className="w-36 h-8 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
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
  const handleSelectSingleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };
  const getQuestionRange = (questionType: any[], currentIndex: number) => {
    if (!questionType || !questionType[currentIndex])
      return { start: 1, end: 1 };

    const questions = questionType[currentIndex].questions || [];
    if (questions.length === 0) return { start: 1, end: 1 };

    // Lấy số thứ tự của câu hỏi đầu tiên và cuối cùng trong type hiện tại
    const start = questionNumberMap[questions[0].id] || 1;
    const end = questionNumberMap[questions[questions.length - 1].id] || start;

    return { start, end };
  };

  return (
    <div className="h-full w-full flex gap-3 justify-between">
      <DialogPracticeExit
        openDia={openDia}
        setOpenDia={setOpenDia}
        answers={answers}
        id={id}
      />
      {/* <Button
        variant="ghost"
        className="mb-4 w-fit hover:bg-[#F1FFEF] hover:border-0"
        size="sm"
        onClick={() => setOpenDia(true)}
      >
        <ArrowLeft className="text-[#164C7E]" />
      </Button> */}
      <PracticeHeader setOpenDia={setOpenDia} />
      <div className="flex-1 flex pt-20 pb-3 flex-col gap-4">
        <DndProvider backend={HTML5Backend}>
          <div className="h-[73vh] bg-white border border-black rounded-lg overflow-y-auto">
            <div className="grid grid-cols-1 gap-6 p-6">
              <div className="overflow-y-auto">
                {questionTypes?.map((types, index) => {
                  const { start, end } = getQuestionRange(questionTypes, index);
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
                          <QuestionPracticeHeader
                            start={start}
                            end={end}
                            questionType={types.type}
                            limitAnswer={types.limitAnswer}
                          />
                        ) : (
                          <QuestionPracticeHeader
                            start={start}
                            end={end}
                            questionType={types.type}
                            limitAnswer={types.limitAnswer}
                          />
                        )}
                        <div className="flex justify-between">
                          {questionPassageContent(index, isDragAndDropType)}
                          {isDragAndDropType && (
                            <div className="flex flex-col space-x-2 h-fit border-2 border-[#164C7E] sticky top-0 rounded-lg shadow">
                              {types?.questions.map((question) =>
                                question?.answers.map((answer, idx) => {
                                  const answerDrag = {
                                    id: answer.id,
                                    question: answer,
                                    answer: answer.answer,
                                    isCorrect: true,
                                  };
                                  return (
                                    <WordPractice
                                      key={idx}
                                      answer={answerDrag}
                                    />
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else if (isTextBoxType) {
                    return (
                      <div className="space-y-4">
                        <QuestionPracticeHeader
                          start={start}
                          end={end}
                          questionType={types.type}
                          limitAnswer={types.limitAnswer}
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
                                  className="w-36 h-8 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else if (isSingleChoice) {
                    return (
                      <div className="space-y-4">
                        <QuestionPracticeHeader
                          start={start}
                          end={end}
                          questionType={types.type}
                          limitAnswer={types.limitAnswer}
                        />
                        {types.questions.map((question, index) => {
                          const questionNumber =
                            questionNumberMap[question.id] || index + 1;
                          return (
                            <SingleChoicePractice
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
                  } else if (isImageType) {
                    return (
                      <>
                        <QuestionPracticeHeader
                          start={start}
                          end={end}
                          questionType={types.type}
                          limitAnswer={types.limitAnswer}
                        />
                        <div className="flex gap-5">
                          <img
                            src={types.image}
                            alt="image type"
                            className="w-2/3"
                          />
                          <div className="flex flex-col gap-4 items-center">
                            {types?.questions?.map((question) => {
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
            </div>
          </div>
        </DndProvider>
        <ListeningPracticeFooter
          audio={data?.practiceListen.audio}
          types={data?.types ?? []}
          totalQuestions={totalQuestions}
          answers={answers}
          flaggedQuestions={flaggedQuestions}
          id={id}
        />
      </div>
    </div>
  );
};

export default ListeningPractice;
