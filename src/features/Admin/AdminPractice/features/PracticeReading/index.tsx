import { useParams } from "react-router-dom";
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
import { Edit } from "lucide-react";
import StepPractice from "../../components/stepPractice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DialogPracticeCreatePassage from "./components/DialogPracticeCreatePassage";
import DialogCreatePracticeType from "./components/DialogCreatePracticeType";
import DialogCreateReadingPracticeQuestion from "./components/DialogCreateReadingPracticeQuestion";
import { ReadingAnswer } from "@/types/PracticeType/readingPractice";
import { IPracticeDetail } from "@/types/AdminType/exam";
import { useGetFullPracticeDetailAdmin } from "../../hooks/useGetPracticeDetail";
import DialogEditPassage from "./components/DialogEditPassage";
import DialogEditType from "./components/DialogEditType";
import DialogEditQuestion from "./components/DialogEditQuestion";
import StepEditPractice from "../../components/stepEditPractice";

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
interface ReadingPracticeManagerProps {
  mode: "create" | "edit";
}

const ReadingPracticeManager: React.FC<ReadingPracticeManagerProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const [openDiaCreatePassage, setOpenDiaCreatePassage] = useState<boolean>(false);
  const [openDiaEditPassage, setOpenDiaEditPassage] = useState<boolean>(false);
  const [openDiaCreateType, setOpenDiaCreateType] = useState<boolean>(false);
  const [openDiaEditType, setOpenDiaEditType] = useState<boolean>(false);
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] = useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] = useState<boolean>(false);
  const [idPassage, setIdPassage] = useState("");
  const [idType, setIdType] = useState("");
  const [type, setType] = useState("");
  const [selectedType, setSelectedType] = useState<{
    id: string;
    content: string;
    type: EQuestionType;
    image: string;
  } | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string;
    question: string;
    answers: ReadingAnswer[];
    type: EQuestionType;
  } | null>(null);

  const { data: practiceDetail, refetch } = useGetFullPracticeDetailAdmin(id ?? "");

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleOpenCreateType = (passageId: string) => {
    setIdPassage(passageId);
    setOpenDiaCreateType(true);
  };

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
      image: string;
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

  return (
    <div className="h-full w-full p-8 space-y-5">
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
        image={practiceDetail?.image}
        title={practiceDetail?.practiceData?.title}
        refetch={refetch}
      />
      <DialogCreatePracticeType
        openDia={openDiaCreateType}
        setOpenDia={setOpenDiaCreateType}
        id={idPassage}
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
      <div className="w-9/12 mx-auto">
        {mode === "create" ? <StepEditPractice step={1} /> : <StepPractice step={1} />}
      </div>
      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            Reading Practice Manager
          </h1>
          {!practiceDetail?.practiceData && (
            <Button
              className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
              onClick={() => setOpenDiaCreatePassage(true)}
            >
              Create Passage
            </Button>
          )}
        </div>
        {practiceDetail?.practiceData ? (
          <Card className="w-full h-fit">
            <CardHeader>
              <CardTitle className="text-center font-bold relative p-3">
                {practiceDetail.practiceData.title}
                <Button
                  className="absolute top-0 right-0 w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
                  onClick={() => setOpenDiaEditPassage(true)}
                >
                  Edit Passage
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div
                dangerouslySetInnerHTML={{
                  __html: practiceDetail.practiceData.content || "",
                }}
              />
              <img
                src={practiceDetail.image}
                alt="Image"
                className="object-contain"
              />
              <div className="flex justify-end w-full mt-4">
                <Button
                  className="border-2 flex gap-3 border-blue-500 font-bold bg-white text-blue-500 hover:text-white hover:bg-blue-500"
                  onClick={() => handleOpenCreateType(practiceDetail.id)}
                >
                  Create New Type Question
                </Button>
              </div>
              {practiceDetail.practiceData.types && practiceDetail.practiceData.types.length > 0 ? (
                practiceDetail.practiceData.types.map((type) => {
                  const isContentEnabled =
                    type.type &&
                    contentEnabledTypes.includes(type.type as EQuestionType);
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
                          {isContentEnabled && (
                            <Button
                              className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-500"
                              onClick={(e) => handleOpenEditType(
                                {
                                  id: type.id,
                                  content: type.content,
                                  type: type.type,
                                  image: type.image,
                                },
                                e
                              )}
                            >
                              <Edit />
                            </Button>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex justify-end">
                            <Button
                              className="border-2 flex gap-3 border-[#188F09] font-bold bg-white text-[#188F09] hover:text-white hover:bg-[#188F09]"
                              onClick={() => handleOpenCreateQuestion(type.id, type.type)}
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
                                      onClick={(e) => handleOpenEditQuestion(
                                        {
                                          id: question.id,
                                          question: question.question,
                                          answers: question.answers,
                                          type: type.type,
                                        },
                                        e
                                      )}
                                    >
                                      Edit Question
                                    </Button>
                                    <Button
                                      className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold border-red-500 border-2 text-red-500"
                                      disabled
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