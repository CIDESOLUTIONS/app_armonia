import { jsx as _jsx } from "react/jsx-runtime";
import { Providers } from '@/components/providers';
import './globals.css';
// Eliminamos la fuente Inter para resolver el conflicto con Babel
// const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Armonía - Gestión de Conjuntos Residenciales',
    description: 'Sistema de gestión para conjuntos residenciales',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "es", children: _jsx("body", { className: "font-sans", children: _jsx(Providers, { children: children }) }) }));
}
