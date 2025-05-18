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
export interface IExamWritingResult {
  summary: [
    {
      questionId: string;
      overallBandScore: number;
      taskResponse: number;
      taskResponseDetails: string;
      coherenceAndCohesion: number;
      coherenceAndCohesionDetails: string;
      lexicalResource: number;
      lexicalResourceDetails: string;
      grammaticalRangeAndAccuracy: number;
      grammaticalRangeAndAccuracyDetails: string;
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
  BlankPassageDrag = "blank-passage-drag",
  BlankPassageTextbox = "blank-passage-textbox",
  BlankPassageImageTextbox = "blank-passage-image-textbox",
  TrueFalseNotGiven = "true-false-not-given",
  YesNoNotGiven = "yes-no-not-given",
  MatchingHeadings = "matching-headings",
  MatchingInformation = "matching-information",
  MatchingFeatures = "matching-features",
  MatchingSentencesEnding = "matching-sentences-ending",
  SentenceCompletion = "sentence-completion",
  SummaryCompletion = "summary-completion",
  DiagramLabelCompletion = "diagram-label-completion",
  ShortAnswerQuestion = "short-answer-question",
}
const numberToWords = (num?: number): string => {
  if (!num) return "";
  const words = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE"];
  return words[num] || num.toString();
};
export const QUESTION_INSTRUCTIONS: Record<
  EQuestionType,
  (limitAnswer?: number) => string
> = {
  [EQuestionType.SingleChoice]: () =>
    "Choose the correct letter, A, B, C or D.",
  [EQuestionType.MultipleChoice]: () =>
    "Choose the correct letter, A, B, C or D.",
  [EQuestionType.TrueFalseNotGiven]: () => "Choose TRUE, FALSE, or NOT GIVEN",
  [EQuestionType.YesNoNotGiven]: () => "Choose YES, NO, or NOT GIVEN",
  [EQuestionType.BlankPassageDrag]: () =>
    "Choose the correct heading for each section from the list of headings below.",
  [EQuestionType.BlankPassageTextbox]: () =>
    "Complete the summary using the list of words (A–F) below.OR Choose NO MORE THAN TWO/THREE WORDS",
  [EQuestionType.BlankPassageImageTextbox]: (limitAnswer) =>
    `Label the diagram below. Choose NO MORE THAN ${numberToWords(
      limitAnswer
    )} WORDS from the passage for each answer.`,
  [EQuestionType.MatchingHeadings]: () =>
    "Choose the correct heading for each section from the list of headings below. ",
  [EQuestionType.MatchingInformation]: () =>
    "Which section contains the following information?",
  [EQuestionType.MatchingFeatures]: () =>
    "Match each statement with the correct person/thing from the list. You may use any letter more than once.",
  [EQuestionType.MatchingSentencesEnding]: () =>
    "Complete each sentence with the correct ending (A–F) from the box below.",
  [EQuestionType.SentenceCompletion]: (limit) =>
    `Complete the sentences below. Choose NO MORE THAN ${numberToWords(
      limit
    )} WORDS from the passage for each answer. `,
  [EQuestionType.SummaryCompletion]: () =>
    "Complete the summary using the list of words (A–F) below. OR Choose NO MORE THAN TWO/THREE WORDS",
  [EQuestionType.DiagramLabelCompletion]: (limit) =>
    `Label the diagram below. Choose NO MORE THAN ${numberToWords(
      limit
    )} WORDS from the passage for each answer`,
  [EQuestionType.ShortAnswerQuestion]: (limit) =>
    `Answer the questions below. Choose NO MORE THAN ${numberToWords(
      limit
    )} WORDS and/or NUMBER from the passage for each answer.`,
  [EQuestionType.TextBox]: () => "Write the CORRECT answer",
};
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
  limitAnswer: number;
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
  answer:
    | {
        answer: string;
      }
    | string;
}
export interface ReadingAnswer {
  id: string;
  question: {
    id: string;
  };
  answer: string;
  isCorrect: boolean;
}
