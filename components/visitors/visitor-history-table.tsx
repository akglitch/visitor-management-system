"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface VisitorHistoryTableProps {
    visitors: any[];
}

export function VisitorHistoryTable({ visitors }: VisitorHistoryTableProps) {
    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Visitor Name</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Host Employee</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Purpose</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visitors.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No visitors found matching your criteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        visitors.map((visitor) => (
                            <TableRow key={visitor._id}>
                                <TableCell className="font-medium">{visitor.fullName}</TableCell>
                                <TableCell>
                                    {visitor.institution}
                                    <span className="block text-xs text-muted-foreground">{visitor.institutionType}</span>
                                </TableCell>
                                <TableCell>
                                    {visitor.hostEmployee?.name || <span className="text-muted-foreground italic">Unknown</span>}
                                </TableCell>
                                <TableCell>
                                    {visitor.checkInTime ? format(new Date(visitor.checkInTime), "MMM dd, y p") : "-"}
                                </TableCell>
                                <TableCell>
                                    {visitor.checkOutTime ? format(new Date(visitor.checkOutTime), "MMM dd, y p") : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={visitor.status === 'checked_in' ? 'default' : 'secondary'}>
                                        {visitor.status === 'checked_in' ? 'Active' : 'Checked Out'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{visitor.purpose}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
