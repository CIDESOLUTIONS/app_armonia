import React, { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Esquema de validación
const schema = yup.object({
  propertyUnitId: yup.number().required("Seleccione una unidad"),
  coefficient: yup
    .number()
    .required("El coeficiente es obligatorio")
    .min(0.01, "Mínimo 0.01%")
    .max(100, "Máximo 100%"),
  attendanceType: yup.string().required("Seleccione un tipo de asistencia"),
  proxyUserId: yup.number().when("attendanceType", {
    is: "PROXY",
    then: yup
      .number()
      .required("Seleccione el propietario que otorga el poder"),
  }),
  proxyDocumentUrl: yup.string().when("attendanceType", {
    is: "PROXY",
    then: yup.string().required("Ingrese la URL del documento de poder"),
  }),
});

// Tipos de asistencia
const attendanceTypes = [
  { value: "PRESENT", label: "Presencial" },
  { value: "PROXY", label: "Por poder" },
  { value: "VIRTUAL", label: "Virtual" },
];

// Componente para registrar asistencia a una asamblea
const RegisterAttendanceDialog = ({
  open,
  onClose,
  onSubmit,
  propertyUnits,
  owners,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  propertyUnits: unknown[];
  owners: unknown[];
}) => {
  // Configuración del formulario
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      propertyUnitId: "",
      coefficient: "",
      attendanceType: "PRESENT",
      proxyUserId: "",
      proxyDocumentUrl: "",
    },
  });

  // Observar cambios en tipo de asistencia
  const watchAttendanceType = watch("attendanceType");
  const watchPropertyUnitId = watch("propertyUnitId");

  // Manejar cierre del diálogo
  const handleClose = () => {
    reset();
    onClose();
  };

  // Manejar envío del formulario
  const handleFormSubmit = (data: unknown) => {
    // Agregar información del dispositivo para asistencia virtual
    if ((data as { attendanceType: string }).attendanceType === "VIRTUAL") {
      (data as { ipAddress: string }).ipAddress = window.location.hostname;
      (data as { userAgent: string }).userAgent = navigator.userAgent;
    }

    onSubmit(data);
    reset();
  };

  // Actualizar coeficiente automáticamente al seleccionar unidad
  const updateCoefficient = useCallback(
    (propertyUnitId: number) => {
      if (!propertyUnitId) return "";

      const unit = propertyUnits.find(
        (u: unknown) => (u as { id: number }).id === propertyUnitId,
      );
      return unit ? (unit as { coefficient: number }).coefficient : "";
    },
    [propertyUnits],
  );

  useEffect(() => {
    if (watchPropertyUnitId) {
      const coef = updateCoefficient(watchPropertyUnitId);
      if (coef) {
        setValue("coefficient", coef);
      }
    }
  }, [watchPropertyUnitId, setValue, updateCoefficient]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Asistencia</DialogTitle>
          <DialogDescription>
            Complete los datos para registrar la asistencia a la asamblea.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unidad de propiedad */}
            <div className="grid gap-2">
              <Label htmlFor="propertyUnitId">Unidad</Label>
              <Controller
                name="propertyUnitId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                      const coef = updateCoefficient(Number(value));
                      if (coef) {
                        setValue("coefficient", coef);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners?.map((owner: unknown) => (
                        <SelectItem
                          key={(owner as { id: number }).id}
                          value={String((owner as { id: number }).id)}
                        >
                          {(owner as { name: string }).name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.propertyUnitId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.propertyUnitId.message}
                </p>
              )}
            </div>

            {/* Coeficiente */}
            <div className="grid gap-2">
              <Label htmlFor="coefficient">Coeficiente (%)</Label>
              <Controller
                name="coefficient"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="coefficient"
                    type="number"
                    step="0.01"
                    placeholder="Ej: 0.5, 1.2"
                  />
                )}
              />
              {errors.coefficient && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coefficient.message}
                </p>
              )}
            </div>
          </div>

          {/* Tipo de asistencia */}
          <div className="grid gap-2">
            <Label>Tipo de asistencia</Label>
            <Controller
              name="attendanceType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  {attendanceTypes.map((type) => (
                    <div key={type.value} className="flex items-center">
                      <RadioGroupItem value={type.value} id={type.value} />
                      <Label htmlFor={type.value} className="ml-2">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.attendanceType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.attendanceType.message}
              </p>
            )}
          </div>

          {/* Campos adicionales para asistencia por poder */}
          {watchAttendanceType === "PROXY" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="proxyUserId">
                  Propietario que otorga el poder
                </Label>
                <Controller
                  name="proxyUserId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione propietario" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners?.map((owner: unknown) => (
                          <SelectItem
                            key={(owner as { id: number }).id}
                            value={String((owner as { id: number }).id)}
                          >
                            {(owner as { name: string }).name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.proxyUserId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.proxyUserId.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="proxyDocumentUrl">
                  URL del documento de poder
                </Label>
                <Controller
                  name="proxyDocumentUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="proxyDocumentUrl"
                      placeholder="URL del documento"
                    />
                  )}
                />
                {errors.proxyDocumentUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.proxyDocumentUrl.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Información adicional para asistencia virtual */}
          {watchAttendanceType === "VIRTUAL" && (
            <p className="text-sm text-gray-500">
              La asistencia virtual registrará automáticamente su dirección IP y
              navegador para verificación.
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Registrar Asistencia</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterAttendanceDialog;
