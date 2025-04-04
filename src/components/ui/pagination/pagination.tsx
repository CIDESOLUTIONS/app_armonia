// src/components/ui/pagination/pagination.tsx
"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

/**
 * Componente de paginación reutilizable
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  siblingCount = 1,
}: PaginationProps) {
  // No renderizar paginación si solo hay una página
  if (totalPages <= 1) {
    return null;
  }

  // Función para generar un rango de números
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  // Determinar qué páginas mostrar
  const generatePaginationItems = () => {
    // Siempre mostrar la primera, última y páginas cercanas a la actual
    const firstPage = 1;
    const lastPage = totalPages;
    
    // Determinar el rango de páginas cercanas a la actual
    let startPage = Math.max(2, currentPage - siblingCount);
    let endPage = Math.min(lastPage - 1, currentPage + siblingCount);
    
    // Ajustar si el rango está muy cerca del inicio o fin
    if (currentPage - siblingCount <= 2) {
      endPage = Math.min(lastPage - 1, 2 + siblingCount * 2);
    }
    
    if (currentPage + siblingCount >= lastPage - 1) {
      startPage = Math.max(2, lastPage - 1 - siblingCount * 2);
    }
    
    // Generar los elementos de paginación
    const items: (number | "dots-left" | "dots-right")[] = [];
    
    // Siempre agregar la primera página
    items.push(firstPage);
    
    // Agregar puntos suspensivos si hay un salto desde la primera página
    if (startPage > 2) {
      items.push("dots-left");
    }
    
    // Agregar las páginas del rango calculado
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }
    
    // Agregar puntos suspensivos si hay un salto hasta la última página
    if (endPage < lastPage - 1) {
      items.push("dots-right");
    }
    
    // Siempre agregar la última página si es diferente de la primera
    if (lastPage !== firstPage) {
      items.push(lastPage);
    }
    
    return items;
  };

  const paginationItems = generatePaginationItems();

  return (
    <nav className={`flex justify-center ${className}`} aria-label="Paginación">
      <ul className="flex items-center gap-1">
        {/* Botón Anterior */}
        <li>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>
        
        {/* Elementos de paginación */}
        {paginationItems.map((item, index) => {
          if (item === "dots-left" || item === "dots-right") {
            return (
              <li key={`dots-${index}`}>
                <span className="px-2">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </span>
              </li>
            );
          }
          
          const isActive = item === currentPage;
          
          return (
            <li key={item}>
              <Button
                variant={isActive ? "default" : "outline"}
                className={`h-8 w-8 ${isActive ? "bg-indigo-600 text-white" : ""}`}
                onClick={() => onPageChange(item)}
                aria-current={isActive ? "page" : undefined}
              >
                {item}
              </Button>
            </li>
          );
        })}
        
        {/* Botón Siguiente */}
        <li>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}