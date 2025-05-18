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
import { useGetFullPracticeDetailAdmin } from "../../hooks/useGetPracticeDetail";
import DialogCreatePracticePart from "./components/DialogCreatePart";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DialogEditPracticePart from "./components/DialogEditPart";

const CreatePracticeWriting = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [openDiaCreatePart, setOpenDiaCreatePart] = useState<boolean>(false);
  const [openDiaEditPart, setOpenDiaEditPart] = useState<boolean>(false);
  const { data: practiceDetail, refetch } = useGetFullPracticeDetailAdmin(
    id ?? ""
  );
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
      <DialogCreatePracticePart
        id={id}
        openDia={openDiaCreatePart}
        setOpenDia={setOpenDiaCreatePart}
        refetch={refetch}
      />
      <DialogEditPracticePart
        id={practiceDetail?.practiceData?.id}
        content={practiceDetail?.practiceData?.content}
        image={practiceDetail?.practiceData?.image}
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
          {!practiceDetail?.practiceData?.content && (
            <Button
              className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
              onClick={() => setOpenDiaCreatePart(true)}
            >
              Create New Part
            </Button>
          )}
        </div>
        {practiceDetail?.practiceData?.content ? (
          <Card className="w-full h-fit mt-5">
            <CardHeader>
              <CardTitle className="text-center font-bold relative p-3">
                {practiceDetail.practiceData.content && (
                  <Button
                    className="absolute top-0 right-0 w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
                    onClick={() => setOpenDiaEditPart(true)}
                  >
                    Edit Part
                  </Button>
                )}
              </CardTitle>
              <CardContent className="flex flex-col items-center pt-5">
                {practiceDetail?.practiceData.content ? (
                  <>
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
                  "There are currently no Part available."
                )}
              </CardContent>
            </CardHeader>
          </Card>
        ) : (
          <div className="text-center text-black">
            There are currently no Writing Practice available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePracticeWriting;
