declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export const useScroll: any;
  export const useTransform: any;
  export const useInView: any;
  export const useAnimation: any;
}

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  type Icon = FC<SVGProps<SVGSVGElement> & { size?: number | string; color?: string; strokeWidth?: number | string }>;
  export const ShoppingBag: Icon;
  export const User: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const Search: Icon;
  export const ChevronRight: Icon;
  export const ChevronDown: Icon;
  export const ChevronLeft: Icon;
  export const ChevronUp: Icon;
  export const Instagram: Icon;
  export const Twitter: Icon;
  export const ArrowUpRight: Icon;
  export const ArrowRight: Icon;
  export const ArrowLeft: Icon;
  export const Heart: Icon;
  export const Minus: Icon;
  export const Plus: Icon;
  export const Trash2: Icon;
  export const SlidersHorizontal: Icon;
  export const Check: Icon;
  export const Star: Icon;
  export const Eye: Icon;
  export const EyeOff: Icon;
  export const Mail: Icon;
  export const Lock: Icon;
  export const Package: Icon;
  export const Settings: Icon;
  export const LogOut: Icon;
  export const Edit: Icon;
  export const DollarSign: Icon;
  export const Users: Icon;
  export const TrendingUp: Icon;
  export const BarChart3: Icon;
  export const Clock: Icon;
  export const AlertCircle: Icon;
  export const Save: Icon;
  export const Loader2: Icon;
  export const Upload: Icon;
  export const MapPin: Icon;
  export const Phone: Icon;
  export const CreditCard: Icon;
  export const Shield: Icon;
  export const Truck: Icon;
  export const RotateCcw: Icon;
  export const Headphones: Icon;
  export const Facebook: Icon;
  export const ShoppingCart: Icon;
  export const Pencil: Icon;
  export const LayoutDashboard: Icon;
}

declare module 'next/link' {
  import { FC, AnchorHTMLAttributes, PropsWithChildren } from 'react';
  interface LinkProps extends PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> {
    href: string | { pathname?: string; query?: Record<string, string> };
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    passHref?: boolean;
  }
  const Link: FC<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import { FC, ImgHTMLAttributes } from 'react';
  interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
    sizes?: string;
    className?: string;
  }
  const Image: FC<ImageProps>;
  export default Image;
}

declare module 'next/navigation' {
  export function useRouter(): {
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(href: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams<T = Record<string, string>>(): T;
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module 'react-hot-toast' {
  const toast: any;
  export const Toaster: any;
  export default toast;
}

declare module '@stripe/stripe-js' {
  export function loadStripe(publishableKey: string): Promise<any>;
}
