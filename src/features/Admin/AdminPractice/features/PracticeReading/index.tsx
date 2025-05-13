import { Button } from "@/components/ui/button";
import StepPractice from "../../components/stepPractice";
import { useState } from "react";
import DialogPracticeCreatePassage from "./components/DialogPracticeCreatePassage";
import { useParams } from "react-router-dom";
import { useGetPracticeDetail } from "../../hooks/useGetPracticeDetail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DialogCreatePracticeType from "./components/DialogCreatePracticeType";
import { EQuestionType } from "@/types/ExamType/exam";
import DialogCreateReadingPracticeQuestion from "./components/DialogCreateReadingPracticeQuestion";
import { IPracticeDetail } from "@/types/AdminType/exam";
const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.TextBox]: "Text Box",
  [EQuestionType.MultipleChoice]: "Multiple Choice",
  [EQuestionType.SingleChoice]: "Single Choice",
  [EQuestionType.TexBoxPosition]: "Text Box Position",
  [EQuestionType.BlankPassageDrag]: "Blank Passage Drag",
  [EQuestionType.BlankPassageTextbox]: "Blank Passage Textbox",
  [EQuestionType.BlankPassageImageTextbox]: "Blank Passage Image Textbox",
};
const CreatePracticeReading = () => {
  const [openDiaCreatePassage, setOpenDiaCreatePassage] =
    useState<boolean>(false);
  const [openDiaCreateType, setOpenDiaCreateType] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const [openDiaCreateQuestion, setOpenDiaCreateQuestion] =
    useState<boolean>(false);
  const [idType, setIdType] = useState("");
  const [type, setType] = useState("");
  const handleOpenCreateQuestion = (idType: string, type: string) => {
    setIdType(idType);
    setType(type);
    setOpenDiaCreateQuestion(true);
  };
  const [idPassage, setIdPassage] = useState("");
  const handleOpenCreateType = (idPassage: string) => {
    setIdPassage(idPassage);
    setOpenDiaCreateType(true);
  };
  const { data, refetch } = useGetPracticeDetail(id ?? "");
  const practiceDetail = data as IPracticeDetail;
  return (
    <div className="h-full w-full p-8 space-y-5">
      <DialogPracticeCreatePassage
        openDia={openDiaCreatePassage}
        setOpenDia={setOpenDiaCreatePassage}
        id={id}
        refetch={refetch}
      />
      <DialogCreatePracticeType
        openDia={openDiaCreateType}
        setOpenDia={setOpenDiaCreateType}
        id={idPassage}
        refetch={refetch}
      />
      <DialogCreateReadingPracticeQuestion
        openDia={openDiaCreateQuestion}
        setOpenDia={setOpenDiaCreateQuestion}
        id={idType}
        type={type}
        refetch={refetch}
      />
      <div className="w-9/12 mx-auto">
        <StepPractice step={1} />
      </div>
      <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
        <div className="flex justify-between items-center">
          <h1 className="text-center mb-4 text-xl font-bold">
            Create Reading Practice Detail
          </h1>
          {!practiceDetail && (
            <Button
              className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
              onClick={() => setOpenDiaCreatePassage(true)}
            >
              Create Passage
            </Button>
          )}
        </div>
        {practiceDetail ? (
          <Accordion
            type="single"
            collapsible
            className="w-full bg-[#F1FFEF] border-2 border-[#188F09] rounded-lg px-4 mt-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex gap-3 items-center font-bold">
                Passage: <span>{practiceDetail.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex justify-end">
                  <Button
                    className="border-2 flex gap-3 border-blue-500 font-bold bg-white text-blue-500 hover:text-white hover:bg-blue-500"
                    onClick={() => handleOpenCreateType(practiceDetail.id)}
                  >
                    Create New Type Question
                  </Button>
                </div>

                {practiceDetail.types && practiceDetail.types.length > 0 ? (
                  practiceDetail.types.map((type) => (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full bg-[#F1FFEF] border-2 border-[#164C7E] rounded-lg px-4 mt-4"
                    >
                      <AccordionItem value="item-1" key={type.id}>
                        <AccordionTrigger className="flex gap-3 items-center font-bold">
                          <span>Type:</span>{" "}
                          <span>
                            {questionTypeDisplayNames[type.type] || type.type}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
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
                              <div className="w-full flex gap-4 font-bold text-black items-center bg-yellow-200 border-2 border-[#188F09] rounded-lg p-3 mt-4">
                                <span>Question {index + 1}:</span>{" "}
                                <span>{question.question}</span>
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
                    There are currently no Type Question available.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="text-center text-black">
            There are currently no passages available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePracticeReading;
