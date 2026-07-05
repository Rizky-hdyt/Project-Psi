-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "relevansi" INTEGER NOT NULL,
    "kemudahan" INTEGER NOT NULL,
    "komentar" TEXT,
    "personaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);
