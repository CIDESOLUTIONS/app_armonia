import { jsx as _jsx } from "react/jsx-runtime";
import AuthLayout from '@/app/auth/layout';
export const metadata = {
    title: 'Administración - Armonía',
    description: 'Portal de administración para complejos residenciales'
};
export default function AdminLayout({ children }) {
    return (_jsx(AuthLayout, { children: children }));
}
