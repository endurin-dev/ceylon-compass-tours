CREATE TABLE "Attraction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attraction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TourAttraction" (
    "tourId" TEXT NOT NULL,
    "attractionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TourAttraction_pkey" PRIMARY KEY ("tourId","attractionId")
);

CREATE TABLE "TourActivity" (
    "tourId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TourActivity_pkey" PRIMARY KEY ("tourId","activityId")
);

CREATE UNIQUE INDEX "Attraction_slug_key" ON "Attraction"("slug");
CREATE UNIQUE INDEX "Activity_slug_key" ON "Activity"("slug");
CREATE INDEX "TourAttraction_attractionId_idx" ON "TourAttraction"("attractionId");
CREATE INDEX "TourActivity_activityId_idx" ON "TourActivity"("activityId");

ALTER TABLE "TourAttraction" ADD CONSTRAINT "TourAttraction_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TourAttraction" ADD CONSTRAINT "TourAttraction_attractionId_fkey"
    FOREIGN KEY ("attractionId") REFERENCES "Attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TourActivity" ADD CONSTRAINT "TourActivity_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TourActivity" ADD CONSTRAINT "TourActivity_activityId_fkey"
    FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
