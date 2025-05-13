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
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit } from "lucide-react";
import { useGetFullPractice } from "../../../hooks/useGetFullPractices";
import { useGetPracticeDetail } from "../../../hooks/useGetPracticeDetail";
import StepEditPractice from "../components/stepEditPractice";
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
const contentEnabledTypes = [
  EQuestionType.BlankPassageDrag,
  EQuestionType.BlankPassageTextbox,
  EQuestionType.BlankPassageImageTextbox,
];
const EditPracticeReading = () => {
  const [openDiaDeletePassage, setOpenDiaDeletePassage] =
    useState<boolean>(false);
  const [openDiaDeleteQuestion, setOpenDiaDeleteQuestion] =
    useState<boolean>(false);
  const [openDiaEditPassage, setOpenDiaEditPassage] = useState<boolean>(false);
  const [selectedPassage, setSelectedPassage] = useState<{
    id: string;
    title: string;
    passage: string;
  } | null>(null);
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
  const [openDiaEditType, setOpenDiaEditType] = useState<boolean>(false);
  const [openDiaEditQuestion, setOpenDiaEditQuestion] =
    useState<boolean>(false);
  const [idPassage, setIdPassage] = useState("");
  const [idQuestion, setIdQuestion] = useState("");
  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useGetPracticeDetail(id ?? "");
  const practiceDetail = data as IPracticeDetail;
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
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

  return (
    // <div className="h-full w-full p-8 space-y-5">
    //   <DialogEditPassage
    //     openDia={openDiaEditPassage}
    //     setOpenDia={setOpenDiaEditPassage}
    //     passageData={selectedPassage}
    //     refetch={refetch}
    //   />
    //   <DialogEditType
    //     openDia={openDiaEditType}
    //     setOpenDia={setOpenDiaEditType}
    //     selectedType={selectedType}
    //     refetch={refetch}
    //   />
    //   <DialogEditQuestion
    //     openDia={openDiaEditQuestion}
    //     setOpenDia={setOpenDiaEditQuestion}
    //     questions={selectedQuestion}
    //     refetch={refetch}
    //   />
    //   <DialogDeletePassage
    //     openDeletePassage={openDiaDeletePassage}
    //     id={idPassage}
    //     setOpenDeletePassage={setOpenDiaDeletePassage}
    //     refetch={refetch}
    //   />
    //   <DialogDeleteQuestion
    //     openDeleteQuestion={openDiaDeleteQuestion}
    //     id={idQuestion}
    //     setOpenDeleteQuestion={setOpenDiaDeleteQuestion}
    //     refetch={refetch}
    //   />
    //   <div className="w-9/12 mx-auto">
    //     <StepEditPractice step={1} />
    //   </div>
    //   <div className="w-10/12 mx-auto bg-white h-[70vh] overflow-y-auto rounded-lg shadow-md p-10">
    //     <div className="flex justify-between items-center">
    //       <h1 className="text-center mb-4 text-xl font-bold">
    //         Edit Passage Detail
    //       </h1>
    //     </div>
    //     {passages && passages.length > 0 ? (
    //       passages.map((passage, index) => (
    //         <Accordion
    //           type="single"
    //           collapsible
    //           className="w-full bg-[#F1FFEF] border-2 border-[#188F09] rounded-lg px-4 mt-4"
    //         >
    //           <AccordionItem value="item-1" key={passage.id}>
    //             <AccordionTrigger className="flex gap-3 items-center font-bold relative">
    //               <span>Passage {index + 1}:</span> <span>{passage.title}</span>{" "}
    //               <Popover>
    //                 <PopoverTrigger asChild>
    //                   <Button
    //                     className="absolute right-10 bg-transparent hover:bg-black/10 rounded-full p-3"
    //                     onClick={(e) => e.stopPropagation()}
    //                   >
    //                     <HiOutlineDotsVertical className="size-5" />
    //                   </Button>
    //                 </PopoverTrigger>
    //                 <PopoverContent className="w-40 flex items-center justify-center flex-col gap-5">
    //                   <Button
    //                     className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
    //                     onClick={(e) => {
    //                       handleOpenEditPassage(
    //                         {
    //                           id: passage.id,
    //                           title: passage.title,
    //                           passage: passage.passage,
    //                         },
    //                         e
    //                       );
    //                     }}
    //                   >
    //                     Edit Passage
    //                   </Button>
    //                   <Button
    //                     className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold border-red-500 border-2 text-red-500"
    //                     onClick={(e) => {
    //                       handleOpenDiaDeletePassage(passage.id, e);
    //                     }}
    //                   >
    //                     Delete Passage
    //                   </Button>
    //                 </PopoverContent>
    //               </Popover>
    //             </AccordionTrigger>
    //             <AccordionContent>
    //               {passage.types && passage.types.length > 0 ? (
    //                 passage.types.map((type) => {
    //                   const isContentEnabled =
    //                     type.type &&
    //                     contentEnabledTypes.includes(
    //                       type.type as EQuestionType
    //                     );
    //                   return (
    //                     <Accordion
    //                       type="single"
    //                       collapsible
    //                       className="w-full bg-blue-200 border-2 border-[#164C7E] rounded-lg px-4 mt-4"
    //                     >
    //                       <AccordionItem value="item-1" key={type.id}>
    //                         <AccordionTrigger className="flex gap-3 items-center font-bold relative">
    //                           <span>Type:</span>{" "}
    //                           <span>
    //                             {questionTypeDisplayNames[type.type] ||
    //                               type.type}
    //                           </span>
    //                           {isContentEnabled && (
    //                             <Button
    //                               className="absolute right-10 w-10 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-transparent hover:text-yellow-400 font-semibold text-yellow-500"
    //                               onClick={(e) => {
    //                                 handleOpenEditType(
    //                                   {
    //                                     id: type.id,
    //                                     content: type.content,
    //                                     type: type.type,
    //                                     image: type.image,
    //                                   },
    //                                   e
    //                                 );
    //                               }}
    //                             >
    //                               <Edit />
    //                             </Button>
    //                           )}
    //                         </AccordionTrigger>
    //                         <AccordionContent>
    //                           {type.questions && type.questions.length > 0 ? (
    //                             type.questions.map((question, index) => (
    //                               <div className="w-full justify-between relative flex items-center bg-yellow-200 border-2 border-[#188F09] rounded-lg p-3 mt-4">
    //                                 <div className="flex gap-4 font-bold text-black">
    //                                   <span>Question {index + 1}:</span>
    //                                   <span>{question.question}</span>
    //                                 </div>
    //                                 <Popover>
    //                                   <PopoverTrigger asChild>
    //                                     <Button
    //                                       className="absolute right-10 bg-transparent hover:bg-black/10 rounded-full p-3"
    //                                       onClick={(e) => e.stopPropagation()}
    //                                     >
    //                                       <HiOutlineDotsVertical className="size-5" />
    //                                     </Button>
    //                                   </PopoverTrigger>
    //                                   <PopoverContent className="w-40 flex items-center justify-center flex-col gap-5">
    //                                     <Button
    //                                       className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-yellow-500 hover:text-white font-semibold border-yellow-500 border-2 text-yellow-500"
    //                                       onClick={(e) => {
    //                                         handleOpenEditQuestion(
    //                                           {
    //                                             id: question.id,
    //                                             question: question.question,
    //                                             answers: question.answers,
    //                                             type: type.type,
    //                                           },
    //                                           e
    //                                         );
    //                                       }}
    //                                     >
    //                                       Edit Question
    //                                     </Button>
    //                                     <Button
    //                                       className="w-28 px-2 py-1 line-clamp-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold border-red-500 border-2 text-red-500"
    //                                       onClick={(e) => {
    //                                         handleOpenDiaDeleteQuestion(
    //                                           question.id,
    //                                           e
    //                                         );
    //                                       }}
    //                                     >
    //                                       Delete Question
    //                                     </Button>
    //                                   </PopoverContent>
    //                                 </Popover>
    //                               </div>
    //                             ))
    //                           ) : (
    //                             <div className="text-center text-black">
    //                               There are currently no Question available.
    //                             </div>
    //                           )}
    //                         </AccordionContent>
    //                       </AccordionItem>
    //                     </Accordion>
    //                   );
    //                 })
    //               ) : (
    //                 <div className="text-center text-black">
    //                   There are currently no Type Question available.
    //                 </div>
    //               )}
    //             </AccordionContent>
    //           </AccordionItem>
    //         </Accordion>
    //       ))
    //     ) : (
    //       <div className="text-center text-black">
    //         There are currently no passages available.
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div>oke</div>
  );
};

export default EditPracticeReading;
