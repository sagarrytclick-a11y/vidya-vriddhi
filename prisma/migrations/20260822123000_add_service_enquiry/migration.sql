-- CreateTable
CREATE TABLE IF NOT EXISTS "ServiceEnquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceEnquiry_status_idx" ON "ServiceEnquiry"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceEnquiry_createdAt_idx" ON "ServiceEnquiry"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceEnquiry_email_idx" ON "ServiceEnquiry"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceEnquiry_name_idx" ON "ServiceEnquiry"("name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ServiceEnquiry_phone_idx" ON "ServiceEnquiry"("phone");
