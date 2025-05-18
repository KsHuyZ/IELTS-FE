import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Edit } from "lucide-react";
import DialogCreatePart from "./components/DialogCreatePart";
import DialogEditWriting from "./components/DialogEditWriting";
import { useGetFullExamDetail } from "../CreateReading/hooks/useGetFullExamDetail";
import StepEdit from "../../components/stepEdit";
import Step from "../../components/step";
interface WritingExamManagerProps {
  mode: "create" | "edit";
}
const WritingExamManager: React.FC<WritingExamManagerProps> = ({ mode }) => {
  const nav = useNavigate()
  const { id } = useParams<{ id: string }>();
  const [openDiaCreatePart, setOpenDiaCreatePart] = useState<boolean>(false);
  const [openDiaEditPart, setOpenDiaEditPart] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<{
    id: string;
    content: string;
    image: string;
  } | null>(null);
  const { data, refetch } = useGetFullExamDetail(id ?? "");
  const passages = data?.examPassage;

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const handleOpenEditPart = (
    passage: { id: string; content: string; image: string },
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setSelectedPart(passage);
    setOpenDiaEditPart(true);
    e.stopPropagation();
  };

  return (
    <div className="h-full w-full p-8 space-y-5 relative">
       <ArrowLeft className="absolute top-16 cursor-pointer left-10" onClick={() => nav(-1)}/>
      <DialogCreatePart
        id={id}
        openDia={openDiaCreatePart}
        setOpenDia={setOpenDiaCreatePart}
        refetch={refetch}
      />
      <DialogEditWriting
        openDia={openDiaEditPart}
        setOpenDia={setOpenDiaEditPart}
        refetch={refetch}
        selectedPart={selectedPart}
      />
      <div className="w-9/12 mx-auto">
        {mode === 'edit' ? <StepEdit step={1} /> : <Step step={1} />}
      </div>
      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            Writing Part Manager
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
                  <span>Part {index + 1}:</span> <span>{passage.title}</span>
                  <Button
                    className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-500"
                    onClick={(e) => {
                      handleOpenEditPart(
                        {
                          id: passage.id,
                          content: passage.content,
                          image: passage.image,
                        },
                        e
                      );
                    }}
                  >
                    <Edit />
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: passage.content || "",
                    }}
                  />
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

export default WritingExamManager;