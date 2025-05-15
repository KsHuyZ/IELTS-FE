import { Card } from "@/components/ui/card";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import ReadingFooterResult from "./ReadingFooterResult";
import { Badge } from "@/components/ui/badge";
import { Route } from "@/constant/route";
import { EQuestionType, IExamResult } from "@/types/ExamType/exam";
import SingleChoiceResult from "../../components/SingleChoiceResult";
import QuestionHeader from "../../components/QuestionHeader";
import { useExamPassage } from "../../hooks/useExamPassage";
import { useExamResult } from "../../hooks/useExamResult";
// import { Checkbox } from "@/components/ui/checkbox";

const ReadingResult = () => {
  const { idResult } = useParams<{ idResult: string }>();
  const { id } = useParams<{ id: string }>();
  const { data } = useExamPassage(id ?? "");
  const { data: result } = useExamResult(idResult ?? "") as {
    data: IExamResult;
  };
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const passageParam = searchParams.get("passage") ?? "1";
  const [currentPassage, setCurrentPassage] = useState(
    passageParam ? parseInt(passageParam) : 1
  );
  const questionNumberMap = useMemo(() => {
    if (!data?.exam) return {};
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
    setSearchParams({ passage: currentPassage.toString() });
  }, [currentPassage, setSearchParams]);

  const questionType = useMemo(
    () => data?.exam.examPassage[currentPassage - 1]?.types,
    [currentPassage, data?.exam]
  );
  const calculateTotalQuestions = useCallback(() => {
    if (!data?.exam.examPassage) return 0;

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
            const question = questions[idx];
            const answerData = result?.summary.find(
              (item) => item.questionId === question?.id
            );
            const questionId = questions[idx]?.id;
            const questionNumber = questionNumberMap[questionId] || 0;
            return (
              <React.Fragment key={idx}>
                {isDrag ? (
                  <div className="space-y-2">
                    <span className="font-bold">{questionNumber}. </span>
                    {part}
                    <div className="flex gap-2 items-center">
                      <Badge
                        className={cn(
                          "w-32 min-w-fit h-9 truncate line-clamp-1 border-b-4 rounded-xl",
                          answerData?.userAnswer === ""
                            ? "bg-yellow-300 border-yellow-700 text-black hover:bg-yellow-400"
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
                        <Badge className="w-32 min-w-fit h-9 truncate line-clamp-1 border-b-4 rounded-xl hover:bg-[#66B032]/80 bg-[#66B032] border-green-800 text-white hover:border-green-800">
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
                  </>
                )}{" "}
              </React.Fragment>
            );
          })}
        </p>
      </React.Fragment>
    );
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
    <div className="min-h-screen flex flex-col overflow-y-hidden bg-white">
      <div
        className="px-6 flex items-center gap-4 text-lg font-semibold cursor-pointer"
        onClick={() => nav(Route.Exam)}
      >
        <ArrowLeft className="h-8 w-8" /> Back To Exam
      </div>
      <div className="flex-1 h-full overflow-y-hidden">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <Card className="p-6 h-[75vh] overflow-y-auto">
            {data?.exam && data.exam.examPassage.length > 0 ? (
              <>
                <h2 className="mb-4 text-2xl font-bold">
                  {data.exam.examPassage[currentPassage - 1].title ?? ""}
                </h2>
                <p className="mb-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        data.exam.examPassage[currentPassage - 1].passage || "",
                    }}
                  />
                </p>
              </>
            ) : (
              <p>Loading passage...</p>
            )}
          </Card>
          <Card className="p-6 h-[75vh] overflow-y-auto">
            {questionType?.map((types, index) => {
              const { start, end } = getQuestionRange(questionType, index);
              // const isHeadingQuestion =
              //   types.type === EQuestionType.HeadingPosition;
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
              } else if (isTextBox) {
                return (
                  <div className="space-y-4">
                    <QuestionHeader
                      start={start}
                      end={end}
                      instruction="Write the CORRECT answer"
                    />
                    {questionType[index].questions.map((question, index) => {
                      const answerData = result?.summary.find(
                        (item) => item.questionId === question.id
                      );
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
                        </div>
                      );
                    })}
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
            })}
          </Card>
        </div>
      </div>
      <ReadingFooterResult
        result={result}
        setCurrentPassage={setCurrentPassage}
        passages={data?.exam.examPassage ?? []}
        totalQuestions={totalQuestions}
        passageParam={passageParam}
      />
    </div>
  );
};

export default ReadingResult;
