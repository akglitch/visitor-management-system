import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Visitor from '@/models/Visitor';
import Employee from '@/models/Employee'; // Register Employee schema
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const from = searchParams.get('from');
        const to = searchParams.get('to');

        let query: any = {};

        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { institution: { $regex: search, $options: 'i' } }
            ];
        }

        if (from || to) {
            query.checkInTime = {};
            if (from) query.checkInTime.$gte = startOfDay(parseISO(from));
            if (to) query.checkInTime.$lte = endOfDay(parseISO(to));
        }

        const visitors = await Visitor.find(query)
            .sort({ checkInTime: -1 })
            .populate('hostEmployee', 'name department')
            .lean();

        // Convert to CSV
        const csvHeaders = ['Name,Region,Institution,Type,Purpose,Host,Date,Check In,Check Out,Status,Notes'];
        const csvRows = visitors.map((v: any) => {
            const checkIn = v.checkInTime ? new Date(v.checkInTime).toLocaleString() : '';
            const checkOut = v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : '';
            const hostName = v.hostEmployee?.name || 'Unknown';

            // Escape quotes and wrap fields in quotes
            const safe = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

            return [
                safe(v.fullName),
                safe(v.region),
                safe(v.institution),
                safe(v.institutionType),
                safe(v.purpose),
                safe(hostName),
                safe(v.checkInTime ? new Date(v.checkInTime).toLocaleDateString() : ''),
                safe(checkIn),
                safe(checkOut),
                safe(v.status),
                safe(v.notes)
            ].join(',');
        });

        const csvContent = [csvHeaders, ...csvRows].join('\n');

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="visitors-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
