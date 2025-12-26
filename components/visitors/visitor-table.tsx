"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Visitor {
    _id: string;
    fullName: string;
    institution: string;
    hostEmployee?: { name: string; department: string };
    checkInTime: string;
    status: string;
}

interface VisitorTableProps {
    visitors: Visitor[];
}

export function VisitorTable({ visitors }: VisitorTableProps) {
    const router = useRouter();
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const handleCheckout = async (id: string) => {
        setLoadingIds(prev => [...prev, id]);
        try {
            const res = await fetch(`/api/visitors/${id}/checkout`, {
                method: 'PATCH',
            });

            if (!res.ok) throw new Error('Checkout failed');

            toast.success('Visitor checked out');
            router.refresh();
        } catch (error) {
            toast.error('Failed to check out visitor');
        } finally {
            setLoadingIds(prev => prev.filter(lid => lid !== id));
        }
    };

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Institution</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visitors.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No active visitors.
                            </TableCell>
                        </TableRow>
                    ) : (
                        visitors.map((visitor) => (
                            <TableRow key={visitor._id}>
                                <TableCell className="font-medium">{visitor.fullName}</TableCell>
                                <TableCell>{visitor.institution}</TableCell>
                                <TableCell>
                                    {visitor.hostEmployee?.name || (
                                        <span className="text-muted-foreground italic">Unknown</span>
                                    )}
                                    {visitor.hostEmployee && (
                                        <span className="text-xs text-muted-foreground block">
                                            {visitor.hostEmployee.department}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(visitor.checkInTime), "h:mm a")}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={visitor.status === 'checked_in' ? 'default' : 'secondary'}>
                                        {visitor.status === 'checked_in' ? 'Active' : 'Checked Out'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {visitor.status === 'checked_in' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCheckout(visitor._id)}
                                            disabled={loadingIds.includes(visitor._id)}
                                        >
                                            {loadingIds.includes(visitor._id) ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Check Out
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
