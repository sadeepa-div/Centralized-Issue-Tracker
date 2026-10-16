import {
  LayoutDashboard,
  FolderKanban,
  CircleDot,
  ClipboardList,
  PlusCircle,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Issues",
      path: "/issues",
      icon: CircleDot,
    },
    {
      name: "My Issues",
      path: "/my-issues",
      icon: ClipboardList,
    },
    {
      name: "Create Issue",
      path: "/create-issue",
      icon: PlusCircle,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="modern-sidebar">

      <div className="sidebar-brand">
        <div className="brand-logo">
          B
        </div>

        <div>
          <h2>BugFlow</h2>
          <span>Issue Tracker</span>
        </div>
      </div>

      <div className="sidebar-label">
        WORKSPACE
      </div>

      <nav className="sidebar-navigation">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <Icon size={19} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-user">

        <div className="sidebar-user-avatar">
          {user?.name
            ?.charAt(0)
            .toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">
          <strong>
            {user?.name || "User"}
          </strong>

          <span>
            {user?.role || "Member"}
          </span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;