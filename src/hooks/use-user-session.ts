import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebase";

function useUserSession() {
  const [user, setUser] = useState<any>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  });

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (user === undefined) return;

      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user, router]);

  return user;
}

export default useUserSession;
