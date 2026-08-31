import { useContext } from "react";
import ThemeContext from "./ThemeContext";

const useTheme = () => {
    const value = useContext(ThemeContext);

    if (!value) {
        throw new Error("Context error | Theme context must be used within Theme Context Provider");
    }

    return value;
};

export default useTheme;
