import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const AssemblyForm = ({ initialData = {}, onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState(Object.assign({ tipo: 'ordinaria', titulo: '', fecha: '', hora: '', descripcion: '', quorumRequerido: 50 }, initialData));
    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === "quorumRequerido") {
            processedValue = value === "" ? 0 : Number(value);
        }
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: processedValue })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "tipo", children: "Tipo de Asamblea" }), _jsxs(Select, { name: "tipo", value: formData.tipo, onValueChange: (value) => setFormData(prev => (Object.assign(Object.assign({}, prev), { tipo: value }))), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ordinaria", children: "Ordinaria" }), _jsx(SelectItem, { value: "extraordinaria", children: "Extraordinaria" })] })] })] }), _jsx(Input, { name: "titulo", label: "T\u00EDtulo", value: formData.titulo, onChange: handleChange, required: true }), _jsx(Input, { name: "fecha", type: "date", label: "Fecha", value: formData.fecha, onChange: handleChange, required: true }), _jsx(Input, { name: "hora", type: "time", label: "Hora", value: formData.hora, onChange: handleChange, required: true }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { htmlFor: "descripcion", children: "Descripci\u00F3n" }), _jsx(Textarea, { name: "descripcion", rows: 4, value: formData.descripcion, onChange: handleChange, className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" })] }), _jsx(Input, { name: "quorumRequerido", type: "number", label: "Qu\u00F3rum Requerido (%)", value: formData.quorumRequerido.toString(), onChange: handleChange, min: "1", max: "100", required: true })] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, disabled: isLoading, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: isLoading, children: "Guardar Asamblea" })] })] }));
};
export default AssemblyForm;
