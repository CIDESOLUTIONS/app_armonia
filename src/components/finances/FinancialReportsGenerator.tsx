import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateFinancialReport } from '@/services/financeService';

export function FinancialReportsGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const report = await generateFinancialReport(startDate, endDate, reportType);
      // In a real application, you would likely trigger a download or display the report
      console.log('Generated Report:', report);
      toast({
        title: 'Éxito',
        description: 'Reporte generado correctamente. Revisa la consola para los datos.',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el reporte.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informes Financieros</CardTitle>
        <CardDescription>
          Genere diversos informes financieros para su complejo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reportType">Tipo de Reporte</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de reporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Resumen General</SelectItem>
                <SelectItem value="income">Ingresos</SelectItem>
                <SelectItem value="expenses">Gastos</SelectItem>
                <SelectItem value="fees">Cuotas</SelectItem>
                <SelectItem value="payments">Pagos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">Fecha de Fin</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <Download className="mr-2 h-4 w-4" /> Generar Reporte
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
