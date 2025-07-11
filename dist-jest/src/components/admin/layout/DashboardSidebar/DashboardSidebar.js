import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Users, Calendar, FileText, Settings, X } from 'lucide-react';
const DashboardSidebar = ({ isOpen, onClose }) => {
    const _router = useRouter();
    const menuItems = [
        {
            label: 'Dashboard',
            icon: Home,
            href: '/admin/dashboard'
        },
        {
            label: 'Asambleas',
            icon: Calendar,
            href: '/admin/assemblies'
        },
        {
            label: 'Residentes',
            icon: Users,
            href: '/admin/residents'
        },
        {
            label: 'Documentos',
            icon: FileText,
            href: '/admin/documents'
        },
        {
            label: 'Configuración',
            icon: Settings,
            href: '/admin/settings'
        }
    ];
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 lg:hidden", onClick: onClose })), _jsxs("aside", { className: `
        fixed top-0 left-0 z-40 h-screen w-64
        bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `, children: [_jsx("button", { onClick: onClose, className: "lg:hidden absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100", children: _jsx(X, { className: "w-6 h-6" }) }), _jsx("div", { className: "px-6 py-8", children: _jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Armon\u00EDa" }) }), _jsx("nav", { className: "px-4 space-y-1", children: menuItems.map(({ label, icon: Icon, href }) => {
                            const isActive = router.pathname === href;
                            return (_jsxs(Link, { href: href, className: `
                  flex items-center px-4 py-2 text-sm font-medium rounded-lg
                  ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'}
                `, children: [_jsx(Icon, { className: "w-5 h-5 mr-3" }), label] }, href));
                        }) })] })] }));
};
export default DashboardSidebar;
