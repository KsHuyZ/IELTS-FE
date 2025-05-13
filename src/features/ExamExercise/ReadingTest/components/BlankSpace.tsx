import React from "react";
import { useDrop } from "react-dnd";

interface Props {
  index: number;
  idx: number
  onDrop: (idx: number ,word: string, index: number) => void;
  word: string;
}
interface DragItem {
  word: string;
}

const BlankSpace: React.FC<Props> = ({idx ,index, onDrop, word }) => {
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
      className={`p-2 m-2 border-2 border-dashed min-w-fit w-24 line-clamp-1 truncate h-10 flex items-center justify-center ${
        isOver ? "bg-gray-300" : "bg-white"
      }`}
    >
      {word || ""}
    </span>
  );
};

export default BlankSpace;
