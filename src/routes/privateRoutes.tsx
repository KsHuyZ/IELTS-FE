import { Route } from "@/constant/route";
import HomeUser from "@/features/HomeUser";
import { Exam } from "@/features/Exam";
import { Practice } from "@/features/Practice";
import Learn from "@/features/Learn";
import Layout from "@/layout/mainLayout";
import ListeningTest from "@/features/ExamExercise/ListeningTest";
import PracticeReading from "@/features/Practice/PracticeReading";
import ReadingResult from "@/features/ExamExercise/ReadingTest/components/ReadingResult";
import MicrophoneTest from "@/features/ExamExercise/SpeakingTest/MicrophoneTest";
import SpeakingTest from "@/features/ExamExercise/SpeakingTest/SpeakingTest";
import WritingTest from "@/features/ExamExercise/WritingTest";
import WritingTestResult from "@/features/ExamExercise/WritingTest/WritingTestResult";
import ListeningTestResult from "@/features/ExamExercise/ListeningTest/components/ListeningResult";
import ListeningPractice from "@/features/Practice/PracticeListening";
import ReadingTest from "@/features/ExamExercise/ReadingTest";
import PracticeReadingResult from "@/features/Practice/PracticeReading/components/ReadingPracticeResult";
import PracticeWriting from "@/features/Practice/PracticeWriting";
import PracticeSpeakingTest from "@/features/Practice/PracticeSpeaking/SpeakingTest";
import PracticeSpeaking from "@/features/Practice/PracticeSpeaking";
import PracticeListeningResult from "@/features/Practice/PracticeListening/components/ListeningPracticeResult";
import WritingPracticeResult from "@/features/Practice/PracticeWriting/components/WritingPracticeResult";
import Report from "@/features/Report";
import PracticeLayout from "@/layout/practiceLayout";
import LearnLesson from "@/features/Learn/features/LearnLesson";
import AdminHome from "@/features/Admin/AdminHome";
import AdminExam from "@/features/Admin/AdminExam";
import AdminLearn from "@/features/Admin/AdminLearn";
import AdminReport from "@/features/Admin/AdminReport";
import AdminPractice from "@/features/Admin/AdminPractice";
import CreatePractice from "@/features/Admin/AdminPractice/features/CreatePractice";
import CreateReadingExamDetail from "@/features/Admin/AdminExam/features/CreateReading/CreateReadingExamDetail";
import CreateExam from "@/features/Admin/AdminExam/features/CreateExam";
import Store from "@/features/Store";
import CreateListeningExamDetail from "@/features/Admin/AdminExam/features/CreateListening";
import CreateWritingDetail from "@/features/Admin/AdminExam/features/CreateWriting";
import CreatePracticeReading from "@/features/Admin/AdminPractice/features/PracticeReading";
import CreatePracticeListening from "@/features/Admin/AdminPractice/features/PracticeListening";
import CreatePracticeWriting from "@/features/Admin/AdminPractice/features/PracticeWriting";
import CreatePracticeSpeaking from "@/features/Admin/AdminPractice/features/PracticeSpeaking";

export const privateRoutes = [
  {
    element: <Layout />,
    children: [
      {
        element: <Practice />,
        path: Route.Practice,
      },
      {
        element: <HomeUser />,
        path: Route.Home,
      },
      {
        element: <Exam />,
        path: Route.Exam,
      },
      {
        element: <Learn />,
        path: Route.Learn,
      },
      {
        element: <Report />,
        path: `${Route.Report}`,
      },
      {
        element: <Store />,
        path: `${Route.Store}`,
      },
      {
        element: <LearnLesson />,
        path: `${Route.LearnLesson}/:id`,
      },
    ],
  },
  {
    element: <PracticeLayout />,
    children: [
      {
        element: <PracticeReading />,
        path: `${Route.PracticeReading}/:id`,
      },
      {
        element: <PracticeReadingResult />,
        path: `${Route.PracticeReadingResult}/:id/:idResult`,
      },
      {
        element: <ListeningPractice />,
        path: `${Route.PracticeListening}/:id`,
      },
      {
        element: <PracticeListeningResult />,
        path: `${Route.PracticeListeningResult}/:id/:idResult`,
      },
      {
        element: <PracticeSpeakingTest />,
        path: `${Route.PracticeSpeaking}/:id`,
      },
      {
        element: <PracticeSpeaking />,
        path: `${Route.PracticeSpeakingStart}/:id`,
      },
      {
        element: <PracticeWriting />,
        path: `${Route.PracticeWriting}/:id`,
      },
      {
        element: <WritingPracticeResult />,
        path: `${Route.PracticeWritingResult}/:id/:idResult`,
      },
    ],
  },
  {
    element: <ReadingTest />,
    path: `${Route.ExamReading}/:id`,
  },
  {
    element: <ReadingResult />,
    path: `${Route.ExamReadingResult}/:id/:idResult`,
  },
  {
    element: <ListeningTest />,
    path: `${Route.ExamListening}/:id`,
  },
  {
    element: <ListeningTestResult />,
    path: `${Route.ExamListeningResult}/:id/:idResult`,
  },
  {
    element: <MicrophoneTest />,
    path: `${Route.ExamSpeaking}/:id`,
  },
  {
    element: <SpeakingTest />,
    path: `${Route.ExamSpeakingStart}/:id`,
  },
  {
    element: <WritingTest />,
    path: `${Route.ExamWriting}/:id`,
  },
  {
    element: <WritingTestResult />,
    path: `${Route.ExamWritingResult}/:id/:idResult`,
  },
];
export const adminPrivateRoutes = [
  {
    element: <Layout />,
    children: [
      {
        element: <AdminHome />,
        path: Route.Home,
      },
      {
        element: <AdminPractice />,
        path: Route.Practice,
      },
      {
        element: <AdminExam />,
        path: Route.Exam,
      },
      {
        element: <CreateExam />,
        path: `${Route.CreateExam}`,
      },
      {
        element: <CreateReadingExamDetail />,
        path: `${Route.CreateExamDetail}/reading/:id`,
      },
      {
        element: <CreateListeningExamDetail />,
        path: `${Route.CreateExamDetail}/listening/:id`,
      },
      {
        element: <CreateWritingDetail />,
        path: `${Route.CreateExamDetail}/writing/:id`,
      },
      {
        element: <CreatePractice />,
        path: Route.CreatePractice,
      },
      {
        element: <CreatePracticeReading />,
        path: `${Route.CreatePracticeDetail}/reading/:id`,
      },
      {
        element: <CreatePracticeListening />,
        path: `${Route.CreatePracticeDetail}/listening/:id`,
      },
      {
        element: <CreatePracticeWriting />,
        path: `${Route.CreatePracticeDetail}/writing/:id`,
      },
      {
        element: <CreatePracticeSpeaking />,
        path: `${Route.CreatePracticeDetail}/speaking/:id`,
      },
      {
        element: <AdminLearn />,
        path: Route.Learn,
      },
      {
        element: <AdminReport />,
        path: `${Route.Report}`,
      },
    ],
  },
];
