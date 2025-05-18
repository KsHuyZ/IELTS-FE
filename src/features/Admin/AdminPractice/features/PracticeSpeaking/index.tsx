import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StepPractice from "../../components/stepPractice";
import { useGetPracticeDetail } from "../../hooks/useGetPracticeDetail";
import DialogCreateSpeakingPart from "./components/DialogCreateSpeakingPart";
import { IPracticeDetail } from "@/types/AdminType/exam";
import { ArrowLeft, Edit } from "lucide-react";
import DialogEditSpeakingPart from "./components/DialogEditSpeakingPart";

const CreatePracticeSpeaking = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [selectedPart, setSelectedPart] = useState<{
    id: string;
    question: string;
    audio: string;
  } | null>(null);
  const [openDiaCreatePart, setOpenDiaCreatePart] = useState<boolean>(false);
  const [openDiaEditPart, setOpenDiaEditPart] = useState<boolean>(false);
  const { data, refetch } = useGetPracticeDetail(id ?? "");
  const practiceDetail = data as IPracticeDetail[];
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  const handleOpenEditPart = (
    part: {
      id: string;
      question: string;
      audio: string;
    },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedPart(part);
    setOpenDiaEditPart(true);
    e.stopPropagation();
  };
  return (
    <div className="h-full w-full p-8 space-y-5 relative">
      <ArrowLeft
        className="absolute top-16 cursor-pointer left-10"
        onClick={() => nav(-1)}
      />
      <DialogCreateSpeakingPart
        id={id}
        openDia={openDiaCreatePart}
        setOpenDia={setOpenDiaCreatePart}
        refetch={refetch}
      />
      <DialogEditSpeakingPart
        selectedPart={selectedPart}
        openDia={openDiaEditPart}
        setOpenDia={setOpenDiaEditPart}
        refetch={refetch}
      />
      <div className="w-9/12 mx-auto">
        <StepPractice step={1} />
      </div>
      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            Create Part Detail
          </h1>
          {practiceDetail && practiceDetail.length < 3 && (
            <Button
              className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
              onClick={() => setOpenDiaCreatePart(true)}
            >
              Create New Part
            </Button>
          )}
        </div>
        {practiceDetail && practiceDetail.length > 0 ? (
          practiceDetail.map((question, index) => (
            <Accordion
              type="single"
              collapsible
              className="w-full bg-[#F1FFEF] border-2 border-[#188F09] rounded-lg px-4 mt-4"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex gap-3 items-center font-bold relative">
                  <span>Question: {index + 1}</span>{" "}
                  <span>{question.question}</span>
                  <Button
                    className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-500"
                    onClick={(e) =>
                      handleOpenEditPart(
                        {
                          id: question.id,
                          question: question.question,
                          audio: question.audio,
                        },
                        e
                      )
                    }
                  >
                    <Edit />
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  <audio controls className="w-full">
                    <source src={question.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        ) : (
          <div className="text-center text-black">
            There are currently no Speaking Question available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePracticeSpeaking;
