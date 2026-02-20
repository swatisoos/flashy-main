"use client";

import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Alert from "./deletion-alert";
import { editUser } from "@/actions/login-actions";
import { User } from "@/types/user-type";

/**
 * Form schema, Zod form validation
 */
const formSchema = z.object({
  name: z.any(),
  password: z.any(),
  picture: z.any(),
});

export function SettingsForm(user: User) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    editUser(user.id, values);
    setTimeout(() => location.reload(), 250);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 mb-8">
        {/* Column 1 - Display Name & Password */}
        <section className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-60">
                <FormLabel>Display Name:</FormLabel>
                <FormControl>
                  <Input placeholder="Navn Navnesen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-60">
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Column 2 - Profile Image & Save / Delete Account */}
        <section className="flex flex-col">
          <FormField
            control={form.control}
            name="picture"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Profile Picture:</FormLabel>
                <FormControl>
                  <div className="grid w-full items-center gap-1.5">
                    <Input
                      id="picture"
                      type="file"
                      className="text-[--clr_text] placeholder:text-[--clr_secondary] bg-[--clr_fg]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DrawerFooter className="flex-row p-0 float-end mt-auto">
            {/* Alert popup to confirm account deletion */}
            <Alert />
            <DrawerClose>
              <Button variant="positive" className="w-full">
                Save
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </section>
      </form>
    </Form>
  );
}
