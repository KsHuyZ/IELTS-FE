import { ReadingAnswer } from "@/types/ExamType/exam";
import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

interface Props {
  answer: ReadingAnswer;
}

const Word: React.FC<Props> = ({ answer }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WORD",
    item: { word: answer.answer },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      className={`p-2 m-2 w-56 rounded-lg hover:border-[#164C7E] border-2 cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {answer.answer}
    </div>
  );
};
export default Word;
