import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminSetter from "./adminbox";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.any(),
});

export const AdminCreator = z.object({
  email: z.string().email().min(1),
});

export default function CreateAdminDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-44 ml-auto" variant="positive">
          <Plus className="mr-2" size={16} />
          Set new admin
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed z-[250] h-auto w-auto">
        <AdminSetter></AdminSetter>
      </DialogContent>
    </Dialog>
  );
}
