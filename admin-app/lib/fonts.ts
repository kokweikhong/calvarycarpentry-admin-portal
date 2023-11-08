import localFont from "next/font/local";

export const roboto = localFont({
  variable: "--font-roboto",
  src: [
    {
      path: "../public/fonts/Roboto/Roboto-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});
