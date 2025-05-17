import { Button } from "@/components/ui/button";
import { Route } from "@/constant/route";
import DialogConfirm from "@/features/Exam/components/DialogConfirm";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SpeakingTestInstruction() {
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
        title={`ARE YOU READY TO START THE SPEAKING TEST?`}
        id={id}
        type="speaking"
      />
      <div className="w-full h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="border-b p-4 shadow h-20 relative">
          <h1 className="text-xl text-center font-medium text-[#164C7E]">
            SPEAKING TEST INSTRUCTION
          </h1>
          <Button
            className="bg-white border-2 absolute right-5 top-5 border-[#164C7E] text-[#164C7E] font-bold px-8 py-5 hover:bg-[#164C7E] hover:text-white"
            onClick={handleExit}
          >
            EXIT
          </Button>
        </div>

        {/* Content */}
        <div className="h-full flex flex-col justify-between">
          <div className="mt-8 pl-56">
            <div className="flex mb-6">
              <div className="font-bold w-24">TIME</div>
              <div className="font-bold">15 minute</div>
            </div>

            <h2 className="font-bold text-xl mb-4">
              Official Instructions to candidates
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>
                You have <span className="font-bold">15 minutes</span> to
                complete this test.
              </li>
              <li>
                The test has <span className="font-bold">3 parts</span>:
                <ul className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Part 1: Introduction and general questions (4–5 mins)</li>
                  <li>
                    Part 2: Long turn – speak on a given topic using cue card
                    (3–4 mins)
                  </li>
                  <li>
                    Part 3: Discussion – abstract questions related to Part 2
                    topic (4–5 mins)
                  </li>
                </ul>
              </li>
              <li>
                You will be given <span className="font-bold">1 minute</span> to
                prepare for Part 2.
              </li>
              <li>Please allow microphone access to begin the test.</li>
              <li>
                Speak clearly and naturally. Your responses will be recorded.
              </li>
              <li>
                Ensure you are in a quiet environment for the best recording
                quality.
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
