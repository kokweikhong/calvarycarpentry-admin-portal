"use client";

import React from "react";

export interface SidebarContextProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarContext = React.createContext<SidebarContextProps>({
  sidebarOpen: false,
  setSidebarOpen: () => { },
});

export const SidebarContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);


  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => React.useContext(SidebarContext);
