import { Button } from "@/components/ui/button";
import Step from "../../components/step";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetFullExamDetail } from "../CreateReading/hooks/useGetFullExamDetail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DialogCreatePart from "./components/DialogCreatePart";
import DialogCreateQuestion from "./components/DialogCreateQuestion";
import DialogDeletePart from "./components/DialogDeletePart";
import DialogEditQuestion from "./components/DialogEditQuestion";
import { Edit, Trash2 } from "lucide-react";

interface SpeakingExamManagerProps {
  mode: "create" | "edit";
}

const SpeakingExamManager: React.FC<SpeakingExamManagerProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const [openDiaCreatePart, setOpenDiaCreatePart] = useState<boolean>(false);
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] =
    useState<boolean>(false);
  const [openDiaDeletePart, setOpenDiaDeletePart] = useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [idPart, setIdPart] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<{
    idQuestion: string;
    partId: string;
    question: string;
  } | null>(null);
  const { data, refetch } = useGetFullExamDetail(id ?? "");

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleOpenCreateQuestion = (idPart: string) => {
    setIdPart(idPart);
    setOpenDiaCreateQuestion(true);
  };

  const handleOpenDiaDeletePart = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenDiaDeletePart(true);
    setIdPart(id);
    e.stopPropagation();
  };

  const handleOpenEditQuestion = (
    question: { idQuestion: string; partId: string; question: string },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedQuestion(question);
    setOpenDiaEditQuestion(true);
    e.stopPropagation();
  };

  const passages = data?.examPassage;

  return (
    <div className="h-full w-full p-8 space-y-5">
      <DialogCreatePart
        id={id}
        openDia={openDiaCreatePart}
        setOpenDia={setOpenDiaCreatePart}
        refetch={refetch}
      />
      <DialogCreateQuestion
        id={idPart}
        openDia={openDiaCreateQuestion}
        setOpenDia={setOpenDiaCreateQuestion}
        refetch={refetch}
      />
      <DialogDeletePart
        openDeletePassage={openDiaDeletePart}
        id={idPart}
        setOpenDeletePassage={setOpenDiaDeletePart}
        refetch={refetch}
      />
      <DialogEditQuestion
        openDia={openDiaEditQuestion}
        setOpenDia={setOpenDiaEditQuestion}
        questions={selectedQuestion}
        refetch={refetch}
      />

      <div className="w-9/12 mx-auto">
        <Step step={1} />
      </div>

      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            {mode === "create" ? "Create Part Detail" : "Edit Part Detail"}
          </h1>
          <Button
            className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
            onClick={() => setOpenDiaCreatePart(true)}
          >
            Create New Part
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
                  <span>Part {index + 1}:</span>
                  <span>{passage.title}</span>
                  <Button
                    className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-red-400 font-semibold text-red-500"
                    onClick={(e) => handleOpenDiaDeletePart(passage.id, e)}
                  >
                    <Trash2 />
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  {passage.questions.length < 3 && (
                    <div className="flex justify-end">
                      <Button
                        className="border-2 flex gap-3 border-[#188F09] font-bold bg-white text-[#188F09] hover:text-white hover:bg-[#188F09]"
                        onClick={() => handleOpenCreateQuestion(passage.id)}
                      >
                        Create New Question
                      </Button>
                    </div>
                  )}
                  {passage.questions && passage.questions.length > 0 ? (
                    passage.questions.map((question, index) => (
                      <div
                        className="w-full flex gap-3 justify-between items-center font-bold text-black bg-blue-200 border-2 border-[#188F09] rounded-lg p-3 mt-4"
                        key={question.id}
                      >
                        <span>Question {index + 1}:</span>
                        <audio
                          controls
                          src={question.question}
                          className="w-9/12"
                        />
                        <Button
                          className="w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-600"
                          onClick={(e) =>
                            handleOpenEditQuestion(
                              {
                                idQuestion: question.id,
                                partId: passage.id,
                                question: question.question,
                              },
                              e
                            )
                          }
                        >
                          <Edit />
                        </Button>
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
          ))
        ) : (
          <div className="text-center text-black">
            There are currently no Part available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakingExamManager;
