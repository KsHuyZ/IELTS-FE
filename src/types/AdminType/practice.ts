import { IAnswer } from "./exam";

export interface ICreatePractice {
  topicId: string;
  name: string;
  image: FileList;
  type: string;
}
export interface IEditReadingPassage {
  title: string;
  image: FileList;
  content: string;
}
export interface ICreatePracticePassage {
  practiceId: string;
  content: string;
  image: File;
  title: string;
}
export interface ICreateReadingPracticeQuestion {
  question: string;
  practiceReadingTypeId: string;
  answers: IAnswer[];
}
export interface ICreatePracticeListeningType {
  practiceListenId: string;
  type: string;
  content: string;
}
export interface ICreatePracticeListeningQuestion {
  question: string;
  typeId: string;
  answers: IAnswer[];
}