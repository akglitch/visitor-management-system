import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserMinus } from "lucide-react";

interface StatsCardsProps {
    totalToday: number;
    currentVisitors: number;
}

export function StatsCards({ totalToday, currentVisitors }: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Visitors Today
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalToday}</div>
                    <p className="text-xs text-muted-foreground">
                        +0% from yesterday
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Currently Checked In
                    </CardTitle>
                    <UserMinus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{currentVisitors}</div>
                    <p className="text-xs text-muted-foreground">
                        Active on site
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
