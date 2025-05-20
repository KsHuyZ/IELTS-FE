import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Route } from "@/constant/route";
import { setStorage } from "@/utils/storage";
import { startPractice } from "@/api/PracticeAPI/practice";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>;
  openDia: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  id: string | undefined;
  type: string;
}
const DialogPracticeConfirm = ({
  openDia,
  setOpenDia,
  setIsPlaying,
  id,
  title,
  type,
}: IProps) => {
  const nav = useNavigate();
  const handStart = async () => {
    await startPractice(id ?? "");
    setOpenDia(false);
    // setStorage("isTesting", "true");
    if (setIsPlaying) {
      setIsPlaying(true);
    }
    nav(`${Route.Practice}/${type}/${id}`);
  };
  return (
    <Dialog open={openDia} onOpenChange={setOpenDia}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="[&>button]:hidden md:w-full w-96 gap-10 flex flex-col items-center justify-center md:h-40 h-56 bg-[#3C64CE] text-white font-bold md:p-4 p-6 text-center"
      >
        <DialogTitle>{title}</DialogTitle>
        <div className="flex justify-between items-center w-2/3">
          <Button
            className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
            onClick={() => setOpenDia(false)}
          >
            Back to Exam
          </Button>
          <Button
            onClick={handStart}
            className="bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold rounded-xl"
          >
            Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPracticeConfirm;
