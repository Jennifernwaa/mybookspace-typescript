export const navbarLinks = [
  {
    route: "/dashboard",
    label: "Dashboard",
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
    imgURL: "/images/icons8-setting-30.png",
    label: "Settings",
  }
];

type TabType = 'wantToRead' | 'reading' | 'finished';
type ModalType = 'wantToRead-modal' | 'reading-modal' | 'finished-modal';