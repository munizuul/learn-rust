import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
      sendNotification({
        title: 'Pomodoro Timer',
        body: mode === 'work' ? "Time for a break!" : "Break's over! Time to work!",
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const toggleMode = () => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {mode === 'work' ? 'Work Time' : 'Break Time'}
        </h1>
        <div className="text-6xl font-mono text-center mb-8">
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-2 rounded-lg ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
          >
            Reset
          </button>
          <button
            onClick={toggleMode}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Switch to {mode === 'work' ? 'Break' : 'Work'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;