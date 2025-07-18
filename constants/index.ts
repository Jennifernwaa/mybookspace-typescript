export type TabType = 'wantToRead' | 'reading' | 'finished';
export type ModalType = 'wantToRead-modal' | 'reading-modal' | 'finished-modal';

// Define a discriminated union type for NavbarLink
export type NavbarLink = {
  route: string;
  label: string;
  type?: never; // Ensures 'type' is not present for regular links
  imgURL?: never; // Ensures 'imgURL' is not present for regular links
} | {
  type: "icon";
  imgURL: string;
  label: string;
  route?: undefined; // Explicitly undefined for icon links
};

export const navbarLinks: NavbarLink[] = [
  {
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    route: "/discover",
    label: "Discover",
  },
  {
    route: "/my-books",
    label: "My Books",
  },
  {
    route: "/feed",
    label: "Friends & Feed",
  },
  {
    route: "/recommendations",
    label: "Recommendations",
  },
  {
    type: "icon",
    imgURL: "notification.svg",
    label: "Notifications",
    route: undefined, // Explicitly undefined for this type
  },
  {
    type: "icon",
    imgURL: "/images/icons8-setting-30.png",
    label: "Settings",
    route: undefined, // Explicitly undefined for this type
  }
];
