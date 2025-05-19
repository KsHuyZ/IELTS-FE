import { Button } from "@/components/ui/button";
import StepPractice from "../../components/stepPractice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EQuestionType } from "@/types/ExamType/exam";
import { useGetFullPracticeDetailAdmin } from "../../hooks/useGetPracticeDetail";
import DialogCreateListening from "./components/DialogCreateSection";
import DialogCreatePracticeListeningType from "./components/DialogCreatePracticeListeningType";
import DialogCreateListeningPracticeQuestion from "./components/DialogCreateListeningPracticeQuestion";
import { ArrowLeft, Edit } from "lucide-react";
import DialogEditListening from "./components/DialogEditSection";
import DialogEditPracticeListeningType from "./components/DialogEditListeningType";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { ReadingAnswer } from "@/types/PracticeType/readingPractice";
import DialogEditListeningQuestion from "./components/DialogEditListeningQuestion";
import DialogDeleteListeningQuestion from "./components/DialogDeleteListeningQuestion";
import StepEditPractice from "../../components/stepEditPractice";
const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.DiagramLabelCompletion]: "Diagram Label Completion",
  [EQuestionType.MatchingFeatures]: "Matching Features",
  [EQuestionType.MatchingHeadings]: "Matching Headings",
  [EQuestionType.MatchingInformation]: "Matching Information",
  [EQuestionType.MatchingSentencesEnding]: "Matching Sentences Ending",
  [EQuestionType.MultipleChoice]: "Multiple Choice",
  [EQuestionType.SentenceCompletion]: "Sentence Completion",
  [EQuestionType.ShortAnswerQuestion]: "Short Answer Question",
  [EQuestionType.SummaryCompletion]: "Summary Completion",
  [EQuestionType.TrueFalseNotGiven]: "True/False/Not Given",
  [EQuestionType.YesNoNotGiven]: "Yes/No/Not Given",
};
const blankType = [
  EQuestionType.MatchingHeadings,
  EQuestionType.MatchingInformation,
  EQuestionType.MatchingFeatures,
  EQuestionType.MatchingSentencesEnding,
  EQuestionType.SummaryCompletion,
];

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
interface ListeningPracticeManagerProps {
  mode: "create" | "edit";
}
const CreatePracticeListening: React.FC<ListeningPracticeManagerProps> = ({
  mode,
}) => {
  const [openDiaAddAudio, setOpenDiaAddAudio] = useState<boolean>(false);
  const nav = useNavigate();
  const [openDiaEditAudio, setOpenDiaEditAudio] = useState<boolean>(false);
  const [openDiaCreateType, setOpenDiaCreateType] = useState<boolean>(false);
  const [openDiaEditType, setOpenDiaEditType] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [selectedType, setSelectedType] = useState<{
    id: string;
    content: string;
    type: EQuestionType;
    limitAnswer: number;
  } | null>(null);
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] =
    useState<boolean>(false);
  const [idType, setIdType] = useState("");
  const [type, setType] = useState("");
  const [idQuestion, setIdQuestion] = useState("");
  const [openDiaDeleteQuestion, setOpenDiaDeleteQuestion] =
    useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string;
    question: string;
    answers: ReadingAnswer[];
    type: EQuestionType;
  } | null>(null);
  const handleOpenCreateQuestion = (idType: string, type: string) => {
    setIdType(idType);
    setType(type);
    setOpenDiaCreateQuestion(true);
  };
  const handleOpenDiaDeleteQuestion = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenDiaDeleteQuestion(true);
    setIdQuestion(id);
    e.stopPropagation();
  };
  const { data: practiceDetail, refetch } = useGetFullPracticeDetailAdmin(
    id ?? ""
  );
  const countBlanks = (content: string): number => {
    const regex = /\{blank\}/g;
    return (content.match(regex) || []).length;
  };
  const handleOpenEditType = (
    typeQuestion: {
      id: string;
      content: string;
      type: EQuestionType;
      limitAnswer: number;
    },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedType(typeQuestion);
    setOpenDiaEditType(true);
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
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  return (
    <div className="h-full w-full p-8 space-y-5 relative">
      <ArrowLeft
        className="absolute top-16 cursor-pointer left-10"
        onClick={() => nav(-1)}
      />
      <DialogCreateListening
        openDia={openDiaAddAudio}
        setOpenDia={setOpenDiaAddAudio}
        id={id}
        refetch={refetch}
      />
      <DialogCreatePracticeListeningType
        openDia={openDiaCreateType}
        setOpenDia={setOpenDiaCreateType}
        id={practiceDetail?.practiceData?.id}
        refetch={refetch}
      />
      <DialogCreateListeningPracticeQuestion
        openDia={openDiaCreateQuestion}
        setOpenDia={setOpenDiaCreateQuestion}
        id={idType}
        type={type}
        refetch={refetch}
      />
      <DialogEditListening
        openDia={openDiaEditAudio}
        setOpenDia={setOpenDiaEditAudio}
        audio={practiceDetail?.practiceData?.audio}
        id={practiceDetail?.practiceData?.id}
        refetch={refetch}
      />
      <DialogEditPracticeListeningType
        openDia={openDiaEditType}
        setOpenDia={setOpenDiaEditType}
        selectedType={selectedType}
        refetch={refetch}
      />
      <DialogEditListeningQuestion
        openDia={openDiaEditQuestion}
        setOpenDia={setOpenDiaEditQuestion}
        questions={selectedQuestion}
        refetch={refetch}
      />
      <DialogDeleteListeningQuestion
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
            {mode === "create"
              ? "Create Listening Practice Detail"
              : "Edit Listening Practice Detail"}
          </h1>
          {!practiceDetail?.practiceData?.audio && (
            <Button
              className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
              onClick={() => setOpenDiaAddAudio(true)}
            >
              Add Audio Listening
            </Button>
          )}
        </div>
        {practiceDetail?.practiceData?.audio ? (
          <Accordion
            type="single"
            collapsible
            className="w-full bg-[#F1FFEF] border-2 border-[#188F09] rounded-lg px-4 mt-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex gap-3 items-center font-bold relative">
                <span>Practice Listening:</span>
                <Button
                  className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-500"
                  onClick={(e) => {
                    setOpenDiaEditAudio(true);
                    e.stopPropagation();
                  }}
                >
                  <Edit />
                </Button>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex justify-between items-center mb-4 gap-4">
                  <audio
                    controls
                    className="w-full"
                    key={practiceDetail?.practiceData?.audio}
                  >
                    <source
                      src={practiceDetail?.practiceData?.audio}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                  <Button
                    className="border-2 flex gap-3 border-blue-500 font-bold bg-white text-blue-500 hover:text-white hover:bg-blue-500"
                    onClick={() => setOpenDiaCreateType(true)}
                  >
                    Create New Type Question
                  </Button>
                </div>

                {practiceDetail?.practiceData?.types &&
                practiceDetail?.practiceData?.types.length > 0 ? (
                  practiceDetail.practiceData.types.map((type) => {
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
                        className="w-full bg-[#F1FFEF] border-2 border-[#164C7E] rounded-lg px-4 mt-4"
                      >
                        <AccordionItem value="item-1" key={type.id}>
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
                            {type.questions && type.questions.length > 0 ? (
                              type.questions.map((question, index) => (
                                <div
                                  className="w-full justify-between relative flex items-center bg-yellow-200 border-2 border-[#188F09] rounded-lg p-3 mt-4"
                                  key={question.id}
                                >
                                  <div className="flex gap-4 font-bold text-black">
                                    <span>Question {index + 1}:</span>{" "}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="text-center text-black">
            There are currently no audio available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePracticeListening;
