"use client";

import { addComment } from "@/actions/comment-actions";
import { getFlashcardSet } from "@/actions/flashcard-set-actions";
import { getUserById } from "@/actions/login-actions";
import SetInfo from "@/components/profile/set-info";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import useUserSession from "@/hooks/use-user-session";
import { User } from "@/types/user-type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface FlashCardSetPageProps {
  params: {
    setId: string;
  };
}

export default function FlashcardPage({ params }: FlashCardSetPageProps) {
  const userSession = useUserSession();
  const queryClient = useQueryClient();

  const { data: set } = useQuery({
    queryKey: ["set", params.setId],
    queryFn: () => getFlashcardSet(params.setId),
  });

  const { data: user } = useQuery({
    queryKey: ["user", "user_id"],
    queryFn: () => getUserById(userSession?.uid),
    enabled: !!userSession,
  });

  const handleAddComment = (id: string) => {
    addComment(
      userSession.uid,
      id,
      (document.getElementById("comment") as HTMLInputElement).value,
    ).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["set", params.setId],
      });
    });
  };

  return (
    <main className="mb-6">
      {set && (
        <>
          <h1 className="max-w-4xl mx-auto mt-20">{set!.name}</h1>

          <section className="max-w-4xl mx-auto mt-6">
            <SetInfo set={set} user={user} />

            <Card className="flex flex-col gap-4 pb-4">
              <CardTitle className="p-4 pb-0">Comments:</CardTitle>

              <input
                id="comment"
                type="text"
                className="p-4 mx-4 rounded-md text-primary dark:text-white"
                placeholder="Add a comment..."
              ></input>
              <Button
                className="mx-4"
                onClick={() => handleAddComment(set!!.id)}
              >
                Send
              </Button>
              {set.comments!.map((comment, index) => {
                return (
                  <Card key={index} className="mx-4 border-2 p-4">
                    <CardTitle className="mb-4">{comment.createdBy}</CardTitle>
                    <hr className="mb-4" />
                    <p>{comment.content}</p>
                  </Card>
                );
              })}
            </Card>
          </section>
        </>
      )}
    </main>
  );
}
