import { HTMLAttributes } from 'react';

export default function ({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />;
}
