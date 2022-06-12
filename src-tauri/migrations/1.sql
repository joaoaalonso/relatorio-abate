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

CREATE TABLE reports (
    `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `clientId` INTEGER NOT NULL,
    `rancheId` INTEGER NOT NULL,
    `slaughterhouseId` INTEGER NOT NULL,
    `file` TEXT NOT NULL,
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

INSERT INTO discounts VALUES 
    (1, "Funrural", 150), 
    (2, "Senar", 20);

INSERT INTO fetus VALUES 
    (1, "P", 800, "DE ATÉ 2 MESES"), 
    (2, "M", 1600, "ENTRE 2 À 5 MESES"), 
    (3, "G", 3200, "DE ATÉ 9 MESES");