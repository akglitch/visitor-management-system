import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Visitor from "@/models/Visitor";
import Employee from "@/models/Employee";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
    try {
        await dbConnect();

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const totalToday = await Visitor.countDocuments({
            checkInTime: { $gte: todayStart, $lte: todayEnd },
        });

        const currentVisitorsCount = await Visitor.countDocuments({
            status: "checked_in",
        });

        const activeVisitors = await Visitor.find({ status: "checked_in" })
            .sort({ checkInTime: -1 })
            .populate("hostEmployee", "name department");

        return NextResponse.json({
            totalToday,
            currentVisitorsCount,
            activeVisitors: JSON.parse(JSON.stringify(activeVisitors)),
        });
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}