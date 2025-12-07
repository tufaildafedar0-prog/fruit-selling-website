-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `selectedQuantity` DECIMAL(10, 2) NULL,
    ADD COLUMN `selectedUnit` VARCHAR(191) NULL,
    ADD COLUMN `variantId` INTEGER NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `defaultUnit` VARCHAR(191) NOT NULL DEFAULT 'kg';

-- CreateTable
CREATE TABLE `product_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `retailPrice` DECIMAL(10, 2) NOT NULL,
    `wholesalePrice` DECIMAL(10, 2) NOT NULL,
    `minQtyWholesale` INTEGER NOT NULL DEFAULT 10,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `product_variants_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
