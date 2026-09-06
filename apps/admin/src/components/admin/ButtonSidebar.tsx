import { MenuIcon } from "@shared/icons";

import { useAdminSidebar } from "./AdminSidebarContext";

export function ButtonSidebar() {
  const { toggleMobile } = useAdminSidebar();

  return (
    <div className="px-10 pt-4 min-[700px]:hidden">

    <button
      type="button"
      onClick={toggleMobile}
      aria-label="Open sidebar"
      className="mb-3 p-1 text-neon-primary transition-colors hover:text-white "
    >
      <MenuIcon className="h-6 w-6" />
    </button>
    </div>
  );
}
