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
import { useNavigate } from "react-router-dom";
import { Route } from "@/constant/route";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function HistoryTable() {
  const nav = useNavigate();
  const { data: exam } = useGetExamHistory();  
  const { data: practice } = useGetPracticeHistory();
  const [historyType, setHistoryType] = useState("exam");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentData = historyType === "exam" ? exam : practice;
  const totalItems = currentData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData?.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
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
            {paginatedData?.map((test) => (
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
                      test.isCompleted
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-yellow-500 hover:bg-yellow-400",
                      "px-2 py-1 font-bold"
                    )}
                  >
                    {test.isCompleted ? "Completed" : "In Progress"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {test.isCompleted ? (
                    <Badge
                      className="bg-green-500 hover:bg-green-400 cursor-pointer px-2 py-1 line-clamp-1 text-center text-white font-bold"
                      onClick={() =>
                        historyType === "exam"
                          ? nav(
                              `${Route.Exam}/${test.exam.type}/result/${test.exam.id}/${test.id}`
                            )
                          : ""
                      }
                    >
                      View
                    </Badge>
                  ) : (
                    <Badge
                      className="bg-blue-500 hover:bg-blue-400 cursor-pointer px-2 py-1 line-clamp-1 text-center text-white font-bold"
                      onClick={() =>
                        historyType === "exam"
                          ? nav(
                              `${Route.ExamIntruction}/${test.exam.type}/${test.exam.id}`
                            )
                          : ""
                      }
                    >
                      Continute
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={cn(
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
