import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function Docy() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [AppointmentTime, setAppointmentTime] = useState('');
  const ulRef = useRef(null);
  const router = useRouter();

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

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Europe/Istanbul' 
    };
    return date.toLocaleString('en-US', options);
  };

  const handleSubmit = async (doctorId, e) => {
    e.preventDefault();

    if (!user) {
      router.push('/SignUp');
      return;
    }

    try {
      const requestBody = {
        userId: user.id,
        doctorId,
        date: AppointmentTime,
      };

      console.log('Request Body:', requestBody);

      const res = await fetch('/api/appo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        console.log('Appointment created successfully!');
        router.push('/Appointments');
      } else {
        console.error('Failed to create appointment');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <ul ref={ulRef} className="grid grid-cols-3 gap-4" style={{ width: '100%' }}>
      {doctors.map(doctor => (
        <li key={doctor.Iddoctor} className="bg-white rounded-lg shadow overflow-hidden doctor-li">
          <a
            href="#"
            className="block p-4 sm:p-6 lg:p-8"
          >
            <div className="sm:flex sm:justify-between sm:gap-4">
              <div>
                {doctor.Fname} {doctor.Lname} - {doctor.Specialty}
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                </h3>
              </div>

              <div className="hidden sm:block sm:shrink-0">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                  className="size-16 rounded-lg object-cover shadow-sm"
                />
              </div>
            </div>

            <dl className="mt-6 flex gap-4 sm:gap-6">
              <div className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-gray-600">{formatTime(doctor.StartTime)}</dt>
                <dd className="text-xs text-gray-500">starts working from</dd>
              </div>

              <div className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-gray-600">{formatTime(doctor.EndTime)}</dt>
                <dd className="text-xs text-gray-500">until</dd>
              </div>
              <Button>
                <Sheet>
                  <SheetTrigger>Schedule Now</SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Choose the time for your Appointment</SheetTitle>
                      <SheetDescription>
                        <div>Doctors Id : {doctor.Iddoctor} </div>
                        <div>Doctors Name : {doctor.Fname} {doctor.Lname} </div>
                        Your IdCard Number : {user ? user.id : 'Guest'}
                        <div>
                          <h1>Pick a time </h1>
                          <form onSubmit={(e) => handleSubmit(doctor.Iddoctor, e)}>
                            <label htmlFor="AppointmentTime">Appointment Date:</label>
                            <input
                              type="datetime-local"
                              id="AppointmentTime"
                              value={AppointmentTime}
                              onChange={(e) => setAppointmentTime(e.target.value)}
                            />
                            
                            <div style={{ marginTop: '20px' }}><Button><button type="submit">Submit</button></Button></div>
                         
                          </form>
                        </div>
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </Button>
            </dl>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default Docy;
