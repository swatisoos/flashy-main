import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFlashcardSet } from "@/actions/flashcard-set-actions";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface DeleteDialogProps {
  setId: string;
}

const AdminDeleteSet = ({ setId }: DeleteDialogProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteSet = () => {
    deleteFlashcardSet(setId).then(() => {
      toast({
        title: "Set Deleted",
        description: "The flashcard set has been deleted",
        duration: 3000,
      });
      router.push("/explore");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon className="mr-2" size={16} />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDeleteSet}>
              Delete
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDeleteSet;
