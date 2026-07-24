import type { ReactNode } from 'react';

interface AnimatedRouteProps {
  children: ReactNode;
}

export const AnimatedRoute = ({ children }: AnimatedRouteProps) => {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
};
