-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "umk" INTEGER NOT NULL,
    "coworkingCount" INTEGER NOT NULL,
    "internetMbps" INTEGER NOT NULL,
    "kostMin" INTEGER NOT NULL,
    "kostMax" INTEGER NOT NULL,
    "estimasiBiayaHidup" INTEGER NOT NULL,
    "ringkasanKarakteristik" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistrictScore" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DistrictScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "nilaiLama" DOUBLE PRECISION NOT NULL,
    "nilaiBaru" DOUBLE PRECISION NOT NULL,
    "operator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DistrictScore_districtId_indicatorId_key" ON "DistrictScore"("districtId", "indicatorId");

-- AddForeignKey
ALTER TABLE "DistrictScore" ADD CONSTRAINT "DistrictScore_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
