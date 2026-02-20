"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Pencil, Play, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlashcardSet } from "@/types/flashcard-set";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { addCanEdit } from "@/actions/flashcard-set-actions";
import { User } from "@/types/user-type";
import { useToast } from "@/components/ui/use-toast";
import AdminDeleteSet from "@/components/explore/admin-delete-set";
import { getUserById } from "@/actions/login-actions";

interface PreviewProps {
  set: FlashcardSet;
  user?: User;
}

/**
 *
 * @param set the flashcard set to be previewed
 * @param index the index for the set in lists
 * @returns a flashcard preview box of the passed set
 */
const SetInfo = ({ set, user }: PreviewProps) => {
  const [email, setEmail] = useState("");
  const [createdBy, setCreatedBy] = useState<User | undefined>(undefined);

  const { toast } = useToast();

  useEffect(() => {
    if (set) {
      getUserById(set.createdBy).then((user) => setCreatedBy(user));
    }
  }, [set]);

  const share = async () => {
    if (email === "") {
      return;
    }
    addCanEdit(email, set.id).then((res) => {
      toast({
        title: "Set shared!",
        duration: 3000,
      });
    });
  };

  const canEdit =
    user &&
    (user.id === set.createdBy ||
      (set.canEdit && set.canEdit.includes(user.id)));
  const canDelete = canEdit || (user && user.role === "admin");

  return (
    <Card key={set.id} className="mb-4">
      <CardHeader className="flex justify-between flex-row">
        <div className="flex flex-col justify-start">
          <Link href={`/sets/${set.id}`}>
            <Button variant="link" className="px-0">
              <CardTitle>{set.name}</CardTitle>
            </Button>
          </Link>
          <span>Created by {createdBy?.name}</span>
        </div>
        <div>
          <Heart size={24} />
          <span className="ml-2">{set.likes ? set.likes : 0}</span>
        </div>
      </CardHeader>

      {/* Edit and start flashcards buttons */}
      <CardFooter className="p-5">
        {canDelete && (
          <div className="mr-4">
            <AdminDeleteSet setId={set.id}></AdminDeleteSet>
          </div>
        )}

        {canEdit && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mr-4">
                  <Share2 className="mr-2" size={16} />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share with a friend</DialogTitle>
                  <DialogDescription>
                    The person you share with will be able to edit your sets.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <Label htmlFor="name" className="text-left">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="name"
                    placeholder="example@email.com"
                    className="w-full mt-2"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose>
                    <Button type="submit" onClick={share}>
                      Share
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link className="mr-4" href={`/sets/${set.id}/edit`}>
              <Button>
                <Pencil className="mr-2" size={16} />
                Edit
              </Button>
            </Link>
          </>
        )}

        <Link
          href={`/sets/${set.id}/game`}
          className={canEdit || canDelete ? "ml-auto" : ""}
        >
          <Button variant="positive">
            PLAY NOW
            <Play className="ml-2" size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SetInfo;
