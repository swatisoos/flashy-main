import { Flashcard } from "@/types/flashcard";
import { FlashcardSet } from "@/types/flashcard-set";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateFlashcardForm from "@/components/sets/create-flashcard-form";

interface CreateFlashcardDialogProps {
  children: React.ReactNode;
  set: FlashcardSet;
  flashcard?: Flashcard;
}

const CreateFlashcardDialog = ({
  children,
  set,
  flashcard,
}: CreateFlashcardDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[--background] dark:bg-background">
        <DialogTitle>Add Flashcard</DialogTitle>
        <CreateFlashcardForm flashcard={flashcard} set={set} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateFlashcardDialog;
