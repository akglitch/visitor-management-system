"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import type SignatureCanvas from "react-signature-canvas";

const SignaturePad = dynamic(() => import("react-signature-canvas"), { ssr: false }) as any;
import { Check, ChevronsUpDown, Eraser, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const visitorSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    region: z.string().min(1, "Region is required"),
    institution: z.string().min(1, "Institution is required"),
    institutionType: z.string().min(1, "Institution type is required"),
    contactEmail: z.string().email().optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    purpose: z.string().min(1, "Purpose is required"),
    hostEmployee: z.string().min(1, "Host is required"),
});

type VisitorFormValues = z.infer<typeof visitorSchema>;

const REGIONS = ['North America', 'Europe', 'Asia', 'Africa', 'Australia', 'Other'];
const INSTITUTION_TYPES = ['Corporate', 'Government', 'Educational', 'Personal', 'Other'];

export function VisitorForm() {
    const [employees, setEmployees] = useState<{ _id: string; name: string; department: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sigPad = useRef<SignatureCanvas>(null);
    const router = useRouter();

    const form = useForm<VisitorFormValues>({
        resolver: zodResolver(visitorSchema),
        defaultValues: {
            fullName: "",
            region: "",
            institution: "",
            institutionType: "",
            contactEmail: "",
            contactPhone: "",
            purpose: "",
            hostEmployee: "",
        },
    });

    useEffect(() => {
        // Fetch employees for the combo box
        fetch('/api/employees')
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error("Failed to fetch employees", err));

        // Attempt to load draft from local storage
        const draft = localStorage.getItem("visitorFormDraft");
        if (draft) {
            try {
                const parsed = JSON.parse(draft);
                form.reset(parsed);
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, [form]);

    // Auto-save draft
    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem("visitorFormDraft", JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const clearSignature = (e: React.MouseEvent) => {
        e.preventDefault();
        sigPad.current?.clear();
    };

    const onSubmit = async (data: VisitorFormValues) => {
        if (sigPad.current?.isEmpty()) {
            toast.error("Please provide a signature");
            return;
        }

        setIsSubmitting(true);
        const signatureData = sigPad.current?.getTrimmedCanvas().toDataURL('image/png');

        try {
            const response = await fetch("/api/visitors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    signatureData,
                }),
            });

            if (!response.ok) throw new Error("Check-in failed");

            toast.success("Visitor checked in successfully");
            localStorage.removeItem("visitorFormDraft");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Failed to check in visitor. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="region"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Region</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select region" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {REGIONS.map(region => (
                                                <SelectItem key={region} value={region}>{region}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="institution"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution / Company</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Corp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="institutionType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Institution Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {INSTITUTION_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="hostEmployee"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Host Employee</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? employees.find(
                                                            (employee) => employee._id === field.value
                                                        )?.name
                                                        : "Select host"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search employee..." />
                                                <CommandList>
                                                    <CommandEmpty>No employee found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {employees.map((employee) => (
                                                            <CommandItem
                                                                value={employee.name}
                                                                key={employee._id}
                                                                onSelect={() => {
                                                                    form.setValue("hostEmployee", employee._id);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        employee._id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {employee.name} ({employee.department})
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purpose of Visit</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Meeting, Interview, delivery..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="visitor@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <FormLabel className="text-base">Signature</FormLabel>
                        <Button size="sm" variant="ghost" onClick={clearSignature} className="h-8">
                            <Eraser className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                    </div>
                    <div className="border rounded-md bg-white">
                        <SignaturePad
                            ref={sigPad as any}
                            penColor="black"
                            canvasProps={{
                                className: "w-full h-[200px] rounded-md"
                            }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">Please sign within the box above.</p>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Checking In...
                            </>
                        ) : "Complete Check-in"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
