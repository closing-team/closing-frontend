import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../../assets/icons/home-02.svg?react';
import GuideIcon from '../../assets/icons/book-05.svg?react';
import SupportIcon from '../../assets/icons/file-search-02.svg?react';
import MarketIcon from '../../assets/icons/bag-03.svg?react';
import { ROUTES } from '../../constants/routes';

const TABS = [
  {
    label: '홈',
    path: ROUTES.HOME,
    Icon: HomeIcon,
    isActive: (pathname: string) => pathname === '/',
  },
  {
    label: '가이드',
    path: ROUTES.GUIDE_LIST,
    Icon: GuideIcon,
    isActive: (pathname: string) => pathname.startsWith('/guide'),
  },
  {
    label: '지원정보',
    path: ROUTES.SUPPORT,
    Icon: SupportIcon,
    isActive: (pathname: string) => pathname.startsWith('/support'),
  },
  {
    label: '중고거래',
    path: ROUTES.MARKET,
    Icon: MarketIcon,
    isActive: (pathname: string) => pathname.startsWith('/market'),
  },
] as const;

const ACTIVE_COLOR = '#6558FF';
const INACTIVE_COLOR = '#9F9FA2';

export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex bg-white border-t border-gray-100">
      {TABS.map(({ label, path, Icon, isActive }) => {
        const active = isActive(pathname);
        const color = active ? ACTIVE_COLOR : INACTIVE_COLOR;
        return (
          <Link
            key={path}
            to={path}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
          >
            <Icon style={{ color }} />
            <span className="text-[10px] font-medium" style={{ color }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
