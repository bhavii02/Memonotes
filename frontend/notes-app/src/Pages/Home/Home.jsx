/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from '../../assets/images/add-notes.jpg';
import NoNoteImg from '../../assets/images/NoNote.png';

const Home = () => {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: '',
        type: 'add',
    });

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [isSearch, setIsSearch] = useState(false);
    const navigate = useNavigate();

    
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user');
            console.log('User Info Response:', response.data); 
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }
        }
    };

    
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get('/get-all-notes');
            console.log('Notes Response:', response.data); 
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    
    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete(`/delete-note/${noteId}`);
            if (response.data && !response.data.error) {
                console.log('Note deleted successfully', response.data.note); 
                showToastMessage('Note deleted successfully', 'delete');
                getAllNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error); 
            if (error.response && error.response.data && error.response.data.message) {
                console.log('An unexpected error occurred. Please try again.');
            }
        }
    };

    
    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get('/search-notes', {
                params: { query },
            });
            if (response.data && response.data.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch (error) {
            console.error('Error searching notes:', error);
        }
    };

    
    const updateIsPinned = async (noteData) => {
        const noteId = noteData?._id; 
        console.log('Editing note with id:', noteId); 
        try {
            const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
                isPinned: !noteData.isPinned,
            });
            if (response.data && response.data.note) {
                console.log('Note updated successfully:', response.data.note); 
                showToastMessage('Note updated successfully');
                getAllNotes();
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    };

    useEffect(() => {
        getAllNotes();
        getUserInfo();
    }, []);

    const handleEditNote = (note) => {
        setOpenAddEditModal({ isShown: true, type: 'edit', data: note });
    };

    
    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: '',
        });
    };

    

    return (
        <>
            {userInfo ? (
                <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
            ) : (
                <p>Loading...</p>
            )}

            <div className="container mx-auto px-16">
                {Array.isArray(allNotes) && allNotes.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {allNotes.map((item) => (
                            <NoteCard
                                key={item._id}
                                title={item.title}
                                date={item.createdOn}
                                content={item.content}
                                tags={item.tags}
                                isPinned={item.isPinned}
                                onEdit={() => handleEditNote(item)}
                                onDelete={() => deleteNote(item)}
                                onPinNote={() => updateIsPinned(item)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyCard 
                        imgSrc={isSearch ? NoNoteImg : AddNotesImg} 
                        message={isSearch ? 'Oops! No notes found matching your input' : 'Click add button to add new notes.'}
                    />
                )}
            </div>

            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-green-500 hover:bg-green-600 fixed right-10 bottom-10"
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: 'add', data: null });
                }}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => {}}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                }}
                contentLabel="Add or Edit Note"
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto p-5 overflow-hidden"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: 'add', data: null });
                    }}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Home;
