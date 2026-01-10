import { PrismaClient, Role, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@mail.com';

    const existing = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existing) { 
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: 'admin123',
                name: 'Super Admin',
                role: Role.ADMIN,
                status: UserStatus.ACTIVE,
            },
        })
        
        console.log('Admin Created');
    } else {
        console.log('Admin already exists');
    }    
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());