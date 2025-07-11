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
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createReservation } from '@/services/reservationService';
import { getAmenities } from '@/services/amenityService';
export default function CreateReservationPage() {
    const { user, loading: authLoading } = useAuthStore();
    const { toast } = useToast();
    const router = useRouter();
    const [amenities, setAmenities] = useState([]);
    const [formData, setFormData] = useState({
        commonAreaId: 0,
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        attendees: 1,
        propertyId: (user === null || user === void 0 ? void 0 : user.propertyId) || 0, // Assuming user has a propertyId
        userId: (user === null || user === void 0 ? void 0 : user.id) || 0,
    });
    const [loading, setLoading] = useState(false);
    const fetchAmenities = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getAmenities();
            setAmenities(data.filter((amenity) => amenity.isActive));
        }
        catch (error) {
            console.error('Error fetching amenities:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron cargar las áreas comunes disponibles.',
                variant: 'destructive',
            });
        }
    }), [toast]);
    useEffect(() => {
        if (!authLoading && user) {
            fetchAmenities();
        }
    }, [authLoading, user, fetchAmenities]);
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'number' ? parseInt(value) : value })));
    };
    const handleSelectChange = (name, value) => {
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: parseInt(value) })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        try {
            yield createReservation(formData);
            toast({
                title: 'Éxito',
                description: 'Reserva creada correctamente.',
            });
            router.push('/resident/reservations');
        }
        catch (error) {
            console.error('Error creating reservation:', error);
            toast({
                title: 'Error',
                description: 'Error al crear la reserva.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    });
    if (authLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return null; // Redirect handled by AuthLayout
    }
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Crear Nueva Reserva" }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-6 md:grid-cols-2", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "commonAreaId", children: "\u00C1rea Com\u00FAn" }), _jsxs(Select, { name: "commonAreaId", value: String(formData.commonAreaId), onValueChange: (value) => handleSelectChange('commonAreaId', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar \u00E1rea com\u00FAn" }) }), _jsx(SelectContent, { children: amenities.map(amenity => (_jsx(SelectItem, { value: String(amenity.id), children: amenity.name }, amenity.id))) })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "title", children: "T\u00EDtulo de la Reserva" }), _jsx(Input, { id: "title", name: "title", value: formData.title, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "startDateTime", children: "Fecha y Hora de Inicio" }), _jsx(Input, { id: "startDateTime", name: "startDateTime", type: "datetime-local", value: formData.startDateTime, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "endDateTime", children: "Fecha y Hora de Fin" }), _jsx(Input, { id: "endDateTime", name: "endDateTime", type: "datetime-local", value: formData.endDateTime, onChange: handleInputChange, required: true })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { htmlFor: "attendees", children: "N\u00FAmero de Asistentes" }), _jsx(Input, { id: "attendees", name: "attendees", type: "number", value: formData.attendees, onChange: handleInputChange, min: 1 })] }), _jsxs("div", { className: "grid gap-2 col-span-full", children: [_jsx(Label, { htmlFor: "description", children: "Descripci\u00F3n" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, rows: 3 })] }), _jsx("div", { className: "col-span-full flex justify-end", children: _jsxs(Button, { type: "submit", disabled: loading, children: [loading ? _jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null, " Crear Reserva"] }) })] })] }));
}
