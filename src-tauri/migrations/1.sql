CREATE TABLE clients (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `postalCode` VARCHAR(200) NOT NULL,
    `streetName` VARCHAR(200),
    `streetNumber` VARCHAR(200),
    `neighborhood` VARCHAR(200),
    `addressComplement` VARCHAR(200),
    `city` VARCHAR(200) NOT NULL,
    `state` VARCHAR(200) NOT NULL
);

CREATE TABLE ranches (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `clientId` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `postalCode` VARCHAR(200) NOT NULL,
    `city` VARCHAR(200) NOT NULL,
    `state` VARCHAR(200) NOT NULL,
    `address` VARCHAR(200),
    `description` VARCHAR(200),
    CONSTRAINT `ranches_clientId_fk` 
        FOREIGN KEY (`clientId`) 
        REFERENCES `clients` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE slaughterhouses (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(200) NOT NULL
);

CREATE TABLE slaughterhouseUnits (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `slaughterhouseId` INTEGER NOT NULL,
    `city` VARCHAR(200) NOT NULL,
    `state` VARCHAR(200) NOT NULL,
    CONSTRAINT `slaughterhouses_Id_fk` 
        FOREIGN KEY (`slaughterhouseId`) 
        REFERENCES `slaughterhouses` (`id`)
        ON DELETE CASCADE
);

CREATE TABLE reports (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `clientId` INTEGER NOT NULL,
    `rancheId` INTEGER NOT NULL,
    `slaughterhouseId` INTEGER NOT NULL,
    `file` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME NOT NULL,
    CONSTRAINT `reports_clientId_fk` 
        FOREIGN KEY (`clientId`) 
        REFERENCES `clients` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `reports_rancheId_fk` 
        FOREIGN KEY (`rancheId`) 
        REFERENCES `ranches` (`id`)
        ON DELETE CASCADE,
    CONSTRAINT `reports_slaughterhouseId_fk` 
        FOREIGN KEY (`slaughterhouseId`) 
        REFERENCES `slaughterhouses` (`id`)
        ON DELETE CASCADE
);