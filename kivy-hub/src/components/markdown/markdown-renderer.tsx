'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Custom component for inline math
const InlineMathComponent = ({ value }: { value: string }) => {
  try {
    return <InlineMath math={value} />;
  } catch (error) {
    console.error('Error rendering inline math:', error);
    return <code>{value}</code>;
  }
};

// Custom component for block math
const BlockMathComponent = ({ value }: { value: string }) => {
  try {
    return <BlockMath math={value} />;
  } catch (error) {
    console.error('Error rendering block math:', error);
    return <pre>{value}</pre>;
  }
};

const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'mt-8 mb-4 text-4xl font-bold tracking-tight text-white',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'mt-8 mb-4 text-3xl font-semibold tracking-tight text-white',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'mt-6 mb-4 text-2xl font-semibold tracking-tight text-white',
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        'mt-4 mb-2 text-xl font-semibold tracking-tight text-white',
        className
      )}
      {...props}
    />
  ),
  p: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => {
    // Process inline math in paragraphs
    if (typeof children === 'string') {
      const parts = children.split(/(\$\$.*?\$\$|\$.*?\$)/g);
      const processedChildren = parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMathComponent key={index} value={part.slice(2, -2)} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMathComponent key={index} value={part.slice(1, -1)} />;
        }
        return part;
      });
      return (
        <p className={cn('mb-4 leading-7 text-white', className)} {...props}>
          {processedChildren}
        </p>
      );
    }
    return (
      <p className={cn('mb-4 leading-7 text-white', className)} {...props}>
        {children}
      </p>
    );
  },
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn('mb-4 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn('mb-4 ml-6 list-decimal [&>li]:mt-2', className)}
      {...props}
    />
  ),
  li: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLLIElement>) => {
    // Process inline math in list items
    if (typeof children === 'string') {
      const parts = children.split(/(\$\$.*?\$\$|\$.*?\$)/g);
      const processedChildren = parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMathComponent key={index} value={part.slice(2, -2)} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMathComponent key={index} value={part.slice(1, -1)} />;
        }
        return part;
      });
      return (
        <li className={cn('text-white', className)} {...props}>
          {processedChildren}
        </li>
      );
    }
    return (
      <li className={cn('text-white', className)} {...props}>
        {children}
      </li>
    );
  },
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-gray-300 pl-6 text-white italic',
        className
      )}
      {...props}
    />
  ),
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    // Process math in code blocks
    if (typeof children === 'string') {
      const parts = children.split(/(\$\$.*?\$\$|\$.*?\$)/g);
      const processedChildren = parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMathComponent key={index} value={part.slice(2, -2)} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMathComponent key={index} value={part.slice(1, -1)} />;
        }
        return part;
      });
      return (
        <code
          className={cn(
            'relative rounded bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-white',
            className
          )}
          {...props}
        >
          {processedChildren}
        </code>
      );
    }
    return (
      <code
        className={cn(
          'relative rounded bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-white',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => {
    // Process math in pre blocks
    if (typeof children === 'string') {
      const parts = children.split(/(\$\$.*?\$\$|\$.*?\$)/g);
      const processedChildren = parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMathComponent key={index} value={part.slice(2, -2)} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMathComponent key={index} value={part.slice(1, -1)} />;
        }
        return part;
      });
      return (
        <pre
          className={cn(
            'mt-6 mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4',
            className
          )}
          {...props}
        >
          {processedChildren}
        </pre>
      );
    }
    return (
      <pre
        className={cn(
          'mt-6 mb-4 overflow-x-auto rounded-lg bg-gray-800 p-4',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  },
  a: ({ className, ...props }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        'font-medium text-indigo-600 underline underline-offset-4',
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className='my-6 w-full overflow-y-auto'>
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('m-0 border-t border-gray-300 p-0', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border border-gray-300 bg-gray-800 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border border-gray-300 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  )
};

export function MarkdownRenderer({
  content,
  className
}: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-indigo max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
