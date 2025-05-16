import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetExamHistory } from "../hooks/useGetExamHistory";
import { useGetPracticeHistory } from "../hooks/useGetPracticeHistory";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { roundToHalfOrWhole } from "@/utils/roundup";
import { Button } from "@/components/ui/button";

export function HistoryTable() {
  const { data: exam } = useGetExamHistory();
  const { data: practice } = useGetPracticeHistory();
  const [historyType, setHistoryType] = useState("exam");
  const currentData = historyType === "exam" ? exam : practice;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">History</h2>
        <Select value={historyType} onValueChange={setHistoryType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select History" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exam">Exams History</SelectItem>
            <SelectItem value="practice">Practices History</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData?.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">
                  {historyType === "exam"
                    ? test.exam.name
                    : test.practice?.name || "Practice Test"}
                </TableCell>
                <TableCell>
                  {test.startTime
                    ? format(test.startTime, "dd/MM/yyyy HH:mm:ss")
                    : "_"}
                </TableCell>
                <TableCell>
                  {test.endTime
                    ? format(test.endTime, "dd/MM/yyyy HH:mm:ss")
                    : "_"}
                </TableCell>
                <TableCell>
                  {test.isCompleted
                    ? roundToHalfOrWhole(test.score).toFixed(1)
                    : "_"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      test.isCompleted ? "bg-green-500" : "bg-yellow-500",
                      "px-2 py-1"
                    )}
                  >
                    {test.isCompleted ? "Completed" : "In Progress"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {test.isCompleted ? (
                    <Button className="bg-green-500 w-16 line-clamp-1 text-white font-bold hover:bg-green-400">
                      View
                    </Button>
                  ) : (
                    <Button className="bg-blue-500 w-16 line-clamp-1 text-white font-bold">
                      Continute
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
