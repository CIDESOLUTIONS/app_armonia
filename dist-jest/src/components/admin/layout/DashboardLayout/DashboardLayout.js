import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import DashboardSidebar from '../DashboardSidebar';
import DashboardHeader from '../DashboardHeader';
const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx(DashboardSidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: `
        ${sidebarOpen ? 'ml-64' : 'ml-0'}
        transition-margin duration-300 ease-in-out
      `, children: [_jsx(DashboardHeader, { onMenuClick: () => setSidebarOpen(!sidebarOpen) }), _jsx("main", { className: "p-6", children: children })] })] }));
};
export default DashboardLayout;
