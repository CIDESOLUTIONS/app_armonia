/*
  Warnings:

  - You are about to drop the `AccessLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccessPass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Incident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentCustomCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentNotificationTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentSLA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentStatusHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncidentUpdate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Listing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageNotificationTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageStatusHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreRegisteredVisitor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prospect` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resident` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResidentialComplex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Visitor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AccessLog" DROP CONSTRAINT "AccessLog_accessPassId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AccessLog" DROP CONSTRAINT "AccessLog_visitorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AccessPass" DROP CONSTRAINT "AccessPass_preRegisterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IncidentComment" DROP CONSTRAINT "IncidentComment_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IncidentNotification" DROP CONSTRAINT "IncidentNotification_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IncidentStatusHistory" DROP CONSTRAINT "IncidentStatusHistory_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."IncidentUpdate" DROP CONSTRAINT "IncidentUpdate_incidentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_complexId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LoginHistory" DROP CONSTRAINT "LoginHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PackageNotification" DROP CONSTRAINT "PackageNotification_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PackageStatusHistory" DROP CONSTRAINT "PackageStatusHistory_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PreRegisteredVisitor" DROP CONSTRAINT "PreRegisteredVisitor_residentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_listingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_complexId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_complexId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Visitor" DROP CONSTRAINT "Visitor_accessPassId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Visitor" DROP CONSTRAINT "Visitor_preRegisterId_fkey";

-- DropTable
DROP TABLE "public"."AccessLog";

-- DropTable
DROP TABLE "public"."AccessPass";

-- DropTable
DROP TABLE "public"."Incident";

-- DropTable
DROP TABLE "public"."IncidentComment";

-- DropTable
DROP TABLE "public"."IncidentCustomCategory";

-- DropTable
DROP TABLE "public"."IncidentNotification";

-- DropTable
DROP TABLE "public"."IncidentNotificationTemplate";

-- DropTable
DROP TABLE "public"."IncidentReport";

-- DropTable
DROP TABLE "public"."IncidentSLA";

-- DropTable
DROP TABLE "public"."IncidentSettings";

-- DropTable
DROP TABLE "public"."IncidentStatusHistory";

-- DropTable
DROP TABLE "public"."IncidentTeam";

-- DropTable
DROP TABLE "public"."IncidentUpdate";

-- DropTable
DROP TABLE "public"."Listing";

-- DropTable
DROP TABLE "public"."LoginHistory";

-- DropTable
DROP TABLE "public"."Message";

-- DropTable
DROP TABLE "public"."Package";

-- DropTable
DROP TABLE "public"."PackageNotification";

-- DropTable
DROP TABLE "public"."PackageNotificationTemplate";

-- DropTable
DROP TABLE "public"."PackageReport";

-- DropTable
DROP TABLE "public"."PackageSettings";

-- DropTable
DROP TABLE "public"."PackageStatusHistory";

-- DropTable
DROP TABLE "public"."PreRegisteredVisitor";

-- DropTable
DROP TABLE "public"."Prospect";

-- DropTable
DROP TABLE "public"."Report";

-- DropTable
DROP TABLE "public"."Resident";

-- DropTable
DROP TABLE "public"."ResidentialComplex";

-- DropTable
DROP TABLE "public"."Subscription";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."Visitor";

-- DropEnum
DROP TYPE "public"."AccessAction";

-- DropEnum
DROP TYPE "public"."AccessPassStatus";

-- DropEnum
DROP TYPE "public"."AccessPassType";

-- DropEnum
DROP TYPE "public"."AttachmentType";

-- DropEnum
DROP TYPE "public"."DocumentType";

-- DropEnum
DROP TYPE "public"."IncidentCategory";

-- DropEnum
DROP TYPE "public"."IncidentPriority";

-- DropEnum
DROP TYPE "public"."IncidentStatus";

-- DropEnum
DROP TYPE "public"."NotificationType";

-- DropEnum
DROP TYPE "public"."PackagePriority";

-- DropEnum
DROP TYPE "public"."PackageStatus";

-- DropEnum
DROP TYPE "public"."PackageType";

-- DropEnum
DROP TYPE "public"."PlanType";

-- DropEnum
DROP TYPE "public"."VisitorStatus";
