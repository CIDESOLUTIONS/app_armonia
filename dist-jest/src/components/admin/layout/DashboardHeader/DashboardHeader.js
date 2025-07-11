import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu, Bell, Settings, User } from 'lucide-react';
import Button from '@/components/common/Button';
import Dropdown from '@/components/common/Dropdown';
const DashboardHeader = ({ onMenuClick }) => {
    const userMenuItems = [
        {
            key: 'profile',
            label: 'Perfil',
            icon: _jsx(User, { size: 16 }),
            onClick: () => console.log('Profile clicked')
        },
        {
            key: 'settings',
            label: 'Configuración',
            icon: _jsx(Settings, { size: 16 }),
            onClick: () => console.log('Settings clicked')
        },
        {
            key: 'logout',
            label: 'Cerrar Sesión',
            onClick: () => console.log('Logout clicked')
        }
    ];
    return (_jsx("header", { className: "bg-white shadow-sm", children: _jsxs("div", { className: "px-4 h-16 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: onMenuClick, className: "p-2 rounded-lg hover:bg-gray-100", children: _jsx(Menu, { className: "w-6 h-6" }) }), _jsx("h1", { className: "ml-4 text-xl font-semibold text-gray-800", children: "Armon\u00EDa" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Button, { variant: "outline", size: "sm", icon: _jsx(Bell, {}), onClick: () => console.log('Notifications clicked'), children: "Notificaciones" }), _jsx(Dropdown, { trigger: _jsxs("div", { className: "flex items-center space-x-2 cursor-pointer", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx(User, { size: 20 }) }), _jsx("span", { className: "text-sm font-medium", children: "Admin" })] }), items: userMenuItems })] })] }) }));
};
export default DashboardHeader;
