'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';

interface ExpansionCommand {
  seq: number;
  open: boolean;
}

const ExpansionContext = createContext<{
  command: ExpansionCommand | null;
  expandAll: () => void;
  closeAll: () => void;
} | null>(null);

export function SidebarExpansionProvider({ children }: { children: ReactNode }) {
  const [command, setCommand] = useState<ExpansionCommand | null>(null);
  const seq = useRef(0);
  const expandAll = useCallback(() => {
    seq.current += 1;
    setCommand({ seq: seq.current, open: true });
  }, []);
  const closeAll = useCallback(() => {
    seq.current += 1;
    setCommand({ seq: seq.current, open: false });
  }, []);
  const value = useMemo(() => ({ command, expandAll, closeAll }), [command, expandAll, closeAll]);

  return <ExpansionContext.Provider value={value}>{children}</ExpansionContext.Provider>;
}

export function useControlledFolder(active: boolean, defaultOpen?: boolean) {
  const command = useContext(ExpansionContext)?.command ?? null;
  if (!command) return { key: 0, active, defaultOpen };
  return {
    key: command.seq,
    active: command.open ? active : false,
    defaultOpen: command.open,
  };
}

export function SidebarFolderControls({ children, className, ...props }: ComponentProps<'div'>) {
  const expansion = useContext(ExpansionContext);
  if (!expansion) return null;

  return (
    <div {...props} className={['flex flex-col gap-3 p-4 pb-2', className].filter(Boolean).join(' ')}>
      <div className="sidebar-folder-controls">
        <button type="button" onClick={expansion.expandAll}>
          Expand all
        </button>
        <button type="button" onClick={expansion.closeAll}>
          Close all
        </button>
      </div>
      {children}
    </div>
  );
}
