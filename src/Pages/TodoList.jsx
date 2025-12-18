import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import './css/TodoList.css'


const TodoList = () => {
    const [todo, setTodo] = useState('')
    const [status, setStatus] = useState(false)
    const [todoArray, setTodoArray] = useState([]);
    console.log(todoArray);
    const postTodo = async (e) => {
        try {
            //axios.post(api,data to add in db)
            await axios.post("https://todo-server-ec2-wgix.onrender.com/csbs/addtodo", { todo });
            setTodo('')
            setStatus(true)
            getTodo();
            setTimeout(() => setStatus(false), 3000)
        } catch (err) {
            console.error(err)
        }
    }
    const getTodo = async () => {

        const res = await axios.get("https://todo-server-ec2-wgix.onrender.com/csbs/gettodo")
            .then((response) => {
                setTodoArray(response.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }
    const deleteTodo = async (id) => {
        try {
            axios.delete(`https://todo-server-ec2-wgix.onrender.com/csbs/deletetodo/${id}`);
            getTodo();
        } catch (err) {
            console.error(err)
        }
    }
    const newTodo = (id, data) => {
        const newdata = prompt("Enter new Data:", data);

        if (!newdata || newdata.trim() === '') {
            alert("Todo cannot be empty");
            return;
        }

        updateTodo(id, newdata);
    };

    const updateTodo = async (id, data) => {
        try {
            await axios.put(
                ` https://todo-server-ec2-wgix.onrender.com/csbs/updatetodo/${id}`,
                { todo: data }
            );
            getTodo();
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        getTodo();
    }, [])
    return (
        <div className="todo-container">
            <Typography variant="h1" gutterBottom>
                Todo
            </Typography>
            <Box sx={{ width: 700, maxWidth: '100%' }} className="todo-input">
                <TextField fullWidth label="fullWidth" id="fullWidth" value={todo}
                    onChange={(e) => setTodo(e.target.value)} />
                <Button variant="contained" onClick={postTodo} >Add to do</Button>
            </Box>
            {
                status && (
                    <div style={{
                        position: 'fixed',
                        top: "20px",
                        right: "20px",
                        zIndex: 9999,
                    }}>
                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Todo has been added successfully!
                        </Alert>
                    </div>
                )
            }<div>
                <ul>
                    {todoArray.map((res) => (
                        <li key={res._id} class="list"><h3>{res.todo}</h3>
                            <div class="space">
                                <button class="d" onClick={()=>deleteTodo(res._id)}>
                                    <MdDelete />
                                </button>
                                <button class="i" onClick={() => newTodo(res._id, res.todo)}><FaEdit /></button>
                                
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TodoList