import { jsx as _jsx } from "react/jsx-runtime";
export const metadata = {
    title: 'Portal Residente - Armonía',
    description: 'Portal para residentes de complejos habitacionales'
};
export default function ResidentLayout({ children, }) {
    return (_jsx("div", { className: "resident-portal", children: children }));
}
