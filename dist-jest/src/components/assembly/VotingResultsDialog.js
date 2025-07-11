import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { CheckCircle as CheckIcon, Cancel as CancelIcon, PieChart as ChartIcon } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// Componente para mostrar los resultados de una votación
const VotingResultsDialog = ({ open, onClose, voting }) => {
    const theme = useTheme();
    // Si no hay votación seleccionada, no mostrar nada
    if (!voting) {
        return null;
    }
    // Preparar datos para el gráfico
    const prepareChartData = () => {
        if (!voting.result)
            return [];
        // Asegurarse de que voting.result sea un objeto con las opciones de voto
        return Object.entries(voting.result).map(([option, data]) => ({
            name: option,
            value: data.coefficient,
            count: data.count
        }));
    };
    // Colores para el gráfico
    const COLORS = [
        theme.palette.primary.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.info.main
    ];
    // Datos para el gráfico
    const chartData = prepareChartData();
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "md", fullWidth: true, children: [_jsxs(DialogTitle, { children: ["Resultados de Votaci\u00F3n: ", voting.title] }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(Paper, { sx: { p: 2, mb: 2 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Informaci\u00F3n General" }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Punto de agenda:" }), " ", voting.agendaPoint] }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Tipo de votaci\u00F3n:" }), " ", voting.type === 'SIMPLE_MAJORITY' ? 'Mayoría simple' :
                                                                voting.type === 'QUALIFIED_MAJORITY' ? 'Mayoría calificada' :
                                                                    voting.type === 'UNANIMOUS' ? 'Unanimidad' : 'Basado en coeficientes'] }), (voting.type === 'QUALIFIED_MAJORITY' || voting.type === 'COEFFICIENT_BASED') && (_jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Porcentaje requerido:" }), " ", voting.requiredPercentage, "%"] }))] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, children: [_jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Total de votos:" }), " ", voting.totalVotes] }), _jsxs(Typography, { variant: "body2", children: [_jsx("strong", { children: "Coeficiente total votado:" }), " ", voting.totalCoefficientVoted, "%"] }), _jsxs(Typography, { variant: "body2", sx: { display: 'flex', alignItems: 'center', mt: 1 }, children: [_jsx("strong", { children: "Resultado:" }), _jsx(Box, { sx: { display: 'inline-flex', alignItems: 'center', ml: 1 }, children: voting.isApproved ? (_jsxs(_Fragment, { children: [_jsx(CheckIcon, { color: "success", fontSize: "small", sx: { mr: 0.5 } }), _jsx(Typography, { variant: "body2", color: "success.main", fontWeight: "bold", children: "Aprobado" })] })) : (_jsxs(_Fragment, { children: [_jsx(CancelIcon, { color: "error", fontSize: "small", sx: { mr: 0.5 } }), _jsx(Typography, { variant: "body2", color: "error.main", fontWeight: "bold", children: "Rechazado" })] })) })] })] })] })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2, height: 300, display: 'flex', flexDirection: 'column' }, children: [_jsxs(Typography, { variant: "subtitle1", gutterBottom: true, sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(ChartIcon, { sx: { mr: 1 } }), "Distribuci\u00F3n de Votos"] }), chartData.length > 0 ? (_jsx(Box, { sx: { flexGrow: 1, width: '100%' }, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: chartData, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "value", nameKey: "name", label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`, children: chartData.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => `${value.toFixed(2)}%` }), _jsx(Legend, {})] }) }) })) : (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }, children: _jsx(Typography, { variant: "body2", color: "text.secondary", children: "No hay datos disponibles" }) }))] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Paper, { sx: { p: 2, height: 300 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Detalle de Resultados" }), _jsx(TableContainer, { sx: { maxHeight: 220 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Opci\u00F3n" }), _jsx(TableCell, { align: "right", children: "Votos" }), _jsx(TableCell, { align: "right", children: "Porcentaje" }), _jsx(TableCell, { align: "right", children: "Coeficiente" })] }) }), _jsx(TableBody, { children: chartData.length > 0 ? (chartData.map((row) => (_jsxs(TableRow, { children: [_jsx(TableCell, { component: "th", scope: "row", children: row.name }), _jsx(TableCell, { align: "right", children: row.count }), _jsxs(TableCell, { align: "right", children: [((row.count / voting.totalVotes) * 100).toFixed(2), "%"] }), _jsxs(TableCell, { align: "right", children: [row.value.toFixed(2), "%"] })] }, row.name)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 4, align: "center", children: "No hay datos disponibles" }) })) })] }) })] }) })] }) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: onClose, children: "Cerrar" }) })] }));
};
export default VotingResultsDialog;
