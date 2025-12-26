import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Visitor from '@/models/Visitor';
import Employee from '@/models/Employee'; // Register Employee schema
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await dbConnect();

        // Add receptionist ID to the visitor record
        const visitor = await Visitor.create({
            ...body,
            receptionist: session.user.id,
        });

        return NextResponse.json(visitor, { status: 201 });
    } catch (error: any) {
        console.error("Check-in error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');

        let query: any = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { institution: { $regex: search, $options: 'i' } }
            ];
        }

        const visitors = await Visitor.find(query)
            .sort({ checkInTime: -1 })
            .limit(limit)
            .populate('hostEmployee', 'name department');

        return NextResponse.json(visitors);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
