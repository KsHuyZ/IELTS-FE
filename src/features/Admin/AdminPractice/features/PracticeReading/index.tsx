import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EQuestionType } from "@/types/ExamType/exam";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Edit } from "lucide-react";
import StepPractice from "../../components/stepPractice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DialogPracticeCreatePassage from "./components/DialogPracticeCreatePassage";
import DialogCreatePracticeType from "./components/DialogCreatePracticeType";
import DialogCreateReadingPracticeQuestion from "./components/DialogCreateReadingPracticeQuestion";
import { ReadingAnswer } from "@/types/PracticeType/readingPractice";
import { useGetFullPracticeDetailAdmin } from "../../hooks/useGetPracticeDetail";
import DialogEditPassage from "./components/DialogEditPassage";
import DialogEditType from "./components/DialogEditType";
import DialogEditQuestion from "./components/DialogEditQuestion";
import StepEditPractice from "../../components/stepEditPractice";
import DialogDeleteQuestion from "./components/DialogDeleteQuestion";

const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.TextBox]: "Text Box",
  [EQuestionType.MultipleChoice]: "Multiple Choice",
  [EQuestionType.SingleChoice]: "Single Choice",
  [EQuestionType.BlankPassageDrag]: "Blank Passage Drag",
  [EQuestionType.BlankPassageTextbox]: "Blank Passage Textbox",
};
const blankType = [
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SummaryCompletion,
  EQuestionType.DiagramLabelCompletion,
];
interface ReadingPracticeManagerProps {
  mode: "create" | "edit";
}
const singleAnswerTypes = [
  EQuestionType.DiagramLabelCompletion,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SentenceCompletion,
  EQuestionType.ShortAnswerQuestion,
  EQuestionType.SummaryCompletion,
];
const ReadingPracticeManager: React.FC<ReadingPracticeManagerProps> = ({
  mode,
}) => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [openDiaCreatePassage, setOpenDiaCreatePassage] =
    useState<boolean>(false);
  const [openDiaEditPassage, setOpenDiaEditPassage] = useState<boolean>(false);
  const [openDiaCreateType, setOpenDiaCreateType] = useState<boolean>(false);
  const [openDiaEditType, setOpenDiaEditType] = useState<boolean>(false);
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] =
    useState<boolean>(false);
  const [openDiaDeleteQuestion, setOpenDiaDeleteQuestion] =
    useState<boolean>(false);
  const [idQuestion, setIdQuestion] = useState("");
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [idType, setIdType] = useState("");
  const [type, setType] = useState("");
  const [selectedType, setSelectedType] = useState<{
    id: string;
    content: string;
    type: EQuestionType;
    limitAnswer: number;
    image: string;
  } | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string;
    question: string;
    answers: ReadingAnswer[];
    type: EQuestionType;
  } | null>(null);

  const { data: practiceDetail, refetch } = useGetFullPracticeDetailAdmin(
    id ?? ""
  );

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  const handleOpenCreateQuestion = (typeId: string, typeName: string) => {
    setIdType(typeId);
    setType(typeName);
    setOpenDiaCreateQuestion(true);
  };

  const handleOpenEditType = (
    typeQuestion: {
      id: string;
      content: string;
      type: EQuestionType;
      limitAnswer: number;
      image: string;
    },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedType(typeQuestion);
    setOpenDiaEditType(true);
    e.stopPropagation();
  };
  const handleOpenDiaDeleteQuestion = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenDiaDeleteQuestion(true);
    setIdQuestion(id);
    e.stopPropagation();
  };
  const handleOpenEditQuestion = (
    typeQuestion: {
      id: string;
      question: string;
      answers: ReadingAnswer[];
      type: EQuestionType;
    },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedQuestion(typeQuestion);
    setOpenDiaEditQuestion(true);
    e.stopPropagation();
  };
  const countBlanks = (content: string): number => {
    const regex = /\{blank\}/g;
    return (content.match(regex) || []).length;
  };
  return (
    <div className="h-full w-full p-8 space-y-5 relative">
      <ArrowLeft
        className="absolute top-12 cursor-pointer left-10"
        onClick={() => nav(-1)}
      />
      <DialogPracticeCreatePassage
        openDia={openDiaCreatePassage}
        setOpenDia={setOpenDiaCreatePassage}
        id={id}
        refetch={refetch}
      />
      <DialogEditPassage
        openDia={openDiaEditPassage}
        setOpenDia={setOpenDiaEditPassage}
        id={practiceDetail?.id}
        content={practiceDetail?.practiceData?.content}
        image={practiceDetail?.practiceData?.image}
        title={practiceDetail?.practiceData?.title}
        refetch={refetch}
      />
      <DialogCreatePracticeType
        openDia={openDiaCreateType}
        setOpenDia={setOpenDiaCreateType}
        id={practiceDetail?.practiceData?.id}
        refetch={refetch}
      />
      <DialogEditType
        openDia={openDiaEditType}
        setOpenDia={setOpenDiaEditType}
        selectedType={selectedType}
        refetch={refetch}
      />
      <DialogCreateReadingPracticeQuestion
        openDia={openDiaCreateQuestion}
        setOpenDia={setOpenDiaCreateQuestion}
        id={idType}
        type={type}
        refetch={refetch}
      />
      <DialogEditQuestion
        openDia={openDiaEditQuestion}
        setOpenDia={setOpenDiaEditQuestion}
        questions={selectedQuestion}
        refetch={refetch}
      />
      <DialogDeleteQuestion
        openDeleteQuestion={openDiaDeleteQuestion}
        id={idQuestion}
        setOpenDeleteQuestion={setOpenDiaDeleteQuestion}
        refetch={refetch}
      />
      <div className="w-9/12 mx-auto">
        {mode === "create" ? (
          <StepPractice step={1} />
        ) : (
          <StepEditPractice step={1} />
        )}
      </div>
      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            Reading Practice Manager
          </h1>
          {!practiceDetail?.practiceData.content && (
            <Button
              className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
              onClick={() => setOpenDiaCreatePassage(true)}
            >
              Create Passage
            </Button>
          )}
        </div>
        {practiceDetail?.practiceData ? (
          <Card className="w-full h-fit mt-5">
            <CardHeader>
              <CardTitle className="text-center font-bold relative p-3">
                {practiceDetail.practiceData.content && (
                  <Button
                    className="absolute top-0 right-0 w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
                    onClick={() => setOpenDiaEditPassage(true)}
                  >
                    Edit Passage
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {practiceDetail?.practiceData.content ? (
                <>
                  <div className="font-bold text-lg mb-3">
                    {practiceDetail?.practiceData?.title}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: practiceDetail?.practiceData?.content || "",
                    }}
                  />
                  <img
                    src={practiceDetail?.practiceData?.image}
                    alt="Image"
                    className="object-contain w-72 h72"
                  />
                </>
              ) : (
                "There are currently no Passage available."
              )}
              <div className="flex justify-end w-full mt-4">
                <Button
                  className="border-2 flex gap-3 border-blue-500 font-bold bg-white text-blue-500 hover:text-white hover:bg-blue-500"
                  onClick={() => setOpenDiaCreateType(true)}
                >
                  Create New Type Question
                </Button>
              </div>
              {practiceDetail?.practiceData?.types &&
              practiceDetail?.practiceData?.types.length > 0 ? (
                practiceDetail?.practiceData?.types.map((type) => {
                  const isBlankType = blankType.includes(
                    type.type as EQuestionType
                  );
                  const isSingleAnswerType = singleAnswerTypes.includes(
                    type.type as EQuestionType
                  );
                  return (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full bg-blue-200 border-2 border-[#164C7E] rounded-lg px-4 mt-4"
                      key={type.id}
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="flex gap-3 items-center font-bold relative">
                          <span>Type:</span>{" "}
                          <span>
                            {questionTypeDisplayNames[type.type] || type.type}
                          </span>
                          {isSingleAnswerType && (
                            <Button
                              className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-500"
                              onClick={(e) =>
                                handleOpenEditType(
                                  {
                                    id: type.id,
                                    content: type.content,
                                    type: type.type,
                                    limitAnswer: type.limitAnswer,
                                    image: type.image,
                                  },
                                  e
                                )
                              }
                            >
                              <Edit />
                            </Button>
                          )}
                        </AccordionTrigger>
                        <AccordionContent className="relative">
                          {isBlankType && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 text-red-500 font-bold animate-pulse">
                              {(() => {
                                const blankCount = countBlanks(
                                  type.content || ""
                                );
                                const questionCount =
                                  type.questions?.length || 0;
                                const remainingQuestions =
                                  blankCount - questionCount;
                                return remainingQuestions > 0
                                  ? `You need to create ${remainingQuestions} more questions`
                                  : remainingQuestions < 0
                                  ? "You have created more questions than needed, please delete some"
                                  : "";
                              })()}
                            </div>
                          )}
                          <div className="flex justify-end">
                            <Button
                              className="border-2 flex gap-3 border-[#188F09] font-bold bg-white text-[#188F09] hover:text-white hover:bg-[#188F09]"
                              onClick={() =>
                                handleOpenCreateQuestion(type.id, type.type)
                              }
                            >
                              Create New Question
                            </Button>
                          </div>
                          {type?.questions && type.questions.length > 0 ? (
                            type.questions.map((question, index) => (
                              <div
                                className="w-full justify-between relative flex items-center bg-yellow-200 border-2 border-[#188F09] rounded-lg p-3 mt-4"
                                key={question.id}
                              >
                                <div className="flex gap-4 font-bold text-black">
                                  <span>Question {index + 1}:</span>
                                  <span>{question.question}</span>
                                </div>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      className="absolute right-10 bg-transparent hover:bg-black/10 rounded-full p-3"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <HiOutlineDotsVertical className="size-5" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-40 flex items-center justify-center flex-col gap-5">
                                    <Button
                                      className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
                                      onClick={(e) =>
                                        handleOpenEditQuestion(
                                          {
                                            id: question.id,
                                            question: question.question,
                                            answers: question.answers,
                                            type: type.type,
                                          },
                                          e
                                        )
                                      }
                                    >
                                      Edit Question
                                    </Button>
                                    <Button
                                      className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold border-red-500 border-2 text-red-500"
                                      onClick={(e) =>
                                        handleOpenDiaDeleteQuestion(
                                          question.id,
                                          e
                                        )
                                      }
                                    >
                                      Delete Question
                                    </Button>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-black">
                              There are currently no Question available.
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })
              ) : (
                <div className="text-center text-black">
                  There are currently no Type Question available.
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-black">
            There are currently no passages available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingPracticeManager;
