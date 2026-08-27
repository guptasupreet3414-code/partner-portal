import React, { createContext, useContext, useState, useCallback } from 'react';

export type Workspace = 'my' | 'partner';

interface WorkspaceContextValue {
  activeWorkspace: Workspace;
  setWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  activeWorkspace: 'my',
  setWorkspace: () => {},
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(() => {
    try {
      const stored = localStorage.getItem('dc-workspace');
      return (stored === 'partner' ? 'partner' : 'my') as Workspace;
    } catch {
      return 'my';
    }
  });

  const setWorkspace = useCallback((workspace: Workspace) => {
    setActiveWorkspace(workspace);
    try {
      localStorage.setItem('dc-workspace', workspace);
    } catch {
      // ignore
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ activeWorkspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
