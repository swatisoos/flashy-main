"use client";

import { signOut } from "firebase/auth";
import { ChevronRight, LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebase";
import { useRouter } from "next/navigation";

import { ChangeTheme } from "./theme-provider";

import useUserSession from "@/hooks/use-user-session";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/actions/login-actions";

const NavBar = () => {
  const router = useRouter();
  const userSession = useUserSession();

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push("/home");
    });
  };

  const logoLink = userSession ? "/profile" : "/home";

  const { data: user } = useQuery({
    queryKey: ["user", "user_id"],
    queryFn: () => getUserById(userSession?.uid),
    enabled: !!userSession,
  });

  return (
    <div className="bg-[#203354]">
      <nav className="flex justify-between items-center w-[98%] mx-auto">
        <div className="flex items-center gap-6">
          <div>
            <Link href={logoLink}>
              <Image
                width={24}
                height={24}
                className="w-24"
                src="/Logo.svg"
                alt="Logo"
              />
            </Link>
          </div>
          <div className="nav-links duration-500 md:static absolute bg-[#203354] md:min-h-fit min-h-[80hvh] left-0 top-[-100%] md:w-auto w-full flex items-center px-5 py-4 md:px-5 md:py-4">
            <ul className="flex md:flex-row flex-col md:items-center md:gap-2">
              {userSession && (
                <li>
                  <Link href="/profile">
                    <Button variant="link" className="text-md text-white">
                      My flashcard sets
                    </Button>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/explore">
                  <Button variant="link" className="text-md text-white">
                    Explore
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ChangeTheme />
          {userSession ? (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <UserRound />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="shadow-lg py-4 px-6">
                    <Link href="/profile" className="text-sm font-semibold">
                      <Button
                        variant="link"
                        className="px-0 justify-between w-full"
                      >
                        Profile
                        <ChevronRight className="ml-2" size={14} />
                      </Button>
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="text-sm font-semibold">
                        <Button
                          variant="link"
                          className="px-1 justify-between w-full"
                        >
                          Admin page
                          <ChevronRight className="ml-2" size={14} />
                        </Button>
                      </Link>
                    )}
                    <Separator className="my-2" />
                    <Button
                      variant="link"
                      className="text-sm justify-between w-full px-0 w-24"
                      onClick={handleLogout}
                    >
                      Log out
                      <LogOut className="ml-2" size={14} />
                    </Button>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Link
              href="/sign-in-or-register"
              className="bg-[#274060] text-white px-4 py-2 rounded-full hover:bg-[#3e5777] duration-300"
            >
              Log in / Sign up
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
function setError(message: any) {
  throw new Error("Function not implemented.");
}
