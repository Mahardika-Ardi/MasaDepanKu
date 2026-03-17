-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoProfile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file" TEXT NOT NULL,

    CONSTRAINT "PhotoProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilDetail" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "raport_score" JSONB NOT NULL,

    CONSTRAINT "ProfilDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupQuestion" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "GroupQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoProfile_user_id_key" ON "PhotoProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilDetail_user_id_key" ON "ProfilDetail"("user_id");

-- AddForeignKey
ALTER TABLE "PhotoProfile" ADD CONSTRAINT "PhotoProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilDetail" ADD CONSTRAINT "ProfilDetail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupQuestion" ADD CONSTRAINT "GroupQuestion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "GroupQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
