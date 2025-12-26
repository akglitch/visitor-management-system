import { VisitorForm } from "@/components/forms/visitor-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckInPage() {
    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">New Visitor Check-in</h1>
                <p className="text-muted-foreground mt-2">
                    Fill out the form below to register a new visitor.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Visitor Details</CardTitle>
                    <CardDescription>
                        All fields are required unless marked optional.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <VisitorForm />
                </CardContent>
            </Card>
        </div>
    );
}
