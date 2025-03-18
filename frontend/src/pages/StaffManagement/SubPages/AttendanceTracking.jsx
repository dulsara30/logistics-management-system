import React from 'react';
import { Calendar, Clock, Users, UserMinus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Upload, ArrowLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const attendanceData = [
    { date: '2024-03-01', present: 45, absent: 5, late: 3 },
    { date: '2024-03-02', present: 43, absent: 7, late: 2 },
    { date: '2024-03-03', present: 44, absent: 6, late: 4 },
    { date: '2024-03-04', present: 46, absent: 4, late: 1 },
    { date: '2024-03-05', present: 42, absent: 8, late: 5 },
];

function AttendanceTracking(){

    const navigate = useNavigate();

    return(
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Attendance Tracking</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-900">50</p>
                        </div>
                        <Users className='h-8 w-8 text-gray-700'/>
                    </div>
                </div>

                <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
                    <div className='flex item-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-500'>Late Arrivals</p>
                            <p className='text-2xl font-bold text-orange-600'>3</p>
                        </div>
                        <Clock className='h-8 w-8 text-orange-500'/>
                    </div>
                </div>
            </div>

            <div className='bg-gray-100 p-6 rounded-lg shadow-md'>
                <h2 className='text-lg font-semibold mb-4 text-gray-800'>Attendance Overview</h2>
                <div className='h-80'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray='3 3'/>
                            <XAxis dataKey="date" />
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="present" fill="#4F46E5" name="Present" />
                            <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                            <Bar dataKey="late" fill="#F97316" name="Late" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 item-center justify-between'>
                <div className='w-full sm:w-96'>
                    <input type='text' placeholder='Search employee...' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'/>
                </div>

                <div className='flex gap-2'>
                    <button className='px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-colors duration-200 '>
                        Export PDF
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 border border-gray-300  text-gray-700  px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AttendanceTracking;