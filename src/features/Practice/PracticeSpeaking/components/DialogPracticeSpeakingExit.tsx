import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import { Route } from "@/constant/route";
// import { setStorage } from "@/utils/storage";
// import { practiceExitWriting } from "@/api/PracticeAPI/writingExam";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  id: string | undefined;
}
const DialogPracticeSpeakingExit = ({
  openDia,
  setOpenDia,
  id,
}: IProps) => {
//   const nav = useNavigate();
//   const handleExit = async () => {
//       try {
//         const data = {answer: answers}
//         await practiceExitWriting(data, id ?? '');
//         nav(Route.Practice);
//         setStorage("isTesting", false);
//       } catch (error) {
//         console.error("Error while exiting practice:", error);
//       }
//     };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="[&>button]:hidden md:w-full w-96 gap-10 flex flex-col items-center justify-center md:h-40 h-56 bg-[#3C64CE] text-white font-bold md:p-4 p-6 text-center"
      >
        <DialogTitle>Are you sure you want to exit the practice session?</DialogTitle>
        <div className="flex justify-between items-center w-2/3">
          <Button
            className="bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl"
            onClick={() => setOpenDia(false)}
          >
            Cancle
          </Button>
          <Button
            // onClick={handleExit}
            className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
          >
            Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPracticeSpeakingExit;
