"use client";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/firebase/firebase";

export const SignInSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8),
});

const SignInForm = () => {
  const [signInError, setSignInError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = async (data: z.infer<typeof SignInSchema>) => {
    setSignInError("");
    try {
      await login(data);
      router.push("/profile");
    } catch (e: any) {
      setSignInError(e.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onLogin)}
        className="flex flex-col space-y-4"
      >
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
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                {...field}
                placeholder={"********"}
                className="text-white"
              />
            </FormItem>
          )}
        />
        <FormError message={signInError}></FormError>

        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  );
};

export default SignInForm;
