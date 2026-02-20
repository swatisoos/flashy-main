"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/lib/firebase/firebase";

export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8),
});

const RegisterForm = () => {
  const [registerError, setRegisterError] = useState("");
  const router = useRouter();

  const onRegister = async (data: z.infer<typeof RegisterSchema>) => {
    setRegisterError("");
    try {
      await signup(data);
      router.push("/profile");
    } catch (e: any) {
      setRegisterError(e.message);
    }
  };

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onRegister)}
        className="flex flex-col space-y-4"
      >
        <FormField
          name={"name"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input {...field} placeholder={"John Doe"} />
            </FormItem>
          )}
        />
        <FormField
          name={"email"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input {...field} placeholder={"johndoe@gmail.com"} />
            </FormItem>
          )}
        />

        <FormField
          name={"password"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">
                Password (min. 8 characters)
              </FormLabel>
              <Input type="password" {...field} placeholder={"********"} />
            </FormItem>
          )}
        />

        <FormError message={registerError}></FormError>

        <Button type="submit">Register</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
