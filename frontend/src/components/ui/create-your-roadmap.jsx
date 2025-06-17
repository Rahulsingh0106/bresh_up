"use client"
import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";

function CreateYourRoadmapBtn() {
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ roadmap_title: "", description: "" })
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const parsedToken = JSON.parse(token);
            setUserDetails(parsedToken);
        }
    }, []);

    const userId = userDetails?.id;
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        console.log(userDetails.user_details._id)
        e.preventDefault();
        const newErrors = {};
        setErrors({}); // Clear previous errors

        // Validation
        if (!form.roadmap_title) {
            newErrors.roadmap_title = "Roadmap title is required.";
        }
        if (!form.description) {
            newErrors.description = "Description is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const defaultNodes = [
            {
                id: "1",
                type: "titleNode",
                position: { x: 250, y: 50 },
                data: { label: form.roadmap_title },
            },
            {
                id: "2",
                type: "topicNode",
                position: { x: 250, y: 150 },
                data: { label: "Main Topic" },
            },
        ];

        const defaultEdges = [
            {
                id: "e1-2",
                source: "1",
                target: "2",
                type: "default",
            },
        ];

        const roadmapData = {
            title: form.roadmap_title.trim(),
            description: form.description.trim(),
            nodes: defaultNodes,
            edges: defaultEdges,
            createdBy: userDetails.user_details._id
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/roadmap/saveRoadmap`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(roadmapData),
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(JSON.stringify(data.error))
            }
            else {
                toast.success("Roadmap created successfully.")

                router.push(`/roadmap/${data.data._id}/edit`);
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong! Please try later again.")
        }
    };
    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <button className="flex h-full w-full items-center justify-center gap-1 overflow-hidden rounded-md border border-dashed border-gray-800 p-3 text-sm text-gray-400 hover:border-gray-600 hover:bg-gray-900 hover:text-gray-300 min-h-[54px]">
                        <Plus />
                        Create your own Roadmap
                    </button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Roadmap</DialogTitle>
                        <DialogDescription>
                            Add a title and description to your roadmap.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="roadmap_title" className="text-right">
                                    Roadmap Title
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="roadmap_title"
                                        name="roadmap_title"
                                        value={form.roadmap_title}
                                        onChange={handleChange}
                                        placeholder="Enter your roadmap name"
                                    />
                                    {errors.roadmap_title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.roadmap_title}</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <div className="col-span-3">
                                    <Input
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Enter your description"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export { CreateYourRoadmapBtn }