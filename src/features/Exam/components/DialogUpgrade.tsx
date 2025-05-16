import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Route } from "@/constant/route";
import { useNavigate } from "react-router-dom";
interface DialogUpgradeProps {
  openSubscriptionDialog: boolean;
  setOpenSubscriptionDialog: (open: boolean) => void;
}
const DialogUpgrade = ({
  openSubscriptionDialog,
  setOpenSubscriptionDialog,
}: DialogUpgradeProps) => {
  const nav = useNavigate();
  return (
    <Dialog
      open={openSubscriptionDialog}
      onOpenChange={setOpenSubscriptionDialog}
    >
      <DialogContent className="sm:max-w-[425px] bg-[#E3FDDF] border-red-500 border-2">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-lg">Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            The Writing exam is exclusive to Plus or Pro subscriptions. Upgrade
            your plan to unlock this feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between w-full">
          <Button
            onClick={() => setOpenSubscriptionDialog(false)}
            className="border-2 border-red-500 bg-transparent hover:bg-red-500 hover:text-white font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              nav(Route.Subcription);
            }}
            className="border-2 border-[#188F09] bg-transparent hover:bg-[#188F09] hover:text-white font-bold"
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUpgrade;
