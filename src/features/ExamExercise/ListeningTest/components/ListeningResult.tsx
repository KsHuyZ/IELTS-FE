import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useListeningExamSection } from "../hooks/useListeningExamSection";
import { ArrowLeft } from "lucide-react";
import { Route } from "@/constant/route";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExamResult } from "../../ReadingTest/hooks/useExamResult";
import ListeningFooterResult from "./ListeningFooterResult";
import { EQuestionType } from "@/types/ExamType/exam";
import QuestionHeader from "../../components/QuestionHeader";
import SingleChoiceResult from "../../components/SingleChoiceResult";

const ListeningTestResult = () => {
  const nav = useNavigate();
  const { idResult } = useParams<{ idResult: string }>();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("section") ?? "1";
  const [currentSection, setCurrentSection] = useState(
    sectionParam ? parseInt(sectionParam) : 1
  );
  // const [answers, setAnswers] = useState<Record<string, string>>({});
  const { data, refetch } = useListeningExamSection(id ?? "");
  const questionNumberMap = useMemo(() => {
    if (!data?.exam) return {};
    const map: Record<string, number> = {};
    let currentNumber = 1;
    data.exam.forEach((passage) => {
      passage.types.forEach((type) => {
        type.questions.forEach((question) => {
          map[question.id] = currentNumber++;
        });
      });
    });
    return map;
  }, [data?.exam]);
  const { data: result } = useExamResult(idResult ?? "");
  useEffect(() => {
    setSearchParams({ passage: currentSection.toString() });
  }, [currentSection, setSearchParams]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);
  const questionType = useMemo(
    () => data?.exam[currentSection - 1]?.types,
    [currentSection, data?.exam]
  );
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
            const question = questions[idx];
            const answerData = result?.summary.find(
              (item) => item.questionId === question?.id
            );
            return (
              <React.Fragment key={idx}>
                {isDrag ? (
                  <div className="space-y-2">
                    <span className="font-bold">{questionNumber}. </span>
                    {part}
                    <div className="flex gap-2 items-center">
                      <Badge
                        className={cn(
                          "w-32 h-9 border-b-4 rounded-xl",
                          answerData?.userAnswer === ""
                            ? "bg-white border-yellow-700 text-yellow-400 hover:bg-yellow-400"
                            : answerData?.isCorrect
                            ? "bg-[#66B032] hover:bg-[#66B032]/80  border-green-800 text-white hover:border-green-800"
                            : "bg-red-500 border-red-700 text-white hover:bg-red-400"
                        )}
                      >
                        {answerData?.userAnswer === ""
                          ? "Not answered"
                          : answerData?.userAnswer}
                      </Badge>
                      {!answerData?.isCorrect && (
                        <Badge className="w-32 h-9 border-b-4 rounded-xl hover:bg-[#66B032]/80 bg-[#66B032] border-green-800 text-white hover:border-green-800">
                          {answerData?.correctAnswer}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {part}
                    <span className="font-bold">{questionNumber}. </span>
                    <Badge
                      className={cn(
                        "w-32 h-9 border-b-4 rounded-xl",
                        answerData?.userAnswer === ""
                          ? "bg-yellow-300 border-yellow-700 text-black hover:bg-yellow-400"
                          : answerData?.isCorrect
                          ? "bg-[#66B032] border-green-800 text-white hover:border-green-800"
                          : "bg-red-500 border-red-700 text-white hover:bg-red-400"
                      )}
                    >
                      {answerData?.userAnswer === ""
                        ? "Not answered"
                        : answerData?.userAnswer}
                    </Badge>
                    {!answerData?.isCorrect && (
                      <Badge className="w-32 ml-2 h-9  border-b-4 rounded-xl hover:bg-[#66B032]/80 bg-[#66B032] border-green-800 text-white hover:border-green-800">
                        {answerData?.correctAnswer}
                      </Badge>
                    )}
                  </>
                )}{" "}
              </React.Fragment>
            );
          })}
        </p>
      </React.Fragment>
    );
  };
  const calculateTotalQuestions = useCallback(() => {
    if (!data?.exam) return 0;

    return data.exam.reduce((total, passage) => {
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
    <div className="min-h-screen flex flex-col overflow-y-hidden bg-white">
      <div
        className="px-6 flex items-center gap-4 text-lg font-semibold cursor-pointer"
        onClick={() => nav(Route.Exam)}
      >
        <ArrowLeft className="h-8 w-8" /> Back To Exam
      </div>
      <div className="flex-1 h-full overflow-y-hidden relative">
        <div className="grid grid-cols-1 gap-6 p-6">
          <Card className="p-6 h-[75vh] overflow-y-auto">
            {questionType?.map((types, index) => {
              const { start, end } = getQuestionRange(questionType, index);
              // const isHeadingQuestion =
              //   types.type === EQuestionType.HeadingPosition;
              const isSingleChoiceQuestion =
                types.type === EQuestionType.SingleChoice;
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
                    </div>
                  </div>
                );
              } else if (isSingleChoiceQuestion) {
                return (
                  <div className="space-y-4">
                    {questionType[index].questions.map((question, index) => {
                      const answerData = result?.summary.find(
                        (item) => item.questionId === question.id
                      );
                      const questionNumber =
                        questionNumberMap[question.id] || index + 1;
                      return (
                        <SingleChoiceResult
                          question={question}
                          index={index}
                          questionNumber={questionNumber}
                          userAnswer={answerData?.userAnswer}
                          correctAnswer={answerData?.correctAnswer}
                          isCorrect={answerData?.isCorrect}
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
                                {/* <Checkbox
                                  checked={answers[question.id]?.includes(
                                    answer.answer
                                  )}

                                /> */}
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
                        className="w-1/3"
                      />
                      <div className="flex flex-col gap-4 items-center">
                        {questionType[index].questions.map((question) => {
                          const questionNumber =
                            questionNumberMap[question.id] || index + 1;
                          const answerData = result?.summary.find(
                            (item) => item.questionId === question?.id
                          );
                          return (
                            <div className="flex gap-2 items-center">
                              <span className="font-bold">
                                {questionNumber}
                              </span>
                              <Badge
                                className={cn(
                                  "w-32 min-w-fit h-9 truncate border-b-4 rounded-xl",
                                  answerData?.userAnswer === ""
                                    ? "bg-yellow-300 border-yellow-700 text-black hover:bg-yellow-400"
                                    : answerData?.isCorrect
                                    ? "bg-[#66B032] border-green-800 text-white hover:border-green-800"
                                    : "bg-red-500 border-red-700 text-white hover:bg-red-400"
                                )}
                              >
                                {answerData?.userAnswer === ""
                                  ? "Not answered"
                                  : answerData?.userAnswer}
                              </Badge>
                              {!answerData?.isCorrect && (
                                <Badge className="w-32 min-w-fit ml-2 h-9 truncate border-b-4 rounded-xl hover:bg-[#66B032]/80 bg-[#66B032] border-green-800 text-white hover:border-green-800">
                                  {answerData?.correctAnswer}
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              }
              // else if (isHeadingQuestion) {
              //   <div>
              //     {isHeadingQuestion && (
              //       <p className="text-lg font-bold ">List of Headings</p>
              //     )}
              //     <div className="flex space-x-2">
              //       {questionType[index].questions.map((question) =>
              //         question.answers.map((answer, idx) => (
              //           <Word key={idx} answer={answer} />
              //         ))
              //       )}
              //     </div>
              //   </div>;
              // }
            })}
          </Card>
        </div>
      </div>
      <ListeningFooterResult
        section={data?.exam ?? []}
        setCurrentSection={setCurrentSection}
        totalQuestions={totalQuestions}
        sectionParam={sectionParam}
        result={result}
        idResult={idResult}
      />
    </div>
  );
};

export default ListeningTestResult;
