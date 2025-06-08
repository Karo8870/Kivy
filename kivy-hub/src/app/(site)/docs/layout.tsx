'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Getting Started',
    items: [
      {
        title: 'Overview',
        href: '/docs/getting-started/overview'
      },
      {
        title: 'Objectives',
        href: '/docs/getting-started/objectives'
      },
      {
        title: 'Problem identified',
        href: '/docs/getting-started/problem-identified'
      },
      {
        title: 'Scope',
        href: '/docs/getting-started/scope'
      }
    ]
  },
  {
    title: 'Hardware',
    items: [
      {
        title: 'Overview',
        href: '/docs/hardware/overview'
      },
      {
        title: 'Math',
        href: '/docs/hardware/math'
      }
    ]
  },
  {
    title: 'Recipe Embeddings',
    items: [
      {
        title: 'Overview',
        href: '/docs/recipe-embeddings/overview'
      },
      {
        title: 'Objectives',
        href: '/docs/recipe-embeddings/objectives'
      },
      {
        title: 'Architecture',
        href: '/docs/recipe-embeddings/architecture'
      },
      {
        title: 'Data',
        href: '/docs/recipe-embeddings/data'
      }
    ]
  }
];

function NavItem({ item, level = 0 }: { item: NavItem; level?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(() => {
    const checkItems = (items?: NavItem[]): boolean => {
      if (!items) return false;
      return items.some((subItem) => {
        if (pathname === subItem.href) return true;
        return checkItems(subItem.items);
      });
    };
    return checkItems(item.items);
  });

  const isActive = pathname === item.href;
  const hasItems = item.items && item.items.length > 0;
  const isMainSection = level === 0;

  if (isMainSection) {
    return (
      <div>
        <h2 className='pt-3 pb-3 text-white'>{item.title}</h2>
        {hasItems && (
          <div className='mt-1'>
            {item.items?.map((subItem, index) => (
              <NavItem key={index} item={subItem} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const margin = level > 1 ? `${level * 0.3}rem` : '0';

  if (hasItems) {
    return (
      <div className='relative pb-3'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center space-x-2 pb-2 font-medium text-white/40`}
          style={{ marginLeft: margin }}
        >
          <span>{item.title}</span>
          {isOpen ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </button>
        {isOpen && (
          <div className='mt-1'>
            {item.items?.map((subItem, index) => (
              <NavItem key={index} item={subItem} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'block py-1 font-medium',
        isActive ? 'text-[#437CFF]' : 'text-white/40',
        level > 1
          ? isActive
            ? 'border-l border-l-[#437CFF]'
            : 'border-l border-l-[#D9D9D9]/20'
          : ''
      )}
      style={{ marginLeft: margin, paddingLeft: level > 1 ? '0.5rem' : '0' }}
    >
      {item.title}
    </Link>
  );
}

export default function ({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-[calc(100vh-74px)] w-dvw'>
      <aside className='w-64 overflow-auto pt-10 pl-12'>
        <nav className='mt-4'>
          {navigation.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>
      </aside>
      <main className='flex-1 overflow-auto pt-10'>
        <div className='mx-auto max-w-4xl p-8'>{children}</div>
      </main>
    </div>
  );
}
