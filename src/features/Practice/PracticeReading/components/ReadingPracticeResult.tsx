import React, { useCallback, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Route } from "@/constant/route";
import { useNavigate, useParams } from "react-router-dom";
import { useReadingPracticePassage } from "../hooks/useReadingPracticePassage";
import { usePracticeResult } from "../hooks/usePracticeResult";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EQuestionType } from "@/types/ExamType/exam";
import QuestionPracticeHeader from "../../components/QuestionPracticeHeader";
import SingleChoicePracticeResult from "../../components/SingleChoicePracticeResult";
import ReadingFooterPracticeResult from "./ReadingFooterPracticeResult";
import { IPracticeResult } from "@/types/PracticeType/practice";
export default function PracticeReadingResult() {
  const { idResult } = useParams<{ idResult: string }>();
  const nav = useNavigate();
  const { data: result } = usePracticeResult(idResult ?? "") as {
    data: IPracticeResult;
  };
  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useReadingPracticePassage(id ?? "");
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
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

    const contentParts = questionTypes[index].content?.split("{blank}");
    const questions = questionTypes[index].questions || [];
    const blankLength = contentParts?.length - 1;
    return (
      <React.Fragment>
        <p className="mt-4 leading-loose">
          {contentParts.map((part, idx) => {
            if (idx >= blankLength) return <span key={idx}>{part}</span>;
            const questionId = questions[idx]?.id;
            const answerData = result?.summary.find(
              (item) => item.questionId === questionId
            );
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
                          "w-32 h-9 border-b-4 rounded-xl",
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
                        <Badge className="w-32 h-9 border-b-4 rounded-xl hover:bg-[#66B032]/80 bg-[#66B032] border-green-800 text-white hover:border-green-800">
                          {answerData?.correctAnswer[0]}
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
                        {answerData?.correctAnswer[0]}
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
  const handleExit = () => {
    nav(Route.Practice);
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
    <div className="h-full relative p-4 flex justify-between">
      <Button
        variant="ghost"
        className="mb-4 w-fit hover:bg-[#F1FFEF] hover:border-0"
        size="sm"
        onClick={handleExit}
      >
        <ArrowLeft className="text-[#164C7E]" />
      </Button>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-4 w-full">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Section */}
            <Card className="px-8 py-2 h-[86vh] overflow-y-auto">
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
                    <p className="mb-4">{data.practiceReading.content}</p>
                  </p>
                </>
              ) : (
                <p>Loading passage...</p>
              )}
            </Card>

            {/* Right Section */}
            <Card className="px-8 py-2 h-[86vh] overflow-y-auto">
              <CardContent className="pt-6 px-0">
                <div className="space-y-8">
                  {questionTypes?.map((types, index) => {
                    const { start, end } = getQuestionRange(
                      questionTypes,
                      index
                    );
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
                      isTextBox ||
                      isShortAnswerQuestion ||
                      isSentenceCompletion;
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
                          </div>
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
                            const answerData = result?.summary.find(
                              (item) => item.questionId === question.id
                            );
                            return (
                              <SingleChoicePracticeResult
                                question={question}
                                questionNumber={questionNumber}
                                userAnswer={answerData?.userAnswer}
                                correctAnswer={answerData?.correctAnswer[0]}
                                isCorrect={answerData?.isCorrect}
                              />
                            );
                          })}
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
                    } else if (isImageType) {
                      const questions = questionTypes[index].questions || [];
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
                              {types.questions.map((question, idx) => {
                                const questionNumber =
                                  questionNumberMap[question.id] || index + 1;
                                const questionId = questions[idx]?.id;
                                const answerData = result?.summary.find(
                                  (item) => item.questionId === questionId
                                );
                                return (
                                  <div className="flex gap-2 items-center">
                                    <span className="font-bold">
                                      {questionNumber}
                                    </span>
                                    <div className="flex gap-2 items-center">
                                      <Badge
                                        className={cn(
                                          "w-32 h-9 border-b-4 rounded-xl",
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
                                        <Badge className="w-32 h-9 border-b-4 rounded-xl hover:bg-[#66B032]/80 bg-[#66B032] border-green-800 text-white hover:border-green-800">
                                          {answerData?.correctAnswer[0]}
                                        </Badge>
                                      )}
                                    </div>
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
        <ReadingFooterPracticeResult
          result={result}
          types={data?.types || []}
          totalQuestions={totalQuestions}
        />
      </div>
    </div>
  );
}
