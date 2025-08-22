"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import {
  DocumentSearchParams,
  DocumentType,
  DocumentStatus,
  AccessLevel,
  getDocumentCategories,
} from '@/services/documentService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentFiltersProps {
  onFiltersChange: (filters: DocumentSearchParams) => void;
  loading?: boolean;
  initialFilters?: DocumentSearchParams;
}

const DOCUMENT_TYPES = [
  { value: DocumentType.REGULATION, label: 'Reglamento' },
  { value: DocumentType.MINUTES, label: 'Actas' },
  { value: DocumentType.MANUAL, label: 'Manual' },
  { value: DocumentType.CONTRACT, label: 'Contrato' },
  { value: DocumentType.INVOICE, label: 'Factura' },
  { value: DocumentType.REPORT, label: 'Reporte' },
  { value: DocumentType.FINANCIAL, label: 'Financiero' },
  { value: DocumentType.LEGAL, label: 'Legal' },
  { value: DocumentType.ASSEMBLY, label: 'Asamblea' },
  { value: DocumentType.BUDGET, label: 'Presupuesto' },
  { value: DocumentType.EXPENSE, label: 'Gasto' },
  { value: DocumentType.COMMUNICATION, label: 'Comunicación' },
  { value: DocumentType.CERTIFICATE, label: 'Certificado' },
  { value: DocumentType.OTHER, label: 'Otro' },
];

const DOCUMENT_STATUSES = [
  { value: DocumentStatus.ACTIVE, label: 'Activo' },
  { value: DocumentStatus.DRAFT, label: 'Borrador' },
  { value: DocumentStatus.ARCHIVED, label: 'Archivado' },
];

const ACCESS_LEVELS = [
  { value: AccessLevel.PUBLIC, label: 'Público' },
  { value: AccessLevel.RESIDENTS, label: 'Residentes' },
  { value: AccessLevel.ADMIN, label: 'Administradores' },
  { value: AccessLevel.RESTRICTED, label: 'Restringido' },
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Más recientes' },
  { value: 'createdAt-asc', label: 'Más antiguos' },
  { value: 'name-asc', label: 'Nombre A-Z' },
  { value: 'name-desc', label: 'Nombre Z-A' },
  { value: 'fileSize-desc', label: 'Tamaño (mayor)' },
  { value: 'fileSize-asc', label: 'Tamaño (menor)' },
  { value: 'downloadCount-desc', label: 'Más descargados' },
  { value: 'viewCount-desc', label: 'Más vistos' },
];

export function DocumentFilters({ onFiltersChange, loading, initialFilters }: DocumentFiltersProps) {
  const [filters, setFilters] = useState<DocumentSearchParams>(initialFilters || {
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getDocumentCategories();
        setCategories(data.categories);
        setSubcategories(data.subcategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const updateFilters = (updates: Partial<DocumentSearchParams>) => {
    const newFilters = {
      ...filters,
      ...updates,
      page: updates.page || 1, // Reset page when changing filters
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      dateFrom: dateFrom ? dateFrom.toISOString() : undefined,
      dateTo: dateTo ? dateTo.toISOString() : undefined,
      page: 1,
    };
    setFilters(searchFilters);
    onFiltersChange(searchFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    };
    setFilters(resetFilters);
    setSelectedTags([]);
    setTagInput('');
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange(resetFilters);
  };

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag();
      } else {
        handleSearch();
      }
    }
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    if (['page', 'limit', 'sortBy', 'sortOrder'].includes(key)) return false;
    return filters[key as keyof DocumentSearchParams] !== undefined;
  }) || selectedTags.length > 0 || dateFrom || dateTo;

  const activeFiltersCount = [
    filters.query,
    filters.type,
    filters.category,
    filters.subcategory,
    filters.status,
    filters.accessLevel,
    filters.uploadedBy,
    filters.expiringSoon,
    filters.hasVersions,
    selectedTags.length > 0 ? 'tags' : null,
    dateFrom ? 'dateFrom' : null,
    dateTo ? 'dateTo' : null,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Búsqueda principal */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={filters.query || ''}
              onChange={(e) => updateFilters({ query: e.target.value || undefined })}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={loading}
            size="default"
          >
            Buscar
          </Button>
        </div>

        {/* Ordenamiento */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label className="text-sm font-medium">Ordenar por</Label>
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avanzados - colapsables */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Tipo y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Tipo de documento</Label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => updateFilters({ type: value as DocumentType || undefined })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Estado</Label>
                <Select
                  value={filters.status || ''}
                  onValueChange={(value) => updateFilters({ status: value as DocumentStatus || undefined })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los estados</SelectItem>
                    {DOCUMENT_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categoría y Subcategoría */}
            {categories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Categoría</Label>
                  <Select
                    value={filters.category || ''}
                    onValueChange={(value) => {
                      updateFilters({ 
                        category: value || undefined,
                        subcategory: undefined // Reset subcategory when category changes
                      });
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filters.category && subcategories[filters.category] && (
                  <div>
                    <Label className="text-sm font-medium">Subcategoría</Label>
                    <Select
                      value={filters.subcategory || ''}
                      onValueChange={(value) => updateFilters({ subcategory: value || undefined })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Todas las subcategorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas las subcategorías</SelectItem>
                        {subcategories[filters.category].map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Nivel de acceso */}
            <div>
              <Label className="text-sm font-medium">Nivel de acceso</Label>
              <Select
                value={filters.accessLevel || ''}
                onValueChange={(value) => updateFilters({ accessLevel: value as AccessLevel || undefined })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los niveles</SelectItem>
                  {ACCESS_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    Agregar
                  </Button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Fecha desde</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium">Fecha hasta</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expiring-soon"
                  checked={filters.expiringSoon || false}
                  onCheckedChange={(checked) => updateFilters({ expiringSoon: checked as boolean || undefined })}
                />
                <Label htmlFor="expiring-soon" className="text-sm">
                  Solo documentos que expiran pronto
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-versions"
                  checked={filters.hasVersions || false}
                  onCheckedChange={(checked) => updateFilters({ hasVersions: checked as boolean || undefined })}
                />
                <Label htmlFor="has-versions" className="text-sm">
                  Solo documentos con múltiples versiones
                </Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}