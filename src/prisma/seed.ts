import 'dotenv/config';
import { PrismaClient, Role, UserStatus } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
// ======= SEED ADMIN =======
    console.log("Running admin seed...");
    console.log("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
    console.log("SEED DATABASE_URL =", process.env.DATABASE_URL);
    console.log("SEED DIRECT_URL =", process.env.DIRECT_URL);


    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword)
        throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD is not defined");

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
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
    } else {
        console.log('Admin already exists');
    }


// ======= SEED COURSES =======
    const courseCount = await prisma.course.count();

    if (courseCount === 0) {
        const teacher = await prisma.user.findFirst({
            where: { role: Role.TEACHER },
        });

        if (!teacher) {
            console.log('No teacher found. Please register & approve a teacher first.');
            return;
        }

        await prisma.course.createMany({
            data: [
                {
                    title: 'Basic Programming',
                    description: 'Learn the fundamentals of programming.',
                    teacherId: teacher.id,
                },
                {
                    title: 'Web Development',
                    description: 'HTML, CSS, React, and Next.js.',
                    teacherId: teacher.id,
                },
                {
                    title: 'Database Systems',
                    description: 'Learn SQL and relational databases.',
                    teacherId: teacher.id,
                },
            ],
        });

        console.log('Courses seeded successfully');
    } else {
        console.log('Courses already exist');
    }


// ======= SEED LESSONS =======
    const courses = await prisma.course.findMany();

    for (const course of courses) {
        const lessonCount = await prisma.lesson.count({
            where: { courseId: course.id}
        });

        if (lessonCount === 0) {
            await prisma.lesson.createMany({
                data: [
                    { 
                        title: "Intro to Programming",
                        content: "Welcome to Programming Lesson.",
                        courseId: course.id,
                        order: 1,
                    },
                    { 
                        title: "Variables", 
                        content: "Let's learn variables.", 
                        courseId: course.id,
                        order: 2,
                    },
                ],
            });
        }
    }

    console.log("Lessons seeded for all courses");
}


main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())