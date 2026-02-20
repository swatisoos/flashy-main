import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlashcardSet } from "@/types/flashcard-set";

interface FlashCardSetPageProps {
  set: FlashcardSet;
  onDelete: () => void;
}

const FlashcardSetOptions = ({ set, onDelete }: FlashCardSetPageProps) => {
  return (
    <div className="flex flex-row justify-between">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-2" variant="destructive">
            <Trash className="mr-2" size={16} />
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
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashcardSetOptions;
