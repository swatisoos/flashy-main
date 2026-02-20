import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { createFlashCardSet } from "@/actions/flashcard-set-actions";
import { useRouter } from "next/navigation";
import { User } from "@/types/user-type";

const formSchema = z.object({
  name: z.any(),
});

export default function NewSet(user: User) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createFlashCardSet(values.name, user.id).then((id) => {
      router.push(`/sets/${id}`);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-44 ml-auto text-white" variant="positive">
          <Plus className="mr-2 text-white" size={16} />
          New set
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Set</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-4"
                id="new_set_form"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Set Name</FormLabel>
                      <Input
                        placeholder="Set Name"
                        {...field}
                        className="border-primary"
                      />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant="positive"
            onClick={() => form.handleSubmit(onSubmit)}
            type="submit"
            form="new_set_form"
          >
            Create Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
