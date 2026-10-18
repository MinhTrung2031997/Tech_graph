'use client';

import { useLayoutEffect } from 'react';

/** Keep sticky offsets in step with a header that wraps onto extra rows. */
export function DocsHeaderMeasure() {
  useLayoutEffect(() => {
    const header = document.getElementById('nd-subnav');
    const layout = document.getElementById('nd-notebook-layout');
    if (!header || !layout) return;

    const apply = () => {
      layout.style.setProperty('--fd-header-height', `${header.offsetHeight}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return null;
}
