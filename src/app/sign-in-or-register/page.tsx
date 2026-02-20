import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInForm from "@/components/sign-in-register/sign-in-form";
import RegisterForm from "@/components/sign-in-register/register-form";

export default function LogIn() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Tabs defaultValue="account" className="w-[400px">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Sign in</TabsTrigger>
          <TabsTrigger value="Signup">Create account</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Sign in to Flashy</CardTitle>
              <CardDescription>
                Sign in to Flashy with your existing account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SignInForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Signup">
          <Card>
            <CardHeader>
              <CardTitle>Create account</CardTitle>
              <CardDescription>
                Create a new account using your email to start using Flashy!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <RegisterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
