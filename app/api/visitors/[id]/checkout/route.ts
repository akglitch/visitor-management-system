import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Visitor from '@/models/Visitor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const visitor = await Visitor.findByIdAndUpdate(
            params.id,
            {
                status: 'checked_out',
                checkOutTime: new Date(),
            },
            { new: true }
        );

        if (!visitor) {
            return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });
        }

        return NextResponse.json(visitor);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
