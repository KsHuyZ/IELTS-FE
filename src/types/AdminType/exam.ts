import { ExamPassage } from "../ExamType/exam";
import { IDetailExcercise, TypeExcercise } from "../excercise";
import { TypesReading } from "../PracticeType/readingPractice";

export interface ICreateExam {
  name: string;
  type: TypeExcercise;
  file: FileList;
  audio?: FileList;
  year: number;
}

export interface ICreatePassage {
  examId: string;
  title: string;
  passage: string;
}
export interface IEditPassage {
  title: string;
  passage: string;
}
export interface ICreateListeningType {
  examSectionId: string;
  type: string;
  content: string;
}
export interface ICreateQuestion {
  question: string;
  examReadingTypeId: string;
  answers: IAnswer[];
}
export interface IEditQuestion {
  question: string;
  answers: IAnswer[];
}
export interface ICreateListeningQuestion {
  question: string;
  examListenTypeId: string;
  answers: IAnswer[];
}
export interface IAnswer {
  id: string;
  answer: string;
  isCorrect: boolean;
}
export interface IExamDetail extends IDetailExcercise {
  examPassage: ExamPassage[];
}
export interface IPracticeDetail {
  id: string;
  content: string;
  name: string;
  image: string;
  audio: string;
  question: string;
  practice: {
    id: string;
  };
  title: string;
  createdAt: string;
  updatedAt: string;
  types: TypesReading[];
}
export interface IRequestChart {
  startDate?: Date;
  endDate?: Date;
}
