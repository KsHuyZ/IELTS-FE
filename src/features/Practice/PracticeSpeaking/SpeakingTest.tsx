import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Route } from '@/constant/route';
import { Mic } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const PracticeSpeakingTest = () => {
    const [isRecording, setIsRecording] = useState(false);
      const [timeLeft, setTimeLeft] = useState(20);
      const [audioUrl, setAudioUrl] = useState<string | null>(null);
      const timerRef = useRef<NodeJS.Timeout | null>(null);
      const mediaRecorderRef = useRef<MediaRecorder | null>(null);
      const streamRef = useRef<MediaStream | null>(null);
      const audioChunksRef = useRef<Blob[]>([]);
      const nav = useNavigate();
      const { id } = useParams<{ id: string }>();
      const startRecording = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
    
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];
    
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
    
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/wav",
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
          };
    
          setIsRecording(true);
    
          // Start the countdown
          timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
              if (prevTime <= 1) {
                stopRecording();
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
    
          mediaRecorder.start();
        } catch (error) {
          console.error("Error accessing microphone:", error);
        }
      };
    
      const stopRecording = useCallback(() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
    
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
    
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
    
        setIsRecording(false);
      }, []);
    
      const handleSkip = () => {
        nav(`${Route.PracticeSpeakingStart}/${id}`);
      };
    
      useEffect(() => {
        return () => {
          stopRecording();
        };
      }, [stopRecording]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1FFEF]">
      <div className="w-10/12 h-5/6 p-6 border border-black bg-[#F5F5F5] rounded-lg shadow-sm overflow-y-auto">
        <div className="mb-6 bg-[#164C7E] h-20 text-white flex items-center justify-center rounded-lg">
          <h1 className="text-xl font-semibold">TEST YOUR MICROPHONE</h1>
        </div>
        {!isRecording && !audioUrl && (
          <div className="flex flex-col items-center space-y-16">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-[#3C64CE] bg-[#D9D9D9]`}
              >
                <Mic className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">
                You have 20 seconds to speak...
              </p>
              <p className="text-lg font-semibold">
                To complete this activity, you must allow access to your
                system's microphone. Click the button below to Start.
              </p>
            </div>

            <div className="flex w-full justify-center gap-16 mt-4">
              <Button
                onClick={startRecording}
                className="w-44 p-6 rounded-xl bg-[#3C64CE] text-white font-bold hover:bg-[#3C64CE]/80"
              >
                TEST MICROPHONE
              </Button>
              <Button
                onClick={handleSkip}
                className="w-44 p-6 rounded-xl bg-[#3C64CE] text-white font-bold hover:bg-[#3C64CE]/80 transition-colors"
              >
                SKIP
              </Button>
            </div>
          </div>
        )}
        {isRecording && (
          <div className="flex flex-col items-center space-y-16">
            <div className="p-5 rounded-lg border-2">
              <Progress className="w-72" value={((20 - timeLeft) / 20) * 100} />
            </div>

            <div className="text-center space-y-4">Speak now...</div>

            <div className="flex w-full justify-center gap-16 mt-4">
              <Button
                onClick={stopRecording}
                className="w-44 p-6 rounded-xl bg-[#D13030] text-white font-bold hover:bg-[#D13030]/80"
              >
                STOP RECORD
              </Button>
              <Button
                onClick={handleSkip}
                className="w-44 p-6 rounded-xl bg-[#3C64CE] text-white font-bold hover:bg-[#3C64CE]/80 transition-colors"
              >
                SKIP
              </Button>
            </div>
          </div>
        )}
        {audioUrl && !isRecording && (
          <div className="flex flex-col items-center space-y-16">
            <p className="text-lg font-semibold">Your recorded audio:</p>
            <div className="max-w-md w-full px-5 py-2 rounded-lg border-2">
              <audio controls className="w-full max-w-md">
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="flex w-full justify-center gap-16 mt-4">
              <Button
                onClick={() => {
                  setAudioUrl(null);
                  setTimeLeft(20);
                }}
                className="w-44 p-6 rounded-xl bg-[#3C64CE] text-white font-bold hover:bg-[#3C64CE]/80 transition-colors flex items-center"
              >
                TEST MIC AGAIN
              </Button>
              <Button
                className="w-44 p-6 rounded-xl bg-[#3C64CE] text-white font-bold hover:bg-[#3C64CE]/80 transition-colors"
                onClick={handleSkip}
              >
                START PRACTICE
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PracticeSpeakingTest
