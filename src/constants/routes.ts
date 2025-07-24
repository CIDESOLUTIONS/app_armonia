// src/constants/routes.ts
export const ROUTES = {
  HOME: "/",
  PORTAL_SELECTOR: "/portal-selector",
  LOGIN: "/login",
  RESIDENT_LOGIN: "/login?portal=resident",
  RECEPTION_LOGIN: "/login?portal=reception",
  ADMIN_LOGIN: "/login?portal=admin",
  // Portales principales
  APP_ADMIN_DASHBOARD: "/(admin)/app-dashboard", // Renamed
  RESIDENT_DASHBOARD: "/(resident)/my-finances/fees", // Changed to fees page for now
  RECEPTION_DASHBOARD: "/(reception)",

  // Portal de administración de la aplicación (Superadmin)
  APP_ADMIN_FINANCES_REPORTS: "/(admin)/app-reports", // New route for consolidated reports
  APP_ADMIN_SETTINGS: "/(admin)/settings", // This one is correct

  // Portal de administración de conjunto
  COMPLEX_ADMIN_DASHBOARD: "/(complex-admin)/dashboard",
  COMPLEX_ADMIN_INVENTORY: "/(complex-admin)/inventory",
  COMPLEX_ADMIN_ASSEMBLIES: "/(complex-admin)/assemblies",
  COMPLEX_ADMIN_FINANCES: "/(complex-admin)/finances",
  COMPLEX_ADMIN_PQR: "/(complex-admin)/pqr",
  COMPLEX_ADMIN_USER_MANAGEMENT: "/(complex-admin)/user-management",

  // Portal de residentes
  RESIDENT_FINANCES_FEES: "/(resident)/my-finances/fees", // New route for resident fees
  RESIDENT_PQR: "/(resident)/pqr",
  RESIDENT_ASSEMBLIES: "/(resident)/assemblies",
  RESIDENT_RESERVATIONS: "/(resident)/my-reservations",
  RESIDENT_PROFILE: "/(resident)/profile",
  RESIDENT_SECURITY_PRE_REGISTER_VISITOR: "/(resident)/security/pre-register-visitor",
  RESIDENT_SECURITY_PANIC_BUTTON: "/(resident)/security/panic-button",
  RESIDENT_MARKETPLACE: "/(resident)/marketplace",

  // Portal de recepción
  RECEPTION_SECURITY_SCAN_QR: "/(reception)/security/scan-qr",
  RECEPTION_SECURITY_MANUAL_REGISTER: "/(reception)/security/manual-register",
  RECEPTION_PACKAGES: "/(reception)/packages",
  RECEPTION_INCIDENTS: "/(reception)/incidents",

  FORGOT_PASSWORD: "/forgot-password",
  REGISTER_COMPLEX: "/register-complex",
} as const;
