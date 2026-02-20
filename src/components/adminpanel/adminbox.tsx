"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "../ui/use-toast";
import { setUserType } from "@/actions/admin-actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";

export const AdminCreator = z.object({
  email: z.string().email().min(1),
});

const AdminSetter = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof AdminCreator>>({
    resolver: zodResolver(AdminCreator),
    defaultValues: {
      email: "",
    },
  });

  const queryClient = useQueryClient();

  const onAuthorise = async (data: z.infer<typeof AdminCreator>) => {
    await setUserType(data.email, "admin");

    toast({
      title: "User has been set as Admin",
    });

    await queryClient.invalidateQueries({
      queryKey: ["admins"],
    });
  };

  return (
    <div>
      <div>
        <h2 className="text-3xl flex flex-col mb-8">Set new Admin</h2>
        <h3 className="flex flex-col mb-2">
          Type in user-email to set as Admin:
        </h3>

        <Form {...form}>
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onAuthorise)}
          >
            <FormField
              name={"email"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Input {...field} placeholder={"johndoe@gmail.com"} />
                </FormItem>
              )}
            />

            <DialogClose asChild>
              <Button
                className="bg-[--clr_secondary] hover:bg-[--clr_primary] text-white px-12"
                type="submit"
              >
                Set as Admin
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminSetter;
