"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Printer, FileText, Settings, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
export default function ReceiptGenerator({ token, language, onReceiptGenerated }) {
    const [activeTab, setActiveTab] = useState('individual');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Estados para generación individual
    const [propertyUnit, setPropertyUnit] = useState('');
    const [feeId, setFeeId] = useState('');
    const [receiptType, setReceiptType] = useState('STANDARD');
    // Estados para generación masiva
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('2024');
    const [feeType, setFeeType] = useState('ORDINARY');
    // Estado para envío por correo
    const [emailAddress, setEmailAddress] = useState('');
    const [generatedReceiptId, setGeneratedReceiptId] = useState(null);
    const handleGenerateIndividual = () => __awaiter(this, void 0, void 0, function* () {
        if (!propertyUnit || !feeId) {
            setError(language === 'Español' ? 'Por favor complete todos los campos' : 'Please fill all fields');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Obtener ID de propiedad a partir de la unidad
            const propertyResponse = yield fetch(`/api/properties?unitNumber=${propertyUnit}`);
            const propertyData = yield propertyResponse.json();
            if (!propertyResponse.ok || !propertyData.properties || propertyData.properties.length === 0) {
                throw new Error(language === 'Español' ? 'Unidad no encontrada' : 'Unit not found');
            }
            const propertyId = propertyData.properties[0].id;
            // Generar recibo
            const response = yield fetch('/api/finances/receipts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    propertyId,
                    feeIds: [parseInt(feeId)],
                    type: receiptType
                })
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al generar recibo');
            }
            setGeneratedReceiptId(data.id);
            setSuccess(language === 'Español' ? 'Recibo generado exitosamente' : 'Receipt generated successfully');
            onReceiptGenerated(data.pdfUrl);
            toast({
                title: language === 'Español' ? 'Recibo generado' : 'Receipt generated',
                description: language === 'Español'
                    ? `Recibo #${data.receiptNumber} generado exitosamente`
                    : `Receipt #${data.receiptNumber} successfully generated`,
                variant: 'default',
            });
        }
        catch (err) {
            console.error('[ReceiptGenerator] Error:', err);
            setError(err.message);
            toast({
                title: language === 'Español' ? 'Error' : 'Error',
                description: err.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    const handleGenerateBulk = () => __awaiter(this, void 0, void 0, function* () {
        if (!month || !year) {
            setError(language === 'Español' ? 'Por favor seleccione mes y año' : 'Please select month and year');
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = yield fetch('/api/finances/receipts/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    month: parseInt(month),
                    year: parseInt(year),
                    feeType,
                    type: receiptType
                })
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al generar recibos');
            }
            const generatedCount = data.generatedReceipts || 0;
            setSuccess(language === 'Español'
                ? `${generatedCount} recibos generados exitosamente`
                : `${generatedCount} receipts generated successfully`);
            toast({
                title: language === 'Español' ? 'Recibos generados' : 'Receipts generated',
                description: language === 'Español'
                    ? `${generatedCount} recibos generados exitosamente`
                    : `${generatedCount} receipts successfully generated`,
                variant: 'default',
            });
        }
        catch (err) {
            console.error('[ReceiptGenerator] Error:', err);
            setError(err.message);
            toast({
                title: language === 'Español' ? 'Error' : 'Error',
                description: err.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    const handleSendEmail = () => __awaiter(this, void 0, void 0, function* () {
        if (!generatedReceiptId || !emailAddress) {
            setError(language === 'Español' ? 'Recibo no generado o correo no especificado' : 'Receipt not generated or email not specified');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = yield fetch(`/api/finances/receipts/${generatedReceiptId}/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: emailAddress
                })
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar correo');
            }
            setSuccess(language === 'Español' ? 'Recibo enviado por correo exitosamente' : 'Receipt successfully sent by email');
            toast({
                title: language === 'Español' ? 'Correo enviado' : 'Email sent',
                description: language === 'Español'
                    ? `Recibo enviado exitosamente a ${emailAddress}`
                    : `Receipt successfully sent to ${emailAddress}`,
                variant: 'default',
            });
        }
        catch (err) {
            console.error('[ReceiptGenerator] Error sending email:', err);
            setError(err.message);
            toast({
                title: language === 'Español' ? 'Error' : 'Error',
                description: err.message,
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5" }), language === 'Español' ? 'Generación de Recibos' : 'Receipt Generation'] }) }), _jsxs(CardContent, { children: [_jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid grid-cols-2 mb-4", children: [_jsx(TabsTrigger, { value: "individual", children: language === 'Español' ? 'Individual' : 'Individual' }), _jsx(TabsTrigger, { value: "bulk", children: language === 'Español' ? 'Masiva' : 'Bulk' })] }), _jsxs(TabsContent, { value: "individual", className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "propertyUnit", children: language === 'Español' ? 'Unidad' : 'Unit' }), _jsx(Input, { id: "propertyUnit", placeholder: language === 'Español' ? 'Ej: A-101' : 'E.g.: A-101', value: propertyUnit, onChange: (e) => setPropertyUnit(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "feeId", children: language === 'Español' ? 'ID de Cuota' : 'Fee ID' }), _jsx(Input, { id: "feeId", placeholder: language === 'Español' ? 'Ej: 123' : 'E.g.: 123', value: feeId, onChange: (e) => setFeeId(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "receiptType", children: language === 'Español' ? 'Tipo de Recibo' : 'Receipt Type' }), _jsxs(Select, { value: receiptType, onValueChange: setReceiptType, children: [_jsx(SelectTrigger, { id: "receiptType", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar tipo' : 'Select type' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "STANDARD", children: language === 'Español' ? 'Estándar' : 'Standard' }), _jsx(SelectItem, { value: "DETAILED", children: language === 'Español' ? 'Detallado' : 'Detailed' }), _jsx(SelectItem, { value: "SIMPLIFIED", children: language === 'Español' ? 'Simplificado' : 'Simplified' })] })] })] }), _jsx(Button, { onClick: handleGenerateIndividual, disabled: loading, className: "w-full mt-2", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" }), language === 'Español' ? 'Generando...' : 'Generating...'] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(Printer, { className: "h-4 w-4 mr-2" }), language === 'Español' ? 'Generar Recibo' : 'Generate Receipt'] })) })] }), generatedReceiptId && (_jsxs("div", { className: "mt-6 pt-4 border-t border-gray-200", children: [_jsx("h4", { className: "text-sm font-medium mb-3", children: language === 'Español' ? 'Enviar Recibo por Correo' : 'Send Receipt by Email' }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "emailAddress", children: language === 'Español' ? 'Correo Electrónico' : 'Email Address' }), _jsx(Input, { id: "emailAddress", type: "email", placeholder: language === 'Español' ? 'correo@ejemplo.com' : 'email@example.com', value: emailAddress, onChange: (e) => setEmailAddress(e.target.value) })] }), _jsx(Button, { onClick: handleSendEmail, disabled: loading || !emailAddress, variant: "outline", className: "w-full", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent mr-2" }), language === 'Español' ? 'Enviando...' : 'Sending...'] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(Mail, { className: "h-4 w-4 mr-2" }), language === 'Español' ? 'Enviar por Correo' : 'Send by Email'] })) })] })] }))] }), _jsxs(TabsContent, { value: "bulk", className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "month", children: language === 'Español' ? 'Mes' : 'Month' }), _jsxs(Select, { value: month, onValueChange: setMonth, children: [_jsx(SelectTrigger, { id: "month", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar mes' : 'Select month' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "1", children: language === 'Español' ? 'Enero' : 'January' }), _jsx(SelectItem, { value: "2", children: language === 'Español' ? 'Febrero' : 'February' }), _jsx(SelectItem, { value: "3", children: language === 'Español' ? 'Marzo' : 'March' }), _jsx(SelectItem, { value: "4", children: language === 'Español' ? 'Abril' : 'April' }), _jsx(SelectItem, { value: "5", children: language === 'Español' ? 'Mayo' : 'May' }), _jsx(SelectItem, { value: "6", children: language === 'Español' ? 'Junio' : 'June' }), _jsx(SelectItem, { value: "7", children: language === 'Español' ? 'Julio' : 'July' }), _jsx(SelectItem, { value: "8", children: language === 'Español' ? 'Agosto' : 'August' }), _jsx(SelectItem, { value: "9", children: language === 'Español' ? 'Septiembre' : 'September' }), _jsx(SelectItem, { value: "10", children: language === 'Español' ? 'Octubre' : 'October' }), _jsx(SelectItem, { value: "11", children: language === 'Español' ? 'Noviembre' : 'November' }), _jsx(SelectItem, { value: "12", children: language === 'Español' ? 'Diciembre' : 'December' })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "year", children: language === 'Español' ? 'Año' : 'Year' }), _jsxs(Select, { value: year, onValueChange: setYear, children: [_jsx(SelectTrigger, { id: "year", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar año' : 'Select year' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "2023", children: "2023" }), _jsx(SelectItem, { value: "2024", children: "2024" }), _jsx(SelectItem, { value: "2025", children: "2025" })] })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "feeType", children: language === 'Español' ? 'Tipo de Cuota' : 'Fee Type' }), _jsxs(Select, { value: feeType, onValueChange: setFeeType, children: [_jsx(SelectTrigger, { id: "feeType", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar tipo' : 'Select type' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ORDINARY", children: language === 'Español' ? 'Ordinaria' : 'Regular' }), _jsx(SelectItem, { value: "EXTRAORDINARY", children: language === 'Español' ? 'Extraordinaria' : 'Extra' }), _jsx(SelectItem, { value: "ALL", children: language === 'Español' ? 'Todas' : 'All' })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "bulkReceiptType", children: language === 'Español' ? 'Tipo de Recibo' : 'Receipt Type' }), _jsxs(Select, { value: receiptType, onValueChange: setReceiptType, children: [_jsx(SelectTrigger, { id: "bulkReceiptType", children: _jsx(SelectValue, { placeholder: language === 'Español' ? 'Seleccionar tipo' : 'Select type' }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "STANDARD", children: language === 'Español' ? 'Estándar' : 'Standard' }), _jsx(SelectItem, { value: "DETAILED", children: language === 'Español' ? 'Detallado' : 'Detailed' }), _jsx(SelectItem, { value: "SIMPLIFIED", children: language === 'Español' ? 'Simplificado' : 'Simplified' })] })] })] }), _jsx(Button, { onClick: handleGenerateBulk, disabled: loading, className: "w-full mt-2", children: loading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" }), language === 'Español' ? 'Generando...' : 'Generating...'] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(Printer, { className: "h-4 w-4 mr-2" }), language === 'Español' ? 'Generar Recibos' : 'Generate Receipts'] })) })] })] }), error && (_jsx("div", { className: "mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md", children: error })), success && (_jsx("div", { className: "mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md", children: success })), _jsx("div", { className: "flex justify-end mt-4", children: _jsxs(Button, { variant: "outline", size: "sm", className: "flex items-center gap-1", children: [_jsx(Settings, { className: "h-3 w-3" }), _jsx("span", { children: language === 'Español' ? 'Configuración de Recibos' : 'Receipt Settings' })] }) })] })] }));
}
