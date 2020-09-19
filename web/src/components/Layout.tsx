import React from "react";
import Head from "next/head";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { Navbar } from "./Navbar";

interface LayoutProps {
  title?: string;
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, title }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Lireddit` : "Lireddit"}</title>
      </Head>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
