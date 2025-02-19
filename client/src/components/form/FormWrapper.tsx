import { FunctionComponent, h } from "preact";
import { ReactNode } from "preact/compat";

interface FormWrapperProps {
	title: string;
	children: ReactNode;
}

export const FormWrapper: FunctionComponent<FormWrapperProps> = ({
	title,
	children,
}) => {
	return (
		<div className="form">
			<div className="form__container">
				<h1 className="form__title">{title}</h1>
				{children}
			</div>
		</div>
	);
};
