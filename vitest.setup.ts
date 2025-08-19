import "reflect-metadata";
import "@testing-library/jest-dom";
import "whatwg-fetch";
import "text-encoding";
import { vi } from "vitest";
import { mockPrisma, PQRStatus, NotificationChannel } from "./src/__mocks__/prisma";

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);


// Mock PrismaClient
vi.mock("@prisma/client", () => {
  return {
    __esModule: true,
    PrismaClient: vi.fn(() => mockPrisma),
    PQRStatus: PQRStatus,
    NotificationChannel: NotificationChannel,
  };
});

// Mock Prisma client functions from @/lib/prisma
vi.mock("@/lib/prisma", () => ({
  __esModule: true,
  getTenantPrismaClient: vi.fn(() => mockPrisma),
  getPublicPrismaClient: vi.fn(() => mockPrisma),
}));

// Mock @/lib/api
vi.mock("@/lib/api", () => ({
  __esModule: true,
  fetchApi: vi.fn(),
}));

// Mock Date.now() if needed for consistent test results
// For example, if you use Date.now() in your code and need it to return a fixed value
// vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-01T00:00:00Z').getTime());


// Mock de next-auth
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "USER",
      },
    },
  })),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock de next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Mock de react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: "es",
      changeLanguage: vi.fn(),
    },
  }),
}));

// Mock de @/store/authStore
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "RESIDENT",
    },
    changeUserRole: vi.fn(),
  })),
}));

// Mock de @/lib/utils
vi.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// Mock de @/components/ui/use-toast
vi.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock de @/hooks/use-pqr-actions
vi.mock("@/hooks/use-pqr-actions", () => ({
  usePqrActions: () => ({
    handleCategorize: vi.fn(),
    handleAssign: vi.fn(),
    handleStartProgress: vi.fn(),
    handleResolve: vi.fn(),
    handleClose: vi.fn(),
    handleReopen: vi.fn(),
    handleCancel: vi.fn(),
    handleCreateComment: vi.fn(),
    handleUpdatePQR: vi.fn(),
    handleDeletePQR: vi.fn(),
  }),
}));

// Mock de @/hooks/use-pqr-data
vi.mock("@/hooks/use-pqr-data", () => ({
  usePqrData: () => ({
    pqr: {
      id: 1,
      title: "Test PQR",
      description: "Test Description",
      status: "OPEN",
      category: "GENERAL",
      priority: "MEDIUM",
      assignedTo: { name: "Admin" },
      comments: [],
      history: [],
    },
    loading: false,
    error: null,
  }),
}));

// Mock de @/hooks/use-pqr-form
vi.mock("@/hooks/use-pqr-form", () => ({
  usePqrForm: () => ({
    register: vi.fn(),
    handleSubmit: (fn: any) => fn,
    errors: {},
    isSubmitting: false,
    setValue: vi.fn(),
    control: {},
  }),
}));

// Mock de @/hooks/use-pqr-state
vi.mock("@/hooks/use-pqr-state", () => ({
  usePqrState: () => ({
    isEditing: false,
    setIsEditing: vi.fn(),
    isCommenting: false,
    setIsCommenting: vi.fn(),
    comment: "",
    setComment: vi.fn(),
  }),
}));

// Mock de @/hooks/use-pqr-status
vi.mock("@/hooks/use-pqr-status", () => ({
  usePqrStatus: () => ({
    getStatusLabel: (status: string) => status,
    getStatusColor: () => "gray",
  }),
}));

// Mock de @/hooks/use-pqr-workflow
vi.mock("@/hooks/use-pqr-workflow", () => ({
  usePqrWorkflow: () => ({
    availableActions: ["CATEGORIZE", "ASSIGN"],
  }),
}));

// Mock de @/hooks/use-satisfaction-survey
vi.mock("@/hooks/use-satisfaction-survey", () => ({
  useSatisfactionSurvey: () => ({
    isSurveyVisible: true,
    handleSurveySubmit: vi.fn(),
  }),
}));

// Mock de @/services/pqr-service
vi.mock("@/services/pqr-service", () => ({
  PqrService: {
    getCategories: vi.fn().mockResolvedValue([]),
    getPriorities: vi.fn().mockResolvedValue([]),
    getUsers: vi.fn().mockResolvedValue([]),
  },
}));

// Mock de @/lib/date-utils
vi.mock("@/lib/date-utils", () => ({
  formatDate: (date: any) => new Date(date).toLocaleDateString(),
  formatTime: (date: any) => new Date(date).toLocaleTimeString(),
  formatDateTime: (date: any) => new Date(date).toLocaleString(),
}));

// Mock de @/lib/template-helper
vi.mock("@/lib/template-helper", () => ({
  getTemplate: vi.fn().mockResolvedValue("<div>Template</div>"),
}));

// Mock de @/services/template-service
vi.mock("@/services/template-service", () => ({
  TemplateService: {
    getTemplate: vi.fn().mockResolvedValue("<div>Template</div>"),
  },
}));

// Mock de @/lib/auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 1 } }),
}));

// Mock de @/lib/session
vi.mock("@/lib/session", () => ({
  getSession: vi.fn().mockResolvedValue({ user: { id: 1 } }),
}));

// Mock de @/lib/permissions
vi.mock("@/lib/permissions", () => ({
  hasPermission: vi.fn().mockReturnValue(true),
}));

// Mock de @/lib/logger
vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de @/lib/config
vi.mock("@/lib/config", () => ({
  config: {
    pqr: {
      satisfactionSurvey: {
        enabled: true,
      },
    },
  },
}));

// Mock de @/lib/analytics
vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

// Mock de @/lib/feature-flags
vi.mock("@/lib/feature-flags", () => ({
  isFeatureEnabled: vi.fn().mockReturnValue(true),
}));

// Mock de @/lib/cache
vi.mock("@/lib/cache", () => ({
  cache: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock de @/lib/email
vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

// Mock de @/lib/sms
vi.mock("@/lib/sms", () => ({
  sendSms: vi.fn().mockResolvedValue(undefined),
}));

// Mock de @/lib/notifications
vi.mock("@/lib/notifications", () => ({
  sendNotification: vi.fn().mockResolvedValue(undefined),
}));

// Mock de @/lib/websockets
vi.mock("@/lib/websockets", () => ({
  getSocket: vi.fn(() => ({
    emit: vi.fn(),
    on: vi.fn(),
  })),
}));

// Mock de @/lib/payments
vi.mock("@/lib/payments", () => ({
  createPayment: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock de @/lib/reports
vi.mock("@/lib/reports", () => ({
  generateReport: vi.fn().mockResolvedValue(Buffer.from("report")),
}));

// Mock de @/lib/storage
vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn().mockResolvedValue("https://example.com/file.pdf"),
}));

// Mock de @/lib/search
vi.mock("@/lib/search", () => ({
  search: vi.fn().mockResolvedValue([]),
}));

// Mock de @/lib/i18n
vi.mock("@/lib/i18n", () => ({
  getTranslator: vi.fn().mockResolvedValue((key: string) => key),
}));

// Mock de @/lib/geolocation
vi.mock("@/lib/geolocation", () => ({
  getCurrentPosition: vi.fn().mockResolvedValue({
    latitude: 0,
    longitude: 0,
  }),
}));

// Mock de @/lib/biometrics
vi.mock("@/lib/biometrics", () => ({
  authenticate: vi.fn().mockResolvedValue(true),
}));

// Mock de @/lib/qr
vi.mock("@/lib/qr", () => ({
  generateQrCode: vi.fn().mockResolvedValue("data:image/png;base64,..."),
}));

// Mock de @/lib/pdf
vi.mock("@/lib/pdf", () => ({
  generatePdf: vi.fn().mockResolvedValue(Buffer.from("pdf")),
}));

// Mock de @/lib/excel
vi.mock("@/lib/excel", () => ({
  generateExcel: vi.fn().mockResolvedValue(Buffer.from("excel")),
}));

// Mock de @/lib/csv
vi.mock("@/lib/csv", () => ({
  generateCsv: vi.fn().mockResolvedValue("csv"),
}));

// Mock de @/lib/ical
vi.mock("@/lib/ical", () => ({
  generateIcal: vi.fn().mockResolvedValue("ical"),
}));

// Mock de @/lib/vcard
vi.mock("@/lib/vcard", () => ({
  generateVcard: vi.fn().mockResolvedValue("vcard"),
}));

// Mock de @/lib/oauth
vi.mock("@/lib/oauth", () => ({
  getGoogleAuthUrl: vi.fn().mockReturnValue("https://google.com"),
  getFacebookAuthUrl: vi.fn().mockReturnValue("https://facebook.com"),
}));

// Mock de @/lib/crypto
vi.mock("@/lib/crypto", () => ({
  encrypt: vi.fn((text) => text),
  decrypt: vi.fn((text) => text),
}));

// Mock de @/lib/rate-limiter
vi.mock("@/lib/rate-limiter", () => ({
  rateLimiter: vi.fn().mockResolvedValue(undefined),
}));

// Mock de @/lib/captcha
vi.mock("@/lib/captcha", () => ({
  verifyCaptcha: vi.fn().mockResolvedValue(true),
}));

// Mock de @/lib/xss
vi.mock("@/lib/xss", () => ({
  sanitize: vi.fn((text) => text),
}));

// Mock de @/lib/csrf
vi.tribunals.mock("@/lib/csrf", () => ({
  createCsrfToken: vi.fn().mockReturnValue("csrf-token"),
  verifyCsrfToken: vi.fn().mockReturnValue(true),
}));

// Mock de @/lib/helmet
vi.mock("@/lib/helmet", () => ({
  helmet: vi.fn(),
}));

// Mock de @/lib/cors
vi.mock("@/lib/cors", () => ({
  cors: vi.fn(),
}));

// Mock de @/lib/compression
vi.mock("@/lib/compression", () => ({
  compression: vi.fn(),
}));

// Mock de @/lib/morgan
vi.mock("@/lib/morgan", () => ({
  morgan: vi.fn(),
}));

// Mock de @/lib/cookie-parser
vi.mock("@/lib/cookie-parser", () => ({
  cookieParser: vi.fn(),
}));

// Mock de @/lib/body-parser
vi.mock("@/lib/body-parser", () => ({
  bodyParser: {
    json: vi.fn(),
    urlencoded: vi.fn(),
  },
}));

// Mock de @/lib/passport
vi.mock("@/lib/passport", () => ({
  passport: {
    initialize: vi.fn(),
    session: vi.fn(),
    authenticate: vi.fn(),
  },
}));

// Mock de @/lib/express-session
vi.mock("@/lib/express-session", () => ({
  session: vi.fn(),
}));

// Mock de @/lib/connect-redis
vi.mock("@/lib/connect-redis", () => ({
  connectRedis: vi.fn(),
}));

// Mock de @/lib/redis
vi.mock("@/lib/redis", () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock de @/lib/bull
vi.mock("@/lib/bull", () => ({
  queue: {
    add: vi.fn(),
  },
}));

// Mock de @/lib/agenda
vi.mock("@/lib/agenda", () => ({
  agenda: {
    define: vi.fn(),
    every: vi.fn(),
    now: vi.fn(),
    start: vi.fn(),
  },
}));

// Mock de @/lib/nodemailer
vi.mock("@/lib/nodemailer", () => ({
  transporter: {
    sendMail: vi.fn(),
  },
}));

// Mock de @/lib/twilio
vi.mock("@/lib/twilio", () => ({
  twilio: {
    messages: {
      create: vi.fn(),
    },
  },
}));

// Mock de @/lib/firebase
vi.mock("@/lib/firebase", () => ({
  admin: {
    messaging: () => ({
      send: vi.fn(),
    }),
  },
}));

// Mock de @/lib/sentry
vi.mock("@/lib/sentry", () => ({
  Sentry: {
    captureException: vi.fn(),
  },
}));

// Mock de @/lib/datadog
vi.mock("@/lib/datadog", () => ({
  statsd: {
    increment: vi.fn(),
    gauge: vi.fn(),
    histogram: vi.fn(),
  },
}));

// Mock de @/lib/launchdarkly
vi.mock("@/lib/launchdarkly", () => ({
  ldclient: {
    variation: vi.fn(),
  },
}));

// Mock de @/lib/optimizely
vi.mock("@/lib/optimizely", () => ({
  optimizely: {
    activate: vi.fn(),
    track: vi.fn(),
  },
}));

// Mock de @/lib/segment
vi.mock("@/lib/segment", () => ({
  analytics: {
    track: vi.fn(),
    identify: vi.fn(),
  },
}));

// Mock de @/lib/amplitude
vi.mock("@/lib/amplitude", () => ({
  amplitude: {
    getInstance: () => ({
      logEvent: vi.fn(),
    }),
  },
}));

// Mock de @/lib/mixpanel
vi.mock("@/lib/mixpanel", () => ({
  mixpanel: {
    track: vi.fn(),
  },
}));

// Mock de @/lib/hotjar
vi.mock("@/lib/hotjar", () => ({
  hotjar: {
    initialize: vi.fn(),
  },
}));

// Mock de @/lib/fullstory
vi.mock("@/lib/fullstory", () => ({
  FullStory: {
    init: vi.fn(),
  },
}));

// Mock de @/lib/logrocket
vi.mock("@/lib/logrocket", () => ({
  LogRocket: {
    init: vi.fn(),
  },
}));

// Mock de @/lib/inspectlet
vi.mock("@/lib/inspectlet", () => ({
  __insp: [],
}));

// Mock de @/lib/mouseflow
vi.mock("@/lib/mouseflow", () => ({
  _mfq: [],
}));

// Mock de @/lib/heap
vi.mock("@/lib/heap", () => ({
  heap: {
    track: vi.fn(),
  },
}));

// Mock de @/lib/pendo
vi.mock("@/lib/pendo", () => ({
  pendo: {
    initialize: vi.fn(),
  },
}));

// Mock de @/lib/walkme
vi.mock("@/lib/walkme", () => ({
  walkme: {
    start: vi.fn(),
  },
}));

// Mock de @/lib/whatfix
vi.mock("@/lib/whatfix", () => ({
  _wfx_init: vi.fn(),
}));

// Mock de @/lib/userlane
vi.mock("@/lib/userlane", () => ({
  userlane: {
    init: vi.fn(),
  },
}));

// Mock de @/lib/appcues
vi.mock("@/lib/appcues", () => ({
  Appcues: {
    init: vi.fn(),
  },
}));

// Mock de @/lib/intercom
vi.mock("@/lib/intercom", () => ({
  Intercom: vi.fn(),
}));

// Mock de @/lib/drift
vi.mock("@/lib/drift", () => ({
  drift: {
    load: vi.fn(),
  },
}));

// Mock de @/lib/zendesk
vi.mock("@/lib/zendesk", () => ({
  zE: vi.fn(),
}));

// Mock de @/lib/freshdesk
vi.mock("@/lib/freshdesk", () => ({
  Freshdesk: {
    init: vi.fn(),
  },
}));

// Mock de @/lib/salesforce
vi.mock("@/lib/salesforce", () => ({
  sf: {
    create: vi.fn(),
  },
}));

// Mock de @/lib/hubspot
vi.mock("@/lib/hubspot", () => ({
  hubspot: {
    track: vi.fn(),
  },
}));

// Mock de @/lib/marketo
vi.mock("@/lib/marketo", () => ({
  Munchkin: {
    init: vi.fn(),
  },
}));

// Mock de @/lib/pardot
vi.mock("@/lib/pardot", () => ({
  pi: {
    tracker: {
      track: vi.fn(),
    },
  },
}));

// Mock de @/lib/eloqua
vi.mock("@/lib/eloqua", () => ({
  _elq: [],
}));

// Mock de @/lib/google-analytics
vi.mock("@/lib/google-analytics", () => ({
  ga: vi.fn(),
}));

// Mock de @/lib/google-tag-manager
vi.mock("@/lib/google-tag-manager", () => ({
  dataLayer: [],
}));

// Mock de @/lib/facebook-pixel
vi.mock("@/lib/facebook-pixel", () => ({
  fbq: vi.fn(),
}));

// Mock de @/lib/twitter-pixel
vi.mock("@/lib/twitter-pixel", () => ({
  twq: vi.fn(),
}));

// Mock de @/lib/linkedin-insight-tag
vi.mock("@/lib/linkedin-insight-tag", () => ({
  _linkedin_data_partner_id: "",
}));

// Mock de @/lib/bing-ads
vi.mock("@/lib/bing-ads", () => ({
  UET: vi.fn(),
}));

// Mock de @/lib/quora-pixel
vi.mock("@/lib/quora-pixel", () => ({
  qp: vi.fn(),
}));

// Mock de @/lib/reddit-pixel
vi.mock("@/lib/reddit-pixel", () => ({
  rdt: vi.fn(),
}));

// Mock de @/lib/snapchat-pixel
vi.mock("@/lib/snapchat-pixel", () => ({
  snaptr: vi.fn(),
}));

// Mock de @/lib/tiktok-pixel
vi.mock("@/lib/tiktok-pixel", () => ({
  ttq: vi.fn(),
}));

// Mock de @/lib/pinterest-tag
vi.mock("@/lib/pinterest-tag", () => ({
  pintrk: vi.fn(),
}));

// Mock de @/lib/taboola-pixel
vi.mock("@/lib/taboola-pixel", () => ({
  _tfa: [],
}));

// Mock de @/lib/outbrain-pixel
vi.mock("@/lib/outbrain-pixel", () => ({
  obApi: {
    track: vi.fn(),
  },
}));