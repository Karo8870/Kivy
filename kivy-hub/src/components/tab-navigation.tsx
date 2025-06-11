import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState
} from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TabNavigation({
  children,
  onChange
}: {
  children: ReactNode;
  onChange?: (key: string | null) => void;
}) {
  const pathname = usePathname();

  const validChildren = Children.toArray(children).filter(isValidElement);

  const [activeKey, setActiveKey] = useState<string | null>(
    pathname === '/' ? 'home' : 'documentation'
  );

  return (
    <div className='flex max-w-min'>
      {validChildren.map((child) => {
        if (!isValidElement(child)) return null;

        const isActive = child.key?.includes(activeKey || '');

        return (
          <Link
            // @ts-ignore
            href={child.props!.url}
            key={child.key}
            className='relative cursor-pointer px-4 py-2.5'
            onClick={() => {
              setActiveKey(child.key);
              if (onChange && child.key) {
                onChange(child.key);
              }
            }}
          >
            {cloneElement(child)}
            {isActive && (
              <motion.div
                layoutId='active-tab'
                className='absolute top-0 left-0 z-[-1] h-full w-full gap-3 rounded-full bg-[#818181]/20'
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function TabNavigationItem({
  children,
  className,
  url
}: {
  children: ReactNode;
  className?: string;
  url?: string;
}) {
  return <div className={className}>{children}</div>;
}
