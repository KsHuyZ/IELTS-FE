import { getStorage } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { useGetRecentWork } from "./hooks/useGetRecentWork";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetSuggestion } from "./hooks/useGetSuggestion";
import { useState } from "react";
import DialogConfirm from "../Exam/components/DialogConfirm";
export default function Page() {
  const userName = getStorage("userName");
  const [openDia, setOpenDia] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const { data } = useGetRecentWork();
  const { data: suggestions } = useGetSuggestion();
  const handleStartExam = (id: string, type: string) => {
    setId(id);
    setType(type);
    setOpenDia(true);
  };
  const sortedData = data
    ? [...data].sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      })
    : [];
  return (
    <div className="p-14 w-full">
      <DialogConfirm
        openDia={openDia}
        setOpenDia={setOpenDia}
        title={`ARE YOU READY TO START THE ${type.toUpperCase()} TEST?`}
        id={id}
        type={type}
      />
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-xl font-bold">
          WELCOME, <span>{userName?.toUpperCase()}</span>
        </h1>
        <img
          src="/images/hand.svg"
          alt="hand"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>

      <div className="flex flex-col w-full items-center gap-10">
        {data && data.length > 0 && (
          <div className="bg-white w-full p-5">
            <h2 className="mb-4 text-lg font-semibold">RECENT WORK</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
              {sortedData.slice(0,4)?.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg bg-white shadow p-3"
                >
                  <div className="relative">
                    <img
                      src={item.exam.image || "/placeholder.svg"}
                      alt={item.exam.name}
                      className="h-24 w-full object-cover"
                    />
                    {item.exam.updatedAt && (
                      <span className="absolute left-2 top-2 rounded bg-white/80 px-2 py-1 text-sm">
                        {format(item.updatedAt, "dd/MM/yyyy HH:mm:ss")}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col items-center">
                    <h3 className="mb-4 text-sm line-clamp-1">
                      {item.exam.name}
                    </h3>
                    <Button
                      className={cn(
                        item.isCompleted
                          ? "border-2 border-[#164C7E] bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
                          : "border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white bg-white"
                      )}
                      onClick={() =>
                        handleStartExam(item.exam.id, item.exam.type)
                      }
                    >
                      {item.isCompleted ? "RETRY" : "CONTINUTE"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-5 w-full">
          <h2 className="mb-4 text-lg font-semibold">SUGGESTIONS FOR YOU</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {suggestions?.slice(0,4)?.map((item, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg p-2 bg-white shadow"
              >
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-24 w-full object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col items-center">
                  <h3 className="mb-4 text-sm line-clamp-1">{item.name}</h3>
                  <Button
                    className="border-2 border-[#164C7E] bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
                    onClick={() => handleStartExam(item.id, item.type)}
                  >
                    START
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
