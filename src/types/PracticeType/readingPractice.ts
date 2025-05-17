import { EQuestionType } from "../ExamType/exam";
export interface PracticeReading {
  practiceReading: {
    id: string;
    content: string;
    image: string;
    practice: {
      id: string;
    };
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  types: TypesReading[];
}
export interface TypesReading {
  id: string;
  examPassage: {
    id: string;
  };
  type: EQuestionType;
  limitAnswer: number;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  questions: ReadingQuestion[];
}
export interface ReadingQuestion {
  id: string;
  type: {
    id: string;
  };
  question: string;
  createdAt: string;
  updatedAt: string;
  answers: ReadingAnswer[];
  answer: string;
}
export interface ReadingAnswer {
  id: string;
  question: {
    id: string;
  };
  answer: string;
  isCorrect: boolean;
}
