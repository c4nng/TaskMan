import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

const Box = styled.div`
  background: #f0fdf4;
  border: 2px dashed #10b981;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
`;

const Time = styled.h2`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: ${({ $danger }) => ($danger ? '#ef4444' : '#10b981')};
  color: white;
  padding: 0.5rem 1.5rem;
  margin: 0.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const Input = styled.input`
  width: 80px;
  padding: 0.2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  text-align: center;
`;

const Select = styled.select`
  padding: 0.2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  min-width: 150px;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
`;

const StatText = styled.p`
  font-size: 0.95rem;
  margin-top: 0.5rem;
  color: #444;
`;

const HeadText = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const PomodoroTimer = ({ tasks }) => {
  const durations = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const [mode, setMode] = useState('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [duration, setDuration] = useState(durations.work);
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalPomodoros, setTotalPomodoros] = useState(Number(localStorage.getItem('totalPomodoros')) || 0);
  const [taskPomodoros, setTaskPomodoros] = useState(JSON.parse(localStorage.getItem('taskPomodoros') || '{}'));
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const intervalRef = useRef(null);

  const selectedTask = tasks.find(task => task.id.toString() === selectedTaskId);

  // ---------------- EFFECTS ----------------
  useEffect(() => {
    if ('Notification' in window) Notification.requestPermission();
  }, []);

  useEffect(() => {
    setSecondsLeft(duration * 60);
    setIsRunning(false);
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      document.title = `⏱️ ${formatTime(secondsLeft)} | TaskMan`;
    } else if (!isRunning && secondsLeft === 0) {
      document.title = `✅ Süre Doldu! | TaskMan`;
      const timeout = setTimeout(() => {
        document.title = 'TaskMan';
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      document.title = 'TaskMan';
    }
  }, [isRunning, secondsLeft]);

  // ---------------- HANDLERS ----------------
  const handleFinish = () => {
    setIsRunning(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);

    if (mode === 'work') {
      const newTotal = totalPomodoros + 1;
      setTotalPomodoros(newTotal);
      localStorage.setItem('totalPomodoros', newTotal);

      if (selectedTaskId) {
        const current = taskPomodoros[selectedTaskId] || 0;
        const updated = { ...taskPomodoros, [selectedTaskId]: current + 1 };
        setTaskPomodoros(updated);
        localStorage.setItem('taskPomodoros', JSON.stringify(updated));
      }

      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      if (newCount % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }

    // bildirim + ses
    const taskMsg = selectedTask ? ` (${selectedTask.text})` : '';
    new Audio('/notification.mp3').play();
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`⏰ ${mode === 'work' ? 'Çalışma' : 'Mola'} süresi tamamlandı!`, {
        body: `Yeni mod başlıyor${taskMsg}`,
      });
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setDuration(durations[newMode]);
    setSecondsLeft(durations[newMode] * 60);
    setIsRunning(false);
  };

  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  const toggle = () => {
    if (!duration || secondsLeft === 0) return;
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(duration * 60);
  };

  const handleDurationChange = (e) => {
    const val = Number(e.target.value);
    if (!isRunning && val > 0 && val <= 120) {
      setDuration(val);
      setSecondsLeft(val * 60);
    }
  };

  const showResetButton = useMemo(() => {
    return !isRunning && secondsLeft !== duration * 60 && secondsLeft > 0;
  }, [isRunning, secondsLeft, duration]);

  // ---------------- UI ----------------
  return (
    <Box>
      {showConfetti && <Confetti width={width} height={height} />}
      <HeadText>
        {mode === 'work' && '🎯 Odaklanma Zamanı'}
        {mode === 'shortBreak' && '🧘 Kısa Mola'}
        {mode === 'longBreak' && '☕ Uzun Mola'}
      </HeadText>

      <InputRow>
        {mode === 'work' && (
          <>
            <Label>
              Süre (dk):{' '}
              <Input
                type="number"
                min="1"
                max="120"
                value={duration}
                onChange={handleDurationChange}
              />
            </Label>
            <Label>
              Görev:{' '}
              <Select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
              >
                <option value="">Seç</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.text}
                  </option>
                ))}
              </Select>
            </Label>
          </>
        )}
      </InputRow>

      <Time>{formatTime(secondsLeft)}</Time>

      {secondsLeft > 0 && (
        <Button onClick={toggle}>
          {isRunning ? <FiPause /> : <FiPlay />}
          {isRunning ? 'Durdur' : 'Başlat'}
        </Button>
      )}

      {showResetButton && (
        <Button $danger onClick={reset}>
          <FiRefreshCw /> Sıfırla
        </Button>
      )}

      <StatText>🧠 Toplam Pomodoro: <strong>{totalPomodoros}</strong></StatText>
      {selectedTask && (
        <StatText>
          📌 <strong>{selectedTask.text}</strong> için:{' '}
          <strong>{taskPomodoros[selectedTaskId] || 0}</strong> Pomodoro
        </StatText>
      )}
    </Box>
  );
};

export default PomodoroTimer;
