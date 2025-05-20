import React, { useCallback, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Route } from "@/constant/route";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EQuestionType } from "@/types/ExamType/exam";
import QuestionPracticeHeader from "../../components/QuestionPracticeHeader";
import SingleChoicePracticeResult from "../../components/SingleChoicePracticeResult";
import { usePracticeResult } from "../../PracticeReading/hooks/usePracticeResult";
import { useListeningPracticeSection } from "../hooks/useListeningPracticeSection";
import ListeningFooterPracticeResult from "./ListeningFooterPracticeResult";
import { IPracticeResult } from "@/types/PracticeType/practice";
export default function PracticeListeningResult() {
  const { idResult } = useParams<{ idResult: string }>();
  const nav = useNavigate();
  const { data: result } = usePracticeResult(idResult ?? "") as {
    data: IPracticeResult;
  };
  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useListeningPracticeSection(id ?? "");
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
    <div className="h-full w-full relative p-4 flex justify-between">
      {/* <DialogPracticeConfirm openDia={openDia} setOpenDia={setOpenDia} /> */}
      <Button
        variant="ghost"
        className="mb-4 w-fit hover:bg-[#F1FFEF] hover:border-0"
        size="sm"
        onClick={handleExit}
      >
        <ArrowLeft className="text-[#164C7E]" />
      </Button>
      <div className="flex flex-col justify-between">
        <div className="flex gap-4">
          {/* Right Section */}
          <Card className="px-8 py-2 h-[85vh] w-2/3 overflow-y-auto">
            <CardContent className="pt-6 px-0">
              <div className="space-y-8">
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
          <Card className="px-8 py-2 h-[85vh] w-1/3 overflow-y-auto">
            <CardContent className="pt-6 px-0">
              <span>
                Script Unit 1 EX12: 1. What activities do different members of
                your family enjoy doing? My father enjoys planting flowers. Most
                of them are grown by my father. My father is especially fond of
                orchids so he has a collection of about 20 kinds of orchids. And
                my mother loves to cook. On weekends she often cooks hearty
                meals for my family My Brother also likes cooking but he likes
                playing games more 2. What do your mother and father want you to
                do in the future? My parents want to travel together in the
                future. Their work is very busy so they don't have time for each
                other. Since, they want to travel together to have more good
                memories 3. What type of films do different members of your
                family watch? My parents like movies about family emotions. The
                biggest reason is that they love happy endings and meaningful
                lessons from the movies. My brother likes all kinds of films,
                from movies to fantasy to cartoon 4. What do different members
                of your family talk to you about? "My parents say I'm a person
                who is easygoing and careful. And my brother say I bully him
                into doing house chore because he's too lazy so I make him work
                Ex 13 1. Do you come from a large family? I come from a small
                family. I live with my parents and my young brother. We were an
                extended family many years ago but now we are a nuclear family
                as we live in a town which is far away from our grandparent’s
                house 2. Is there anything you usually do together with your
                family? Everyday we spend an hour doing house chores together. I
                sometimes play games with my young brother and watch films with
                my parents. Those are happy time of my family 3. How often do
                you see your grandparents? because my house is quite far from my
                grandparent's house so I don't visit them often. However, when I
                have free time or vacation I will visit my grandparents 4. Who
                do you like the most in your family It's a difficult question
                because I love them a lot. My family help me get through
                difficult times of my life and enjoy every moment of my success
                with me so they are ones love the most 5. Would you like to
                spend more time with your family? Yes, because I have been
                living in the city which is far away from my family and I miss
                home so much. On weekends when I get back home I spend most of
                my time with my family Unit 2 6. Can you describe the own where
                you grew up? I live in a small town in the west of my country.
                In my opinion, it’s an ideal town to live in thanks to beautiful
                natural landscapes and great atmosphere 7.
              </span>
            </CardContent>
          </Card>
        </div>
        <ListeningFooterPracticeResult
          audio={data?.practiceListen.audio}
          result={result}
          types={data?.types || []}
          totalQuestions={totalQuestions}
        />
      </div>
    </div>
  );
}
