import React from "react";

export const HeroSection = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Armonía</h1>
        <p className="text-lg md:text-xl mb-8">
          La solución integral para la administración de conjuntos
          residenciales.
        </p>
        <a
          href="#contact"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full"
        >
          Contáctanos
        </a>
      </div>
    </section>
  );
};
