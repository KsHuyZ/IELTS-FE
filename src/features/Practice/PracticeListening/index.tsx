import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useListeningPracticeSection } from "./hooks/useListeningPracticeSection";
import { getStorage, setStorage } from "@/utils/storage";
import BlankPracticeSpace from "../components/BlankPracticeSpace";
import { EQuestionType } from "@/types/ExamType/exam";
import QuestionPracticeHeader from "../components/QuestionPracticeHeader";
import WordPractice from "../components/WordPractice";
import SingleChoicePractice from "../components/SingleChoicePractice";
import { Checkbox } from "@/components/ui/checkbox";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ListeningPracticeFooter from "./components/ListeningPracticeFooter";
import DialogPracticeExit from "../components/DiaPracticeExit";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PracticeHeader from "../components/PracticeHeader";

const ListeningPractice = () => {
  const { id } = useParams<{ id: string }>();
  const [openDia, setOpenDia] = useState(false);
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
    (questionId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: e.target.value,
      }));
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

    return (
      <React.Fragment>
        <p className="mt-4 leading-loose">
          {contentParts?.map((part, idx) => {
            if (idx >= blankLength) return <span key={idx}>{part}</span>;
            const questionId = questions[idx]?.id;
            const questionNumber = questionNumberMap[questionId] || 0;
            return (
              <React.Fragment key={idx}>
                {isDrag ? (
                  <>
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
                      onChange={handleInput(questionId)}
                      className="w-36 border-b-4 border px-3 rounded-xl text-[#164C7E] border-[#164C7E]"
                    />
                  </>
                )}
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
                          {questionPassageContent(index, isBlankPassageDrag)}
                          {isBlankPassageDrag && (
                            <div className="flex flex-col space-x-2 h-fit rounded-lg shadow">
                              {types.questions.map((question) =>
                                question.answers.map((answer, idx) => {
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
                        {types.questions.map((question, index) => {
                          const questionNumber =
                            questionNumberMap[question.id] || index + 1;
                          return (
                            <SingleChoicePractice
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
                      {types.questions.map((question, index) => {
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
              </div>
            </div>
          </div>
        </DndProvider>
        <ListeningPracticeFooter
        audio={data?.practiceListen.audio}
        types={data?.types ?? []}
        totalQuestions={totalQuestions}
        answers={answers}
        id={id}
      />  
      </div>
      
    </div>
  );
};

export default ListeningPractice;
