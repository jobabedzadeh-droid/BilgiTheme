import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  queryParams: URLSearchParams;
  navigate: (path: string, options?: { replace?: boolean }) => void;
  setQueryParam: (key: string, value: string | null) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getPath = () => {
    const full = window.location.pathname;
    return full || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getPath());
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPath());
      setQueryParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    const [pathPart, queryPart] = path.split('?');
    setCurrentPath(pathPart || '/');
    setQueryParams(new URLSearchParams(queryPart || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setQueryParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const newSearch = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${currentPath}${newSearch}`;
    window.history.pushState({}, '', newUrl);
    setQueryParams(params);
  };

  return (
    <RouterContext.Provider value={{ currentPath, queryParams, navigate, setQueryParam }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
