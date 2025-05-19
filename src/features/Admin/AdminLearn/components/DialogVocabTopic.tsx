"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGetTopics } from "@/features/Learn/hooks/useGetTopics";
import { Input } from "@/components/ui/input";
import { useCreateTopic } from "../hooks/useCreateTopic";

interface TopicSelectorDialogProps {
  onTopicSelect: (topic: string | undefined) => void;
  selectedTopic: string | undefined;
  buttonLabel?: string;
}

export function DialogVocabTopic({
  onTopicSelect,
  selectedTopic,
}: TopicSelectorDialogProps) {
  const { data: topics, refetch } = useGetTopics();
  const { mutateAsync: createTopic, isPending } = useCreateTopic();
  const topicName = () => {
    if (!selectedTopic) return "Select Topic";
    const topic = topics?.find((card) => card.id === selectedTopic);
    return topic ? topic.name : "Unknown Topic";
  };
  const [open, setOpen] = useState(false);
  const [openAddTopic, setOpenAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const handleAddTopic = async () => {
    if (newTopicName.trim()) {
      try {
        await createTopic({ name: newTopicName });
      } catch (error) {
        console.error("Failed to create topic:", error);
      } finally {
        refetch();
        setNewTopicName("");
        setOpenAddTopic(false);
      }
    }
  };
  const handleTopicSelect = (topic: string) => {
    onTopicSelect(topic);
    setOpen(false);
  };
  const handleClearFilter = () => {
    onTopicSelect(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E] hover:text-white hover:bg-[#164C7E]">
          {topicName()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center relative">
            Select a Topic
            <Button
              className="bg-transparent hover:bg-transparent hover:underline text-red-500 absolute top-0 left-0"
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
          </DialogTitle>
          <DialogDescription className="text-center flex flex-col gap-2 items-center">
            <span>Choose a topic to view related vocabulary lessons</span>
            <Dialog open={openAddTopic} onOpenChange={setOpenAddTopic}>
              <DialogTrigger asChild>
                <Button className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]">
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Topic</DialogTitle>
                  <DialogDescription>
                    Enter the name of the new topic you want to create.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <Input
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="Enter topic name"
                    className="col-span-3"
                  />
                  <Button
                    onClick={handleAddTopic}
                    isLoading={isPending}
                    disabled={!newTopicName.trim()}
                    className="bg-[#164C7E] text-white hover:bg-[#164C7E]/90 w-full rounded-full"
                  >
                    Create Topic
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {topics?.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicSelect(topic.id)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedTopic === topic.id
                  ? "border-[#164C7E] bg-[#164C7E]/10"
                  : "border-gray-200 hover:border-[#164C7E]/50 hover:bg-[#164C7E]/5"
              )}
            >
              <span className="font-medium text-center">{topic.name}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
