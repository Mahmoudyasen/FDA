import React, { useState, useEffect, useRef } from 'react';
import RootLayout from '@/-components/layout';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  

export default function Appointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const ulRef = useRef(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newAppointmentTime, setnewAppointmentTime] = useState("");
    const [confirmation, setConfirmation] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`/api/appr?user_id=${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAppointments(data);
                } else {
                    throw new Error('Failed to fetch appointments');
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        if (user && user.id) {
            fetchAppointments();
        }
    }, [user]);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Europe/Istanbul'
        };
        return date.toLocaleString('en-US', options);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/doc');
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const resizeUlWidth = () => {
            if (ulRef.current) {
                const ulWidth = ulRef.current.clientWidth;
                const ulList = document.querySelectorAll('.grid');
                ulList.forEach(ul => {
                    ul.style.width = `${ulWidth}px`;
                });
            }
        };

        resizeUlWidth();
        window.addEventListener('resize', resizeUlWidth);
        return () => {
            window.removeEventListener('resize', resizeUlWidth);
        };
    }, [doctors]);
    const handleReschedule = async () => {
        try {
            if (!selectedAppointment) {
                throw new Error('No appointment selected for rescheduling');
            }
    
            if (newAppointmentTime && confirmation) {
                const rescheduleResponse = await fetch('/api/reschedule', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appointmentId: selectedAppointment.AId,
                        newAppointmentTime: newAppointmentTime
                    }),
                });
    
                const responseBody = await rescheduleResponse.json(); 
                console.log(responseBody); 
    
                if (rescheduleResponse.ok) {
                    console.log("Appointment rescheduled successfully");
                    setnewAppointmentTime("");
                    setConfirmation(false);
                    setSelectedAppointment(null);
                    setErrorMessage(""); 
                    const response = await fetch(`/api/appr?user_id=${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setAppointments(data);
                    } else {
                        throw new Error('Failed to fetch appointments after rescheduling');
                    }
                } else {
                    throw new Error('Failed to reschedule appointment');
                }
            } else {
                throw new Error('Please select a new date and confirm the reschedule');
            }
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            setErrorMessage("Error rescheduling appointment");
        }
    };

    const handleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
    };
    
    

    const handleChange = (event) => {
        setnewAppointmentTime(event.target.value);
    };

    const handleCheckboxChange = (event) => {
        setConfirmation(event.target.checked);
    };

    const [appointmentId, setAppointmentId] = useState('');

    const handleDeletion = (appointmentId) => {
        setAppointmentId(appointmentId);
    };
    
    const handleSubmit = async (event) => {
        console.log("Selected Appointment ID:", appointmentId, typeof appointmentId);
        event.preventDefault();
    
        try {
            const response = await fetch('/api/can', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ appointmentId }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                alert('Appointment deleted successfully');
            } else {
                const errorData = await response.text(); 
                console.error('Error:', errorData); 
                alert('Failed to delete the appointment');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the appointment');
        }
    };
    

    return (
        <RootLayout>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
                    <thead className="ltr:text-center rtl:text-center">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Appointment Id</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Your Id Card Number</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Doctor Id</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Doctor Name</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date and Time of the Appointment</th> 
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-center">
                        {appointments.map((appointment) => {
                            const doctor = doctors.find(doc => doc.Iddoctor === appointment.DId);
                            return (
                                <tr key={appointment.AId}>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-primary">{appointment.AId}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-primary">{appointment.UId}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-primary">{appointment.DId}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-primary">
                                        {doctor ? `${doctor.Fname} ${doctor.Lname}` : 'Doctor not found'}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-primary">{formatTime(appointment.AppointmentTime)}</td>
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <a
                                            href="#"
                                            className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                            onClick={() => handleSelectAppointment(appointment)}
                                        >
                                            <Dialog>
                                                <DialogTrigger >Reschedule</DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>You are about to Reschedule your Appointment</DialogTitle>
                                                        <DialogDescription>
                                                            
                                                        </DialogDescription>

                                                    </DialogHeader>
                                                    <form onSubmit={handleReschedule}>
                                                                <div>Appointment Id : {appointment.AId}</div>
                                                                <div>
                                                                <label>
                                                                    New Appointment Time:
                                                                    <input type="datetime-local" value={newAppointmentTime} onChange={handleChange} />
                                                                </label>
                                                                </div>
                                                                <div>
                                                                <label>
                                                                    <input type="checkbox" checked={confirmation} onChange={handleCheckboxChange} />
                                                                    Confirm change
                                                                </label>
                                                                </div>
                                                                
                                                                <button type="submit">Submit</button>
                                                                {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                                            </form>
                                                </DialogContent>
                                            </Dialog>
                                        </a>
                                        <a
                                            onClick={() => handleDeletion(appointment.AId)}
                                            className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 ml-2"
                                        >
                                            <Drawer>
                                                <DrawerTrigger>Cancel</DrawerTrigger>
                                                <DrawerContent className="flex flex-col items-center justify-center">
                                                    <DrawerHeader>
                                                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                                                    </DrawerHeader>
                                                    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
                                                        <label className="mb-2">The id you are deleting:</label>
                                                        <input
                                                            type="number"
                                                            value={appointmentId}
                                                            onChange={handleDeletion}
                                                            required
                                                            className="mb-4 px-2 py-1 border border-gray-400 rounded"
                                                        />
                                                        <button type="submit" className="rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">
                                                            Delete
                                                        </button>
                                                    </form>
                                                    <DrawerFooter className="mt-4">
                                                        <DrawerClose>
                                                            <button variant="outline" className="rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700" onClick={() => window.location.reload()}>
                                                                Close
                                                            </button>
                                                        </DrawerClose>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>


                                        </a>
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>
            </div>
        </RootLayout>
    );
}
