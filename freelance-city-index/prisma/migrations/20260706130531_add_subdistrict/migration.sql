-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "subDistrictId" TEXT,
ADD COLUMN     "subDistrictNama" TEXT;

-- CreateTable
CREATE TABLE "SubDistrict" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "estimasiBiayaHidup" INTEGER NOT NULL,
    "coworkingCount" INTEGER NOT NULL,
    "cafeCount" INTEGER NOT NULL,
    "universityCount" INTEGER NOT NULL,
    "tourismScore" DOUBLE PRECISION NOT NULL,
    "ringkasanKarakteristik" TEXT NOT NULL,

    CONSTRAINT "SubDistrict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubDistrictScore" (
    "id" TEXT NOT NULL,
    "subDistrictId" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubDistrictScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubDistrictScore_subDistrictId_indicatorId_key" ON "SubDistrictScore"("subDistrictId", "indicatorId");

-- AddForeignKey
ALTER TABLE "SubDistrict" ADD CONSTRAINT "SubDistrict_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubDistrictScore" ADD CONSTRAINT "SubDistrictScore_subDistrictId_fkey" FOREIGN KEY ("subDistrictId") REFERENCES "SubDistrict"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
