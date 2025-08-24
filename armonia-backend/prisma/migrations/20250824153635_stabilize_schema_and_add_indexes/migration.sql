-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."BillingCycle" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'TRIAL', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."LicenseStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."UsageLimitType" AS ENUM ('USERS', 'PROPERTIES', 'DOCUMENTS', 'STORAGE', 'API_CALLS');

-- CreateEnum
CREATE TYPE "public"."ResetPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'RESIDENT', 'GUARD', 'STAFF');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'OFFICE', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "public"."DocumentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."AccessLevel" AS ENUM ('VIEW', 'EDIT', 'DOWNLOAD', 'COMMENT');

-- CreateEnum
CREATE TYPE "public"."AssemblyType" AS ENUM ('ORDINARY', 'EXTRAORDINARY');

-- CreateEnum
CREATE TYPE "public"."AssemblyStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BudgetStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."CommunicationType" AS ENUM ('ANNOUNCEMENT', 'MESSAGE', 'PQR_RESPONSE');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('GENERAL', 'EMERGENCY', 'IMPORTANT', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'ROLE_BASED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "public"."ConversationType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "public"."FeeType" AS ENUM ('ADMINISTRATION', 'LATE_FEE', 'SPECIAL_ASSESSMENT', 'AMENITY');

-- CreateEnum
CREATE TYPE "public"."IncidentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."MessageStatus" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."PackageStatus" AS ENUM ('IN_RECEPTION', 'DELIVERED', 'RETURNED');

-- CreateEnum
CREATE TYPE "public"."PanicAlertStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethodType" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'PSE');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."PQRType" AS ENUM ('PETITION', 'COMPLAINT', 'CLAIM', 'SUGGESTION');

-- CreateEnum
CREATE TYPE "public"."PQRStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ProjectTaskStatus" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'OPEN_TEXT');

-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."SecurityEventType" AS ENUM ('THEFT', 'VANDALISM', 'SUSPICIOUS_ACTIVITY', 'ACCESS_VIOLATION');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('PAYMENT', 'REFUND', 'CHARGEBACK', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethodProvider" AS ENUM ('STRIPE', 'PAYPAL', 'PSE', 'MERCADOPAGO');

-- CreateEnum
CREATE TYPE "public"."RefundReason" AS ENUM ('REQUESTED_BY_CUSTOMER', 'DUPLICATE', 'FRAUDULENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LogLevel" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL');

-- CreateTable
CREATE TABLE "public"."Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."PlanType" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "billingCycle" "public"."BillingCycle" NOT NULL,
    "features" JSONB,
    "featureConfiguration" JSONB,
    "usageLimits" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "trialDays" INTEGER DEFAULT 0,
    "setupFee" DECIMAL(65,30) DEFAULT 0,
    "metadata" JSONB,
    "allowedRoles" "public"."UserRole"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL,
    "billingCycle" "public"."BillingCycle" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "currentPrice" DECIMAL(65,30) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethodId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."License" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."LicenseStatus" NOT NULL,
    "assignedRoles" "public"."UserRole"[],
    "permissions" JSONB,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubscriptionUsageLimit" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "limitType" "public"."UsageLimitType" NOT NULL,
    "limitValue" DECIMAL(65,30) NOT NULL,
    "currentUsage" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "resetPeriod" "public"."ResetPeriod" NOT NULL,
    "resetDate" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionUsageLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsageTracking" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "limitType" "public"."UsageLimitType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "residentialComplexId" TEXT,
    "phoneNumber" TEXT,
    "deviceToken" TEXT,
    "biometricData" TEXT,
    "biometricEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ResidentialComplex" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT,
    "adminId" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ResidentialComplex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "type" "public"."PropertyType" NOT NULL,
    "number" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "residentId" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "checksum" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "subcategory" TEXT,
    "tags" TEXT[],
    "accessLevel" "public"."AccessLevel" NOT NULL,
    "accessRoles" "public"."UserRole"[],
    "isPublic" BOOLEAN NOT NULL,
    "version" INTEGER NOT NULL,
    "isCurrentVersion" BOOLEAN NOT NULL,
    "parentDocumentId" TEXT,
    "status" "public"."DocumentStatus" NOT NULL,
    "requiresApproval" BOOLEAN NOT NULL,
    "approvalStatus" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "expirationDate" TIMESTAMP(3),
    "priority" TEXT,
    "language" TEXT,
    "downloadCount" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "lastAccessedAt" TIMESTAMP(3),
    "uploadedById" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "type" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "visibility" "public"."Visibility" NOT NULL,
    "targetRoles" "public"."UserRole"[],
    "requireConfirmation" BOOLEAN NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnnouncementAttachment" (
    "id" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "AnnouncementAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnnouncementRead" (
    "announcementId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnouncementRead_pkey" PRIMARY KEY ("announcementId","userId")
);

-- CreateTable
CREATE TABLE "public"."Assembly" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "public"."AssemblyType" NOT NULL,
    "status" "public"."AssemblyStatus" NOT NULL,
    "quorum" DECIMAL(65,30) NOT NULL,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "Assembly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssemblyMinutes" (
    "id" TEXT NOT NULL,
    "assemblyId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssemblyMinutes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssemblyAttendance" (
    "id" TEXT NOT NULL,
    "assemblyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "attendedAt" TIMESTAMP(3),
    "unitId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "notes" TEXT,
    "proxyName" TEXT,
    "proxyDocument" TEXT,
    "isDelegate" BOOLEAN NOT NULL,
    "isOwner" BOOLEAN NOT NULL,

    CONSTRAINT "AssemblyAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "status" "public"."BudgetStatus" NOT NULL,
    "year" INTEGER NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BudgetItem" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Camera" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Communication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."CommunicationType" NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunityEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "visibility" "public"."Visibility" NOT NULL,
    "targetRoles" "public"."UserRole"[],
    "maxAttendees" INTEGER,
    "organizerId" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventAttachment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "EventAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventAttendee" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "type" "public"."ConversationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationParticipant" (
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("conversationId","userId")
);

-- CreateTable
CREATE TABLE "public"."DemoRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "complexName" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Expense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "category" TEXT NOT NULL,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "vendor" TEXT,
    "invoiceNumber" TEXT,
    "notes" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "budgetId" TEXT,
    "approvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fee" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."FeeType" NOT NULL,
    "propertyId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "paymentId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "frequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."IncidentStatus" NOT NULL,
    "reportedById" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Intercom" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "number" TEXT NOT NULL,

    CONSTRAINT "Intercom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "sellerId" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" "public"."MessageStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageRead" (
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageRead_pkey" PRIMARY KEY ("messageId","userId")
);

-- CreateTable
CREATE TABLE "public"."MicroCreditApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MicroCreditApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "data" JSONB,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT,
    "priority" "public"."NotificationPriority" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "requireConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationConfirmation" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Option" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Package" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),
    "notes" TEXT,
    "status" "public"."PackageStatus" NOT NULL DEFAULT 'IN_RECEPTION',
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PanicAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "status" "public"."PanicAlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "resolvedTime" TIMESTAMP(3),
    "resolvedById" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PanicAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parking" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "propertyId" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentAttempt" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL,
    "gateway" TEXT NOT NULL,
    "gatewayId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "method" "public"."PaymentMethodType" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL,
    "transactionId" TEXT,
    "paymentMethodId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentGatewayConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "supportedCurrencies" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "testMode" BOOLEAN NOT NULL DEFAULT true,
    "webhookUrl" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentGatewayConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PersonalFinance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalFinance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "ownerId" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PQR" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."PQRType" NOT NULL,
    "status" "public"."PQRStatus" NOT NULL,
    "reportedById" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PQR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ProjectStatus" NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "budget" DECIMAL(65,30),
    "residentialComplexId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectTask" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ProjectTaskStatus" NOT NULL,
    "assignedToId" TEXT,
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectUpdate" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "progress" DECIMAL(65,30) NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "public"."QuestionType" NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "generatedById" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReportedListing" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "attendees" TEXT[],
    "requiresPayment" BOOLEAN,
    "paymentAmount" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReservationNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reservationId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "migrated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReservationNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "serviceProviderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecurityEvent" (
    "id" TEXT NOT NULL,
    "type" "public"."SecurityEventType" NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "reportedByUserId" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessAttempt" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "isSuccess" BOOLEAN NOT NULL,
    "reason" TEXT,
    "userId" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmartMeterReading" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "propertyId" TEXT,
    "reading" DECIMAL(65,30) NOT NULL,
    "previousReading" DECIMAL(65,30),
    "unit" TEXT NOT NULL,
    "consumption" DECIMAL(65,30),
    "cost" DECIMAL(65,30),
    "timestamp" TIMESTAMP(3) NOT NULL,
    "isAutomatic" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'telemetry',
    "additionalData" JSONB,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartMeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vehicle" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "ownerId" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Visitor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "idNumber" TEXT,
    "entryTime" TIMESTAMP(3) NOT NULL,
    "exitTime" TIMESTAMP(3),
    "propertyId" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vote" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssemblyVote" (
    "id" TEXT NOT NULL,
    "assemblyId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],

    CONSTRAINT "AssemblyVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AssemblyVoteRecord" (
    "id" TEXT NOT NULL,
    "assemblyVoteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "coefficient" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssemblyVoteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankReconciliation" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" TEXT NOT NULL,
    "reference" TEXT,
    "account" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "status" TEXT NOT NULL,
    "paymentId" TEXT,
    "confidence" DECIMAL(65,30),
    "reason" TEXT,
    "suggestions" JSONB,
    "notes" TEXT,
    "processedById" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "paymentGatewayId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL,
    "gatewayTransactionId" TEXT,
    "gatewayReference" TEXT,
    "gatewayResponse" JSONB,
    "processingFee" DECIMAL(65,30),
    "netAmount" DECIMAL(65,30),
    "description" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "webhookVerified" BOOLEAN NOT NULL DEFAULT false,
    "reconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconciledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."PaymentMethodType" NOT NULL,
    "provider" "public"."PaymentMethodProvider" NOT NULL,
    "gatewayMethodId" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "last4" TEXT,
    "brand" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "bankName" TEXT,
    "bankCode" TEXT,
    "accountType" TEXT,
    "paypalEmail" TEXT,
    "name" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookEvent" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "paymentId" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "rawPayload" JSONB NOT NULL,
    "signature" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentRefund" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "reason" "public"."RefundReason" NOT NULL,
    "status" "public"."RefundStatus" NOT NULL,
    "gatewayRefundId" TEXT,
    "gatewayResponse" JSONB,
    "processedBy" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRefund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "sentViaEmail" BOOLEAN NOT NULL DEFAULT false,
    "sentViaSMS" BOOLEAN NOT NULL DEFAULT false,
    "sentViaApp" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MetricDataPoint" (
    "id" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "tags" JSONB,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "unit" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonitoringAlert" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricName" TEXT NOT NULL,
    "thresholdType" TEXT NOT NULL,
    "thresholdValue" DECIMAL(65,30) NOT NULL,
    "thresholdValue2" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notificationChannel" TEXT,
    "recipients" JSONB,
    "cooldownPeriod" INTEGER NOT NULL DEFAULT 15,
    "lastTriggered" TIMESTAMP(3),
    "residentialComplexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonitoringAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LogEvent" (
    "id" TEXT NOT NULL,
    "level" "public"."LogLevel" NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "context" JSONB,
    "metadata" JSONB,
    "stackTrace" TEXT,
    "source" TEXT,
    "residentialComplexId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DocumentShare" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "accessLevel" "public"."AccessLevel" NOT NULL,
    "shareToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DocumentComment" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DocumentActivity" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IoTDevice" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "IoTDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IoTAlert" (
    "id" TEXT NOT NULL,
    "acknowledgedById" TEXT,
    "resolvedById" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "IoTAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TelemetryData" (
    "id" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "TelemetryData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeviceConfig" (
    "id" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "DeviceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UtilityBill" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "smartMeterReadingId" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "UtilityBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UtilityReading" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "UtilityReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConsumptionAnalytics" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "ConsumptionAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UtilityRate" (
    "id" TEXT NOT NULL,
    "residentialComplexId" TEXT NOT NULL,

    CONSTRAINT "UtilityRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Plan_type_idx" ON "public"."Plan"("type");

-- CreateIndex
CREATE INDEX "Plan_isActive_idx" ON "public"."Plan"("isActive");

-- CreateIndex
CREATE INDEX "Subscription_residentialComplexId_idx" ON "public"."Subscription"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "public"."Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "public"."Subscription"("planId");

-- CreateIndex
CREATE INDEX "License_userId_idx" ON "public"."License"("userId");

-- CreateIndex
CREATE INDEX "License_subscriptionId_idx" ON "public"."License"("subscriptionId");

-- CreateIndex
CREATE INDEX "License_status_idx" ON "public"."License"("status");

-- CreateIndex
CREATE INDEX "SubscriptionUsageLimit_limitType_idx" ON "public"."SubscriptionUsageLimit"("limitType");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionUsageLimit_subscriptionId_limitType_key" ON "public"."SubscriptionUsageLimit"("subscriptionId", "limitType");

-- CreateIndex
CREATE INDEX "UsageTracking_subscriptionId_limitType_idx" ON "public"."UsageTracking"("subscriptionId", "limitType");

-- CreateIndex
CREATE INDEX "UsageTracking_createdAt_idx" ON "public"."UsageTracking"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_residentialComplexId_idx" ON "public"."User"("residentialComplexId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "ResidentialComplex_planId_idx" ON "public"."ResidentialComplex"("planId");

-- CreateIndex
CREATE INDEX "ResidentialComplex_adminId_idx" ON "public"."ResidentialComplex"("adminId");

-- CreateIndex
CREATE INDEX "Property_ownerId_idx" ON "public"."Property"("ownerId");

-- CreateIndex
CREATE INDEX "Property_residentId_idx" ON "public"."Property"("residentId");

-- CreateIndex
CREATE INDEX "Property_residentialComplexId_idx" ON "public"."Property"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Document_residentialComplexId_type_idx" ON "public"."Document"("residentialComplexId", "type");

-- CreateIndex
CREATE INDEX "Document_residentialComplexId_category_idx" ON "public"."Document"("residentialComplexId", "category");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "public"."Document"("status");

-- CreateIndex
CREATE INDEX "Document_uploadedById_idx" ON "public"."Document"("uploadedById");

-- CreateIndex
CREATE INDEX "Document_approvedById_idx" ON "public"."Document"("approvedById");

-- CreateIndex
CREATE INDEX "Amenity_residentialComplexId_idx" ON "public"."Amenity"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Announcement_createdById_idx" ON "public"."Announcement"("createdById");

-- CreateIndex
CREATE INDEX "Announcement_residentialComplexId_idx" ON "public"."Announcement"("residentialComplexId");

-- CreateIndex
CREATE INDEX "AnnouncementAttachment_announcementId_idx" ON "public"."AnnouncementAttachment"("announcementId");

-- CreateIndex
CREATE INDEX "Assembly_residentialComplexId_idx" ON "public"."Assembly"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Assembly_date_idx" ON "public"."Assembly"("date");

-- CreateIndex
CREATE INDEX "Assembly_status_idx" ON "public"."Assembly"("status");

-- CreateIndex
CREATE INDEX "AssemblyMinutes_assemblyId_idx" ON "public"."AssemblyMinutes"("assemblyId");

-- CreateIndex
CREATE UNIQUE INDEX "AssemblyAttendance_assemblyId_userId_key" ON "public"."AssemblyAttendance"("assemblyId", "userId");

-- CreateIndex
CREATE INDEX "Budget_residentialComplexId_idx" ON "public"."Budget"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Budget_year_month_idx" ON "public"."Budget"("year", "month");

-- CreateIndex
CREATE INDEX "BudgetItem_budgetId_idx" ON "public"."BudgetItem"("budgetId");

-- CreateIndex
CREATE INDEX "Camera_residentialComplexId_idx" ON "public"."Camera"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Communication_senderId_idx" ON "public"."Communication"("senderId");

-- CreateIndex
CREATE INDEX "Communication_recipientId_idx" ON "public"."Communication"("recipientId");

-- CreateIndex
CREATE INDEX "CommunityEvent_residentialComplexId_idx" ON "public"."CommunityEvent"("residentialComplexId");

-- CreateIndex
CREATE INDEX "CommunityEvent_organizerId_idx" ON "public"."CommunityEvent"("organizerId");

-- CreateIndex
CREATE INDEX "EventAttachment_eventId_idx" ON "public"."EventAttachment"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "DemoRequest_email_key" ON "public"."DemoRequest"("email");

-- CreateIndex
CREATE INDEX "Expense_residentialComplexId_idx" ON "public"."Expense"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Expense_budgetId_idx" ON "public"."Expense"("budgetId");

-- CreateIndex
CREATE INDEX "Expense_approvedById_idx" ON "public"."Expense"("approvedById");

-- CreateIndex
CREATE INDEX "Fee_propertyId_idx" ON "public"."Fee"("propertyId");

-- CreateIndex
CREATE INDEX "Fee_paymentId_idx" ON "public"."Fee"("paymentId");

-- CreateIndex
CREATE INDEX "Fee_type_idx" ON "public"."Fee"("type");

-- CreateIndex
CREATE INDEX "Fee_paid_idx" ON "public"."Fee"("paid");

-- CreateIndex
CREATE INDEX "Incident_reportedById_idx" ON "public"."Incident"("reportedById");

-- CreateIndex
CREATE INDEX "Incident_residentialComplexId_idx" ON "public"."Incident"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "public"."Incident"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Intercom_propertyId_number_key" ON "public"."Intercom"("propertyId", "number");

-- CreateIndex
CREATE INDEX "Listing_sellerId_idx" ON "public"."Listing"("sellerId");

-- CreateIndex
CREATE INDEX "Listing_residentialComplexId_idx" ON "public"."Listing"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "public"."Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_recipientId_idx" ON "public"."Message"("recipientId");

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "public"."MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "MicroCreditApplication_userId_idx" ON "public"."MicroCreditApplication"("userId");

-- CreateIndex
CREATE INDEX "MicroCreditApplication_status_idx" ON "public"."MicroCreditApplication"("status");

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "public"."Notification"("recipientId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "public"."Notification"("read");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationConfirmation_notificationId_userId_key" ON "public"."NotificationConfirmation"("notificationId", "userId");

-- CreateIndex
CREATE INDEX "Option_questionId_idx" ON "public"."Option"("questionId");

-- CreateIndex
CREATE INDEX "Package_residentId_idx" ON "public"."Package"("residentId");

-- CreateIndex
CREATE INDEX "Package_residentialComplexId_idx" ON "public"."Package"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Package_status_idx" ON "public"."Package"("status");

-- CreateIndex
CREATE INDEX "PanicAlert_userId_idx" ON "public"."PanicAlert"("userId");

-- CreateIndex
CREATE INDEX "PanicAlert_residentialComplexId_idx" ON "public"."PanicAlert"("residentialComplexId");

-- CreateIndex
CREATE INDEX "PanicAlert_status_idx" ON "public"."PanicAlert"("status");

-- CreateIndex
CREATE INDEX "Parking_propertyId_idx" ON "public"."Parking"("propertyId");

-- CreateIndex
CREATE INDEX "Parking_residentialComplexId_idx" ON "public"."Parking"("residentialComplexId");

-- CreateIndex
CREATE INDEX "PaymentAttempt_paymentId_idx" ON "public"."PaymentAttempt"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "public"."Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "public"."Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "public"."Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paymentMethodId_idx" ON "public"."Payment"("paymentMethodId");

-- CreateIndex
CREATE INDEX "PaymentGatewayConfig_residentialComplexId_idx" ON "public"."PaymentGatewayConfig"("residentialComplexId");

-- CreateIndex
CREATE INDEX "PersonalFinance_userId_idx" ON "public"."PersonalFinance"("userId");

-- CreateIndex
CREATE INDEX "Pet_ownerId_idx" ON "public"."Pet"("ownerId");

-- CreateIndex
CREATE INDEX "Pet_residentialComplexId_idx" ON "public"."Pet"("residentialComplexId");

-- CreateIndex
CREATE INDEX "PQR_reportedById_idx" ON "public"."PQR"("reportedById");

-- CreateIndex
CREATE INDEX "PQR_residentialComplexId_idx" ON "public"."PQR"("residentialComplexId");

-- CreateIndex
CREATE INDEX "PQR_status_idx" ON "public"."PQR"("status");

-- CreateIndex
CREATE INDEX "PQR_type_idx" ON "public"."PQR"("type");

-- CreateIndex
CREATE INDEX "Project_residentialComplexId_idx" ON "public"."Project"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "public"."Project"("status");

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "public"."Project"("createdById");

-- CreateIndex
CREATE INDEX "ProjectTask_projectId_idx" ON "public"."ProjectTask"("projectId");

-- CreateIndex
CREATE INDEX "ProjectTask_status_idx" ON "public"."ProjectTask"("status");

-- CreateIndex
CREATE INDEX "ProjectTask_assignedToId_idx" ON "public"."ProjectTask"("assignedToId");

-- CreateIndex
CREATE INDEX "ProjectUpdate_projectId_idx" ON "public"."ProjectUpdate"("projectId");

-- CreateIndex
CREATE INDEX "ProjectUpdate_authorId_idx" ON "public"."ProjectUpdate"("authorId");

-- CreateIndex
CREATE INDEX "Question_surveyId_idx" ON "public"."Question"("surveyId");

-- CreateIndex
CREATE INDEX "Report_generatedById_idx" ON "public"."Report"("generatedById");

-- CreateIndex
CREATE INDEX "Report_residentialComplexId_idx" ON "public"."Report"("residentialComplexId");

-- CreateIndex
CREATE INDEX "ReportedListing_listingId_idx" ON "public"."ReportedListing"("listingId");

-- CreateIndex
CREATE INDEX "ReportedListing_reportedById_idx" ON "public"."ReportedListing"("reportedById");

-- CreateIndex
CREATE INDEX "Reservation_amenityId_idx" ON "public"."Reservation"("amenityId");

-- CreateIndex
CREATE INDEX "Reservation_userId_idx" ON "public"."Reservation"("userId");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "public"."Reservation"("status");

-- CreateIndex
CREATE INDEX "ReservationNotification_userId_idx" ON "public"."ReservationNotification"("userId");

-- CreateIndex
CREATE INDEX "ReservationNotification_reservationId_idx" ON "public"."ReservationNotification"("reservationId");

-- CreateIndex
CREATE INDEX "Review_serviceProviderId_idx" ON "public"."Review"("serviceProviderId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");

-- CreateIndex
CREATE INDEX "SecurityEvent_residentialComplexId_idx" ON "public"."SecurityEvent"("residentialComplexId");

-- CreateIndex
CREATE INDEX "SecurityEvent_type_idx" ON "public"."SecurityEvent"("type");

-- CreateIndex
CREATE INDEX "AccessAttempt_userId_idx" ON "public"."AccessAttempt"("userId");

-- CreateIndex
CREATE INDEX "AccessAttempt_residentialComplexId_idx" ON "public"."AccessAttempt"("residentialComplexId");

-- CreateIndex
CREATE INDEX "ServiceProvider_residentialComplexId_idx" ON "public"."ServiceProvider"("residentialComplexId");

-- CreateIndex
CREATE INDEX "SmartMeterReading_deviceId_timestamp_idx" ON "public"."SmartMeterReading"("deviceId", "timestamp");

-- CreateIndex
CREATE INDEX "SmartMeterReading_propertyId_idx" ON "public"."SmartMeterReading"("propertyId");

-- CreateIndex
CREATE INDEX "SmartMeterReading_residentialComplexId_timestamp_idx" ON "public"."SmartMeterReading"("residentialComplexId", "timestamp");

-- CreateIndex
CREATE INDEX "Survey_residentialComplexId_idx" ON "public"."Survey"("residentialComplexId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "public"."Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_ownerId_idx" ON "public"."Vehicle"("ownerId");

-- CreateIndex
CREATE INDEX "Vehicle_residentialComplexId_idx" ON "public"."Vehicle"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Visitor_propertyId_idx" ON "public"."Visitor"("propertyId");

-- CreateIndex
CREATE INDEX "Visitor_residentialComplexId_idx" ON "public"."Visitor"("residentialComplexId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_questionId_userId_key" ON "public"."Vote"("questionId", "userId");

-- CreateIndex
CREATE INDEX "AssemblyVote_assemblyId_idx" ON "public"."AssemblyVote"("assemblyId");

-- CreateIndex
CREATE UNIQUE INDEX "AssemblyVoteRecord_assemblyVoteId_userId_key" ON "public"."AssemblyVoteRecord"("assemblyVoteId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankReconciliation_transactionId_key" ON "public"."BankReconciliation"("transactionId");

-- CreateIndex
CREATE INDEX "BankReconciliation_paymentId_idx" ON "public"."BankReconciliation"("paymentId");

-- CreateIndex
CREATE INDEX "BankReconciliation_processedById_idx" ON "public"."BankReconciliation"("processedById");

-- CreateIndex
CREATE INDEX "BankReconciliation_residentialComplexId_idx" ON "public"."BankReconciliation"("residentialComplexId");

-- CreateIndex
CREATE INDEX "Transaction_paymentGatewayId_idx" ON "public"."Transaction"("paymentGatewayId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "public"."Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "public"."Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "PaymentMethod_userId_idx" ON "public"."PaymentMethod"("userId");

-- CreateIndex
CREATE INDEX "PaymentMethod_type_idx" ON "public"."PaymentMethod"("type");

-- CreateIndex
CREATE INDEX "WebhookEvent_processed_idx" ON "public"."WebhookEvent"("processed");

-- CreateIndex
CREATE INDEX "WebhookEvent_eventType_idx" ON "public"."WebhookEvent"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_eventId_key" ON "public"."WebhookEvent"("provider", "eventId");

-- CreateIndex
CREATE INDEX "PaymentRefund_paymentId_idx" ON "public"."PaymentRefund"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentRefund_status_idx" ON "public"."PaymentRefund"("status");

-- CreateIndex
CREATE INDEX "PaymentNotification_userId_idx" ON "public"."PaymentNotification"("userId");

-- CreateIndex
CREATE INDEX "PaymentNotification_isRead_idx" ON "public"."PaymentNotification"("isRead");

-- CreateIndex
CREATE INDEX "MetricDataPoint_metricName_timestamp_idx" ON "public"."MetricDataPoint"("metricName", "timestamp");

-- CreateIndex
CREATE INDEX "MetricDataPoint_residentialComplexId_type_idx" ON "public"."MetricDataPoint"("residentialComplexId", "type");

-- CreateIndex
CREATE INDEX "MonitoringAlert_metricName_idx" ON "public"."MonitoringAlert"("metricName");

-- CreateIndex
CREATE INDEX "MonitoringAlert_isActive_idx" ON "public"."MonitoringAlert"("isActive");

-- CreateIndex
CREATE INDEX "LogEvent_level_timestamp_idx" ON "public"."LogEvent"("level", "timestamp");

-- CreateIndex
CREATE INDEX "LogEvent_category_idx" ON "public"."LogEvent"("category");

-- CreateIndex
CREATE INDEX "LogEvent_userId_idx" ON "public"."LogEvent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShare_shareToken_key" ON "public"."DocumentShare"("shareToken");

-- CreateIndex
CREATE INDEX "DocumentShare_documentId_idx" ON "public"."DocumentShare"("documentId");

-- CreateIndex
CREATE INDEX "DocumentShare_recipientId_idx" ON "public"."DocumentShare"("recipientId");

-- CreateIndex
CREATE INDEX "DocumentComment_documentId_idx" ON "public"."DocumentComment"("documentId");

-- CreateIndex
CREATE INDEX "DocumentComment_userId_idx" ON "public"."DocumentComment"("userId");

-- CreateIndex
CREATE INDEX "DocumentActivity_documentId_idx" ON "public"."DocumentActivity"("documentId");

-- CreateIndex
CREATE INDEX "DocumentActivity_userId_idx" ON "public"."DocumentActivity"("userId");

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."License" ADD CONSTRAINT "License_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."License" ADD CONSTRAINT "License_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubscriptionUsageLimit" ADD CONSTRAINT "SubscriptionUsageLimit_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageTracking" ADD CONSTRAINT "UsageTracking_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResidentialComplex" ADD CONSTRAINT "ResidentialComplex_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResidentialComplex" ADD CONSTRAINT "ResidentialComplex_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_parentDocumentId_fkey" FOREIGN KEY ("parentDocumentId") REFERENCES "public"."Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Amenity" ADD CONSTRAINT "Amenity_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Announcement" ADD CONSTRAINT "Announcement_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnouncementAttachment" ADD CONSTRAINT "AnnouncementAttachment_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnouncementRead" ADD CONSTRAINT "AnnouncementRead_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnouncementRead" ADD CONSTRAINT "AnnouncementRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assembly" ADD CONSTRAINT "Assembly_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssemblyMinutes" ADD CONSTRAINT "AssemblyMinutes_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."Assembly"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssemblyAttendance" ADD CONSTRAINT "AssemblyAttendance_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."Assembly"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssemblyAttendance" ADD CONSTRAINT "AssemblyAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BudgetItem" ADD CONSTRAINT "BudgetItem_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "public"."Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Camera" ADD CONSTRAINT "Camera_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Communication" ADD CONSTRAINT "Communication_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Communication" ADD CONSTRAINT "Communication_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunityEvent" ADD CONSTRAINT "CommunityEvent_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunityEvent" ADD CONSTRAINT "CommunityEvent_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAttachment" ADD CONSTRAINT "EventAttachment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."CommunityEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."CommunityEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "public"."Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Expense" ADD CONSTRAINT "Expense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fee" ADD CONSTRAINT "Fee_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fee" ADD CONSTRAINT "Fee_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Incident" ADD CONSTRAINT "Incident_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intercom" ADD CONSTRAINT "Intercom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageRead" ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageRead" ADD CONSTRAINT "MessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MicroCreditApplication" ADD CONSTRAINT "MicroCreditApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationConfirmation" ADD CONSTRAINT "NotificationConfirmation_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "public"."Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationConfirmation" ADD CONSTRAINT "NotificationConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Package" ADD CONSTRAINT "Package_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PanicAlert" ADD CONSTRAINT "PanicAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PanicAlert" ADD CONSTRAINT "PanicAlert_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PanicAlert" ADD CONSTRAINT "PanicAlert_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parking" ADD CONSTRAINT "Parking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parking" ADD CONSTRAINT "Parking_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentAttempt" ADD CONSTRAINT "PaymentAttempt_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentGatewayConfig" ADD CONSTRAINT "PaymentGatewayConfig_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PersonalFinance" ADD CONSTRAINT "PersonalFinance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pet" ADD CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pet" ADD CONSTRAINT "Pet_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PQR" ADD CONSTRAINT "PQR_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PQR" ADD CONSTRAINT "PQR_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTask" ADD CONSTRAINT "ProjectTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportedListing" ADD CONSTRAINT "ReportedListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReportedListing" ADD CONSTRAINT "ReportedListing_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "public"."Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReservationNotification" ADD CONSTRAINT "ReservationNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReservationNotification" ADD CONSTRAINT "ReservationNotification_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "public"."Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "public"."ServiceProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecurityEvent" ADD CONSTRAINT "SecurityEvent_reportedByUserId_fkey" FOREIGN KEY ("reportedByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecurityEvent" ADD CONSTRAINT "SecurityEvent_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessAttempt" ADD CONSTRAINT "AccessAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessAttempt" ADD CONSTRAINT "AccessAttempt_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceProvider" ADD CONSTRAINT "ServiceProvider_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartMeterReading" ADD CONSTRAINT "SmartMeterReading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."IoTDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartMeterReading" ADD CONSTRAINT "SmartMeterReading_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmartMeterReading" ADD CONSTRAINT "SmartMeterReading_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Survey" ADD CONSTRAINT "Survey_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vehicle" ADD CONSTRAINT "Vehicle_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visitor" ADD CONSTRAINT "Visitor_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Visitor" ADD CONSTRAINT "Visitor_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssemblyVote" ADD CONSTRAINT "AssemblyVote_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "public"."Assembly"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssemblyVoteRecord" ADD CONSTRAINT "AssemblyVoteRecord_assemblyVoteId_fkey" FOREIGN KEY ("assemblyVoteId") REFERENCES "public"."AssemblyVote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AssemblyVoteRecord" ADD CONSTRAINT "AssemblyVoteRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankReconciliation" ADD CONSTRAINT "BankReconciliation_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankReconciliation" ADD CONSTRAINT "BankReconciliation_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankReconciliation" ADD CONSTRAINT "BankReconciliation_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_paymentGatewayId_fkey" FOREIGN KEY ("paymentGatewayId") REFERENCES "public"."PaymentGatewayConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebhookEvent" ADD CONSTRAINT "WebhookEvent_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentRefund" ADD CONSTRAINT "PaymentRefund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentNotification" ADD CONSTRAINT "PaymentNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentNotification" ADD CONSTRAINT "PaymentNotification_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MetricDataPoint" ADD CONSTRAINT "MetricDataPoint_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MonitoringAlert" ADD CONSTRAINT "MonitoringAlert_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LogEvent" ADD CONSTRAINT "LogEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LogEvent" ADD CONSTRAINT "LogEvent_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentShare" ADD CONSTRAINT "DocumentShare_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentShare" ADD CONSTRAINT "DocumentShare_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentShare" ADD CONSTRAINT "DocumentShare_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentComment" ADD CONSTRAINT "DocumentComment_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentComment" ADD CONSTRAINT "DocumentComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentActivity" ADD CONSTRAINT "DocumentActivity_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentActivity" ADD CONSTRAINT "DocumentActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTDevice" ADD CONSTRAINT "IoTDevice_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTDevice" ADD CONSTRAINT "IoTDevice_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTAlert" ADD CONSTRAINT "IoTAlert_acknowledgedById_fkey" FOREIGN KEY ("acknowledgedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTAlert" ADD CONSTRAINT "IoTAlert_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTAlert" ADD CONSTRAINT "IoTAlert_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelemetryData" ADD CONSTRAINT "TelemetryData_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeviceConfig" ADD CONSTRAINT "DeviceConfig_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilityBill" ADD CONSTRAINT "UtilityBill_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilityBill" ADD CONSTRAINT "UtilityBill_smartMeterReadingId_fkey" FOREIGN KEY ("smartMeterReadingId") REFERENCES "public"."SmartMeterReading"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilityBill" ADD CONSTRAINT "UtilityBill_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilityReading" ADD CONSTRAINT "UtilityReading_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilityReading" ADD CONSTRAINT "UtilityReading_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConsumptionAnalytics" ADD CONSTRAINT "ConsumptionAnalytics_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConsumptionAnalytics" ADD CONSTRAINT "ConsumptionAnalytics_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilityRate" ADD CONSTRAINT "UtilityRate_residentialComplexId_fkey" FOREIGN KEY ("residentialComplexId") REFERENCES "public"."ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
