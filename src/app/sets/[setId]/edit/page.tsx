"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import FlashcardPreview from "@/components/sets/flashcard-preview";
import { useQuery } from "@tanstack/react-query";
import {
  deleteFlashcardSet,
  getFlashcardSet,
  updateVisibility,
} from "@/actions/flashcard-set-actions";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import FlashcardSetOptions from "@/components/sets/flashcard-set-options";
import CreateFlashcardDialog from "@/components/sets/create-flashcard-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import SetTags from "@/components/sets/set-tags";

interface FlashCardSetPageProps {
  params: {
    setId: string;
  };
}

const FlashCardSetPage = ({ params }: FlashCardSetPageProps) => {
  const { toast } = useToast();
  const { data: set } = useQuery({
    queryKey: ["set", params.setId],
    queryFn: () => getFlashcardSet(params.setId),
  });

  const [isPublic, setIsPublic] = useState(true);

  const onDelete = () => {
    deleteFlashcardSet(params.setId).then(() => {
      toast({
        title: "Set Deleted",
        description: "The flashcard set has been deleted",
        duration: 3000,
      });
    });
  };

  return (
    <div className="flex justify-center h-screen pt-24">
      <div className="flex flex-row items-start space-x-12 w-fit">
        <section className="flex flex-col space-y-4">
          {set && <h1>{set.name}</h1>}
          <div className="w-96">{set && <SetTags set={set} canEdit />}</div>
          <Separator />
          <a href={`/sets/${params.setId}/game`}>
            <Button className="w-full py-8 shadow-xl" variant="positive">
              PLAY NOW
              <Play className="ml-2" size={16} fill="#e8f0ff" />
            </Button>
          </a>
          <div className="flex justify-between">
            <ToggleGroup type="single">
              <ToggleGroupItem
                onFocus={() => {
                  setIsPublic(true);
                  updateVisibility(params.setId, "publicSet", true).catch(
                    console.error,
                  );
                }}
                value="public"
                className={`${isPublic ? "bg-primary text-white" : "bg-card dark:bg-secondary"}`}
              >
                Public
              </ToggleGroupItem>
              <ToggleGroupItem
                onFocus={() => {
                  setIsPublic(false);
                  updateVisibility(params.setId, "publicSet", false).catch(
                    console.error,
                  );
                }}
                value="private"
                className={`${isPublic ? "bg-card dark:bg-secondary" : "bg-primary text-white"}`}
              >
                Private
              </ToggleGroupItem>
            </ToggleGroup>

            {set && <FlashcardSetOptions set={set} onDelete={onDelete} />}
          </div>
        </section>

        <section className="flex flex-col space-y-4 pb-12 w-full">
          <div className="flex flex-row items-center justify-between">
            <h3>Flashcards</h3>
            {set && (
              <CreateFlashcardDialog set={set}>
                <Button className="ml-auto">
                  <Plus className="mr-2" size={16} />
                  Add Flashcard
                </Button>
              </CreateFlashcardDialog>
            )}
          </div>
          <Separator />
          {set &&
            set.flashcards.map((flashCard) => (
              <FlashcardPreview
                key={flashCard.id}
                flashcard={flashCard}
                set={set}
              />
            ))}
        </section>
      </div>
      <Toaster />
    </div>
  );
};

export default FlashCardSetPage;
