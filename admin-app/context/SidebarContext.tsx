"use client";

import React from "react";

type SidebarContextProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type SidebarProviderProps = {
  children: React.ReactNode;
};

const SidebarContext = React.createContext<SidebarContextProps>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
});

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => React.useContext(SidebarContext);
