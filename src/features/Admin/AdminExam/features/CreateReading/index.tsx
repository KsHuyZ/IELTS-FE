import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EQuestionType, ReadingAnswer } from "@/types/ExamType/exam";
import { useGetFullExamDetail } from "./hooks/useGetFullExamDetail";
import Step from "../../components/step";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit } from "lucide-react";
import DialogCreatePassage from "./components/DialogCreatePassage";
import DialogCreateType from "./components/DialogCreateType";
import DialogCreateQuestion from "./components/DialogCreateQuestion";
import DialogEditPassage from "./components/DialogEditPassage";
import DialogEditType from "./components/DialogEditType";
import DialogEditQuestion from "./components/DialogEditQuestion";
import DialogDeletePassage from "./components/DialogDeletePassage";
import DialogDeleteQuestion from "./components/DialogDeleteQuestion";
import StepEdit from "../../components/stepEdit";

const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.TextBox]: "Text Box",
  [EQuestionType.MultipleChoice]: "Multiple Choice",
  [EQuestionType.SingleChoice]: "Single Choice",
  [EQuestionType.TexBoxPosition]: "Text Box Position",
  [EQuestionType.BlankPassageDrag]: "Blank Passage Drag",
  [EQuestionType.BlankPassageTextbox]: "Blank Passage Textbox",
  [EQuestionType.BlankPassageImageTextbox]: "Blank Passage Image Textbox",
};

const contentEnabledTypes = [
  EQuestionType.BlankPassageDrag,
  EQuestionType.BlankPassageTextbox,
  EQuestionType.BlankPassageImageTextbox,
];
const blankType = [
  EQuestionType.BlankPassageDrag,
  EQuestionType.BlankPassageTextbox,
];

interface ReadingExamManagerProps {
  mode: "create" | "edit";
}

const ReadingExamManager: React.FC<ReadingExamManagerProps> = ({ mode }) => {
  const [openDiaCreatePassage, setOpenDiaCreatePassage] =
    useState<boolean>(false);
  const [openDiaCreateType, setOpenDiaCreateType] = useState<boolean>(false);
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] =
    useState<boolean>(false);
  const [openDiaDeletePassage, setOpenDiaDeletePassage] =
    useState<boolean>(false);
  const [openDiaDeleteQuestion, setOpenDiaDeleteQuestion] =
    useState<boolean>(false);
  const [openDiaEditPassage, setOpenDiaEditPassage] = useState<boolean>(false);
  const [openDiaEditType, setOpenDiaEditType] = useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [idPassage, setIdPassage] = useState("");
  const [idType, setIdType] = useState("");
  const [idQuestion, setIdQuestion] = useState("");
  const [type, setType] = useState("");
  const [selectedPassage, setSelectedPassage] = useState<{
    id: string;
    title: string;
    passage: string;
  } | null>(null);
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

  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useGetFullExamDetail(id ?? "");

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

  const handleOpenEditPassage = (
    passage: { id: string; title: string; passage: string },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedPassage(passage);
    setOpenDiaEditPassage(true);
    e.stopPropagation();
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
  const countBlanks = (content: string): number => {
    const regex = /\{blank\}/g;
    return (content.match(regex) || []).length;
  };
  const passages = data?.examPassage;

  return (
    <div className="h-full w-full p-8 space-y-5">
      <DialogCreatePassage
        openDia={openDiaCreatePassage}
        setOpenDia={setOpenDiaCreatePassage}
        id={id}
        refetch={refetch}
      />
      <DialogCreateType
        openDia={openDiaCreateType}
        setOpenDia={setOpenDiaCreateType}
        id={idPassage}
        refetch={refetch}
      />
      <DialogCreateQuestion
        openDia={openDiaCreateQuestion}
        setOpenDia={setOpenDiaCreateQuestion}
        id={idType}
        type={type}
        refetch={refetch}
      />
      <DialogEditPassage
        openDia={openDiaEditPassage}
        setOpenDia={setOpenDiaEditPassage}
        passageData={selectedPassage}
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
      <DialogDeletePassage
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
              ? "Create Passage Detail"
              : "Edit Passage Detail"}
          </h1>
          <Button
            className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
            onClick={() => setOpenDiaCreatePassage(true)}
          >
            Create New Passage
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
                  <span>Passage {index + 1}:</span>
                  <span>{passage.title}</span>
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
                          handleOpenEditPassage(
                            {
                              id: passage.id,
                              title: passage.title,
                              passage: passage.passage,
                            },
                            e
                          )
                        }
                      >
                        Edit Passage
                      </Button>
                      <Button
                        className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold border-red-500 border-2 text-red-500"
                        onClick={(e) =>
                          handleOpenDiaDeletePassage(passage.id, e)
                        }
                      >
                        Delete Passage
                      </Button>
                    </PopoverContent>
                  </Popover>
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
                                      image: type.image,
                                      limitAnswer: type.limitAnswer,
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
                                type.questions.map((question, index) => {
                                  return (
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
                                  );
                                })
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

export default ReadingExamManager;
