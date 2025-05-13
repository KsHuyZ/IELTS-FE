import React from "react";
import { useDrop } from "react-dnd";

interface Props {
  index: number;
  idx: number;
  onDrop: (idx: number, word: string, index: number) => void;
  word: string;
}
interface DragItem {
  word: string;
}

const BlankPracticeSpace: React.FC<Props> = ({ idx, index, onDrop, word }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "WORD",
    drop: (item: DragItem) => onDrop(idx, item.word, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <span
      ref={drop}
      className={`p-2 m-2 border-2 border-dashed w-24 truncate min-w-fit h-10 flex items-center justify-center ${
        isOver ? "bg-gray-300" : "bg-white"
      } ${word ? "" : "text-gray-400"}`}
    >
      {word || "Drag here"}
    </span>
  );
};

export default BlankPracticeSpace;
