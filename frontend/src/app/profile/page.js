"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from "next/link";


const page = () => {
    const [isExperienced, setIsExperienced] = useState("fresher")
    const [profileData, setProfileData] = useState("")

    async function fetchProfileData() {
        const token = localStorage.getItem("token")
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProfileData(result)
    }

    return (
        <div className='flex justify-center items-center min-h-screen'>
            {/* <Card className="w-[100vh] shadow-md p-5 m-5"> */}
            {/* <div className="bg-gray-100"> */}
            <Card className="w-[100vh] shadow-md p-5 m-5">
                <CardHeader className="border-b-2 mb-2">
                    <CardTitle className="text-2xl">Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className='flex flex-row space-x-4'>
                        <div className='flex-1 flex-col'>
                            <Label htmlFor="name" className="mb-2">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className='flex-1 flex-col'>
                            <Label htmlFor="email" className="mb-2">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                            />
                        </div>

                    </div>
                    <div className='flex flex-row space-x-4'>
                        <div className='flex-1 flex-col'>
                            <Label htmlFor="experience" className="mb-2">Total Experience</Label>
                            <Input
                                id="experience"
                                type="number"
                                name="experience"
                                placeholder="Enter your experience"
                            />
                        </div>
                        <div className='flex-1 flex-col'>
                            <Label htmlFor="phone" className="mb-2">Phone</Label>
                            <Input
                                id="phone"
                                type="text"
                                name="phone"
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>
                    <div className='flex flex-row space-x-4'>

                        <div className='flex-1 flex-col'>
                            <Label htmlFor="name" className="mb-2">Linkedin</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className='flex-1 flex-col'>
                            <Label htmlFor="name" className="mb-2">Skills</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                            />
                        </div>
                    </div>
                    {/* <div className='flex flex-row space-x-4'>
                        <div className='flex-1 flex-col'>
                            <Label htmlFor="name" className="mb-2">Experience</Label>
                            <RadioGroup defaultValue="option-one">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-one" id="option-one" />
                                    <Label htmlFor="option-one">Fresher</Label>

                                    <RadioGroupItem value="option-two" id="option-two" />
                                    <Label htmlFor="option-two">Experience</Label>
                                </div>
                                <div className="flex items-center space-x-2">

                                </div>
                            </RadioGroup>
                        </div>
                    </div> */}
                    {/* <div className='flex flex-row space-x-4'>
                        <div className='flex-1 flex-col'>
                            <div className='flex-1 flex-col'>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                        <div className='flex-1 flex-col'>
                            <div className='flex-1 flex-col'>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                    </div> */}
                </CardContent>
            </Card>
            {/* <Card >
                        <CardHeader className="border-b-2 mb-2">
                            <CardTitle className="text-2xl">Basic Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex flex-row space-x-4'>
                                <div className='flex-1 flex-col'>
                                    <Label htmlFor="name" className="mb-2">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className='flex-1 flex-col'>
                                    <Label htmlFor="email" className="mb-2">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className='flex-1 flex-col'>
                                    <Label htmlFor="experience" className="mb-2">Experience</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        name="experience"
                                        placeholder="Enter your experience"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-row space-x-4'>
                                <div className='flex-1 flex-col'>
                                    <Label htmlFor="address" className="mb-2">Address</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        name="address"
                                        placeholder="Enter your address"
                                    />
                                </div>
                                <div className='flex-1 flex-col'>
                                    <Label htmlFor="phone" className="mb-2">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div className='flex-1 flex-col'>
                                    <Label htmlFor="dob" className="mb-2">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        name="dob"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card> */}
            {/* </div> */}
            {/* </Card>s */}
        </div>
    )
}

export default page