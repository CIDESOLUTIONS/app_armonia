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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { FormField } from '@/components/common/FormField';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// Textos para soportar múltiples idiomas
const texts = {
    es: {
        backToHome: "Volver a Inicio",
        title: "Registro de Conjunto Residencial",
        description: "Complete la información requerida para registrar su conjunto en la plataforma Armonía.",
        stepPlan: "Plan",
        stepComplex: "Conjunto",
        stepAccount: "Cuenta",
        selectPlanTitle: "Seleccione un Plan",
        basicPlan: "Plan Básico",
        basicPlanPrice: "Gratuito",
        basicPlanDesc: "Ideal para conjuntos pequeños de hasta 30 unidades.",
        basicPlanFeature1: "Gestión de propiedades y residentes",
        basicPlanFeature2: "Portal básico de comunicaciones",
        basicPlanFeature3: "Limitado a 1 año de históricos",
        selectBasicPlan: "Seleccionar Plan Básico",
        standardPlan: "Plan Estándar",
        recommended: "RECOMENDADO",
        standardPlanDesc: "Para conjuntos de hasta 50 unidades.",
        standardPlanFeature1: "Todas las funcionalidades básicas",
        standardPlanFeature2: "Gestión de asambleas y votaciones",
        standardPlanFeature3: "Sistema de PQR avanzado",
        standardPlanFeature4: "Históricos de hasta 3 años",
        selectStandardPlan: "Seleccionar Plan Estándar",
        premiumPlan: "Plan Premium",
        premiumPlanDesc: "Para conjuntos de hasta 90 unidades. ($USD 1/mes por unidad residencial adicional)",
        premiumPlanFeature1: "Todas las funcionalidades estándar",
        premiumPlanFeature2: "Módulo financiero avanzado",
        premiumPlanFeature3: "Personalización de la plataforma",
        premiumPlanFeature4: "API para integraciones",
        premiumPlanFeature5: "Históricos completos hasta 5 años",
        premiumPlanFeature6: "Soporte prioritario",
        paymentVerified: "Pago verificado",
        paymentNotVerified: "Pago pendiente de verificación",
        selectPremiumPlan: "Seleccionar Plan Premium",
        complexInfoTitle: "Información del Conjunto",
        complexName: "Nombre del conjunto",
        complexNamePlaceholder: "Ej. Conjunto Residencial Vista Hermosa",
        adminName: "Nombre del administrador",
        adminNamePlaceholder: "Nombre completo",
        phone: "Teléfono",
        phonePlaceholder: "(123) 456-7890",
        email: "Correo electrónico",
        emailPlaceholder: "correo@ejemplo.com",
        address: "Dirección",
        addressPlaceholder: "Dirección del conjunto",
        city: "Ciudad",
        cityPlaceholder: "Ciudad",
        state: "Departamento/Estado",
        statePlaceholder: "Departamento",
        country: "País",
        units: "Número de unidades",
        unitsPlaceholder: "Ej. 30",
        basicPlanLimit: "El plan básico solo permite hasta 30 unidades. Por favor, seleccione otro plan o reduzca el número de unidades.",
        standardPlanLimit: "El plan estándar solo permite hasta 50 unidades. Por favor, seleccione el plan premium o reduzca el número de unidades.",
        premiumPlanLimit: "El plan premium solo permite hasta 120 unidades. Por favor, contacte con nosotros para un plan personalizado.",
        services: "Servicios comunes",
        pool: "Piscina",
        gym: "Gimnasio",
        communityRoom: "Salón comunal",
        bbq: "Zona BBQ",
        tennis: "Cancha de tenis",
        playground: "Parque infantil",
        security: "Vigilancia 24h",
        parking: "Parqueadero",
        back: "Atrás",
        continue: "Continuar",
        accountCreationTitle: "Creación de Cuenta",
        username: "Nombre de usuario",
        usernamePlaceholder: "Nombre de usuario para acceder",
        password: "Contraseña",
        passwordPlaceholder: "Mínimo 8 caracteres",
        confirmPassword: "Confirmar contraseña",
        confirmPasswordPlaceholder: "Repita su contraseña",
        passwordsDoNotMatch: "Las contraseñas no coinciden.",
        termsAndConditions: "Acepto los",
        terms: "Términos y Condiciones",
        and: "y la",
        privacyPolicy: "Política de Privacidad",
        of: "de Armonía.",
        registerComplex: "Registrar Conjunto",
        successMessage: "¡Gracias por registrar su conjunto! Te hemos enviado un correo con los pasos a seguir para completar la configuración.",
        copyright: "© 2025 Armonía. Todos los derechos reservados."
    },
    en: {
        backToHome: "Back to Home",
        title: "Residential Complex Registration",
        description: "Complete the required information to register your complex in the Armonía platform.",
        stepPlan: "Plan",
        stepComplex: "Complex",
        stepAccount: "Account",
        selectPlanTitle: "Select a Plan",
        basicPlan: "Basic Plan",
        basicPlanPrice: "Free",
        basicPlanDesc: "Ideal for small complexes with up to 30 units.",
        basicPlanFeature1: "Property and resident management",
        basicPlanFeature2: "Basic communications portal",
        basicPlanFeature3: "Limited to 1 year of historical data",
        selectBasicPlan: "Select Basic Plan",
        standardPlan: "Standard Plan",
        recommended: "RECOMMENDED",
        standardPlanDesc: "For complexes with up to 40 units. ($USD 1/month per additional residential unit)",
        standardPlanFeature1: "All basic features",
        standardPlanFeature2: "Assembly and voting management",
        standardPlanFeature3: "Advanced PQR system",
        standardPlanFeature4: "Up to 3 years of historical data",
        selectStandardPlan: "Select Standard Plan",
        premiumPlan: "Premium Plan",
        premiumPlanDesc: "For complexes with up to 90 units. ($USD 1/month per additional residential unit)",
        premiumPlanFeature1: "All standard features",
        premiumPlanFeature2: "Advanced financial module",
        premiumPlanFeature3: "Platform customization",
        premiumPlanFeature4: "API for integrations",
        premiumPlanFeature5: "Complete historical data up to 5 years",
        premiumPlanFeature6: "Priority support",
        paymentVerified: "Payment verified",
        paymentNotVerified: "Payment pending verification",
        selectPremiumPlan: "Select Premium Plan",
        complexInfoTitle: "Complex Information",
        complexName: "Complex name",
        complexNamePlaceholder: "E.g. Vista Hermosa Residential Complex",
        adminName: "Administrator name",
        adminNamePlaceholder: "Full name",
        phone: "Phone",
        phonePlaceholder: "(123) 456-7890",
        email: "Email",
        emailPlaceholder: "email@example.com",
        address: "Address",
        addressPlaceholder: "Complex address",
        city: "City",
        cityPlaceholder: "City",
        state: "State/Province",
        statePlaceholder: "State",
        country: "Country",
        units: "Number of units",
        unitsPlaceholder: "E.g. 30",
        basicPlanLimit: "The basic plan only allows up to 30 units. Please select another plan or reduce the number of units.",
        standardPlanLimit: "The standard plan only allows up to 50 units. Please select the premium plan or reduce the number of units.",
        premiumPlanLimit: "The premium plan only allows up to 120 units. Please contact us for a custom plan.",
        services: "Common services",
        pool: "Swimming pool",
        gym: "Gym",
        communityRoom: "Community room",
        bbq: "BBQ area",
        tennis: "Tennis court",
        playground: "Playground",
        security: "24h Security",
        parking: "Parking",
        back: "Back",
        continue: "Continue",
        accountCreationTitle: "Account Creation",
        username: "Username",
        usernamePlaceholder: "Username to access",
        password: "Password",
        passwordPlaceholder: "Minimum 8 characters",
        confirmPassword: "Confirm password",
        confirmPasswordPlaceholder: "Repeat your password",
        passwordsDoNotMatch: "Passwords do not match.",
        termsAndConditions: "I accept the",
        terms: "Terms and Conditions",
        and: "and the",
        privacyPolicy: "Privacy Policy",
        of: "of Armonía.",
        registerComplex: "Register Complex",
        successMessage: "Thank you for registering your complex! We have sent you an email with the steps to complete the setup.",
        copyright: "© 2025 Armonía. All rights reserved."
    }
};
export default function RegisterComplex() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planParam = searchParams.get("plan");
    const paidParam = searchParams.get("paid");
    const [language, setLanguage] = useState("Español");
    const [currency, setCurrency] = useState("Pesos");
    const [theme, setTheme] = useState("Claro");
    const [step, setStep] = useState(1);
    const [plan, setPlan] = useState(planParam || "basic");
    const [paymentCompleted, setPaymentCompleted] = useState(paidParam === "true");
    const [transactionId, setTransactionId] = useState(null);
    // Obtener los textos traducidos
    const t = language === "Español" ? texts.es : texts.en;
    // Formulario para registro de conjunto
    const [formData, setFormData] = useState({
        complexName: "",
        adminName: "",
        adminEmail: "",
        adminPhone: "",
        address: "",
        city: "",
        country: "Colombia",
        state: "",
        units: "",
        services: [],
        username: "",
        password: "",
        confirmPassword: "",
        terms: false
    });
    // Efectos para verificar pago y recuperar datos del formulario
    useEffect(() => {
        // Verificar el estado del pago
        if (planParam && (planParam === "standard" || planParam === "premium")) {
            const storedPaymentCompleted = localStorage.getItem("paymentCompleted");
            const storedTransactionId = localStorage.getItem("transactionId");
            console.log('Verificando estado de pago:', {
                storedPaymentCompleted,
                storedTransactionId,
                paidParam,
                planParam
            });
            // Si el parámetro paid es true o hay un pago completado en localStorage
            if (storedPaymentCompleted === "true" || paidParam === "true") {
                setPaymentCompleted(true);
                // Obtener el ID de transacción del localStorage si existe
                if (storedTransactionId) {
                    setTransactionId(storedTransactionId);
                    console.log('TransactionId recuperado del localStorage:', storedTransactionId);
                }
                else {
                    console.warn('No se encontró transactionId en localStorage');
                }
            }
            // Si estamos regresando de checkout, intentamos recuperar los datos del formulario
            const storedFormData = localStorage.getItem("complexFormData");
            if (storedFormData) {
                try {
                    const parsedData = JSON.parse(storedFormData);
                    setFormData(prev => (Object.assign(Object.assign({}, prev), parsedData)));
                    console.log('Datos de formulario recuperados:', parsedData);
                }
                catch (error) {
                    console.error('Error al recuperar datos del formulario:', error);
                }
            }
            // Si el pago se completó, avanzamos al paso 2
            if (paidParam === "true" || storedPaymentCompleted === "true") {
                console.log('Avanzando al paso 2 (pago completado)');
                setStep(2);
            }
        }
        else if (planParam === "basic") {
            // Para el plan básico, si venimos directamente aquí, establecemos el step 2
            console.log('Plan básico seleccionado, avanzando al paso 2');
            setStep(2);
        }
    }, [planParam, paidParam]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
        // Limpiar error de validación al editar un campo
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const updated = Object.assign({}, prev);
                delete updated[name];
                return updated;
            });
        }
    };
    // Función de validación para el formulario
    const validateForm = () => {
        const errors = {};
        let isValid = true;
        // Validaciones paso 2: Información del conjunto
        if (step === 2) {
            if (!formData.complexName.trim()) {
                errors.complexName = language === "Español" ? 'El nombre del conjunto es obligatorio' : 'Complex name is required';
                isValid = false;
            }
            if (!formData.adminName.trim()) {
                errors.adminName = language === "Español" ? 'El nombre del administrador es obligatorio' : 'Administrator name is required';
                isValid = false;
            }
            if (!formData.adminEmail.trim()) {
                errors.adminEmail = language === "Español" ? 'El correo electrónico es obligatorio' : 'Email is required';
                isValid = false;
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
                errors.adminEmail = t.invalidEmail;
                isValid = false;
            }
            if (!formData.adminPhone.trim()) {
                errors.adminPhone = language === "Español" ? 'El teléfono es obligatorio' : 'Phone is required';
                isValid = false;
            }
            else if (!/^[0-9\s\-+()]+$/.test(formData.adminPhone)) {
                errors.adminPhone = t.invalidPhone;
                isValid = false;
            }
            if (!formData.address.trim()) {
                errors.address = language === "Español" ? 'La dirección es obligatoria' : 'Address is required';
                isValid = false;
            }
            if (!formData.city.trim()) {
                errors.city = language === "Español" ? 'La ciudad es obligatoria' : 'City is required';
                isValid = false;
            }
            if (!formData.state.trim()) {
                errors.state = language === "Español" ? 'El departamento/estado es obligatorio' : 'State is required';
                isValid = false;
            }
            if (!formData.units.trim()) {
                errors.units = language === "Español" ? 'El número de unidades es obligatorio' : 'Number of units is required';
                isValid = false;
            }
            else {
                const unitsNum = parseInt(formData.units);
                if (isNaN(unitsNum) || unitsNum <= 0) {
                    errors.units = t.invalidUnit;
                    isValid = false;
                }
                else {
                    // Validar límites según el plan
                    if (plan === "basic" && unitsNum > 25) {
                        errors.units = t.basicPlanLimit;
                        isValid = false;
                    }
                    else if (plan === "standard" && unitsNum > 40) {
                        errors.units = t.standardPlanLimit;
                        isValid = false;
                    }
                    else if (plan === "premium" && unitsNum > 90) {
                        errors.units = t.premiumPlanLimit;
                        isValid = false;
                    }
                }
            }
        }
        // Validaciones paso 3: Creación de cuenta
        if (step === 3) {
            if (!formData.username.trim()) {
                errors.username = language === "Español" ? 'El nombre de usuario es obligatorio' : 'Username is required';
                isValid = false;
            }
            if (!formData.password) {
                errors.password = language === "Español" ? 'La contraseña es obligatoria' : 'Password is required';
                isValid = false;
            }
            else if (formData.password.length < 8) {
                errors.password = t.passwordMinLength;
                isValid = false;
            }
            if (!formData.confirmPassword) {
                errors.confirmPassword = language === "Español" ? 'Debe confirmar la contraseña' : 'Password confirmation is required';
                isValid = false;
            }
            else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = t.passwordsDoNotMatch;
                isValid = false;
            }
            if (!formData.terms) {
                errors.terms = t.acceptTerms;
                isValid = false;
            }
        }
        setValidationErrors(errors);
        return isValid;
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === "terms") {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
            return;
        }
        if (checked) {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { services: [...prev.services, name] })));
        }
        else {
            setFormData(prev => (Object.assign(Object.assign({}, prev), { services: prev.services.filter(service => service !== name) })));
        }
    };
    // Actualizamos para conectar con el API y procesar la respuesta
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // Validar formulario antes de proceder
        if (!validateForm()) {
            return;
        }
        if (step < 3) {
            setStep(step + 1);
            return;
        }
        try {
            setIsSubmitting(true);
            setError("");
            // Convertir los servicios a un formato adecuado para el API
            const propertyTypes = formData.services.map(service => ({
                name: service,
                enabled: true
            }));
            // Verificar si tenemos transactionId para planes pagados
            let txId = transactionId;
            if ((plan === "standard" || plan === "premium") && !txId) {
                // Intentar recuperar de localStorage como último recurso
                const storedTransactionId = localStorage.getItem("transactionId");
                if (storedTransactionId) {
                    console.log('Recuperando transactionId de localStorage:', storedTransactionId);
                    txId = storedTransactionId;
                    setTransactionId(storedTransactionId);
                }
                else if (paymentCompleted) {
                    console.warn('Pago marcado como completado pero falta ID de transacción');
                }
                else {
                    throw new Error('Se requiere completar el pago para registrar este plan');
                }
            }
            // Crear objeto con los datos a enviar
            const requestData = {
                complexName: formData.complexName,
                totalUnits: parseInt(formData.units),
                adminName: formData.adminName,
                adminEmail: formData.adminEmail,
                adminPhone: formData.adminPhone,
                adminPassword: formData.password,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                propertyTypes,
                planCode: plan,
                username: formData.username,
                transactionId: txId
            };
            console.log('Enviando datos de registro:', {
                complexName: requestData.complexName,
                planCode: requestData.planCode,
                transactionId: requestData.transactionId
            });
            // Enviar datos al API
            const response = yield fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar el conjunto');
            }
            // Registro exitoso
            alert('¡Conjunto registrado exitosamente! Ahora puede iniciar sesión.');
            // Redirigir al portal selector
            router.push('/portal-selector');
        }
        catch (err) {
            console.error('Error de registro:', err);
            setError(err.message || 'Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.');
        }
        finally {
            setIsSubmitting(false);
        }
    });
    const handlePlanSelect = (selectedPlan) => {
        setPlan(selectedPlan);
        // Si el plan seleccionado es de pago, redirigir a la página de checkout
        if (selectedPlan === "standard" || selectedPlan === "premium") {
            // Guardar la selección y datos del formulario en localStorage para recuperarla después
            localStorage.setItem("selectedPlan", selectedPlan);
            localStorage.setItem("complexFormData", JSON.stringify(formData));
            // Redirigir a la página de checkout con el plan seleccionado
            router.push(`/checkout?plan=${selectedPlan}`);
        }
        else {
            // Para el plan básico, continuar con el flujo normal
            setStep(2);
        }
    };
    return (_jsxs("div", { className: `flex flex-col min-h-screen ${theme === "Oscuro" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`, children: [_jsx(Header, { theme: theme, setTheme: setTheme, langlanguage: language, setLanglanguage: setLanguage, currency: currency, setCurrency: setCurrency, hideNavLinks: true }), _jsxs("div", { className: "pt-5 flex-grow", children: [" ", _jsxs("div", { className: "container mx-auto px-4 py-2", children: [_jsx("div", { className: "flex items-center mb-2", children: _jsxs(Button, { variant: "ghost", onClick: () => router.push('/'), className: "text-indigo-600 hover:bg-indigo-50", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), t.backToHome] }) }), _jsxs("div", { className: "mb-3 text-center", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-indigo-600 mb-2", children: t.title }), _jsx("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: t.description })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex justify-center items-center", children: [_jsxs("div", { className: `flex items-center ${step === 1 ? "text-indigo-600" : (step > 1 ? "text-green-500" : "text-gray-400")}`, children: [_jsx("div", { className: `w-10 h-10 rounded-full border-2 flex items-center justify-center ${step === 1 ? "border-indigo-600 text-indigo-600" : (step > 1 ? "border-green-500 text-green-500" : "border-gray-300 text-gray-400")}`, children: step > 1 ? _jsx(Check, { className: "h-6 w-6" }) : "1" }), _jsx("span", { className: "ml-2 text-sm font-medium", children: t.stepPlan })] }), _jsx("div", { className: `w-16 md:w-32 h-1 mx-2 ${step > 1 ? "bg-green-500" : "bg-gray-300"}` }), _jsxs("div", { className: `flex items-center ${step === 2 ? "text-indigo-600" : (step > 2 ? "text-green-500" : "text-gray-400")}`, children: [_jsx("div", { className: `w-10 h-10 rounded-full border-2 flex items-center justify-center ${step === 2 ? "border-indigo-600 text-indigo-600" : (step > 2 ? "border-green-500 text-green-500" : "border-gray-300 text-gray-400")}`, children: step > 2 ? _jsx(Check, { className: "h-6 w-6" }) : "2" }), _jsx("span", { className: "ml-2 text-sm font-medium", children: t.stepComplex })] }), _jsx("div", { className: `w-16 md:w-32 h-1 mx-2 ${step > 2 ? "bg-green-500" : "bg-gray-300"}` }), _jsxs("div", { className: `flex items-center ${step === 3 ? "text-indigo-600" : "text-gray-400"}`, children: [_jsx("div", { className: `w-10 h-10 rounded-full border-2 flex items-center justify-center ${step === 3 ? "border-indigo-600 text-indigo-600" : "border-gray-300 text-gray-400"}`, children: "3" }), _jsx("span", { className: "ml-2 text-sm font-medium", children: t.stepAccount })] })] }) }), step === 1 && (_jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-5 text-center", children: t.selectPlanTitle }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: `bg-white p-6 rounded-lg border ${plan === "basic" ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200"} shadow-md hover:shadow-xl transition-all cursor-pointer`, onClick: () => handlePlanSelect("basic"), children: [_jsx("h3", { className: "text-xl font-bold mb-2 text-gray-900", children: t.basicPlan }), _jsx("div", { className: "text-3xl font-bold mb-3 text-gray-900", children: t.basicPlanPrice }), _jsx("p", { className: "text-gray-600 mb-4", children: t.basicPlanDesc }), _jsxs("ul", { className: "space-y-2 mb-6", children: [_jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.basicPlanFeature1 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.basicPlanFeature2 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.basicPlanFeature3 })] })] }), _jsx(Button, { className: `w-full ${plan === "basic" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-900 hover:bg-gray-800"}`, onClick: () => handlePlanSelect("basic"), children: t.selectBasicPlan })] }), _jsxs("div", { className: `bg-white p-6 rounded-lg border ${plan === "standard" ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200"} shadow-md hover:shadow-xl transition-all cursor-pointer relative`, onClick: () => handlePlanSelect("standard"), children: [_jsx("div", { className: "absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg", children: t.recommended }), _jsx("h3", { className: "text-xl font-bold mb-2 text-gray-900", children: t.standardPlan }), _jsxs("div", { className: "text-3xl font-bold mb-3 text-gray-900", children: ["$", currency === "Dólares" ? "25" : "95000", _jsx("span", { className: "text-base font-normal", children: "/mes" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: t.standardPlanDesc }), _jsxs("ul", { className: "space-y-2 mb-6", children: [_jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.standardPlanFeature1 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.standardPlanFeature2 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.standardPlanFeature3 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.standardPlanFeature4 })] })] }), _jsx(Button, { className: `w-full ${plan === "standard" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-900 hover:bg-gray-800"}`, onClick: () => handlePlanSelect("standard"), children: t.selectStandardPlan })] }), _jsxs("div", { className: `bg-white p-6 rounded-lg border ${plan === "premium" ? "border-indigo-500 ring-2 ring-indigo-500" : "border-gray-200"} shadow-md hover:shadow-xl transition-all cursor-pointer`, onClick: () => handlePlanSelect("premium"), children: [_jsx("h3", { className: "text-xl font-bold mb-2 text-gray-900", children: t.premiumPlan }), _jsxs("div", { className: "text-3xl font-bold mb-3 text-gray-900", children: ["$", currency === "Dólares" ? "50" : "190000", _jsx("span", { className: "text-base font-normal", children: "/mes" })] }), _jsx("p", { className: "text-gray-600 mb-4", children: t.premiumPlanDesc }), _jsxs("ul", { className: "space-y-2 mb-6", children: [_jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.premiumPlanFeature1 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.premiumPlanFeature2 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.premiumPlanFeature3 })] }), _jsxs("li", { className: "flex items-start", children: [_jsx(Check, { className: "h-5 w-5 text-green-500 mr-2 flex-shrink-0" }), _jsx("span", { className: "text-gray-700", children: t.premiumPlanFeature4 })] })] }), _jsx(Button, { className: `w-full ${plan === "premium" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-900 hover:bg-gray-800"}`, onClick: () => handlePlanSelect("premium"), children: t.selectPremiumPlan })] })] })] })), step === 2 && (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-5 text-center", children: t.complexInfoTitle }), _jsx("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded-lg shadow-lg", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "p-3 bg-indigo-50 border border-indigo-100 rounded-md", children: _jsx("span", { className: "font-medium text-indigo-700", children: plan === "basic" ? t.basicPlan : (plan === "standard" ? t.standardPlan : t.premiumPlan) }) }), _jsxs("div", { children: [_jsx("label", { htmlFor: "complexName", className: "block mb-2 text-sm font-medium text-gray-700", children: t.complexName }), _jsx("input", { type: "text", id: "complexName", name: "complexName", value: formData.complexName, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.complexName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.complexNamePlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" }), validationErrors.complexName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.complexName }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "adminName", className: "block mb-2 text-sm font-medium text-gray-700", children: t.adminName }), _jsx("input", { type: "text", id: "adminName", name: "adminName", value: formData.adminName, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.adminName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.adminNamePlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" }), validationErrors.adminName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.adminName }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "adminPhone", className: "block mb-2 text-sm font-medium text-gray-700", children: t.phone }), _jsx("input", { type: "tel", id: "adminPhone", name: "adminPhone", value: formData.adminPhone, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.adminPhone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.phonePlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" }), validationErrors.adminPhone && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.adminPhone }))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "adminEmail", className: "block mb-2 text-sm font-medium text-gray-700", children: t.email }), _jsx("input", { type: "email", id: "adminEmail", name: "adminEmail", value: formData.adminEmail, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.adminEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.emailPlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" }), validationErrors.adminEmail && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.adminEmail }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "address", className: "block mb-2 text-sm font-medium text-gray-700", children: t.address }), _jsx("input", { type: "text", id: "address", name: "address", value: formData.address, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.addressPlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" }), validationErrors.address && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.address }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "city", className: "block mb-2 text-sm font-medium text-gray-700", children: t.city }), _jsx("input", { type: "text", id: "city", name: "city", value: formData.city, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500", placeholder: t.cityPlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "state", className: "block mb-2 text-sm font-medium text-gray-700", children: t.state }), _jsx("input", { type: "text", id: "state", name: "state", value: formData.state, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500", placeholder: t.statePlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "country", className: "block mb-2 text-sm font-medium text-gray-700", children: t.country }), _jsxs(Select, { value: formData.country, onValueChange: (value) => handleChange({ target: { name: 'country', value } }), children: [_jsx(SelectTrigger, { id: "country", name: "country", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500", title: language === "Español" ? "Por favor seleccione una opción" : "Please select an option", children: _jsx(SelectValue, { placeholder: "Seleccione un pa\u00EDs" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "Colombia", children: "Colombia" }), _jsx(SelectItem, { value: "M\u00E9xico", children: "M\u00E9xico" }), _jsx(SelectItem, { value: "Espa\u00F1a", children: "Espa\u00F1a" }), _jsx(SelectItem, { value: "Argentina", children: "Argentina" }), _jsx(SelectItem, { value: "Chile", children: "Chile" }), _jsx(SelectItem, { value: "Per\u00FA", children: "Per\u00FA" })] })] })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "units", className: "block mb-2 text-sm font-medium text-gray-700", children: t.units }), _jsx("input", { type: "number", id: "units", name: "units", value: formData.units, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.units ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.unitsPlaceholder, required: true, title: language === "Español" ? "Por favor complete este campo" : "Please fill out this field" }), validationErrors.units ? (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.units })) : (_jsxs(_Fragment, { children: [plan === "basic" && parseInt(formData.units) > 25 && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: t.basicPlanLimit })), plan === "standard" && parseInt(formData.units) > 40 && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: t.standardPlanLimit })), plan === "premium" && parseInt(formData.units) > 90 && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: t.premiumPlanLimit }))] }))] }), _jsxs("div", { children: [_jsx("p", { className: "mb-2 text-sm font-medium text-gray-700", children: t.services }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-pool", name: "pool", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-pool", className: "text-gray-700", children: t.pool })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-gym", name: "gym", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-gym", className: "text-gray-700", children: t.gym })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-salon", name: "salon", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-salon", className: "text-gray-700", children: t.communityRoom })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-bbq", name: "bbq", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-bbq", className: "text-gray-700", children: t.bbq })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-tennis", name: "tennis", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-tennis", className: "text-gray-700", children: t.tennis })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-park", name: "park", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-park", className: "text-gray-700", children: t.playground })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-security", name: "security", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-security", className: "text-gray-700", children: t.security })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "service-parking", name: "parking", onChange: handleCheckboxChange, className: "mr-2" }), _jsx("label", { htmlFor: "service-parking", className: "text-gray-700", children: t.parking })] })] })] }), _jsxs("div", { className: "flex justify-between pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setStep(1), className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50", disabled: isSubmitting, children: t.back }), _jsx(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), language === "Español" ? "Procesando..." : "Processing..."] })) : (t.continue) })] }), error && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded", children: error }))] }) })] })), step === 3 && (_jsxs("div", { className: "max-w-xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-5 text-center", children: t.accountCreationTitle }), _jsx("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded-lg shadow-lg", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "username", className: "block mb-2 text-sm font-medium text-gray-700", children: t.username }), _jsx("input", { type: "text", id: "username", name: "username", value: formData.username, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.usernamePlaceholder, required: true }), validationErrors.username && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.username }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block mb-2 text-sm font-medium text-gray-700", children: t.password }), _jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, className: `w-full px-4 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`, placeholder: t.passwordPlaceholder, minLength: 8, required: true }), validationErrors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: validationErrors.password }))] }), _jsx(FormField, { label: t.confirmPassword, id: "confirmPassword", name: "confirmPassword", type: "password", value: formData.confirmPassword, onChange: handleChange, placeholder: t.confirmPasswordPlaceholder, error: validationErrors.confirmPassword || (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? t.passwordsDoNotMatch : null), minLength: 8, required: true }), _jsxs("div", { className: "flex items-start", children: [_jsx("input", { type: "checkbox", id: "terms", name: "terms", checked: formData.terms, onChange: handleCheckboxChange, className: "mt-1 mr-2", required: true }), _jsxs("label", { htmlFor: "terms", className: "text-sm text-gray-700", children: [t.termsAndConditions, " ", _jsx("a", { href: "#", className: "text-indigo-600 hover:text-indigo-800", children: t.terms }), " ", t.and, " ", _jsx("a", { href: "#", className: "text-indigo-600 hover:text-indigo-800", children: t.privacyPolicy }), " ", t.of] })] }), (plan === "standard" || plan === "premium") && (_jsx("div", { className: "bg-blue-50 p-3 rounded-md border border-blue-100", children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-blue-800", children: plan === "standard" ? t.standardPlan : t.premiumPlan }), paymentCompleted && transactionId ? (_jsxs("p", { className: "text-xs text-blue-600 mt-1", children: [t.paymentVerified, " (ID: ", transactionId.slice(-8), ")"] })) : (_jsx("p", { className: "text-xs text-blue-600 mt-1", children: t.paymentNotVerified }))] })] }) })), _jsxs("div", { className: "flex justify-between pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setStep(2), className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50", children: t.back }), _jsx(Button, { type: "submit", className: "bg-indigo-600 hover:bg-indigo-700", disabled: !formData.terms || formData.password !== formData.confirmPassword || isSubmitting || ((plan === "standard" || plan === "premium") && !paymentCompleted), children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), language === "Español" ? "Procesando..." : "Processing..."] })) : (t.registerComplex) })] })] }) })] }))] })] }), _jsx("footer", { className: "py-4 bg-gray-900 text-gray-400", children: _jsx("div", { className: "container mx-auto px-4 text-center", children: _jsx("p", { children: t.copyright }) }) })] }));
}
