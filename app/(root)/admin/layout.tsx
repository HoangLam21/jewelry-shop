import Sidebar from "@/components/shared/sidebar/Sidebar";
import React from "react";
import { requireStaffOrAdmin } from "@/lib/utils/auth";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Server-side role check
  try {
    await requireStaffOrAdmin();
  } catch (error) {
    // Redirect sẽ được xử lý bởi requireStaffOrAdmin
    redirect('/unauthorized');
  }

  return (
    <main className="background-light700_dark400 flex w-full cursor-default">
      {/* <div className=" bg-white">
        <Sidebar />
      </div> */}

      <div className={`background-light700_dark400 w-full h-full`}>
        <section className="h-screen w-full ">
          <div className="background-light700_dark400">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
