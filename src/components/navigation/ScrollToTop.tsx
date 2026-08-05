import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash) {
      const elementId = window.location.hash.slice(1);
      const target = document.getElementById(elementId);

      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [location]);

  return null;
}