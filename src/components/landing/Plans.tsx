"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoRequestModal } from "./DemoRequestModal";

export function Plans() {
  const { t } = useTranslation("landing.pricing");
  const [currency, setCurrency] = useState("USD"); // Default to USD

  return (
    <section id="planes" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("title")}</h2>
        <p className="text-xl text-gray-600 mb-12">{t("description")}</p>

        <div className="mb-8">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="USD">USD</option>
            <option value="COP">COP</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Basic Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-indigo-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("basic.name")}
            </h3>
            <p className="text-gray-600 mb-6">{t("basic.description")}</p>
            <div className="text-5xl font-extrabold text-indigo-600 mb-6">
              {t("basic.price")}
            </div>
            <ul className="text-left text-gray-700 space-y-3 mb-8">
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("basic.feature1")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("basic.feature2")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("basic.feature3")}
              </li>
            </ul>
            <Link href={ROUTES.REGISTER_COMPLEX} passHref>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md">
                {t("basic.cta")}
              </Button>
            </Link>
          </div>

          {/* Standard Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-green-500 relative">
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              {t("standard.badge")}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("standard.name")}
            </h3>
            <p className="text-gray-600 mb-6">{t("standard.description")}</p>
            <div className="text-5xl font-extrabold text-green-600 mb-6">
              {currency === "USD" ? "$25" : "$95.000"}
              <span className="text-xl font-medium">/ {t("perMonth")}</span>
            </div>
            <ul className="text-left text-gray-700 space-y-3 mb-8">
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("standard.feature1")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("standard.feature2")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("standard.feature3")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("standard.feature4")}
              </li>
            </ul>
            <Link href={`${ROUTES.CHECKOUT}?plan=standard`} passHref>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md">
                {t("standard.cta")}
              </Button>
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-purple-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("premium.name")}
            </h3>
            <p className="text-gray-600 mb-6">{t("premium.description")}</p>
            <div className="text-5xl font-extrabold text-purple-600 mb-6">
              {currency === "USD" ? "$50" : "$190.000"}
              <span className="text-xl font-medium">/ {t("perMonth")}</span>
            </div>
            <ul className="text-left text-gray-700 space-y-3 mb-8">
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("premium.feature1")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("premium.feature2")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("premium.feature3")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("premium.feature4")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("premium.feature5")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("premium.feature6")}
              </li>
            </ul>
            <Link href={`${ROUTES.CHECKOUT}?plan=premium`} passHref>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md">
                {t("premium.cta")}
              </Button>
            </Link>
          </div>

          {/* Empresarial Plan */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("plans.enterprise.name")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("plans.enterprise.description")}
            </p>
            <div className="text-5xl font-extrabold text-yellow-600 mb-6">
              {t("plans.enterprise.price")}
            </div>
            <ul className="text-left text-gray-700 space-y-3 mb-8">
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("plans.enterprise.feature1")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("plans.enterprise.feature2")}
              </li>
              <li>
                <Check className="inline-block text-green-500 mr-2" />
                {t("plans.enterprise.feature3")}
              </li>
            </ul>
            <DemoRequestModal>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-md">
                {t("plans.enterprise.buttonText")}
              </Button>
            </DemoRequestModal>
          </div>
        </div>
      </div>
    </section>
  );
}
