"use client";

import { getSavedFlashcardSets } from "@/actions/flashcard-set-actions";
import useUserSession from "@/hooks/use-user-session";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SetInfo from "@/components/profile/set-info";

export default function Favourites() {
  const userSession = useUserSession();

  const { data: sets } = useQuery({
    queryKey: ["sets", "user_id"],
    queryFn: () => getSavedFlashcardSets(userSession?.uid),
    enabled: !!userSession,
  });

  if (!userSession) {
    return null;
  }

  return (
    <main className="flex justify-center mx-auto mt-8 max-w-screen-lg">
      <section id="your_flashcards" className="flex flex-col my-auto w-9/12">
        {/* Flashcard section title and 'new' button */}
        <section id="title" className="flex pb-4">
          <h3 className="text-xl mt-4">Your Favourites</h3>
        </section>

        <Separator className="w-full h-px mb-4" />

        {/* List of user's flashcards */}
        <ul>
          <Suspense
            fallback={
              <div>
                <Skeleton className="w-96 h-16" />
                <Skeleton className="w-96 h-16" />
                <Skeleton className="w-96 h-16" />
              </div>
            }
          >
            {sets?.length === 0 && <p>No flashcards found</p>}
            {sets &&
              sets.map((set, index) => {
                return <SetInfo set={set} key={index} />;
              })}
          </Suspense>
        </ul>
      </section>
    </main>
  );
}
