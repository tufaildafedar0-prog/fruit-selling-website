-- CreateTable
CREATE TABLE "telegram_logs" (
    "id" SERIAL PRIMARY KEY,
    "orderId" INTEGER,
    "type" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastError" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "telegram_logs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "telegram_logs_orderId_idx" ON "telegram_logs"("orderId");
CREATE INDEX "telegram_logs_status_idx" ON "telegram_logs"("status");
CREATE INDEX "telegram_logs_createdAt_idx" ON "telegram_logs"("createdAt");

-- Rollback SQL (save this for reference):
-- DROP TABLE IF EXISTS "telegram_logs";
