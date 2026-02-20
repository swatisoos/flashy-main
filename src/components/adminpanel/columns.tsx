"use client";

import { XCircle } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { setUserType } from "@/actions/admin-actions";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";

export type UserInfo = {
  id: string;
  role: "owner" | "admin" | "user";
  email: string;
};

type DeleteAdminButtonProps = {
  row: Row<UserInfo>;
};

const DeleteAdminButton: React.FC<DeleteAdminButtonProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDeleteAdmin = async () => {
    await setUserType(row.getValue("email"), "user");
    queryClient.invalidateQueries({
      queryKey: ["admins"],
    });
    toast({
      title: "Admin has been removed",
      description: "",
    });
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDeleteAdmin}>
      <XCircle className="h-4 w-4" />
    </Button>
  );
};

export const Columns: ColumnDef<UserInfo>[] = [
  {
    accessorKey: "role",
    header: "User type",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "delete",
    cell: ({ row }) => <DeleteAdminButton row={row} />,
  },
];
