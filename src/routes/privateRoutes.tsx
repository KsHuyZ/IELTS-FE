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
import LearnLesson from "@/features/Learn/features/LearnLesson";
import AdminHome from "@/features/Admin/AdminHome";
import AdminExam from "@/features/Admin/AdminExam";
import AdminLearn from "@/features/Admin/AdminLearn";
import AdminReport from "@/features/Admin/AdminReport";
import AdminPractice from "@/features/Admin/AdminPractice";
import CreatePractice from "@/features/Admin/AdminPractice/features/CreatePractice";
import CreateReadingExamDetail from "@/features/Admin/AdminExam/features/CreateReading";
import CreateExam from "@/features/Admin/AdminExam/features/CreateExam";
import Store from "@/features/Store";
import CreateListeningExamDetail from "@/features/Admin/AdminExam/features/CreateListening";
import CreateWritingDetail from "@/features/Admin/AdminExam/features/CreateWriting";
import CreatePracticeListening from "@/features/Admin/AdminPractice/features/PracticeListening";
import CreatePracticeWriting from "@/features/Admin/AdminPractice/features/PracticeWriting";
import CreatePracticeSpeaking from "@/features/Admin/AdminPractice/features/PracticeSpeaking";
import EditExam from "@/features/Admin/AdminExam/features/EditExam";
import CreateSpeakingDetail from "@/features/Admin/AdminExam/features/CreateSpeaking";
import EditPractice from "@/features/Admin/AdminPractice/features/EditPractice";
import ReadingPracticeManager from "@/features/Admin/AdminPractice/features/PracticeReading";
import ReadingInstruction from "@/features/ExamExercise/ReadingTest/components/ReadingInstruction";
import ListeningTestInstruction from "@/features/ExamExercise/ListeningTest/components/ListeningInstruction";
import WritingTestInstruction from "@/features/ExamExercise/WritingTest/components/WritingInstruction";
import SpeakingTestInstruction from "@/features/ExamExercise/SpeakingTest/components/SpeakingInstruction";
import ManageLearn from "@/features/Admin/AdminLearn/ManageLearn";

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
        path: `${Route.Subcription}`,
      },
      {
        element: <LearnLesson />,
        path: `${Route.LearnLesson}/:id`,
      },
    ],
  },
  {
    element: <ReadingInstruction />,
    path: `${Route.ExamIntruction}/reading/:id`,
  },
  {
    element: <ListeningTestInstruction />,
    path: `${Route.ExamIntruction}/listening/:id`,
  },
  {
    element: <WritingTestInstruction />,
    path: `${Route.ExamIntruction}/writing/:id`,
  },
  {
    element: <SpeakingTestInstruction />,
    path: `${Route.ExamIntruction}/speaking/:id`,
  },
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
        element: <CreateReadingExamDetail mode="create" />,
        path: `${Route.CreateExamDetail}/reading/:id`,
      },
      {
        element: <CreateListeningExamDetail mode="create" />,
        path: `${Route.CreateExamDetail}/listening/:id`,
      },
      {
        element: <CreateWritingDetail mode="create" />,
        path: `${Route.CreateExamDetail}/writing/:id`,
      },
      {
        element: <CreateSpeakingDetail mode="create" />,
        path: `${Route.CreateExamDetail}/speaking/:id`,
      },
      {
        element: <EditExam />,
        path: `${Route.EditExam}/:id`,
      },
      {
        element: <CreateReadingExamDetail mode="create" />,
        path: `${Route.EditExamDetail}/reading/:id`,
      },
      {
        element: <CreateListeningExamDetail mode="edit" />,
        path: `${Route.EditExamDetail}/listening/:id`,
      },
      {
        element: <CreateWritingDetail mode="create" />,
        path: `${Route.EditExamDetail}/writing/:id`,
      },
      {
        element: <CreateSpeakingDetail mode="edit" />,
        path: `${Route.EditExamDetail}/speaking/:id`,
      },
      {
        element: <EditPractice />,
        path: `${Route.EditPractice}/:id`,
      },
      {
        element: <ReadingPracticeManager mode="edit" />,
        path: `${Route.EditPracticeDetail}/reading/:id`,
      },
      {
        element: <CreatePracticeListening mode="edit" />,
        path: `${Route.EditPracticeDetail}/listening/:id`,
      },
      {
        element: <CreatePracticeWriting mode="edit" />,
        path: `${Route.EditPracticeDetail}/writing/:id`,
      },
      {
        element: <CreatePracticeSpeaking mode="edit" />,
        path: `${Route.EditPracticeDetail}/speaking/:id`,
      },
      {
        element: <CreatePractice />,
        path: Route.CreatePractice,
      },
      {
        element: <ReadingPracticeManager mode="create" />,
        path: `${Route.CreatePracticeDetail}/reading/:id`,
      },
      {
        element: <CreatePracticeListening mode="create" />,
        path: `${Route.CreatePracticeDetail}/listening/:id`,
      },
      {
        element: <CreatePracticeWriting mode="create" />,
        path: `${Route.CreatePracticeDetail}/writing/:id`,
      },
      {
        element: <CreatePracticeSpeaking mode="create" />,
        path: `${Route.CreatePracticeDetail}/speaking/:id`,
      },
      {
        element: <AdminLearn />,
        path: Route.Learn,
      },
      {
        element: <ManageLearn />,
        path: Route.LearnCreate,
      },
      {
        element: <ManageLearn />,
        path: `${Route.LearnEdit}/:id`,
      },
      {
        element: <AdminReport />,
        path: `${Route.Report}`,
      },
    ],
  },
];
