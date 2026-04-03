-- AlterTable
ALTER TABLE `photoprofile` MODIFY `file` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `profildetail` MODIFY `jurusan` VARCHAR(191) NULL,
    MODIFY `raport_score` JSON NULL;
