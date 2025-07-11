"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
// Crear el contexto con valores por defecto
const TranslationContext = createContext({
    language: 'Español', // Idioma por defecto
    setLanguage: () => { }, // Función vacía por defecto
});
// Hook personalizado para usar el contexto de traducción
export const useTranslation = () => useContext(TranslationContext);
export const TranslationProvider = ({ children }) => {
    // Estado para almacenar el idioma actual
    const [language, setLanguage] = useState('Español');
    // Valor del contexto
    const value = {
        language,
        setLanguage,
    };
    return (_jsx(TranslationContext.Provider, { value: value, children: children }));
};
export default TranslationContext;
