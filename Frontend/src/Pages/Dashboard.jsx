import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import Navbar from '../Components/Navbar';
import PomodoroTimer from '../Components/PomodoroTimer';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../Components/Footer';

const Container = styled.div`
  max-width: 1100px;
  margin: 2.5rem auto;
  padding: 2rem;
  background: linear-gradient(to right, #f8fafc, #ffffff);
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TaskArea = styled.div``;

const PomodoroArea = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  height: fit-content;
  align-self: start;

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: bold;

  &:hover {
    background-color: #2563eb;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TaskItem = styled(motion.li)`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background-color: ${({ done }) => (done ? '#d1fae5' : '#f9fafb')};
  border-left: 4px solid ${({ done }) => (done ? '#10b981' : '#3b82f6')};
  border-radius: 12px;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.015);
  }
`;

const TaskText = styled.span`
  flex: 1;
  font-size: 1rem;
  text-decoration: ${({ done }) => (done ? 'line-through' : 'none')};
`;

const IconButton = styled.button`
  border: none;
  background: none;
  color: #555;
  font-size: 1.2rem;
  margin-left: 0.5rem;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #888;
  font-style: italic;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;

  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskType, setTaskType] = useState('günlük');

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:5000/api/tasks?email=${email}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => alert('Görevler yüklenemedi'));
  }, [email, navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask = { email, text: taskText, type: taskType };

    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });

    const data = await res.json();
    if (res.ok) {
      setTasks([...tasks, data]);
      setTaskText('');
      setTaskType('günlük');
    } else {
      alert('Görev eklenemedi');
    }
  };

  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}?email=${email}`, {
      method: 'PUT',
    });
    if (res.ok) {
      const updated = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updated);
    }
  };

  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}?email=${email}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <Title>Hoş geldin, {email}</Title>
        </Header>

        <GridLayout>
          <TaskArea>
            <Form onSubmit={handleAddTask}>
              <Input
                type="text"
                placeholder="Yeni görev yaz..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
              />
              <Select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                <option value="günlük">Günlük</option>
                <option value="haftalık">Haftalık</option>
              </Select>
              <Button type="submit">Ekle</Button>
            </Form>

            {tasks.length === 0 ? (
              <EmptyMessage>Henüz hiç görev eklenmedi.</EmptyMessage>
            ) : (
              <TaskList>
                <AnimatePresence>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      done={task.completed}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskText done={task.completed}>
                        {task.text} ({task.type})
                      </TaskText>
                      <div>
                        <IconButton onClick={() => toggleTask(task.id)} title="Tamamlandı">
                          <FiCheck />
                        </IconButton>
                        <IconButton onClick={() => deleteTask(task.id)} title="Sil">
                          <FiTrash2 />
                        </IconButton>
                      </div>
                    </TaskItem>
                  ))}
                </AnimatePresence>
              </TaskList>
            )}
          </TaskArea>

          <PomodoroArea>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
              ⏱️ Odaklanma Alanı
            </h3>
            <PomodoroTimer tasks={tasks} />
          </PomodoroArea>
        </GridLayout>
      </Container>
      <Footer/>
    </>
  );
};

export default Dashboard;
