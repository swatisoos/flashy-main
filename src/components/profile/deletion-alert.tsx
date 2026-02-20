import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function Alert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="px-4 bg-red-600 hover:bg-red-800">
          <Trash className="mr-2" size={16} />
          Delete my account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[--clr_secondary] border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[--clr_text]">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[--clr_primary] border-none hover:bg-primary/90 hover:text-[--clr_text]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-800">
            Yes, delete my account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
