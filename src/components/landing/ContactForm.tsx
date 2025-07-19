"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useState, FormEvent, ChangeEvent } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  portalType?: "admin" | "resident" | "reception" | null;
}

export default function ContactForm({ portalType = null }: ContactFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitMessage("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitMessage("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Contáctanos
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <Label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Mensaje
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </Button>
      </form>
      {submitMessage && (
        <p className="mt-4 text-center text-sm text-gray-600">
          {submitMessage}
        </p>
      )}
    </div>
  );
}