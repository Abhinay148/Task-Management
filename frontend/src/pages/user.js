import React, { useState, useEffect } from 'react';
import './../App.css';
import 'font-awesome/css/font-awesome.min.css';
import { useParams } from 'react-router-dom';

const formatDateString = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
};

const User = () => {
    const { userId } = useParams();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [Token] = useState(localStorage.getItem("authToken"));
    const [updateTaskId, setUpdateTaskId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        // Fetch user's notes when the component mounts
        fetchUserNotes();
    }, []);

    const toggleTaskForm = (taskId) => {
        if (taskId) {
            // If taskId is provided, set it as the update task
            setUpdateTaskId(taskId);
        } else {
            // If taskId is not provided, clear the update task
            setUpdateTaskId(null);
        }

        setShowTaskForm(!showTaskForm);
    };

    const fetchUserNotes = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/fetchusernotes/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": Token
                }
            });

            if (response.ok) {
                const data = await response.json();

                const formattedTasks = data.map((task) => ({
                    ...task,
                    date: formatDateString(task.date),
                }));
                setTasks(formattedTasks);
            } else {
                console.error('Failed to fetch user notes');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/deletenote/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": Token
                }
            });

            if (response.ok) {
                // Remove the deleted task from the state
                setTasks(tasks.filter((task) => task._id !== taskId));
                setAlertMessage('Task deleted successfully!');
                window.location.reload();
            } else {
                console.error('Failed to delete task');
                setAlertMessage('An error occurred while deleting the task.');
            }
        } catch (error) {
            console.error(error);
            setAlertMessage('An error occurred while deleting the task.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const taskName = event.target.taskName.value;
        const taskDate = event.target.taskDate.value;
        const taskTopic = event.target.taskTopic.value;

        const formData = {
            name: taskName,
            date: taskDate,
            topic: taskTopic,
        };

        try {
            let response;
            if (updateTaskId) {
                response = await fetch(`http://localhost:5000/api/notes/updatenote/${updateTaskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        "auth-token": Token
                    },
                    body: JSON.stringify(formData),
                });
                setAlertMessage('Task updated successfully!');
                window.location.reload();
            } else {
                response = await fetch("http://localhost:5000/api/notes/addnotes", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "auth-token": Token
                    },
                    body: JSON.stringify(formData),
                });
                setAlertMessage('Task added successfully!');
                window.location.reload();
            }

            const json = await response.json();
            console.log(json);

            event.target.taskName.value = '';
            event.target.taskDate.value = '';
            event.target.taskTopic.value = '';
            setShowTaskForm(false);
        } catch (error) {
            console.error(error);
            setAlertMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className='user'>
            <h1>Welcome! Back</h1>
            <h2>Manage Your Task</h2>
            <button onClick={() => toggleTaskForm()}>Add Task</button>

            {showTaskForm && (
                <div className="task-form-popup">
                    <form className="add-task" onSubmit={handleSubmit}>
                        <div className="tasks">
                            <input type="text" name="taskName" placeholder='Task Name' />
                        </div>
                        <div className="tasks">
                            <input type="date" name="taskDate" placeholder='Last Date' />
                        </div>
                        <div className="tasks">
                            <input type="text" name="taskTopic" placeholder='Topic' />
                        </div>
                        <div className="align-right">
                            <button type="submit" className="signup-button">
                                {updateTaskId ? 'Update Task' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {alertMessage && (
                <div className="alert">
                    {alertMessage}
                    <button onClick={() => setAlertMessage('')}>Close</button>
                </div>
            )}

            <table id="task-list">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Topic</th>
                        <th>Last Date</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id}>
                            <td>{task.name}</td>
                            <td>{task.topic}</td>
                            <td>{task.date}</td>
                            <td><input type="checkbox" /></td>
                            <td>
                                <i
                                    className="fa fa-pencil"
                                    onClick={() => toggleTaskForm(task._id)}
                                ></i>
                            </td>
                            <td>
                                <i
                                    className="fa fa-trash"
                                    onClick={() => handleDeleteTask(task._id)}
                                ></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default User;
