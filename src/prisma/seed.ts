import 'dotenv/config';
import { PrismaClient, Role, UserStatus } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Running admin seed...");
    console.log("ADMIN_EMAIL", process.env.ADMIN_EMAIL);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD is not defined");

    const existing = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existing) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: process.env.ADMIN_NAME || 'Super Admin',
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
        },
    });

    console.log("Admin created successfully");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());