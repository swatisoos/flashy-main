"use client";

import { getAdmins } from "@/actions/admin-actions";
import { AdminTable } from "@/components/adminpanel/admintable";
import { Columns } from "@/components/adminpanel/columns";
import { useQuery } from "@tanstack/react-query";
import CreateAdminDialog from "@/components/adminpanel/new-admin-dialog";
import { Toaster } from "@/components/ui/toaster";

const Adminpanel = () => {
  const { data: admins } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins(),
  });

  if (!admins) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen px-20">
        <div>
          <AdminTable columns={Columns} data={admins} />
        </div>

        <div>
          <div className="mt-8 justify-center">
            <CreateAdminDialog />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Adminpanel;
