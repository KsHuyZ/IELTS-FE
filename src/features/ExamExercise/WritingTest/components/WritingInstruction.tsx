import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Route } from "@/constant/route";
import DialogConfirm from "@/features/Exam/components/DialogConfirm";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function WritingTestInstruction() {
  const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [openDia, setOpenDia] = useState(false);
    const handleStart = () => {
      setOpenDia(true);
    };
  
    const handleExit = () => {
      nav(Route.Exam);
    };

  return (
    <div className="min-h-screen w-full">
      <DialogConfirm
        openDia={openDia}
        setOpenDia={setOpenDia}
        title={`ARE YOU READY TO START THE WRITING TEST?`}
        id={id}
        type="writing"
      />
      <div className="w-full h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="border-b p-4 shadow h-20 relative">
          <h1 className="text-xl text-center font-medium text-[#164C7E]">
            WRITING TEST INSTRUCTION
          </h1>
          <Button className="bg-white border-2 absolute right-5 top-5 border-[#164C7E] text-[#164C7E] font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white"
          onClick={handleExit}>
            EXIT
          </Button>
        </div>

        {/* Content */}
        <div className="h-full flex flex-col justify-between">
          <div className="mt-8 pl-56">
            <div className="flex mb-6">
              <div className="font-bold w-24">TIME</div>
              <div className="font-bold">60 minute</div>
            </div>

            <h2 className="font-bold text-xl mb-4">
              Official Instructions to candidates
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>
                You have <span className="font-bold">60 minutes</span> to
                complete this test.
              </li>
              <li>
                The test includes <span className="font-bold">2 task</span>:
                <ul className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Task 1 (at least 150 words): Describe a graph, chart, map or process.</li>
                  <li>Task 2 (at least 250 words): Write an essay on a given topic.</li>
                </ul>
              </li>
              <li>
                It is recommended to spend about <span className="font-bold">20 minutes</span> on Task 1 and <span className="font-bold">40
                minutes</span> on Task 2.
              </li>
              <li>
                Do not refresh or close your browser. Your progress will be
                lost.
              </li>
              <li>You can type your answers directly into the input boxes.</li>
              <li>
                Use the word counter below each task to monitor your writing.
              </li>
              <li>
                Task 2 contributes twice as much as Task 1 to the Writing score
              </li>
            </ul>
          </div>

          <div className="flex justify-center border-t-2 h-28 items-center p-4 mt-16">
            <Button
              className="bg-green-500 hover:bg-green-600 font-bold text-white px-8 py-2 rounded-full"
              onClick={handleStart}
            >
              START NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
