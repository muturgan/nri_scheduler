import { h, Fragment } from "preact";
import { ReactNode } from "preact/compat";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/header/Header";

interface LayoutProps {
	children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
	<>
		<Header />
		<main>{children}</main>
		<Toaster position="bottom-right" />
	</>
);
