import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookIcon,
  FileSearchIcon,
  BagIcon,
} from "../../assets/icons";
import { ROUTES } from "../../constants/routes";

const TABS = [
  {
    label: "홈",
    path: ROUTES.HOME,
    Icon: HomeIcon,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    label: "가이드",
    path: ROUTES.GUIDE,
    Icon: BookIcon,
    isActive: (pathname: string) => pathname.startsWith(ROUTES.GUIDE),
  },
  {
    label: "지원정보",
    path: ROUTES.SUPPORT,
    Icon: FileSearchIcon,
    isActive: (pathname: string) => pathname.startsWith(ROUTES.SUPPORT),
  },
  {
    label: "중고거래",
    path: ROUTES.USED,
    Icon: BagIcon,
    isActive: (pathname: string) => pathname.startsWith(ROUTES.USED),
  },
] as const;

export default function NavigationBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 items-center justify-between border-t border-gray-100 bg-white px-8 pt-2 pb-6">
      {TABS.map(({ label, path, Icon, isActive }) => {
        const active = isActive(pathname);
        return (
          <Link
            key={path}
            to={path}
            className={`flex shrink-0 flex-col items-center justify-center gap-1.5 px-3 py-1 ${active ? "text-primary-500" : "text-gray-200"}`}
          >
            <Icon />
            <span className="text-caption-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
