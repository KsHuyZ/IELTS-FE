import { IDetailExcercise, IExcerciseDetail } from "../excercise";

export interface IExam {
  exam: IDetailExcercise & IExamPassage;
  remainingTime: number;
}
export interface IExamResult {
  summary: [
    {
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
    }
  ];
  score: number;
}
export interface IUserAnswer {
  examId: string;
  examPassageQuestionId: string;
  answer: string | string[];
}
export interface IExamAnswerSubmit {
  questionId: string;
  answer: string;
}

export enum EQuestionType {
  TextBox = "textbox",
  MultipleChoice = "multiple-choice",
  SingleChoice = "single-choice",
  TexBoxPosition = "textbox-position",
  BlankPassageDrag = "blank-passage-drag",
  BlankPassageTextbox = "blank-passage-textbox",
  BlankPassageImageTextbox = "blank-passage-image-textbox",
}
export interface ExamPassage {
  id: string;
  exam: IExcerciseDetail;
  passage: string;
  content: string;
  image: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  answer: {
    answer: string;
  };
  types: TypesReading[];
  questions: ReadingQuestion[];
  // blankPassage?: string;
}
export interface IExamPassage {
  examPassage: ExamPassage[];
}
export interface TypesReading {
  id: string;
  examPassage: {
    id: string;
  };
  type: EQuestionType;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  questions: ReadingQuestion[];
}
export interface ReadingQuestion {
  id: string;
  part: {
    id: string;
  };
  question: string;
  createdAt: string;
  updatedAt: string;
  answers: ReadingAnswer[];
  answer: {
    answer: string;
  } | string;
}
export interface ReadingAnswer {
  id: string;
  question: {
    id: string;
  };
  answer: string;
}
