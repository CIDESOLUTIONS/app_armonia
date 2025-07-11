import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export function ActivityHistory({ activities }) {
    const formatAction = (action) => {
        const actionMap = {
            'CREATE': 'Creación',
            'UPDATE': 'Actualización',
            'STATUS_CHANGE': 'Cambio de Estado',
            'DELETE': 'Eliminación'
        };
        return actionMap[action] || action;
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Historial de Actividad" }) }), _jsx(CardContent, { children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Usuario" }), _jsx(TableHead, { children: "Acci\u00F3n" }), _jsx(TableHead, { children: "Detalles" })] }) }), _jsx(TableBody, { children: activities.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, className: "text-center", children: "No hay actividades registradas" }) })) : (activities.map((activity) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: new Date(activity.createdAt).toLocaleString() }), _jsx(TableCell, { children: activity.user.name }), _jsx(TableCell, { children: formatAction(activity.action) }), _jsx(TableCell, { children: activity.details || 'Sin detalles' })] }, activity.id)))) })] }) })] }));
}
