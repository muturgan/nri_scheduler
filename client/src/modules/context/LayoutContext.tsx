import { createContext, FunctionComponent } from "preact";
import { useContext, useState } from "preact/hooks";

const LayoutContext = createContext({
	showLayout: true,
	setShowLayout: (show: boolean) => {},
});

export const LayoutProvider: FunctionComponent = ({ children }) => {
	const [showLayout, setShowLayout] = useState(true);
	return (
		<LayoutContext.Provider value={{ showLayout, setShowLayout }}>
			{children}
		</LayoutContext.Provider>
	);
};

export const useLayout = () => useContext(LayoutContext);
