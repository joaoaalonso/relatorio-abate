CREATE TABLE clients (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `postalCode` TEXT NOT NULL,
    `streetName` TEXT,
    `streetNumber` TEXT,
    `neighborhood` TEXT,
    `addressComplement` TEXT,
    `city` TEXT NOT NULL,
    `state` TEXT NOT NULL
);

CREATE TABLE ranches (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `clientId` INTEGER NOT NULL,
    `name` TEXT NOT NULL,
    `postalCode` TEXT NOT NULL,
    `city` TEXT NOT NULL,
    `state` TEXT NOT NULL,
    `address` TEXT,
    `description` TEXT,
    CONSTRAINT `ranches_clientId_fk` 
        FOREIGN KEY (`clientId`) 
        REFERENCES `clients` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE slaughterhouses (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL
);

CREATE TABLE slaughterhouseUnits (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `slaughterhouseId` INTEGER NOT NULL,
    `city` TEXT NOT NULL,
    `state` TEXT NOT NULL,
    CONSTRAINT `slaughterhouses_Id_fk` 
        FOREIGN KEY (`slaughterhouseId`) 
        REFERENCES `slaughterhouses` (`id`)
        ON DELETE CASCADE
);


CREATE TABLE discounts (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `value` INTEGER NOT NULL
);

CREATE TABLE fetus (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `size` TEXT NOT NULL,
    `weight` INTEGER NOT NULL,
    `age` TEXT NOT NULL
);

CREATE TABLE reports (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `clientId` INTEGER NOT NULL,
    `ranchId` INTEGER NOT NULL,
    `slaughterhouseId` INTEGER NOT NULL,
    `slaughterhouseUnitId` INTEGER NOT NULL,
    `discountId` INTEGER NOT NULL,
    `PC` INTEGER NOT NULL,
    `PV` INTEGER NOT NULL,
    `arroba` INTEGER,
    `batch` TEXT NOT NULL,
    `breed` TEXT NOT NULL,
    `cattleShed` TEXT NOT NULL,
    `comments` TEXT,
    `corralEvaluation` TEXT NOT NULL,
    `numberOfAnimals` INTEGER NOT NULL,
    `sequential` TEXT NOT NULL,
    `sex` TEXT NOT NULL,
    `vaccineWeight` INTEGER NOT NULL,
    `date` TEXT NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `reports_clientId_fk` 
        FOREIGN KEY (`clientId`) 
        REFERENCES `clients` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `reports_ranchId_fk` 
        FOREIGN KEY (`ranchId`) 
        REFERENCES `ranches` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `reports_slaughterhouseId_fk` 
        FOREIGN KEY (`slaughterhouseId`) 
        REFERENCES `slaughterhouses` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `reports_slaughterhouseUnitId_fk` 
        FOREIGN KEY (`slaughterhouseUnitId`) 
        REFERENCES `slaughterhouseUnits` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `reports_discountsId_fk` 
        FOREIGN KEY (`discountId`) 
        REFERENCES `discounts` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportPhotos (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `extension` TEXT NOT NULL,
    CONSTRAINT `reportPhotos_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportMaturity (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportMaturity_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportFinishing (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportFinishing_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportRumenScore (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportRumenScore_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportAwards (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportAwards_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportFetus (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportFetus_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportDif (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `seq` TEXT NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportDif_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reportBruises (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `reportId` INTEGER NOT NULL,
    `seq` TEXT NOT NULL,
    `type` TEXT NOT NULL,
    `value` TEXT NOT NULL,
    CONSTRAINT `reportBruises_reportId_fk` 
        FOREIGN KEY (`reportId`) 
        REFERENCES `reports` (`id`)
        ON DELETE CASCADE
);


INSERT INTO discounts VALUES 
    (1, "Funrural", 150), 
    (2, "Senar", 20);

INSERT INTO fetus VALUES 
    (1, "P", 800, "DE ATÉ 2 MESES"), 
    (2, "M", 1600, "ENTRE 2 À 5 MESES"), 
    (3, "G", 3200, "DE ATÉ 9 MESES");