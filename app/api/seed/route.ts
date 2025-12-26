import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        // 1. Seed Receptionist
        const receptionistEmail = 'receptionist@example.com';
        const existingUser = await User.findOne({ email: receptionistEmail });

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Jane Doe',
                email: receptionistEmail,
                password: hashedPassword,
                role: 'receptionist',
            });
            console.log('Seeded receptionist user.');
        }

        // 2. Seed Employees
        const employeeCount = await Employee.countDocuments();
        if (employeeCount === 0) {
            await Employee.create([
                { name: 'John Smith', email: 'john@company.com', department: 'Sales' },
                { name: 'Alice Johnson', email: 'alice@company.com', department: 'Engineering' },
                { name: 'Bob Wilson', email: 'bob@company.com', department: 'HR' },
                { name: 'Sarah Davis', email: 'sarah@company.com', department: 'Marketing' },
            ]);
            console.log('Seeded employees.');
        }

        return NextResponse.json({ message: 'Seeding completed successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
