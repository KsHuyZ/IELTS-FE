import { ReadingAnswer } from "@/types/PracticeType/readingPractice";
import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

interface Props {
  answer: ReadingAnswer;
}

const WordPractice: React.FC<Props> = ({ answer }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WORD",
    item: { word: answer.answer },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const scrollRef = useRef<number | null>(null);
  const isElementInViewport = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
  const smoothScrollTo = (element: HTMLElement, duration: number = 300) => {
    const start = window.scrollY;
    const targetPosition =
      element.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight / 2;
    const startTime = performance.now();

    const scroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress * (2 - progress); // Ease-in-out

      window.scrollTo(0, start + (targetPosition - start) * ease);

      if (timeElapsed < duration) {
        scrollRef.current = requestAnimationFrame(scroll);
      }
    };

    if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    scrollRef.current = requestAnimationFrame(scroll);
  };
  useEffect(() => {
    if (isDragging) {
      // Tìm ô BlankSpace rỗng đầu tiên
      const blankSpaces = document.querySelectorAll(
        ".blank-space[data-is-empty='true']"
      );
      const emptyBlankSpace = blankSpaces[0] as HTMLElement;

      if (emptyBlankSpace && !isElementInViewport(emptyBlankSpace)) {
        // Sử dụng cuộn mượt tùy chỉnh
        smoothScrollTo(emptyBlankSpace);
      }
    }

    // Cleanup
    return () => {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    };
  }, [isDragging]);
  return (
    <div
      ref={drag}
      className={`p-2 m-2 w-56 rounded-lg hover:border-[#164C7E] hover:border border cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {answer.answer}
    </div>
  );
};
export default WordPractice;
