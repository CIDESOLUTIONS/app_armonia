import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useTranslations } from "next-intl";

interface PlansProps {
  currency: string;
}

export function Plans({ currency }: PlansProps) {
  const t = useTranslations("landing.pricing");

  const plans = [
    {
      name: "basic",
      price: t("plans.basic.price"),
      description: t("plans.basic.description"),
      features: t.raw("plans.basic.features"),
      buttonText: t("plans.basic.buttonText"),
      recommended: false,
    },
    {
      name: "standard",
      price: currency === "USD" ? "$25" : "$95,000",
      priceSuffix: t("plans.standard.priceSuffix"),
      description: t("plans.standard.description"),
      features: t.raw("plans.standard.features"),
      buttonText: t("plans.standard.buttonText"),
      recommended: true,
    },
    {
      name: "premium",
      price: currency === "USD" ? "$50" : "$190,000",
      priceSuffix: t("plans.premium.priceSuffix"),
      description: t("plans.premium.description"),
      features: t.raw("plans.premium.features"),
      buttonText: t("plans.premium.buttonText"),
      recommended: false,
    },
  ];

  return (
    <section id="planes" className="py-20 bg-indigo-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-lg border shadow-md hover:shadow-xl transition-all ${
                plan.recommended
                  ? "border-2 border-indigo-500 dark:border-indigo-400 transform scale-105"
                  : "border-gray-200 dark:border-gray-600"
              } bg-white dark:bg-gray-700 relative`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">
                  {t("recommended")}
                </div>
              )}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {t(`plans.${plan.name}.name`)}
              </h3>
              <div className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {plan.price}
                {plan.priceSuffix && (
                  <span className="text-base font-normal">
                    {plan.priceSuffix}
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string, fIndex: number) => (
                  <li key={fIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href={ROUTES.REGISTER_COMPLEX} passHref>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
