import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { TargetScoreCard } from "./components/TargetScoreCart";
import { SkillScoreCard } from "./components/SkillScoreCart";
import { ScoreChart } from "./components/ScoreChart";
import { TimeChart } from "./components/TimeChart";
import { HistoryTable } from "./components/HistoryTable";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAvgScore } from "./hooks/useGetAvgScore";
import { useGetUserTarget } from "./hooks/useGetUserTarget";
import { getStorage } from "@/utils/storage";
import { roundToHalfOrWhole } from "@/utils/roundup";
const Report = () => {
  const { data: score } = useGetAvgScore();
  const idUser = getStorage("idUser");
  const { data: target, refetch } = useGetUserTarget(idUser ?? "");
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [skill, setSkill] = useState<string>("all");
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) {
      setStartDate(undefined);
      return;
    }
    if (date > currentDate) {
      setStartDate(currentDate);
    } else if (endDate && date > endDate) {
      setStartDate(endDate);
    } else {
      setStartDate(date);
    }
  };
  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) {
      setEndDate(undefined);
      return;
    }
    if (date > currentDate) {
      setEndDate(currentDate);
    } else if (startDate && date < startDate) {
      setEndDate(startDate);
    } else {
      setEndDate(date);
    }
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-white rounded-t-lg border-b flex">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <TargetScoreCard
                targetScore={target?.target}
                idUser={idUser}
                refetch={refetch}
              />
            </div>
            <SkillScoreCard skill="Speaking" score={score?.speaking} />
            <SkillScoreCard skill="Reading" score={score?.reading} />
            <SkillScoreCard skill="Writing" score={score?.writing} />
            <SkillScoreCard skill="Listening" score={score?.listening} />
            <div className="flex justify-center items-center gap-2 font-medium shadow rounded-lg">
              <span>
                Avg:{" "}
                <span className="">
                  {score &&
                    roundToHalfOrWhole(
                      (score.reading + score.listening + score.writing) / 3
                    ).toFixed(1)}
                </span>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Filter:</span>
              </div>

              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="reading">Reading</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-[200px] justify-start bg-transparent border-2 hover:bg-gray-200 border-[#3C64CE] rounded-full text-left flex gap-3",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                    disabled={(date) =>
                      date > currentDate || (endDate ? date > endDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-[200px] justify-start bg-transparent border-2 hover:bg-gray-200 border-[#3C64CE] rounded-full text-left flex gap-3",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    initialFocus
                    disabled={(date) =>
                      date > currentDate ||
                      (startDate ? date < startDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Test Score</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <ScoreChart
                  skill={skill}
                  startDate={startDate}
                  endDate={endDate}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Time to Learn</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <TimeChart
                  skill={skill}
                  startDate={startDate}
                  endDate={endDate}
                />
              </CardContent>
            </Card>
          </div>
          <HistoryTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
