'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 400,
  showSpinner: false,
});

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a');
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        NProgress.start();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <style>{`
      #nprogress { pointer-events: none; }
      #nprogress .bar {
        background: #ef4444;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        box-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #ef4444, 0 0 5px #ef4444;
        opacity: 1;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  );
}