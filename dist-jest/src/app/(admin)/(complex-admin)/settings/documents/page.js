'use client';
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
import { useAuthStore } from '@/store/authStore';
import { Trash2, Loader2, Upload, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
export default function DocumentsSettingsPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const [documents, setDocuments] = useState([
        // Mock data
        { id: 1, name: 'Certificado de Existencia y Representación Legal', url: '/docs/cert_legal.pdf', uploadedAt: '2024-01-15' },
        { id: 2, name: 'Reglamento de Propiedad Horizontal', url: '/docs/reglamento.pdf', uploadedAt: '2023-11-01' },
    ]);
    const [newDocumentFile, setNewDocumentFile] = useState(null);
    const [newDocumentName, setNewDocumentName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewDocumentFile(e.target.files[0]);
        }
    };
    const handleUploadDocument = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!newDocumentFile || !newDocumentName.trim()) {
            toast({
                title: 'Error',
                description: 'Por favor, seleccione un archivo y escriba un nombre para el documento.',
                variant: 'destructive',
            });
            return;
        }
        setLoading(true);
        try {
            // Placeholder for API call to upload document
            console.log('Uploading document:', newDocumentName, newDocumentFile.name);
            yield new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            const newDoc = {
                id: documents.length + 1,
                name: newDocumentName,
                url: '/docs/' + newDocumentFile.name, // Mock URL
                uploadedAt: new Date().toISOString().split('T')[0],
            };
            setDocuments(prev => [...prev, newDoc]);
            setNewDocumentFile(null);
            setNewDocumentName('');
            toast({
                title: 'Éxito',
                description: 'Documento subido correctamente (simulado).',
            });
        }
        catch (error) {
            console.error('Error uploading document:', error);
            toast({
                title: 'Error',
                description: 'Error al subir el documento.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    const handleDeleteDocument = (id) => __awaiter(this, void 0, void 0, function* () {
        if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            setLoading(true);
            try {
                // Placeholder for API call to delete document
                console.log('Deleting document with ID:', id);
                yield new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                setDocuments(prev => prev.filter(doc => doc.id !== id));
                toast({
                    title: 'Éxito',
                    description: 'Documento eliminado correctamente (simulado).',
                });
            }
            catch (error) {
                console.error('Error deleting document:', error);
                toast({
                    title: 'Error',
                    description: 'Error al eliminar el documento.',
                    variant: 'destructive',
                });
            }
            finally {
                setLoading(false);
            }
        }
    });
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMPLEX_ADMIN')) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Gesti\u00F3n de Documentos Legales" }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6 mb-8", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Subir Nuevo Documento" }), _jsxs("form", { onSubmit: handleUploadDocument, className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "documentName", children: "Nombre del Documento" }), _jsx(Input, { id: "documentName", value: newDocumentName, onChange: (e) => setNewDocumentName(e.target.value), required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "documentFile", children: "Archivo" }), _jsx(Input, { id: "documentFile", type: "file", onChange: handleFileChange, required: true })] }), _jsx("div", { className: "md:col-span-2 flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : _jsx(Upload, { className: "mr-2 h-4 w-4" }), " Subir Documento"] }) })] })] }), _jsxs("div", { className: "bg-white shadow-md rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Documentos Existentes" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Fecha de Subida" }), _jsx(TableHead, {})] }) }), _jsx(TableBody, { children: documents.length > 0 ? (documents.map((doc) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("a", { href: doc.url, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:underline flex items-center", children: [_jsx(FileText, { className: "mr-2 h-4 w-4" }), " ", doc.name] }) }), _jsx(TableCell, { children: doc.uploadedAt }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteDocument(doc.id), children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }, doc.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 3, className: "text-center py-5", children: "No hay documentos registrados." }) })) })] }) })] })] }));
}
