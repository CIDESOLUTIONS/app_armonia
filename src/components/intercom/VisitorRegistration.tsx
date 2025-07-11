import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  UserPlus as PersonAddIcon,
  Camera as CameraIcon,
  Loader2
} from 'lucide-react';
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

// Interfaz para tipos de visitantes
interface VisitorType {
  id: number;
  name: string;
  description?: string;
  requiresApproval: boolean;
}

// Interfaz para unidades
interface Unit {
  id: number;
  number: string;
  tower?: string;
}

const VisitorRegistration: React.FC = () => {
  // Estados
  const { toast } = useToast();
  const [visitorTypes, setVisitorTypes] = useState<VisitorType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [takingPhoto, setTakingPhoto] = useState<boolean>(false);

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
  const fetchData = useCallback(async () => {
    try {
      // En un caso real, estos datos vendrían de la API
      const typesResponse = await fetch('/api/intercom/visitor-types');
      const typesData = await typesResponse.json();
      setVisitorTypes(typesData);

      const unitsResponse = await fetch('/api/intercom/units');
      const unitsData = await unitsResponse.json();
      setUnits(unitsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar datos iniciales',
        variant: 'destructive'
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manejar envío del formulario
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Agregar foto si existe
      if (photoUrl) {
        data.photo = photoUrl;
      }

      // Registrar visita
      await intercomService.registerVisit(data, data.unitId, data.purpose);

      // Mostrar notificación de éxito
      toast({
        title: 'Éxito',
        description: 'Visita registrada correctamente',
        variant: 'default'
      });

      // Resetear formulario
      reset();
      setPhotoUrl(null);
    } catch (error) {
      console.error('Error al registrar visita:', error);
      toast({
        title: 'Error',
        description: 'Error al registrar la visita',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para tomar foto
  const handleTakePhoto = async () => {
    setTakingPhoto(true);
    try {
      // En un entorno real, aquí se integraría con la cámara
      // Por ahora simulamos una URL de foto
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPhotoUrl('https://via.placeholder.com/150');
    } catch (error) {
      console.error('Error al tomar foto:', error);
      toast({
        title: 'Error',
        description: 'Error al tomar la foto',
        variant: 'destructive'
      });
    } finally {
      setTakingPhoto(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PersonAddIcon className="mr-2 h-5 w-5" />
          Registro de Visitantes
        </CardTitle>
        <CardDescription>Registre el ingreso de nuevos visitantes al conjunto.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Información personal */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Nombre completo del visitante"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="identification">Documento de identidad</Label>
              <Controller
                name="identification"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="identification"
                    placeholder="Número de identificación"
                  />
                )}
              />
              {errors.identification && (
                <p className="text-red-500 text-sm mt-1">{errors.identification.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    placeholder="Número de teléfono"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Empresa (opcional)</Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="company"
                    placeholder="Nombre de la empresa"
                  />
                )}
              />
            </div>

            {/* Tipo de visitante */}
            <div className="grid gap-2">
              <Label htmlFor="typeId">Tipo de visitante</Label>
              <Controller
                name="typeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="typeId">
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>Seleccione un tipo</SelectItem>
                      {visitorTypes.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.typeId && (
                <p className="text-red-500 text-sm mt-1">{errors.typeId.message}</p>
              )}
            </div>

            {/* Unidad a visitar */}
            <div className="grid gap-2">
              <Label htmlFor="unitId">Unidad a visitar</Label>
              <Controller
                name="unitId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="unitId">
                      <SelectValue placeholder="Seleccione una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0" disabled>Seleccione una unidad</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.tower ? `${unit.tower} - ${unit.number}` : unit.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.unitId && (
                <p className="text-red-500 text-sm mt-1">{errors.unitId.message}</p>
              )}
            </div>

            {/* Propósito de la visita */}
            <div className="grid gap-2 col-span-full">
              <Label htmlFor="purpose">Propósito de la visita</Label>
              <Controller
                name="purpose"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="purpose"
                    placeholder="Propósito de la visita"
                    rows={2}
                  />
                )}
              />
              {errors.purpose && (
                <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
              )}
            </div>

            {/* Foto */}
            <div className="grid gap-2 col-span-full">
              <Label>Foto del Visitante (Opcional)</Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  disabled={takingPhoto}
                >
                  {takingPhoto ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CameraIcon className="mr-2 h-4 w-4" />
                  )}
                  {takingPhoto ? 'Tomando foto...' : 'Tomar foto'}
                </Button>
                {photoUrl && (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden">
                    <Image 
                      src={photoUrl} 
                      alt="Foto del visitante" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <DialogFooter className="col-span-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setPhotoUrl(null);
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Registrar Visita'
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VisitorRegistration;