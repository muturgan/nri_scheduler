import { h } from "preact";

interface ButtonProps {
	title: string;
	variant?: "primary" | "outline" | "link";
	type?: "button" | "submit" | "reset";
	onClick?: (event: MouseEvent) => void;
	href?: string;
}

export function Button({
	title,
	variant = "primary",
	type = "button",
	onClick,
	href = "#",
}: ButtonProps) {
	const className = `button button_${variant}`;

	return href ? (
		<a href={href} className={className}>
			{title}
		</a>
	) : (
		<button type={type} className={className} onClick={onClick}>
			{title}
		</button>
	);
}
