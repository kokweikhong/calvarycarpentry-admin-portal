"use client";

import React from "react";
import { toast } from "@/components/ui/use-toast";
import { inter } from "@/lib/fonts";

export interface ToastProps {
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  style?: React.CSSProperties;
  tw?: string;
}

export interface ToastContextProps {
  toastMessage: ToastProps;
  setToastMessage: React.Dispatch<React.SetStateAction<ToastProps>>;
}

const ToastContext = React.createContext<ToastContextProps>({
  toastMessage: {
    title: "",
    message: "",
    type: "info",
  },
  setToastMessage: () => {},
});

export const ToastContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastMessage, setToastMessage] = React.useState<ToastProps>({
    title: "",
    message: "",
    type: "info",
  });

  React.useEffect(() => {
    if (toastMessage.message === "") return;
    toast({
      title: toastMessage.title,
      description: toastMessage.message,
      style: toastMessage.style ?? {},
      variant: toastMessage.type === "error" ? "destructive" : "default",
      tw: toastMessage.tw ?? "",
    });
  }, [toastMessage]);
  return (
    <ToastContext.Provider value={{ toastMessage, setToastMessage }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
