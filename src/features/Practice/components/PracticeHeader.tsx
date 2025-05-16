import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect, useState } from "react";
interface IProps {
  setOpenDia: React.Dispatch<React.SetStateAction<boolean>>
}
const PracticeHeader = ({setOpenDia}: IProps) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="bg-white flex items-center justify-between shadow border-b h-16  px-6 w-full fixed top-0">
      <div className="flex justify-center items-center">
      <Button
        variant="ghost"
        className="w-fit hover:bg-[#F1FFEF] hover:border-0"
        size="sm"
        onClick={() => setOpenDia(true)}
      >
        <ArrowLeft className="text-[#164C7E]" />
      </Button></div>
      <div className="flex gap-2 items-center p-2 border-2 border-red-500 rounded-lg">
        <Clock className="h-5 w-5" />
        <span className="font-semibold text-[#9A2E2E]">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default PracticeHeader;
