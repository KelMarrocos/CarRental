import { assets } from "./assets";

export const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/cars" },
  { name: "My Bookings", path: "/my-bookings" },
];

export const ownerMenuLinks = [
  {
    name: "Dashboard",
    path: "/owner",
    icon: assets.dashboardIcon,
    coloredIcon: assets.dashboardIconColored,
  },
  {
    name: "Add car",
    path: "/owner/add-car",
    icon: assets.addIcon,
    coloredIcon: assets.addIconColored,
  },
  {
    name: "Manage Cars",
    path: "/owner/manage-cars",
    icon: assets.carIcon,
    coloredIcon: assets.carIconColored,
  },
  {
    name: "Manage Bookings",
    path: "/owner/manage-bookings",
    icon: assets.listIcon,
    coloredIcon: assets.listIconColored,
  },
];
