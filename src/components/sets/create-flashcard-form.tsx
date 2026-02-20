"use client";

import { FlashcardSet } from "@/types/flashcard-set";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DialogClose } from "@/components/ui/dialog";
import { createFlashcard, updateFlashcard } from "@/actions/flashcard-actions";
import { Toaster } from "@/components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import { Flashcard } from "@/types/flashcard";
import { useState } from "react";
import { storage } from "@/lib/firebase/firebase";
import { v4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";

interface CreateFlashcardFormProps {
  set: FlashcardSet;
  flashcard?: Flashcard;
}

export const CreateFlashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  imageQuestionId: z.string().optional(),
});

const CreateFlashcardForm = ({ flashcard, set }: CreateFlashcardFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [img, setImg] = useState("");

  const form = useForm<z.infer<typeof CreateFlashcardSchema>>({
    resolver: zodResolver(CreateFlashcardSchema),
    defaultValues: {
      question: flashcard?.question || "",
      answer: flashcard?.answer || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateFlashcardSchema>) => {
    const imageRef = ref(storage, `files/${v4()}`);
    const snapshot = await uploadBytes(imageRef, img as any);
    data.imageQuestionId = snapshot.metadata.fullPath;
    if (flashcard) {
      updateFlashcard(set.id, flashcard.id, data).then(() => {
        toast({
          title: "Flashcard Updated",
          description: "The flashcard has been updated",
          duration: 3000,
        });
        queryClient.invalidateQueries({
          queryKey: ["set", set.id],
        });
      });
    } else {
      createFlashcard(set.id, data).then(() => {
        toast({
          title: "Flashcard Created",
          description: "The flashcard has been created",
          duration: 3000,
        });
        queryClient.invalidateQueries({
          queryKey: ["set", set.id],
        });
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <FormField
            name={"question"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="question">Question</FormLabel>
                <Input
                  {...field}
                  placeholder={"Question"}
                  className="border-primary placeholder:text-backrgound"
                />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel htmlFor="image">Image for question</FormLabel>
            <Input
              type="file"
              id="imageq"
              onChange={(e) =>
                setImg(e.target.files ? (e.target.files[0] as any) : "")
              }
              name="image"
              accept="image/*"
              className="border-primary placeholder:text-background"
            />
          </FormItem>

          <FormField
            name={"answer"}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="answer">Answer</FormLabel>
                <Input
                  {...field}
                  placeholder={"Answer"}
                  className="border-primary placeholder:text-backrgound"
                />
              </FormItem>
            )}
          />
          <DialogClose>
            <Button className="w-full" type="submit" variant="positive">
              Add Flashcard
            </Button>
          </DialogClose>
        </form>
      </Form>
    </>
  );
};

export default CreateFlashcardForm;
