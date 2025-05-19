export const Route = {
  Login: '/login',
  SignUp: '/sign-up',
  Home: '/',
  ForgotPassword: '/forgot-password',
  ConfirmEmail: '/confirm-email',
  ResetPassword: '/password-change',
  Practice: '/practice',
  //learn
  Learn: '/learn',
  LearnLesson: '/learn/lesson',
  LearnCreate: '/learn/create',
  LearnEdit: '/learn/edit',
  //exam:
  Exam: '/exam',
  ExamIntruction: '/exam/instruction',
  ExamReading: '/exam/reading',
  ExamReadingResult: '/exam/reading/result',
  ExamListening: '/exam/listening',
  ExamListeningResult: '/exam/listening/result',
  ExamSpeaking: '/exam/speaking',
  ExamWriting: '/exam/writing',
  ExamWritingResult: '/exam/writing/result',
  ExamSpeakingStart:'/exam/speaking/start',
  //practice:
  PracticeReading: '/practice/reading',
  PracticeReadingResult: '/practice/reading/result',
  PracticeListening: '/practice/listening',
  PracticeListeningResult: '/practice/listening/result',
  PracticeSpeaking: '/practice/speaking',
  PracticeSpeakingStart: '/practice/speaking/start',
  PracticeSpeakingResult: '/practice/speaking/result',
  PracticeWriting: '/practice/writing',
  PracticeWritingResult: '/practice/writing/result',
  //report:
  Report: '/report',
  //admin:
  CreateExam: '/exam/create',
  CreateExamDetail: '/exam/create/detail',
  CreatePractice: '/practice/create',
  CreatePracticeDetail: '/practice/create/detail',
  EditExam: '/exam/edit',
  EditExamDetail: '/exam/edit/detail',
  EditPractice: '/practice/edit',
  EditPracticeDetail: '/practice/edit/detail',
  Subcription: '/subcription'
}

export const authRoutes = [Route.Login, Route.SignUp, Route.ForgotPassword, Route.ConfirmEmail, Route.ResetPassword]

