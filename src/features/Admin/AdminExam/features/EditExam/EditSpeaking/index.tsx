import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetFullExamDetail } from "../../CreateReading/hooks/useGetFullExamDetail";
import Step from "../../CreateReading/components/step";
import { Edit, Trash2 } from "lucide-react";
import DialogDeletePart from "./components/DialogDeletePart";
import DialogEditQuestion from "./components/DialogEditQuestion";

const EditSpeakingExam = () => {
  const { id } = useParams<{ id: string }>();
  const [openDiaDeletePart, setOpenDiaDeletePart] = useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [selecteQuestion, setSelectedQuestion] = useState<{
    idQuestion: string;
    partId: string;
    question: string;
  } | null>(null);
  const { data, refetch } = useGetFullExamDetail(id ?? "");
  const [idPart, setIdPart] = useState("");
  const passages = data?.examPassage;
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  const handleOpenDiaDeletePassage = (
    id: string,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setOpenDiaDeletePart(true);
    setIdPart(id);
    e.stopPropagation();
  };
  const handleOpenEditPart = (
    question: { idQuestion: string; partId: string; question: string },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedQuestion(question);
    setOpenDiaEditQuestion(true);
    e.stopPropagation();
  };
  return (
    <div className="h-full w-full p-8 space-y-5">
      <DialogDeletePart
        openDeletePassage={openDiaDeletePart}
        id={idPart}
        setOpenDeletePassage={setOpenDiaDeletePart}
        refetch={refetch}
      />
      <DialogEditQuestion
        openDia={openDiaEditQuestion}
        setOpenDia={setOpenDiaEditQuestion}
        questions={selecteQuestion}
        refetch={refetch}
      />
      <div className="w-9/12 mx-auto">
        <Step step={1} />
      </div>
      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            Edit Part Detail
          </h1>
        </div>
        {passages && passages.length > 0 ? (
          passages.map((passage, index) => (
            <Accordion
              type="single"
              collapsible
              className="w-full bg-[#F1FFEF] border-2 border-[#188F09] rounded-lg px-4 mt-4"
            >
              <AccordionItem value="item-1" key={passage.id}>
                <AccordionTrigger className="flex gap-3 items-center font-bold relative">
                  <span>Part {index + 1}:</span> <span>{passage.title}</span>
                  <Button
                    className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-red-400 font-semibold text-red-500"
                    onClick={(e) => {
                      handleOpenDiaDeletePassage(passage.id, e);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  {passage.questions && passage.questions.length > 0 ? (
                    passage.questions.map((question, index) => (
                      <div className="w-full flex gap-3 justify-between items-center font-bold text-black bg-blue-200 border-2 border-[#188F09] rounded-lg p-3 mt-4">
                        <span>Question {index + 1}:</span>
                        <audio
                          controls
                          src={question.question}
                          className="w-9/12"
                        />

                        <Button
                          className="w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-600"
                          onClick={(e) => {
                            handleOpenEditPart(
                              {
                                idQuestion: question.id,
                                partId: passage.id,
                                question: question.question,
                              },
                              e
                            );
                          }}
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

export default EditSpeakingExam;
