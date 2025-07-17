import { render, screen, fireEvent } from '@testing-library/react';
import { Plans } from '../Plans';

// Mock de next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: { [key: string]: any } = {
      "landing.pricing.title": "Nuestros Planes",
      "landing.pricing.description": "Elige el plan que mejor se adapte a tus necesidades.",
      "landing.pricing.recommended": "Recomendado",
      "landing.pricing.plans.basic.name": "Básico",
      "landing.pricing.plans.basic.price": { COP: "Gratis", USD: "Free", BRL: "Grátis" },
      "landing.pricing.plans.basic.description": "Gestión esencial para pequeños conjuntos.",
      "landing.pricing.plans.basic.features": ["Hasta 40 unidades", "Gestión de inventario", "PQR", "Cartelera digital"],
      "landing.pricing.plans.basic.buttonText": "Empezar Gratis",
      "landing.pricing.plans.standard.name": "Estándar",
      "landing.pricing.plans.standard.price": { COP: "$95,000", USD: "$25", BRL: "R$125" },
      "landing.pricing.plans.standard.priceSuffix": "/mes",
      "landing.pricing.plans.standard.description": "Funcionalidades avanzadas para conjuntos medianos.",
      "landing.pricing.plans.standard.features": ["Todo el plan Básico", "Módulo de Reservas", "Módulo Financiero (sin conciliación)", "Gestión Avanzada de Visitantes"],
      "landing.pricing.plans.standard.buttonText": "Seleccionar Plan",
      "landing.pricing.plans.premium.name": "Premium",
      "landing.pricing.plans.premium.price": { COP: "$190,000", USD: "$50", BRL: "R$250" },
      "landing.pricing.plans.premium.priceSuffix": "/mes",
      "landing.pricing.plans.premium.description": "Solución completa para grandes conjuntos y administradores exigentes.",
      "landing.pricing.plans.premium.features": ["Todo el plan Estándar", "Conciliación Bancaria Automática", "Acceso a API", "Marketplace Comunitario", "Directorio de Servicios"],
      "landing.pricing.plans.premium.buttonText": "Seleccionar Plan",
      "landing.pricing.plans.portfolio.name": "Empresarial (Portafolio)",
      "landing.pricing.plans.portfolio.price": { COP: "Contactar", USD: "Contact", BRL: "Contatar" },
      "landing.pricing.plans.portfolio.description": "Para empresas de administración con múltiples propiedades.",
      "landing.pricing.plans.portfolio.features": ["Dashboard Multi-Propiedad", "Gestión Centralizada", "Informes Consolidados", "Personalización de Marca"],
      "landing.pricing.plans.portfolio.buttonText": "Contactar Ventas",
      "landing.pricing.plans.assembly.name": "Democracia Digital (Asambleas)",
      "landing.pricing.plans.assembly.price": { COP: "Contactar", USD: "Contact", BRL: "Contatar" },
      "landing.pricing.plans.assembly.description": "Módulo independiente para asambleas virtuales y votaciones.",
      "landing.pricing.plans.assembly.features": ["Asambleas virtuales/híbridas", "Registro de asistencia", "Votaciones ponderadas", "Generación de acta"],
      "landing.pricing.plans.assembly.buttonText": "Solicitar Demo",
    };
    if (key.endsWith(".features")) {
      return translations[key];
    }
    return translations[key] || key;
  },
}));

describe('Plans', () => {
  it('renders all plan cards', () => {
    render(<Plans />);
    expect(screen.getByText('Básico')).toBeInTheDocument();
    expect(screen.getByText('Estándar')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Empresarial (Portafolio)')).toBeInTheDocument();
    expect(screen.getByText('Democracia Digital (Asambleas)')).toBeInTheDocument();
  });

  it('displays correct prices for COP by default', () => {
    render(<Plans />);
    expect(screen.getByText('Gratis')).toBeInTheDocument();
    expect(screen.getByText('$95,000')).toBeInTheDocument();
    expect(screen.getByText('$190,000')).toBeInTheDocument();
  });

  it('changes currency to USD when USD button is clicked', () => {
    render(<Plans />);
    fireEvent.click(screen.getByRole('button', { name: 'USD' }));
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('changes currency to BRL when BRL button is clicked', () => {
    render(<Plans />);
    fireEvent.click(screen.getByRole('button', { name: 'BRL' }));
    expect(screen.getByText('Grátis')).toBeInTheDocument();
    expect(screen.getByText('R$125')).toBeInTheDocument();
    expect(screen.getByText('R$250')).toBeInTheDocument();
  });

  it('displays recommended badge for Standard plan', () => {
    render(<Plans />);
    const standardPlanCard = screen.getByText('Estándar').closest('div');
    expect(standardPlanCard).toHaveTextContent('Recomendado');
  });

  it('navigates to registration page when button is clicked', () => {
    render(<Plans />);
    const registerButton = screen.getByRole('link', { name: 'Empezar Gratis' });
    expect(registerButton).toHaveAttribute('href', '/public/register-complex');
  });
});
