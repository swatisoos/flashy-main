import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { TagsInput } from "@/components/ui/tags-input";
import { FlashcardSet } from "@/types/flashcard-set";
import { useState } from "react";
import { setFlashCardSetTags } from "@/actions/flashcard-set-actions";
import { toast, useToast } from "@/components/ui/use-toast";

export interface SetTagsProps {
  set: FlashcardSet;
  canEdit: boolean;
}

const SetTags = ({ set }: SetTagsProps) => {
  const [editTags, setEditTags] = useState<string[]>(set?.tags || []);
  const [savedTags, setSavedTags] = useState<string[]>(set?.tags || []);
  const { toast } = useToast();

  const onTagsChange = (tags: string[]) => {
    setEditTags(tags);
  };

  const onTagsSave = () => {
    setSavedTags(editTags);
    setFlashCardSetTags(set.id, editTags).then((r) =>
      toast({
        title: "Tags Saved!",
        duration: 3000,
      }),
    );
  };

  return (
    <div className="flex flex-wrap gap-y-2">
      {savedTags.length === 0 && (
        <span className="mr-2 border border-muted rounded-2xl px-2 py-1 text-sm flex items-center text-muted">
          No tags...
        </span>
      )}
      {savedTags.map((tag: string, index: number) => (
        <span
          key={index}
          className="mr-2 bg-gray-200 bg-opacity-15 rounded-2xl px-2 py-1 text-sm flex items-center"
        >
          {tag}
        </span>
      ))}
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Edit size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit Tags</DialogTitle>
          <TagsInput initialTags={savedTags} onChange={onTagsChange} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={onTagsSave} variant="positive">
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SetTags;
