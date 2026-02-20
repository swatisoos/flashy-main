import { Flashcard } from "@/types/flashcard";
import { Comment } from "@/types/comment";

export interface FlashcardSet {
  id: string;
  name: string;
  createdBy: string;
  likes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  flashcards: Flashcard[];
  comments: Comment[];
  canEdit: string[];
}
