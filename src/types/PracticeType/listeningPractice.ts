import { EQuestionType } from "../ExamType/exam";
export interface PracticeListening {
   practiceListen: {
      id: string;
      audio: string;
      practice: {
        id: string;
      };
      createdAt: string;
      updatedAt: string;
    };
    types: TypesListening[];
}
export interface TypesListening {
  id: string;
  type: EQuestionType;
  limitAnswer: number;
  content: string;
  image: string
  questions: ListeningQuestion[];
}
export interface ListeningQuestion {
  id: string;
  type: {
    id: string;
  };
  question: string;
  createdAt: string;
  updatedAt: string;
  answers: ListeningAnswer[];
  answer: string;
  }
export interface ListeningAnswer {
  id: string;
  question: {
    id: string;
  };
  answer: string;
}
