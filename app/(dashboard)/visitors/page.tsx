import { VisitorHistoryTable } from "@/components/visitors/visitor-history-table";
import { VisitorFilters } from "@/components/visitors/visitor-filters";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";
import Employee from "@/models/Employee"; // Register Employee schema
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

async function getVisitors(searchParams: { [key: string]: string | undefined } | Promise<{ [key: string]: string | undefined }>) {
    await dbConnect();

    const resolvedSearchParams = await searchParams; // Ensure searchParams is resolved

    const search = resolvedSearchParams.search;
    const from = resolvedSearchParams.from;
    const to = resolvedSearchParams.to;

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
        .populate('hostEmployee', 'name department');

    return JSON.parse(JSON.stringify(visitors));
}

export default async function VisitorsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const visitors = await getVisitors(searchParams);

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Visitor History</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Visitors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <VisitorFilters />
                    <VisitorHistoryTable visitors={visitors} />
                </CardContent>
            </Card>
        </div>
    );
}
