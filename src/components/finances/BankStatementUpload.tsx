
"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud } from "lucide-react";
import { ReconciliationSuggestions } from "./ReconciliationSuggestions";

export function BankStatementUpload() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: "Error", description: "Por favor, selecciona un archivo." });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/finances/upload-statement", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo.");
      }

      const data = await response.json();
      setSuggestions(data);
      toast({ title: "Éxito", description: "Archivo procesado. Revisa las sugerencias." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo subir el archivo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Conciliación Bancaria</h3>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input type="file" onChange={handleFileChange} accept=".csv,.xlsx" />
        </div>
        <Button onClick={handleSubmit} disabled={loading || !file}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          Procesar Extracto
        </Button>
      </div>

      {suggestions.length > 0 && (
        <ReconciliationSuggestions suggestions={suggestions} />
      )}
    </div>
  );
}
