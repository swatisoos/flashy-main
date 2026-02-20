"use client";

import { Flashcard } from "@/types/flashcard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFlashcard } from "@/actions/flashcard-actions";
import { FlashcardSet } from "@/types/flashcard-set";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import CreateFlashcardDialog from "@/components/sets/create-flashcard-dialog";

interface FlashcardPreviewProps {
  flashcard: Flashcard;
  set: FlashcardSet;
}

const FlashcardPreview = ({ flashcard, set }: FlashcardPreviewProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onDelete = () => {
    deleteFlashcard(set.id, flashcard.id).then(() => {
      toast({
        title: "Flashcard Deleted",
        description: "The flashcard has been deleted",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["set", set.id],
      });
    });
  };

  return (
    <Card key={flashcard.id} className="flex flex-row p-5 w-96">
      <div className="flex flex-col space-y-2">
        <span className="font-bold">{flashcard.question}</span>
        <span className="text-gray-500">Answer: {flashcard.answer}</span>
      </div>
      <div className="flex flex-col space-y-2 ml-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
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
        <CreateFlashcardDialog set={set} flashcard={flashcard}>
          <Button>
            <Pencil className="mr-2" size={16} />
            Edit
          </Button>
        </CreateFlashcardDialog>
      </div>
      <Toaster />
    </Card>
  );
};

export default FlashcardPreview;
