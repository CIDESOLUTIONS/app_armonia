import { jsx as _jsx } from "react/jsx-runtime";
export default function PublicLayout({ children }) {
    return (_jsx("html", { lang: "es", children: _jsx("body", { children: children }) }));
}
