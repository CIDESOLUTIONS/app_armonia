"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/components/landing/ContactForm"; // Assuming ContactForm component is already there
import { FadeIn } from "@/components/animations/FadeIn";

export function ContactSection() {
  const { t } = useTranslation("landing");

  return (
    <FadeIn delay={0.2}>
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t("contact.title")}</h2>
          <p className="text-xl mb-12">{t("contact.description")}</p>
          <ContactForm />
        </div>
      </section>
    </FadeIn>
  );
}
