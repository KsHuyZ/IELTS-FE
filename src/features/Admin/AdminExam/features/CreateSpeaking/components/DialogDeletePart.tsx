import { deleteSpeakingPart } from "@/api/AdminAPI/exam";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
interface DialogDeleteProps {
  openDeletePassage: boolean;
  id: string;
  setOpenDeletePassage: (open: boolean) => void;
  refetch: () => void;
}
const DialogDeletePart = ({
  openDeletePassage,
  id,
  setOpenDeletePassage,
  refetch,
}: DialogDeleteProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteSpeakingPart(id);
    } catch (error) {
    } finally {
      setOpenDeletePassage(false);
      toast.success("Delete Part Success");
      refetch();
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={openDeletePassage} onOpenChange={setOpenDeletePassage}>
      <DialogContent className="sm:max-w-[425px] bg-[#E3FDDF] border-red-500 border-2">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-lg">
            Delete Speaking Part
          </DialogTitle>
          <DialogDescription className="font-semibold text-red-500">
            Are you sure you want to delete this Part? This action cannot be
            undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between w-full">
          <Button
            onClick={() => setOpenDeletePassage(false)}
            className="border-2 border-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            isLoading={isLoading}
            className="border-2 border-red-500 bg-transparent hover:bg-red-500 hover:text-white font-bold"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeletePart;
