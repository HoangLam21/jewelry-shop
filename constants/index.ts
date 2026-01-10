export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const navbarLinks = [
  {
    route: "/",
    label: "HOME",
  },
  {
    route: "/product",
    label: "PRODUCT",
  },
  {
    route: "/about-us",
    label: "ABOUT US",
  },
  {
    route: "/contact",
    label: "CONTACT",
  },
];

export const sidebarLinks = [
  {
    icon: "material-symbols:home-rounded",
    route: "/admin",
    label: "Dashboard",
  },
  {
    icon: "heroicons:user-group-16-solid",
    route: "/admin/staff",
    label: "Staff",
  },
  {
    icon: "solar:box-bold",
    route: "/admin/provider",
    label: "Provider",
  },
  {
    icon: "ri:user-3-fill",
    route: "/admin/customer",
    label: "Customer",
  },
  {
    icon: "game-icons:pearl-necklace",
    route: "/admin/product",
    label: "Product",
  },
  {
    icon: "tabler:category-filled",
    route: "/admin/category",
    label: "Category",
  },
  {
    icon: "ic:baseline-discount",
    route: "/admin/voucher",
    label: "Voucher",
  },
  {
    icon: "lets-icons:order-fill",
    route: "/admin/order",
    label: "Order",
  },
  {
    icon: "lets-icons:import-fill",
    route: "/admin/import",
    label: "Import",
  },
  {
    icon: "mdi:finance",
    route: "/admin/finance",
    label: "Finance",
  },
  {
    icon: "uis:schedule",
    route: "/admin/work-schedule",
    label: "Work schedule",
  },
];
