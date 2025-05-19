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
import { useGetGrammar } from "@/features/Learn/hooks/useGetGrammar";
import { Input } from "@/components/ui/input";
import { useCreateGrammar } from "../hooks/useCreateGrammar";
interface GrammarTenseSelectorProps {
  onTenseSelect: (tense: string |  undefined) => void;
  selectedTense: string | undefined;
}

export function DialogGrammarSelect({
  onTenseSelect,
  selectedTense,
}: GrammarTenseSelectorProps) {
  const { data: grammars, refetch } = useGetGrammar();
  const { mutateAsync: createGrammar, isPending } = useCreateGrammar();
  const [openAddGrammar, setOpenAddGrammar] = useState(false);
  const [newGrammarName, setNewGrammarName] = useState("");
  const [open, setOpen] = useState(false);
  const grammarName = () => {
    if (!selectedTense) return "Select Grammar Tense";
    const grammar = grammars?.find((card) => card.id === selectedTense);
    return grammar ? grammar.name : "Unknown Grammar";
  };
  const handleAddGrammar = async () => {
    if (newGrammarName.trim()) {
      try {
        await createGrammar({ name: newGrammarName });
      } catch (error) {
        console.error("Failed to create topic:", error);
      } finally {
        refetch();
        setNewGrammarName("");
        setOpenAddGrammar(false);
      }
    }
  };
  const handleTenseSelect = (tense: string) => {
    onTenseSelect(tense);
    setOpen(false);
  };
  const handleClearFilter = () => {
    onTenseSelect(undefined);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 bg-white border-2 font-medium border-[#164C7E] text-[#164C7E] hover:text-white hover:bg-[#164C7E]">
          {grammarName()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center relative">
            Choose a grammatical tense
            <Button
              className="bg-transparent hover:bg-transparent hover:underline text-red-500 absolute top-0 left-0"
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
          </DialogTitle>
          <DialogDescription className="text-center flex flex-col gap-2 items-center">
            <span>Choose a grammatical tense to view related lessons.</span>
            <Dialog open={openAddGrammar} onOpenChange={setOpenAddGrammar}>
              <DialogTrigger asChild>
                <Button className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]">
                  Add Grammar Point
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Grammar Point</DialogTitle>
                  <DialogDescription>
                    Enter the name of the new Grammar Point you want to create.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <Input
                    value={newGrammarName}
                    onChange={(e) => setNewGrammarName(e.target.value)}
                    placeholder="Enter Grammar name"
                    className="col-span-3"
                  />
                  <Button
                    onClick={handleAddGrammar}
                    isLoading={isPending}
                    disabled={!newGrammarName.trim()}
                    className="bg-[#164C7E] text-white hover:bg-[#164C7E]/90 w-full rounded-full"
                  >
                    Create Grammar Point
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {grammars?.map((tense) => (
            <div
              key={tense.id}
              onClick={() => handleTenseSelect(tense.id)}
              className={cn(
                "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedTense === tense.id
                  ? "border-[#164C7E] bg-[#164C7E]/10"
                  : "border-gray-200 hover:border-[#164C7E]/50 hover:bg-[#164C7E]/5"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{tense.name}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
