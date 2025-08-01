export type TabType = 'wantToRead' | 'reading' | 'finished';
export type ModalType = 'wantToRead-modal' | 'reading-modal' | 'finished-modal';

export type NavbarLink = {
  route: string;
  label: string;
  type?: never;
  imgURL?: never;
} | {
  type: "settings" | "notifications"; // Different type for each icons
  imgURL: string;
  label: string;
  route?: undefined;
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
    type: "notifications",
    imgURL: "notification.svg",
    label: "Notifications",
  },
  {
    type: "settings",
    imgURL: "/images/icons8-setting-30.png",
    label: "Settings",
  }
];