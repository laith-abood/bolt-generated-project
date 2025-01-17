import React from 'react';

import { Url } from 'next/dist/shared/lib/router/router';
import NextLink from 'next/link';

interface CustomLinkProps {
  href: string | Url;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  locale?: string | false;
}

export const CustomLink: React.FC<CustomLinkProps> = ({
  children,
  ...props
}) => {
  return React.createElement(NextLink, props, children);
};

CustomLink.displayName = 'CustomLink';
