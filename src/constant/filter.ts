import { StatusExcercise, TypeExcercise } from "@/types/excercise";

export const examTabs = [
  { id: TypeExcercise.Reading, label: "READING" },
  { id: TypeExcercise.Listening, label: "LISTENING" },
  { id: TypeExcercise.Writing, label: "WRITING" },
  { id: TypeExcercise.Speaking, label: "SPEAKING" },
];
export const practiceTabs = [
  { id: TypeExcercise.Reading, label: "READING" },
  { id: TypeExcercise.Listening, label: "LISTENING" },
  { id: TypeExcercise.Writing, label: "WRITING" },
  { id: TypeExcercise.Speaking, label: "SPEAKING" }
];
export const statusFilters = [
  { id: StatusExcercise.NotStarted, label: "Not Started" },
  { id: StatusExcercise.InProgress, label: "In Progress" },
  { id: StatusExcercise.Completed, label: "Completed" },
];