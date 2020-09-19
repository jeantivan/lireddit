import React from "react";
import Head from "next/head";

interface LayoutProps {
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Lireddit` : "Lireddit"}</title>
      </Head>
      {children}
    </>
  );
};
