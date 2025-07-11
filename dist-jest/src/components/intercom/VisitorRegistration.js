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
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus as PersonAddIcon, Camera as CameraIcon, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { intercomService } from '../../lib/services/intercom-service';
import Image from 'next/image';
// Esquema de validación
const schema = yup.object({
    name: yup.string().required('El nombre es obligatorio'),
    identification: yup.string().required('La identificación es obligatoria'),
    phone: yup.string().matches(/^\+?[0-9]{10,15}$/, 'Formato de teléfono inválido').optional().nullable().transform(value => value === '' ? undefined : value),
    typeId: yup.number().required('El tipo de visitante es obligatorio').min(1, 'Seleccione un tipo'),
    unitId: yup.number().required('La unidad a visitar es obligatoria').min(1, 'Seleccione una unidad'),
    purpose: yup.string().required('El propósito de la visita es obligatorio'),
    company: yup.string().optional().nullable().transform(value => value === '' ? undefined : value)
}).required();
const VisitorRegistration = () => {
    // Estados
    const { toast } = useToast();
    const [visitorTypes, setVisitorTypes] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [takingPhoto, setTakingPhoto] = useState(false);
    // Configuración del formulario
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            identification: '',
            phone: '',
            typeId: 0,
            unitId: 0,
            purpose: '',
            company: ''
        }
    });
    // Cargar datos iniciales
    const fetchData = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // En un caso real, estos datos vendrían de la API
            const typesResponse = yield fetch('/api/intercom/visitor-types');
            const typesData = yield typesResponse.json();
            setVisitorTypes(typesData);
            const unitsResponse = yield fetch('/api/intercom/units');
            const unitsData = yield unitsResponse.json();
            setUnits(unitsData);
        }
        catch (error) {
            console.error('Error al cargar datos:', error);
            toast({
                title: 'Error',
                description: 'Error al cargar datos iniciales',
                variant: 'destructive'
            });
        }
    }), [toast]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    // Manejar envío del formulario
    const onSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // Agregar foto si existe
            if (photoUrl) {
                data.photo = photoUrl;
            }
            // Registrar visita
            yield intercomService.registerVisit(data, data.unitId, data.purpose);
            // Mostrar notificación de éxito
            toast({
                title: 'Éxito',
                description: 'Visita registrada correctamente',
                variant: 'default'
            });
            // Resetear formulario
            reset();
            setPhotoUrl(null);
        }
        catch (error) {
            console.error('Error al registrar visita:', error);
            toast({
                title: 'Error',
                description: 'Error al registrar la visita',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    });
    // Función para tomar foto
    const handleTakePhoto = () => __awaiter(void 0, void 0, void 0, function* () {
        setTakingPhoto(true);
        try {
            // En un entorno real, aquí se integraría con la cámara
            // Por ahora simulamos una URL de foto
            yield new Promise(resolve => setTimeout(resolve, 1500));
            setPhotoUrl('https://via.placeholder.com/150');
        }
        catch (error) {
            console.error('Error al tomar foto:', error);
            toast({
                title: 'Error',
                description: 'Error al tomar la foto',
                variant: 'destructive'
            });
        }
        finally {
            setTakingPhoto(false);
        }
    });
    return (_jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(PersonAddIcon, { className: "mr-2 h-5 w-5" }), "Registro de Visitantes"] }), _jsx(CardDescription, { children: "Registre el ingreso de nuevos visitantes al conjunto." })] }), _jsx(CardContent, { children: _jsx("form", { onSubmit: handleSubmit(onSubmit), className: "grid gap-4 py-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "name", children: "Nombre completo" }), _jsx(Controller, { name: "name", control: control, render: ({ field }) => (_jsx(Input, Object.assign({}, field, { id: "name", placeholder: "Nombre completo del visitante" }))) }), errors.name && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.name.message }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "identification", children: "Documento de identidad" }), _jsx(Controller, { name: "identification", control: control, render: ({ field }) => (_jsx(Input, Object.assign({}, field, { id: "identification", placeholder: "N\u00FAmero de identificaci\u00F3n" }))) }), errors.identification && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.identification.message }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "phone", children: "Tel\u00E9fono (opcional)" }), _jsx(Controller, { name: "phone", control: control, render: ({ field }) => (_jsx(Input, Object.assign({}, field, { id: "phone", placeholder: "N\u00FAmero de tel\u00E9fono" }))) }), errors.phone && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.phone.message }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "company", children: "Empresa (opcional)" }), _jsx(Controller, { name: "company", control: control, render: ({ field }) => (_jsx(Input, Object.assign({}, field, { id: "company", placeholder: "Nombre de la empresa" }))) })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "typeId", children: "Tipo de visitante" }), _jsx(Controller, { name: "typeId", control: control, render: ({ field }) => (_jsxs(Select, { value: String(field.value), onValueChange: (value) => field.onChange(Number(value)), children: [_jsx(SelectTrigger, { id: "typeId", children: _jsx(SelectValue, { placeholder: "Seleccione un tipo" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "0", disabled: true, children: "Seleccione un tipo" }), visitorTypes.map((type) => (_jsx(SelectItem, { value: String(type.id), children: type.name }, type.id)))] })] })) }), errors.typeId && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.typeId.message }))] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "unitId", children: "Unidad a visitar" }), _jsx(Controller, { name: "unitId", control: control, render: ({ field }) => (_jsxs(Select, { value: String(field.value), onValueChange: (value) => field.onChange(Number(value)), children: [_jsx(SelectTrigger, { id: "unitId", children: _jsx(SelectValue, { placeholder: "Seleccione una unidad" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "0", disabled: true, children: "Seleccione una unidad" }), units.map((unit) => (_jsx(SelectItem, { value: String(unit.id), children: unit.tower ? `${unit.tower} - ${unit.number}` : unit.number }, unit.id)))] })] })) }), errors.unitId && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.unitId.message }))] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "purpose", children: "Prop\u00F3sito de la visita" }), _jsx(Controller, { name: "purpose", control: control, render: ({ field }) => (_jsx(Textarea, Object.assign({}, field, { id: "purpose", placeholder: "Prop\u00F3sito de la visita", rows: 2 }))) }), errors.purpose && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.purpose.message }))] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { children: "Foto del Visitante (Opcional)" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { type: "button", variant: "outline", onClick: handleTakePhoto, disabled: takingPhoto, children: [takingPhoto ? (_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : (_jsx(CameraIcon, { className: "mr-2 h-4 w-4" })), takingPhoto ? 'Tomando foto...' : 'Tomar foto'] }), photoUrl && (_jsx("div", { className: "relative w-24 h-24 rounded-md overflow-hidden", children: _jsx(Image, { src: photoUrl, alt: "Foto del visitante", layout: "fill", objectFit: "cover" }) }))] })] }), _jsxs(DialogFooter, { className: "col-span-full", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => {
                                            reset();
                                            setPhotoUrl(null);
                                        }, disabled: loading, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: loading, children: loading ? (_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : ('Registrar Visita') })] })] }) }) })] }));
};
export default VisitorRegistration;
