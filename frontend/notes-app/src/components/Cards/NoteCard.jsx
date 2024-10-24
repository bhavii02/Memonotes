/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
    MdOutlinePushPin, MdCreate, MdDelete, MdMoreVert, MdFlag,
    MdEvent, MdToday, MdWeekend, MdNextWeek, MdClose, MdInfo, MdCalendarToday, MdAlarm
} from "react-icons/md";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
}) => {
    const [showDetailsTooltip, setShowDetailsTooltip] = useState(false);
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showDueDateMenu, setShowDueDateMenu] = useState(false);
    const [showReminderMenu, setShowReminderMenu] = useState(false);
    const [priority, setPriority] = useState(0);
    const [dueDate, setDueDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [time, setTime] = useState('00:00');
    const [reminderTime, setReminderTime] = useState('');
    const cardRef = useRef(null);
    const [email, setEmail] = useState('');


    const handleToggleDetails = () => {
        setShowDetailsTooltip(true);
        setShowPriorityMenu(false);
        setShowActionMenu(false);
        setShowDueDateMenu(false);
        setShowReminderMenu(false);
        setShowCalendar(false); 
        setTimeout(() => {
            setShowDetailsTooltip(false);
        }, 15000);
    };

    const handleHideDetails = () => {
        setShowDetailsTooltip(false);
    };

    const handleTogglePriorityMenu = () => {
        setShowPriorityMenu(prev => !prev);
        setShowDetailsTooltip(false);
        setShowActionMenu(false);
        setShowDueDateMenu(false);
        setShowReminderMenu(false);
        setShowCalendar(false); 
    };

    const handleToggleActionMenu = () => {
        setShowActionMenu(prev => !prev);
        setShowPriorityMenu(false);
        setShowDetailsTooltip(false);
        setShowDueDateMenu(false);
        setShowReminderMenu(false);
        setShowCalendar(false); 
    };

    const handleToggleDueDateMenu = () => {
        setShowDueDateMenu(prev => !prev);
        setShowPriorityMenu(false);
        setShowDetailsTooltip(false);
        setShowActionMenu(false);
        setShowReminderMenu(false);
        setShowCalendar(false); 
    };

    const handleToggleReminderMenu = () => {
        if (!dueDate) {
            alert('Please set a due date before setting a reminder.');
            return;
        }
        setShowReminderMenu(prev => !prev);
        setShowPriorityMenu(false);
        setShowDetailsTooltip(false);
        setShowActionMenu(false);
        setShowDueDateMenu(false);
        setShowCalendar(false); 
    };

    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            handleHideDetails();
            setShowPriorityMenu(false);
            setShowActionMenu(false);
            setShowDueDateMenu(false);
            setShowReminderMenu(false);
            setShowCalendar(false);
        }
    };


    const handlePriorityChange = (level) => {
        setPriority(level);
        setShowPriorityMenu(false);
    };
    const handleEmailKeyPress = (event) => {
        if (event.key === 'Enter' && email) {
            sendReminderEmail(email);
        }
    };

    const sendReminderEmail = async (email) => {
        console.log('Sending email to:', email);
        try {
            const response = await fetch('https://localhost:5173/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Reminder Set',
                    text: `A reminder has been set for the task: "${title}" with a due date of ${dueDate}.`,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(errorText);
            }

            alert('Reminder email sent!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert(`An error occurred while sending the email: ${error.message}`);
        }
    };



    const handleDueDateChange = (option) => {
        let selectedDueDate;
        const now = moment();
        switch (option) {
            case 'today':
                selectedDueDate = now.format('Do MMM YYYY');
                break;
            case 'tomorrow':
                selectedDueDate = now.add(1, 'days').format('Do MMM YYYY');
                break;
            case 'weekend':
                selectedDueDate = now.day(6).format('Do MMM YYYY'); 
                break;
            case 'next_week':
                selectedDueDate = now.add(1, 'weeks').day(1).format('Do MMM YYYY'); 
                break;
            case 'none':
                selectedDueDate = '';
                break;
            case 'calendar':
                setShowCalendar(true);
                setShowDueDateMenu(false);
                return; 
            default:
                selectedDueDate = '';
        }
        setDueDate(selectedDueDate);
        setShowDueDateMenu(false); 
    };

    const handleTimeChange = (value) => {
        setTime(value);
        const formattedTime = moment(value, 'hh:mm a').format('h:mm A');
        if (dueDate) {
            const [datePart] = dueDate.split(', ');
            setDueDate(`${datePart}, ${formattedTime}`);
        } else {
            const today = moment().format('Do MMM YYYY');
            setDueDate(`${today}, ${formattedTime}`);
        }
    };

    const handleDatePickerChange = (date) => {
        const formattedDate = moment(date).format('Do MMM YYYY');
        setDueDate(formattedDate);
        setShowCalendar(false);
    };



    const handleReminderChange = (event) => {
        const inputReminderTime = event.target.value;
        setReminderTime(inputReminderTime);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formattedDate = moment(date).isValid() ? moment(date).local().format('Do MMM YYYY, h:mm A') : "Invalid date";

    const priorityColors = ['#4a4a4a', '#ff0000', '#ffa500', '#0000ff'];

    return (
        <div ref={cardRef} className="relative border rounded p-4 bg-white dark:bg-gray-800 hover:shadow-xl transition-all ease-in-out w-full max-w-md h-auto flex flex-col note-card">
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h6 className="text-sm font-medium light:text-black dark:text-white">{title}</h6>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdOutlinePushPin
                            className={`icon-btn ${isPinned ? 'pin-blue' : 'text-slate-300'}`}
                            onClick={onPinNote}
                        />


                        <div className="relative">
                            <MdFlag
                                className="icon-btn"
                                style={{ color: priorityColors[priority] }}
                                onClick={handleTogglePriorityMenu}
                            />

                            {showPriorityMenu && (
                                <div className="absolute dropdown-menu mt-1 right-0 z-20 w-40">
                                    <div className="flex flex-col">
                                        <button className="flex items-center gap-2" onClick={() => handlePriorityChange(1)}>
                                            <MdFlag className="text-red-500" />
                                            Priority 1
                                        </button>
                                        <button className="flex items-center gap-2" onClick={() => handlePriorityChange(2)}>
                                            <MdFlag className="text-orange-500" />
                                            Priority 2
                                        </button>
                                        <button className="flex items-center gap-2" onClick={() => handlePriorityChange(3)}>
                                            <MdFlag className="text-blue-500" />
                                            Priority 3
                                        </button>
                                        <button className="flex items-center gap-2" onClick={() => handlePriorityChange(0)}>
                                            <MdFlag className="text-slate-300" />
                                            Default
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-2">{content}</p>
                <div className='text-xs text-slate-500 dark:text-gray-400 mt-2'>
                    {tags.map((item) => `#${item}`).join(' ')}
                </div>
            </div>
            <div className='flex items-center justify-between mt-2'>
                <div className='flex items-center gap-2'>
                    <div className="relative flex items-center">
                        <div className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer dropdown-menu" onClick={handleToggleDueDateMenu}>
                            <MdEvent className='text-slate-300 dark:text-gray-400' />
                            {dueDate ? (
                                <span className='text-xs text-slate-600 dark:text-gray-300'>{dueDate}</span>
                            ) : (
                                <span className='text-xs text-slate-500 dark:text-gray-400'>Set Due Date</span>
                            )}
                        </div>
                        {showDueDateMenu && (
                            <div className="absolute dropdown-menu mt-1 left-0 z-20 w-64">
                                <div className="flex flex-col">
                                    <button className="flex items-center gap-2 text-left" onClick={() => handleDueDateChange('today')}>
                                        <MdToday className="text-green-500" />
                                        Today
                                    </button>
                                    <button className="flex items-center gap-2 text-left" onClick={() => handleDueDateChange('tomorrow')}>
                                        <MdNextWeek className="text-orange-500" />
                                        Tomorrow
                                    </button>
                                    <button className="flex items-center gap-2 text-left" onClick={() => handleDueDateChange('weekend')}>
                                        <MdWeekend className="text-blue-500" />
                                        Weekend
                                    </button>
                                    <button className="flex items-center gap-2 text-left" onClick={() => handleDueDateChange('next_week')}>
                                        <MdNextWeek className="text-purple-500" />
                                        Next Week
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-left"
                                        onClick={() => handleDueDateChange('none')}
                                    >
                                        <MdClose className="text-red-500" />
                                        No Due Date
                                    </button>
                                    <button
                                        className="border-t mt-2 pt-2 flex items-center gap-2 text-left"
                                        onClick={() => handleDueDateChange('calendar')}
                                    >
                                        <MdCalendarToday className="text-blue-500" />
                                        <span>From Calendar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative flex items-center ml-2">
                        <div className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer dropdown-menu" onClick={handleToggleReminderMenu}>
                            <MdAlarm className='text-slate-300 dark:text-gray-400' />
                            {reminderTime ? (
                                <span className='text-xs text-slate-600 dark:text-gray-300'>{reminderTime}</span>
                            ) : (
                                <span className='text-xs text-slate-500 dark:text-gray-400'>Set Reminder</span>
                            )}
                        </div>
                        {showReminderMenu && (
                            <div className="absolute dropdown-menu mt-1 left-0 z-20 w-64">
                                <div className="flex flex-col">
                                    <label htmlFor="reminder-time-input" className="text-xs text-slate-600 dark:text-gray-300">Reminder Time:</label>
                                    <input
                                        id="reminder-time-input"
                                        type="time"
                                        value={reminderTime}
                                        onChange={handleReminderChange}
                                        className="block w-full px-2 py-1 mt-1 text-xs border rounded bg-white light:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                    />
                                    <label htmlFor="email-input" className="text-xs text-slate-600 dark:text-gray-300 mt-2">Email:</label>
                                    <input
                                        id="email-input"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="block w-full px-2 py-1 mt-1 text-xs border rounded bg-white light:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleEmailKeyPress}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    {showCalendar && (
                        <div className="absolute dropdown-menu mt-2 left-0 z-20 w-80 bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded shadow-lg">
                            <DatePicker
                                selected={dueDate ? moment(dueDate, 'Do MMM YYYY, h:mm A').toDate() : null}
                                onChange={handleDatePickerChange}
                                dateFormat="MMMM d, yyyy"
                                inline
                                className="bg-gray-800 text-white dark:border-gray-700"
                            />
                            <div className="mt-4">
                                <label htmlFor="time-input" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Set Time:</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker label="Set Time" />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    <div className="relative">
                        <MdMoreVert
                            className='icon-btn text-slate-300 dark:text-gray-400 cursor-pointer'
                            onClick={handleToggleActionMenu}
                        />
                        {showActionMenu && (
                            <div className="absolute dropdown-menu mt-1 right-0 z-20 w-40">
                                <div className="flex flex-col">
                                    <button
                                        className="flex items-center gap-2 text-left"
                                        onClick={() => {
                                            onEdit();
                                            setShowActionMenu(false);
                                        }}
                                    >
                                        <MdCreate className="text-green-600" />
                                        Edit
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-left"
                                        onClick={() => {
                                            onDelete();
                                            setShowActionMenu(false);
                                        }}
                                    >
                                        <MdDelete className="text-red-500" />
                                        Delete
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-left"
                                        onClick={handleToggleDetails}
                                    >
                                        <MdInfo className="text-blue-500" />
                                        Details
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showDetailsTooltip && (
                <div className="absolute dropdown-menu mt-1 right-0 z-20 w-64">
                    <div className="flex flex-col">
                        <p className="text-xs text-white dark:text-gray-300">{formattedDate}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

NoteCard.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    isPinned: PropTypes.bool,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onPinNote: PropTypes.func.isRequired,
};

NoteCard.defaultProps = {
    isPinned: false,
};

export default NoteCard;
