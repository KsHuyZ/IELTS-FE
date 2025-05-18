import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EQuestionType, ReadingAnswer } from "@/types/ExamType/exam";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DialogCreateSection from "./components/DialogCreateSection";
import DialogCreateListeningType from "./components/DialogCreateListeningType";
import DialogCreateListeningQuestion from "./components/DialogCreateListeningQuestion";
import DialogEditType from "./components/DialogEditType";
import DialogEditQuestion from "./components/DialogEditQuestion";
import DialogDeleteQuestion from "./components/DialogDeleteQuestion";
import DialogDeleteSection from "./components/DialogDeleteSection";
import { useGetFullExamDetail } from "../CreateReading/hooks/useGetFullExamDetail";
import Step from "../../components/step";
import StepEdit from "../../components/stepEdit";

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
  EQuestionType.DiagramLabelCompletion,
];
interface ListeningExamManagerProps {
  mode: "create" | "edit";
}

const ListeningExamManager: React.FC<ListeningExamManagerProps> = ({
  mode,
}) => {
  const [openDiaCreateSection, setOpenDiaCreateSection] =
    useState<boolean>(false);
  const [openDiaCreateType, setOpenDiaCreateType] = useState<boolean>(false);
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] =
    useState<boolean>(false);
  const [openDiaDeletePassage, setOpenDiaDeletePassage] =
    useState<boolean>(false);
  const [openDiaDeleteQuestion, setOpenDiaDeleteQuestion] =
    useState<boolean>(false);
  const [openDiaEditType, setOpenDiaEditType] = useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [idPassage, setIdPassage] = useState("");
  const [idType, setIdType] = useState("");
  const [idQuestion, setIdQuestion] = useState("");
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
  const countBlanks = (content: string): number => {
    const regex = /\{blank\}/g;
    return (content.match(regex) || []).length;
  };
  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useGetFullExamDetail(id ?? "");
  const nav = useNavigate();
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleOpenCreateType = (idPassage: string) => {
    setIdPassage(idPassage);
    setOpenDiaCreateType(true);
  };

  const handleOpenCreateQuestion = (idType: string, type: string) => {
    setIdType(idType);
    setType(type);
    setOpenDiaCreateQuestion(true);
  };

  const handleOpenDiaDeletePassage = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenDiaDeletePassage(true);
    setIdPassage(id);
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

  const handleOpenEditType = (
    typeQuestion: {
      id: string;
      content: string;
      limitAnswer: number;
      type: EQuestionType;
      image: string;
    },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenDiaEditType(true);
    setSelectedType(typeQuestion);
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
    setOpenDiaEditQuestion(true);
    setSelectedQuestion(typeQuestion);
    e.stopPropagation();
  };

  const passages = data?.examPassage;

  return (
    <div className="h-full w-full p-8 space-y-5 relative">
      <ArrowLeft
        className="absolute top-16 cursor-pointer left-10"
        onClick={() => nav(-1)}
      />
      <DialogCreateSection
        openDia={openDiaCreateSection}
        setOpenDia={setOpenDiaCreateSection}
        id={id}
        refetch={refetch}
      />
      <DialogCreateListeningType
        openDia={openDiaCreateType}
        setOpenDia={setOpenDiaCreateType}
        id={idPassage}
        refetch={refetch}
      />
      <DialogCreateListeningQuestion
        openDia={openDiaCreateQuestion}
        setOpenDia={setOpenDiaCreateQuestion}
        id={idType}
        type={type}
        refetch={refetch}
      />
      <DialogEditType
        openDia={openDiaEditType}
        setOpenDia={setOpenDiaEditType}
        selectedType={selectedType}
        refetch={refetch}
      />
      <DialogEditQuestion
        openDia={openDiaEditQuestion}
        setOpenDia={setOpenDiaEditQuestion}
        questions={selectedQuestion}
        refetch={refetch}
      />
      <DialogDeleteSection
        openDeletePassage={openDiaDeletePassage}
        id={idPassage}
        setOpenDeletePassage={setOpenDiaDeletePassage}
        refetch={refetch}
      />
      <DialogDeleteQuestion
        openDeleteQuestion={openDiaDeleteQuestion}
        id={idQuestion}
        setOpenDeleteQuestion={setOpenDiaDeleteQuestion}
        refetch={refetch}
      />

      <div className="w-9/12 mx-auto">
        {mode === "create" ? <Step step={1} /> : <StepEdit step={1} />}
      </div>

      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            {mode === "create"
              ? "Create Section Detail"
              : "Edit Section Detail"}
          </h1>
          <Button
            className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
            onClick={() => setOpenDiaCreateSection(true)}
          >
            Create New Section
          </Button>
        </div>

        {passages && passages.length > 0 ? (
          passages.map((passage, index) => (
            <Accordion
              type="single"
              collapsible
              className="w-full bg-[#F1FFEF] border-2 border-[#188F09] rounded-lg px-4 mt-4"
              key={passage.id}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex gap-3 items-center font-bold relative">
                  <span>Section {index + 1}:</span>
                  <span>{passage.title}</span>
                  <Button
                    className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold text-red-500"
                    onClick={(e) => handleOpenDiaDeletePassage(passage.id, e)}
                  >
                    <Trash2 />
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end">
                    <Button
                      className="border-2 flex gap-3 border-blue-500 font-bold bg-white text-blue-500 hover:text-white hover:bg-blue-500"
                      onClick={() => handleOpenCreateType(passage.id)}
                    >
                      Create New Type Question
                    </Button>
                  </div>

                  {passage.types && passage.types.length > 0 ? (
                    passage.types.map((type) => {
                      const isBlankType = blankType.includes(
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
                              <span>Type:</span>
                              <span>
                                {questionTypeDisplayNames[type.type] ||
                                  type.type}
                              </span>
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
                                    className="w-full relative flex items-center bg-yellow-200 border-2 border-[#188F09] rounded-lg p-3 mt-4"
                                    key={question.id}
                                  >
                                    <div className="flex gap-4 font-bold text-black pr-20">
                                      <span className="w-24">
                                        Question {index + 1}:
                                      </span>
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
                                      <PopoverContent className="w-40 flex items-center justify-center flex-col gap-3">
                                        <Button
                                          className="w-28 px-2 py-1 gap-4 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
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
          ))
        ) : (
          <div className="text-center text-black">
            There are currently no passages available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningExamManager;
