import { StatsCards } from "@/components/dashboard/stats-cards";
import { VisitorTable } from "@/components/visitors/visitor-table";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";
import Employee from "@/models/Employee"; // Register Employee schema
import { startOfDay, endOfDay } from "date-fns";

async function getDashboardData() {
    await dbConnect();
    // Force Employee model registration (required for populate)
    void Employee;

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const totalToday = await Visitor.countDocuments({
        checkInTime: { $gte: todayStart, $lte: todayEnd },
    });

    const currentVisitorsCount = await Visitor.countDocuments({
        status: "checked_in",
    });

    // Fetch only currently checked-in visitors for the dashboard list
    const activeVisitors = await Visitor.find({ status: "checked_in" })
        .sort({ checkInTime: -1 })
        .populate("hostEmployee", "name department");

    return {
        totalToday,
        currentVisitorsCount,
        activeVisitors: JSON.parse(JSON.stringify(activeVisitors)), // Serialize for Client Component
    };
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const { totalToday, currentVisitorsCount, activeVisitors } = await getDashboardData();

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <StatsCards
                totalToday={totalToday}
                currentVisitors={currentVisitorsCount}
            />

            <div className="space-y-4">
                <h3 className="text-xl font-semibold tracking-tight">Current Visitors</h3>
                <VisitorTable visitors={activeVisitors} />
            </div>
        </div>
    );
}
