import { h } from "preact";

interface ButtonProps {
	title: string;
	variant?: "primary" | "outline" | "link";
	type?: "button" | "submit" | "reset";
	onClick?: (event: MouseEvent) => void;
	href?: string;
	className?: string;
}

export function Button({
	title,
	variant = "primary",
	type = "button",
	onClick,
	href,
	className,
}: ButtonProps) {
	const customName = `button button_${variant}`;

	return href ? (
		<a href={href} className={customName}>
			{title}
		</a>
	) : (
		<button type={type} className={customName} onClick={onClick}>
			{title}
		</button>
	);
}
