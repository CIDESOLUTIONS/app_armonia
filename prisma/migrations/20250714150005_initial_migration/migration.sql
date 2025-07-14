-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('SECURITY', 'MAINTENANCE', 'EMERGENCY', 'NOISE', 'PARKING', 'COMMON_AREAS', 'NEIGHBOR', 'SERVICES', 'PETS', 'OTHER');

-- CreateEnum
CREATE TYPE "IncidentPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED', 'CANCELLED', 'REOPENED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'APP', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CC', 'CE', 'PASSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "VisitorStatus" AS ENUM ('ACTIVE', 'DEPARTED');

-- CreateEnum
CREATE TYPE "AccessPassType" AS ENUM ('SINGLE_USE', 'TEMPORARY', 'RECURRENT');

-- CreateEnum
CREATE TYPE "AccessPassStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AccessAction" AS ENUM ('ENTRY', 'EXIT', 'DENIED');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('PACKAGE', 'MAIL', 'DOCUMENT', 'FOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('RECEIVED', 'NOTIFIED', 'PENDING', 'DELIVERED', 'RETURNED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PackagePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "IncidentCategory" NOT NULL,
    "subcategory" TEXT,
    "priority" "IncidentPriority" NOT NULL,
    "impact" TEXT,
    "location" TEXT NOT NULL,
    "unitId" INTEGER,
    "unitNumber" TEXT,
    "area" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL,
    "assignedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "reportedById" INTEGER NOT NULL,
    "reportedByName" TEXT NOT NULL,
    "reportedByRole" TEXT NOT NULL,
    "assignedToId" INTEGER,
    "assignedToName" TEXT,
    "assignedToRole" TEXT,
    "status" "IncidentStatus" NOT NULL DEFAULT 'REPORTED',
    "resolution" TEXT,
    "rootCause" TEXT,
    "preventiveActions" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "requiresFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "slaId" INTEGER,
    "responseTime" INTEGER,
    "resolutionTime" INTEGER,
    "slaBreached" BOOLEAN,
    "relatedIncidentIds" TEXT[],
    "visitorId" INTEGER,
    "packageId" INTEGER,
    "mainPhotoUrl" TEXT,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentUpdate" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachments" JSONB,

    CONSTRAINT "IncidentUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentComment" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" INTEGER,
    "attachments" JSONB,

    CONSTRAINT "IncidentComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentStatusHistory" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "previousStatus" "IncidentStatus",
    "newStatus" "IncidentStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" INTEGER NOT NULL,
    "changedByName" TEXT NOT NULL,
    "changedByRole" TEXT NOT NULL,
    "reason" TEXT,
    "timeInStatus" INTEGER,

    CONSTRAINT "IncidentStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentNotification" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "recipientId" INTEGER,
    "recipientRole" TEXT,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "IncidentNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentSLA" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "IncidentCategory",
    "priority" "IncidentPriority",
    "responseTime" INTEGER NOT NULL,
    "resolutionTime" INTEGER NOT NULL,
    "businessHoursOnly" BOOLEAN NOT NULL DEFAULT true,
    "escalationRules" JSONB,
    "notifyRules" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentSLA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentNotificationTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "eventType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentNotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentSettings" (
    "id" SERIAL NOT NULL,
    "autoAssignEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoNotifyResident" BOOLEAN NOT NULL DEFAULT true,
    "autoNotifyStaff" BOOLEAN NOT NULL DEFAULT true,
    "notificationMethods" TEXT[],
    "requirePhoto" BOOLEAN NOT NULL DEFAULT false,
    "allowAnonymousReports" BOOLEAN NOT NULL DEFAULT false,
    "publicIncidentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "residentCanClose" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentCustomCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentCategory" "IncidentCategory" NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentCustomCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "schedule" TEXT,
    "recipients" TEXT[],
    "lastRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "memberIds" INTEGER[],
    "categories" "IncidentCategory"[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentialComplex" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "schemaName" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminPhone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'Colombia',
    "propertyTypes" JSONB,
    "planType" "PlanType" NOT NULL DEFAULT 'BASIC',
    "planStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planEndDate" TIMESTAMP(3),
    "trialEndDate" TIMESTAMP(3),
    "isTrialActive" BOOLEAN NOT NULL DEFAULT true,
    "maxUnits" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResidentialComplex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "complexId" INTEGER,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "complexName" TEXT NOT NULL,
    "units" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contacted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "complexId" INTEGER NOT NULL,
    "planType" "PlanType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingEmail" TEXT NOT NULL,
    "billingName" TEXT NOT NULL,
    "billingAddress" TEXT,
    "billingCity" TEXT,
    "billingCountry" TEXT DEFAULT 'Colombia',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "residentName" TEXT,
    "entryTime" TIMESTAMP(3) NOT NULL,
    "exitTime" TIMESTAMP(3),
    "plate" TEXT,
    "photoUrl" TEXT,
    "status" "VisitorStatus" NOT NULL,
    "notes" TEXT,
    "preRegisterId" INTEGER,
    "accessPassId" INTEGER,
    "purpose" TEXT,
    "company" TEXT,
    "temperature" DOUBLE PRECISION,
    "belongings" JSONB,
    "signature" TEXT,
    "registeredBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreRegisteredVisitor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "documentType" "DocumentType",
    "documentNumber" TEXT,
    "residentId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "expectedDate" TIMESTAMP(3) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "purpose" TEXT,
    "isRecurrent" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "accessCode" TEXT NOT NULL,
    "qrCodeUrl" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreRegisteredVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessPass" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "qrUrl" TEXT NOT NULL,
    "type" "AccessPassType" NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "maxUsages" INTEGER NOT NULL DEFAULT 1,
    "status" "AccessPassStatus" NOT NULL,
    "preRegisterId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessPass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessLog" (
    "id" SERIAL NOT NULL,
    "action" "AccessAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "registeredBy" INTEGER NOT NULL,
    "visitorId" INTEGER,
    "accessPassId" INTEGER,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "residentType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "phone" TEXT,
    "emergencyContact" TEXT,
    "vehicles" JSONB,
    "moveInDate" TIMESTAMP(3),
    "moveOutDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "trackingCode" TEXT,
    "type" "PackageType" NOT NULL,
    "trackingNumber" TEXT,
    "courier" TEXT,
    "senderName" TEXT,
    "senderCompany" TEXT,
    "residentId" INTEGER,
    "unitId" INTEGER NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "residentName" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "status" "PackageStatus" NOT NULL DEFAULT 'RECEIVED',
    "priority" "PackagePriority" NOT NULL DEFAULT 'NORMAL',
    "receivedByStaffId" INTEGER NOT NULL,
    "receivedByStaffName" TEXT NOT NULL,
    "deliveredByStaffId" INTEGER,
    "deliveredByStaffName" TEXT,
    "receivedByResidentId" INTEGER,
    "receivedByResidentName" TEXT,
    "size" TEXT,
    "weight" DOUBLE PRECISION,
    "isFragile" BOOLEAN NOT NULL DEFAULT false,
    "needsRefrigeration" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "notes" TEXT,
    "tags" TEXT[],
    "mainPhotoUrl" TEXT,
    "attachments" JSONB,
    "signatureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageStatusHistory" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "previousStatus" "PackageStatus",
    "newStatus" "PackageStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedByUserId" INTEGER NOT NULL,
    "changedByUserName" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "PackageStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageNotification" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PackageNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageNotificationTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageNotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSettings" (
    "id" SERIAL NOT NULL,
    "autoNotifyResident" BOOLEAN NOT NULL DEFAULT true,
    "notificationMethods" TEXT[],
    "expirationDays" INTEGER NOT NULL DEFAULT 30,
    "reminderFrequency" INTEGER NOT NULL DEFAULT 3,
    "requireSignature" BOOLEAN NOT NULL DEFAULT true,
    "requirePhoto" BOOLEAN NOT NULL DEFAULT true,
    "allowAnyoneToReceive" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageReport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "schedule" TEXT,
    "recipients" TEXT[],
    "lastRun" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "email" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "images" TEXT[],
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "complexId" INTEGER NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "listingId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_category_idx" ON "Incident"("category");

-- CreateIndex
CREATE INDEX "Incident_priority_idx" ON "Incident"("priority");

-- CreateIndex
CREATE INDEX "Incident_reportedAt_idx" ON "Incident"("reportedAt");

-- CreateIndex
CREATE INDEX "Incident_assignedToId_idx" ON "Incident"("assignedToId");

-- CreateIndex
CREATE INDEX "Incident_unitNumber_idx" ON "Incident"("unitNumber");

-- CreateIndex
CREATE INDEX "Incident_incidentNumber_idx" ON "Incident"("incidentNumber");

-- CreateIndex
CREATE INDEX "IncidentUpdate_incidentId_idx" ON "IncidentUpdate"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentUpdate_timestamp_idx" ON "IncidentUpdate"("timestamp");

-- CreateIndex
CREATE INDEX "IncidentComment_incidentId_idx" ON "IncidentComment"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentComment_timestamp_idx" ON "IncidentComment"("timestamp");

-- CreateIndex
CREATE INDEX "IncidentStatusHistory_incidentId_idx" ON "IncidentStatusHistory"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentStatusHistory_changedAt_idx" ON "IncidentStatusHistory"("changedAt");

-- CreateIndex
CREATE INDEX "IncidentNotification_incidentId_idx" ON "IncidentNotification"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentNotification_sentAt_idx" ON "IncidentNotification"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentialComplex_schemaName_key" ON "ResidentialComplex"("schemaName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- CreateIndex
CREATE INDEX "Visitor_documentType_documentNumber_idx" ON "Visitor"("documentType", "documentNumber");

-- CreateIndex
CREATE INDEX "Visitor_status_idx" ON "Visitor"("status");

-- CreateIndex
CREATE INDEX "Visitor_entryTime_idx" ON "Visitor"("entryTime");

-- CreateIndex
CREATE INDEX "Visitor_destination_idx" ON "Visitor"("destination");

-- CreateIndex
CREATE INDEX "Visitor_preRegisterId_idx" ON "Visitor"("preRegisterId");

-- CreateIndex
CREATE INDEX "PreRegisteredVisitor_residentId_idx" ON "PreRegisteredVisitor"("residentId");

-- CreateIndex
CREATE INDEX "PreRegisteredVisitor_status_idx" ON "PreRegisteredVisitor"("status");

-- CreateIndex
CREATE INDEX "PreRegisteredVisitor_validFrom_validUntil_idx" ON "PreRegisteredVisitor"("validFrom", "validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "AccessPass_code_key" ON "AccessPass"("code");

-- CreateIndex
CREATE INDEX "AccessPass_code_idx" ON "AccessPass"("code");

-- CreateIndex
CREATE INDEX "AccessPass_status_idx" ON "AccessPass"("status");

-- CreateIndex
CREATE INDEX "AccessPass_validFrom_validUntil_idx" ON "AccessPass"("validFrom", "validUntil");

-- CreateIndex
CREATE INDEX "AccessPass_preRegisterId_idx" ON "AccessPass"("preRegisterId");

-- CreateIndex
CREATE INDEX "AccessLog_action_idx" ON "AccessLog"("action");

-- CreateIndex
CREATE INDEX "AccessLog_timestamp_idx" ON "AccessLog"("timestamp");

-- CreateIndex
CREATE INDEX "AccessLog_visitorId_idx" ON "AccessLog"("visitorId");

-- CreateIndex
CREATE INDEX "AccessLog_accessPassId_idx" ON "AccessLog"("accessPassId");

-- CreateIndex
CREATE INDEX "Package_status_idx" ON "Package"("status");

-- CreateIndex
CREATE INDEX "Package_receivedAt_idx" ON "Package"("receivedAt");

-- CreateIndex
CREATE INDEX "Package_unitNumber_idx" ON "Package"("unitNumber");

-- CreateIndex
CREATE INDEX "Package_residentId_idx" ON "Package"("residentId");

-- CreateIndex
CREATE INDEX "Package_trackingCode_idx" ON "Package"("trackingCode");

-- CreateIndex
CREATE INDEX "Package_trackingNumber_idx" ON "Package"("trackingNumber");

-- CreateIndex
CREATE INDEX "PackageStatusHistory_packageId_idx" ON "PackageStatusHistory"("packageId");

-- CreateIndex
CREATE INDEX "PackageStatusHistory_changedAt_idx" ON "PackageStatusHistory"("changedAt");

-- CreateIndex
CREATE INDEX "PackageNotification_packageId_idx" ON "PackageNotification"("packageId");

-- CreateIndex
CREATE INDEX "PackageNotification_sentAt_idx" ON "PackageNotification"("sentAt");

-- CreateIndex
CREATE INDEX "Listing_authorId_idx" ON "Listing"("authorId");

-- CreateIndex
CREATE INDEX "Listing_complexId_idx" ON "Listing"("complexId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_listingId_idx" ON "Message"("listingId");

-- CreateIndex
CREATE INDEX "Report_listingId_idx" ON "Report"("listingId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- AddForeignKey
ALTER TABLE "IncidentUpdate" ADD CONSTRAINT "IncidentUpdate_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentComment" ADD CONSTRAINT "IncidentComment_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentStatusHistory" ADD CONSTRAINT "IncidentStatusHistory_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentNotification" ADD CONSTRAINT "IncidentNotification_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "ResidentialComplex"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_preRegisterId_fkey" FOREIGN KEY ("preRegisterId") REFERENCES "PreRegisteredVisitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_accessPassId_fkey" FOREIGN KEY ("accessPassId") REFERENCES "AccessPass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreRegisteredVisitor" ADD CONSTRAINT "PreRegisteredVisitor_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessPass" ADD CONSTRAINT "AccessPass_preRegisterId_fkey" FOREIGN KEY ("preRegisterId") REFERENCES "PreRegisteredVisitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_accessPassId_fkey" FOREIGN KEY ("accessPassId") REFERENCES "AccessPass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageStatusHistory" ADD CONSTRAINT "PackageStatusHistory_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageNotification" ADD CONSTRAINT "PackageNotification_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
