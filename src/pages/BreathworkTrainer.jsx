import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlay, 
  FiPause, 
  FiRefreshCw, 
  FiSettings, 
  FiSave, 
  FiVolumeX, 
  FiVolume2,
  FiEdit3,
  FiClock,
  FiActivity,
  FiPlus,
  FiMinus,
  FiX,
  FiChevronRight
} = FiIcons;

const BreathworkTrainer = () => {
  const navigate = useNavigate();
  const { addDiveEntry } = useApp();

  // Refs
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Main states
  const [activeTab, setActiveTab] = useState('breathwork'); // 'breathwork', 'o2', 'co2'
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionName, setSessionName] = useState('');

  // Breathwork settings
  const [breathworkSettings, setBreathworkSettings] = useState({
    inhaleTime: 4,
    holdTimeAfterInhale: 0,
    exhaleTime: 8,
    holdTimeAfterExhale: 0,
    rounds: 10,
    currentRound: 1,
    currentPhase: 'ready', // 'ready', 'inhale', 'inHold', 'exhale', 'exHold', 'finished'
    timeRemaining: 0,
  });

  // O2 Table settings
  const [o2Settings, setO2Settings] = useState({
    initialHoldTime: 60, // 1 minute in seconds
    restTime: 120, // 2 minutes in seconds
    increaseAmount: 15, // 15 seconds per round
    rounds: 8,
    currentRound: 1,
    currentPhase: 'ready', // 'ready', 'hold', 'rest', 'finished'
    timeRemaining: 0,
  });

  // CO2 Table settings
  const [co2Settings, setCO2Settings] = useState({
    holdTime: 90, // 1.5 minutes in seconds
    initialRestTime: 120, // 2 minutes in seconds
    decreaseAmount: 15, // 15 seconds decrease in rest per round
    rounds: 8,
    currentRound: 1,
    currentPhase: 'ready', // 'ready', 'hold', 'rest', 'finished'
    timeRemaining: 0,
  });

  // Get current settings based on active tab
  const getCurrentSettings = () => {
    switch (activeTab) {
      case 'breathwork':
        return breathworkSettings;
      case 'o2':
        return o2Settings;
      case 'co2':
        return co2Settings;
      default:
        return breathworkSettings;
    }
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format time for display in the circle
  const formatTimeForDisplay = (timeInSeconds) => {
    if (timeInSeconds < 60) {
      return timeInSeconds.toString();
    } else {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  // Get current phase text
  const getCurrentPhaseText = () => {
    const settings = getCurrentSettings();
    
    switch (settings.currentPhase) {
      case 'ready':
        return 'Ready';
      case 'inhale':
        return 'Inhale';
      case 'inHold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'exHold':
        return 'Hold';
      case 'hold':
        return 'Hold';
      case 'rest':
        return 'Rest';
      case 'finished':
        return 'Finished';
      default:
        return '';
    }
  };

  // Get phase color
  const getPhaseColor = () => {
    const settings = getCurrentSettings();
    
    switch (settings.currentPhase) {
      case 'inhale':
        return 'bg-blue-500';
      case 'inHold':
        return 'bg-purple-500';
      case 'exhale':
        return 'bg-green-500';
      case 'exHold':
        return 'bg-yellow-500';
      case 'hold':
        return 'bg-red-500';
      case 'rest':
        return 'bg-green-500';
      case 'finished':
        return 'bg-ocean-500';
      default:
        return 'bg-ocean-500';
    }
  };

  // Play sound
  const playSound = (frequency, duration) => {
    if (isMuted) return;
    
    if (audioRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Add a slight fade in and out to avoid clicks
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    }
  };

  // Start timer
  const startTimer = () => {
    setIsRunning(true);
    
    const startTime = Date.now() - elapsedTime;
    
    // Initialize the first phase
    initializeFirstPhase();
    
    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsedSeconds);
      updateCurrentPhase();
    }, 1000);
  };

  // Initialize first phase
  const initializeFirstPhase = () => {
    switch (activeTab) {
      case 'breathwork':
        setBreathworkSettings(prev => ({
          ...prev,
          currentPhase: 'inhale',
          timeRemaining: prev.inhaleTime
        }));
        break;
      case 'o2':
        setO2Settings(prev => ({
          ...prev,
          currentPhase: 'hold',
          timeRemaining: prev.initialHoldTime
        }));
        break;
      case 'co2':
        setCO2Settings(prev => ({
          ...prev,
          currentPhase: 'hold',
          timeRemaining: prev.holdTime
        }));
        break;
    }
  };

  // Update current phase
  const updateCurrentPhase = () => {
    switch (activeTab) {
      case 'breathwork':
        updateBreathworkPhase();
        break;
      case 'o2':
        updateO2Phase();
        break;
      case 'co2':
        updateCO2Phase();
        break;
    }
  };

  // Update Breathwork phase
  const updateBreathworkPhase = () => {
    setBreathworkSettings(prev => {
      // If finished, don't update
      if (prev.currentPhase === 'finished') {
        return prev;
      }

      // Decrease time remaining
      let timeRemaining = prev.timeRemaining - 1;
      let currentPhase = prev.currentPhase;
      let currentRound = prev.currentRound;

      // If time is up, move to next phase
      if (timeRemaining <= 0) {
        // Play sound at phase change
        playSound(440, 0.2);

        switch (currentPhase) {
          case 'inhale':
            currentPhase = prev.holdTimeAfterInhale > 0 ? 'inHold' : 'exhale';
            timeRemaining = prev.holdTimeAfterInhale > 0 ? prev.holdTimeAfterInhale : prev.exhaleTime;
            break;
          case 'inHold':
            currentPhase = 'exhale';
            timeRemaining = prev.exhaleTime;
            break;
          case 'exhale':
            currentPhase = prev.holdTimeAfterExhale > 0 ? 'exHold' : 'inhale';
            timeRemaining = prev.holdTimeAfterExhale > 0 ? prev.holdTimeAfterExhale : prev.inhaleTime;
            
            // If no hold after exhale and moving back to inhale, check if round is complete
            if (prev.holdTimeAfterExhale === 0) {
              if (currentRound >= prev.rounds) {
                currentPhase = 'finished';
                timeRemaining = 0;
                clearInterval(intervalRef.current);
                setIsRunning(false);
                setShowSaveModal(true);
              } else {
                currentRound += 1;
              }
            }
            break;
          case 'exHold':
            if (currentRound >= prev.rounds) {
              currentPhase = 'finished';
              timeRemaining = 0;
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setShowSaveModal(true);
            } else {
              currentPhase = 'inhale';
              timeRemaining = prev.inhaleTime;
              currentRound += 1;
            }
            break;
        }
      }

      return {
        ...prev,
        timeRemaining,
        currentPhase,
        currentRound
      };
    });
  };

  // Update O2 Table phase
  const updateO2Phase = () => {
    setO2Settings(prev => {
      // If finished, don't update
      if (prev.currentPhase === 'finished') {
        return prev;
      }

      // Decrease time remaining
      let timeRemaining = prev.timeRemaining - 1;
      let currentPhase = prev.currentPhase;
      let currentRound = prev.currentRound;

      // If time is up, move to next phase
      if (timeRemaining <= 0) {
        // Play sound at phase change
        playSound(440, 0.2);

        switch (currentPhase) {
          case 'hold':
            if (currentRound >= prev.rounds) {
              currentPhase = 'finished';
              timeRemaining = 0;
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setShowSaveModal(true);
            } else {
              currentPhase = 'rest';
              timeRemaining = prev.restTime;
            }
            break;
          case 'rest':
            currentPhase = 'hold';
            timeRemaining = prev.initialHoldTime + (prev.increaseAmount * currentRound);
            currentRound += 1;
            break;
        }
      }

      return {
        ...prev,
        timeRemaining,
        currentPhase,
        currentRound
      };
    });
  };

  // Update CO2 Table phase
  const updateCO2Phase = () => {
    setCO2Settings(prev => {
      // If finished, don't update
      if (prev.currentPhase === 'finished') {
        return prev;
      }

      // Decrease time remaining
      let timeRemaining = prev.timeRemaining - 1;
      let currentPhase = prev.currentPhase;
      let currentRound = prev.currentRound;

      // If time is up, move to next phase
      if (timeRemaining <= 0) {
        // Play sound at phase change
        playSound(440, 0.2);

        switch (currentPhase) {
          case 'hold':
            if (currentRound >= prev.rounds) {
              currentPhase = 'finished';
              timeRemaining = 0;
              clearInterval(intervalRef.current);
              setIsRunning(false);
              setShowSaveModal(true);
            } else {
              currentPhase = 'rest';
              const restTime = Math.max(prev.initialRestTime - ((currentRound - 1) * prev.decreaseAmount), 30);
              timeRemaining = restTime;
            }
            break;
          case 'rest':
            currentPhase = 'hold';
            timeRemaining = prev.holdTime;
            currentRound += 1;
            break;
        }
      }

      return {
        ...prev,
        timeRemaining,
        currentPhase,
        currentRound
      };
    });
  };

  // Pause timer
  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsedTime(0);
    
    // Reset current settings based on active tab
    switch (activeTab) {
      case 'breathwork':
        setBreathworkSettings(prev => ({
          ...prev,
          currentRound: 1,
          currentPhase: 'ready',
          timeRemaining: 0
        }));
        break;
      case 'o2':
        setO2Settings(prev => ({
          ...prev,
          currentRound: 1,
          currentPhase: 'ready',
          timeRemaining: 0
        }));
        break;
      case 'co2':
        setCO2Settings(prev => ({
          ...prev,
          currentRound: 1,
          currentPhase: 'ready',
          timeRemaining: 0
        }));
        break;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const settings = getCurrentSettings();
    
    if (settings.currentPhase === 'ready' || settings.currentPhase === 'finished') {
      return 0;
    }

    let totalTime = 0;
    
    switch (activeTab) {
      case 'breathwork':
        switch (settings.currentPhase) {
          case 'inhale':
            totalTime = breathworkSettings.inhaleTime;
            break;
          case 'inHold':
            totalTime = breathworkSettings.holdTimeAfterInhale;
            break;
          case 'exhale':
            totalTime = breathworkSettings.exhaleTime;
            break;
          case 'exHold':
            totalTime = breathworkSettings.holdTimeAfterExhale;
            break;
        }
        break;
      case 'o2':
        switch (settings.currentPhase) {
          case 'hold':
            totalTime = o2Settings.initialHoldTime + ((o2Settings.currentRound - 1) * o2Settings.increaseAmount);
            break;
          case 'rest':
            totalTime = o2Settings.restTime;
            break;
        }
        break;
      case 'co2':
        switch (settings.currentPhase) {
          case 'hold':
            totalTime = co2Settings.holdTime;
            break;
          case 'rest':
            totalTime = Math.max(co2Settings.initialRestTime - ((co2Settings.currentRound - 1) * co2Settings.decreaseAmount), 30);
            break;
        }
        break;
    }
    
    if (totalTime === 0) return 0;
    
    return (settings.timeRemaining / totalTime) * 100;
  };

  // Handle settings change
  const handleSettingsChange = (setting, value, mode) => {
    switch (mode) {
      case 'breathwork':
        setBreathworkSettings(prev => ({
          ...prev,
          [setting]: value
        }));
        break;
      case 'o2':
        setO2Settings(prev => ({
          ...prev,
          [setting]: value
        }));
        break;
      case 'co2':
        setCO2Settings(prev => ({
          ...prev,
          [setting]: value
        }));
        break;
    }
  };

  // Save session to dive log
  const saveSession = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let subCategory;
    let sessionDetails;
    
    switch (activeTab) {
      case 'breathwork':
        subCategory = 'Breathwork';
        sessionDetails = `${breathworkSettings.rounds} rounds of breathwork. Inhale: ${breathworkSettings.inhaleTime}s, Hold: ${breathworkSettings.holdTimeAfterInhale}s, Exhale: ${breathworkSettings.exhaleTime}s, Hold: ${breathworkSettings.holdTimeAfterExhale}s`;
        break;
      case 'o2':
        subCategory = 'Dry STA (Static Apnea)';
        sessionDetails = `O2 Table: ${o2Settings.rounds} rounds. Initial hold: ${formatTime(o2Settings.initialHoldTime)}, Rest: ${formatTime(o2Settings.restTime)}, Increase: ${o2Settings.increaseAmount}s`;
        break;
      case 'co2':
        subCategory = 'Dry STA (Static Apnea)';
        sessionDetails = `CO2 Table: ${co2Settings.rounds} rounds. Hold: ${formatTime(co2Settings.holdTime)}, Initial rest: ${formatTime(co2Settings.initialRestTime)}, Decrease: ${co2Settings.decreaseAmount}s`;
        break;
    }
    
    const entry = {
      date,
      time,
      location: 'Home',
      primaryCategory: 'Dry Training',
      disciplineCategory: 'Dry Discipline',
      disciplineSubCategory: subCategory,
      time_duration: formatTime(elapsedTime),
      experience: 'Good',
      notes: `${sessionName || 'Breathwork Training'}: ${sessionDetails}`
    };
    
    addDiveEntry(entry);
    setShowSaveModal(false);
    navigate('/dive-log');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Breathwork & Apnea Training</h1>
          <p className="text-gray-600">
            Improve your breath-hold capacity with customizable breathing exercises and apnea tables
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => {
                  if (!isRunning) {
                    setActiveTab('breathwork');
                    resetTimer();
                  }
                }}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'breathwork'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <SafeIcon icon={FiActivity} />
                <span>Breathwork</span>
              </button>
              <button
                onClick={() => {
                  if (!isRunning) {
                    setActiveTab('o2');
                    resetTimer();
                  }
                }}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'o2'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <SafeIcon icon={FiActivity} />
                <span>O2 Tables</span>
              </button>
              <button
                onClick={() => {
                  if (!isRunning) {
                    setActiveTab('co2');
                    resetTimer();
                  }
                }}
                className={`px-6 py-4 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'co2'
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-500 hover:text-gray-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <SafeIcon icon={FiActivity} />
                <span>CO2 Tables</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left column - Timer */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {activeTab === 'breathwork' ? 'Breathwork Exercise' : 
                       activeTab === 'o2' ? 'O2 Tables' : 'CO2 Tables'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {activeTab === 'breathwork' ? 'Round ' + breathworkSettings.currentRound + ' of ' + breathworkSettings.rounds :
                       activeTab === 'o2' ? 'Round ' + o2Settings.currentRound + ' of ' + o2Settings.rounds :
                       'Round ' + co2Settings.currentRound + ' of ' + co2Settings.rounds}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleMute}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isRunning}
                    >
                      <SafeIcon icon={FiSettings} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Timer Circle */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-64 h-64">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={getPhaseColor().replace('bg-', 'text-').replace('500', '500')}
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * calculateProgress()) / 100}
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-4xl font-bold ${getPhaseColor().replace('bg-', 'text-')}`}>
                        {getCurrentSettings().currentPhase === 'ready' 
                          ? 'Ready'
                          : formatTimeForDisplay(getCurrentSettings().timeRemaining)}
                      </div>
                      <div className="text-xl text-gray-600">
                        {getCurrentPhaseText()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {isRunning ? (
                    <button
                      onClick={pauseTimer}
                      className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiPause} />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={startTimer}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiPlay} />
                      <span>{elapsedTime > 0 ? 'Resume' : 'Start'}</span>
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiRefreshCw} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Total time */}
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-600">Total Time</div>
                  <div className="text-2xl font-semibold text-gray-900">{formatTime(elapsedTime)}</div>
                </div>
              </div>

              {/* Session Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Preview</h3>
                
                {activeTab === 'breathwork' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: breathworkSettings.rounds }).map((_, index) => (
                        <div 
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                            ${index + 1 === breathworkSettings.currentRound && isRunning 
                              ? 'bg-ocean-500 text-white' 
                              : index + 1 < breathworkSettings.currentRound 
                                ? 'bg-gray-200 text-gray-500' 
                                : 'bg-gray-100 text-gray-400'}`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Cycle Pattern</h4>
                      <div className="flex space-x-2 items-center text-sm">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Inhale: {breathworkSettings.inhaleTime}s
                        </div>
                        <SafeIcon icon={FiChevronRight} className="text-gray-400" />
                        {breathworkSettings.holdTimeAfterInhale > 0 && (
                          <>
                            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Hold: {breathworkSettings.holdTimeAfterInhale}s
                            </div>
                            <SafeIcon icon={FiChevronRight} className="text-gray-400" />
                          </>
                        )}
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          Exhale: {breathworkSettings.exhaleTime}s
                        </div>
                        {breathworkSettings.holdTimeAfterExhale > 0 && (
                          <>
                            <SafeIcon icon={FiChevronRight} className="text-gray-400" />
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Hold: {breathworkSettings.holdTimeAfterExhale}s
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'o2' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: o2Settings.rounds }).map((_, index) => (
                        <div 
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                            ${index + 1 === o2Settings.currentRound && isRunning 
                              ? 'bg-ocean-500 text-white' 
                              : index + 1 < o2Settings.currentRound 
                                ? 'bg-gray-200 text-gray-500' 
                                : 'bg-gray-100 text-gray-400'}`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Round</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Hold Time</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Rest Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: o2Settings.rounds }).map((_, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2">{index + 1}</td>
                              <td className="px-4 py-2">
                                {formatTime(o2Settings.initialHoldTime + (index * o2Settings.increaseAmount))}
                              </td>
                              <td className="px-4 py-2">{formatTime(o2Settings.restTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'co2' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: co2Settings.rounds }).map((_, index) => (
                        <div 
                          key={index}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                            ${index + 1 === co2Settings.currentRound && isRunning 
                              ? 'bg-ocean-500 text-white' 
                              : index + 1 < co2Settings.currentRound 
                                ? 'bg-gray-200 text-gray-500' 
                                : 'bg-gray-100 text-gray-400'}`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Round</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Hold Time</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Rest Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: co2Settings.rounds }).map((_, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2">{index + 1}</td>
                              <td className="px-4 py-2">{formatTime(co2Settings.holdTime)}</td>
                              <td className="px-4 py-2">
                                {formatTime(Math.max(co2Settings.initialRestTime - (index * co2Settings.decreaseAmount), 30))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Settings */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {activeTab === 'breathwork' ? 'Breathwork Settings' : 
                   activeTab === 'o2' ? 'O2 Table Settings' : 'CO2 Table Settings'}
                </h3>

                {activeTab === 'breathwork' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Inhale Time (seconds)
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('inhaleTime', Math.max(breathworkSettings.inhaleTime - 1, 1), 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={breathworkSettings.inhaleTime}
                          onChange={(e) => handleSettingsChange('inhaleTime', Math.max(parseInt(e.target.value) || 1, 1), 'breathwork')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('inhaleTime', breathworkSettings.inhaleTime + 1, 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hold After Inhale (seconds)
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('holdTimeAfterInhale', Math.max(breathworkSettings.holdTimeAfterInhale - 1, 0), 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={breathworkSettings.holdTimeAfterInhale}
                          onChange={(e) => handleSettingsChange('holdTimeAfterInhale', Math.max(parseInt(e.target.value) || 0, 0), 'breathwork')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('holdTimeAfterInhale', breathworkSettings.holdTimeAfterInhale + 1, 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exhale Time (seconds)
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('exhaleTime', Math.max(breathworkSettings.exhaleTime - 1, 1), 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={breathworkSettings.exhaleTime}
                          onChange={(e) => handleSettingsChange('exhaleTime', Math.max(parseInt(e.target.value) || 1, 1), 'breathwork')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('exhaleTime', breathworkSettings.exhaleTime + 1, 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hold After Exhale (seconds)
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('holdTimeAfterExhale', Math.max(breathworkSettings.holdTimeAfterExhale - 1, 0), 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={breathworkSettings.holdTimeAfterExhale}
                          onChange={(e) => handleSettingsChange('holdTimeAfterExhale', Math.max(parseInt(e.target.value) || 0, 0), 'breathwork')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('holdTimeAfterExhale', breathworkSettings.holdTimeAfterExhale + 1, 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rounds
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('rounds', Math.max(breathworkSettings.rounds - 1, 1), 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={breathworkSettings.rounds}
                          onChange={(e) => handleSettingsChange('rounds', Math.max(parseInt(e.target.value) || 1, 1), 'breathwork')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('rounds', breathworkSettings.rounds + 1, 'breathwork')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Preset Patterns</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setBreathworkSettings(prev => ({
                              ...prev,
                              inhaleTime: 4,
                              holdTimeAfterInhale: 0,
                              exhaleTime: 8,
                              holdTimeAfterExhale: 0
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          4-8 Breathing
                        </button>
                        <button
                          onClick={() => {
                            setBreathworkSettings(prev => ({
                              ...prev,
                              inhaleTime: 4,
                              holdTimeAfterInhale: 7,
                              exhaleTime: 8,
                              holdTimeAfterExhale: 0
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          4-7-8 Technique
                        </button>
                        <button
                          onClick={() => {
                            setBreathworkSettings(prev => ({
                              ...prev,
                              inhaleTime: 5,
                              holdTimeAfterInhale: 5,
                              exhaleTime: 5,
                              holdTimeAfterExhale: 5
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Box Breathing
                        </button>
                        <button
                          onClick={() => {
                            setBreathworkSettings(prev => ({
                              ...prev,
                              inhaleTime: 2,
                              holdTimeAfterInhale: 0,
                              exhaleTime: 2,
                              holdTimeAfterExhale: 0
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Fast Breathing
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'o2' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Hold Time
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('initialHoldTime', Math.max(o2Settings.initialHoldTime - 15, 15), 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <div className="w-full text-center border-y border-gray-200 py-2">
                          {formatTime(o2Settings.initialHoldTime)}
                        </div>
                        <button
                          onClick={() => handleSettingsChange('initialHoldTime', o2Settings.initialHoldTime + 15, 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rest Time
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('restTime', Math.max(o2Settings.restTime - 15, 30), 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <div className="w-full text-center border-y border-gray-200 py-2">
                          {formatTime(o2Settings.restTime)}
                        </div>
                        <button
                          onClick={() => handleSettingsChange('restTime', o2Settings.restTime + 15, 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Increase Amount (seconds)
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('increaseAmount', Math.max(o2Settings.increaseAmount - 5, 5), 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={o2Settings.increaseAmount}
                          onChange={(e) => handleSettingsChange('increaseAmount', Math.max(parseInt(e.target.value) || 5, 5), 'o2')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('increaseAmount', o2Settings.increaseAmount + 5, 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rounds
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('rounds', Math.max(o2Settings.rounds - 1, 1), 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={o2Settings.rounds}
                          onChange={(e) => handleSettingsChange('rounds', Math.max(parseInt(e.target.value) || 1, 1), 'o2')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('rounds', o2Settings.rounds + 1, 'o2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Preset Tables</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => {
                            setO2Settings(prev => ({
                              ...prev,
                              initialHoldTime: 60,
                              restTime: 120,
                              increaseAmount: 15,
                              rounds: 8
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Beginner O2 Table
                        </button>
                        <button
                          onClick={() => {
                            setO2Settings(prev => ({
                              ...prev,
                              initialHoldTime: 90,
                              restTime: 120,
                              increaseAmount: 15,
                              rounds: 8
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Intermediate O2 Table
                        </button>
                        <button
                          onClick={() => {
                            setO2Settings(prev => ({
                              ...prev,
                              initialHoldTime: 120,
                              restTime: 120,
                              increaseAmount: 15,
                              rounds: 8
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Advanced O2 Table
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'co2' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hold Time
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('holdTime', Math.max(co2Settings.holdTime - 15, 30), 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <div className="w-full text-center border-y border-gray-200 py-2">
                          {formatTime(co2Settings.holdTime)}
                        </div>
                        <button
                          onClick={() => handleSettingsChange('holdTime', co2Settings.holdTime + 15, 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Rest Time
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('initialRestTime', Math.max(co2Settings.initialRestTime - 15, 30), 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <div className="w-full text-center border-y border-gray-200 py-2">
                          {formatTime(co2Settings.initialRestTime)}
                        </div>
                        <button
                          onClick={() => handleSettingsChange('initialRestTime', co2Settings.initialRestTime + 15, 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Decrease Amount (seconds)
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('decreaseAmount', Math.max(co2Settings.decreaseAmount - 5, 5), 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={co2Settings.decreaseAmount}
                          onChange={(e) => handleSettingsChange('decreaseAmount', Math.max(parseInt(e.target.value) || 5, 5), 'co2')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('decreaseAmount', co2Settings.decreaseAmount + 5, 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rounds
                      </label>
                      <div className="flex">
                        <button
                          onClick={() => handleSettingsChange('rounds', Math.max(co2Settings.rounds - 1, 1), 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-l-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiMinus} />
                        </button>
                        <input
                          type="number"
                          value={co2Settings.rounds}
                          onChange={(e) => handleSettingsChange('rounds', Math.max(parseInt(e.target.value) || 1, 1), 'co2')}
                          className="w-full text-center border-y border-gray-200 py-2 focus:outline-none focus:ring-1 focus:ring-ocean-500"
                          disabled={isRunning}
                        />
                        <button
                          onClick={() => handleSettingsChange('rounds', co2Settings.rounds + 1, 'co2')}
                          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-lg hover:bg-gray-300"
                          disabled={isRunning}
                        >
                          <SafeIcon icon={FiPlus} />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Preset Tables</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => {
                            setCO2Settings(prev => ({
                              ...prev,
                              holdTime: 90,
                              initialRestTime: 120,
                              decreaseAmount: 15,
                              rounds: 8
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Beginner CO2 Table
                        </button>
                        <button
                          onClick={() => {
                            setCO2Settings(prev => ({
                              ...prev,
                              holdTime: 120,
                              initialRestTime: 120,
                              decreaseAmount: 15,
                              rounds: 8
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Intermediate CO2 Table
                        </button>
                        <button
                          onClick={() => {
                            setCO2Settings(prev => ({
                              ...prev,
                              holdTime: 120,
                              initialRestTime: 90,
                              decreaseAmount: 10,
                              rounds: 8
                            }));
                          }}
                          className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200"
                          disabled={isRunning}
                        >
                          Advanced CO2 Table
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Information Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-ocean-50 to-ocean-100 border border-ocean-200 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-ocean-900 mb-2">
            {activeTab === 'breathwork' ? 'About Breathwork Training' : 
             activeTab === 'o2' ? 'About O2 Tables' : 'About CO2 Tables'}
          </h3>
          <p className="text-ocean-700">
            {activeTab === 'breathwork' && 
              'Breathwork training improves your breathing control, lung capacity, and relaxation. Regular practice helps reduce stress, increase oxygen efficiency, and enhance your breath-holding ability for freediving.'}
            {activeTab === 'o2' && 
              'O2 Tables train your body to tolerate low oxygen levels. Each round increases the breath-hold time while keeping the rest time constant, helping you extend your maximum breath-hold duration.'}
            {activeTab === 'co2' && 
              'CO2 Tables train your body to tolerate high carbon dioxide levels. The breath-hold time remains constant, but rest periods decrease with each round, improving your CO2 tolerance and reducing the urge to breathe.'}
          </p>
        </motion.div>
      </div>

      {/* Save Session Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Save Training Session</h3>
            <p className="text-gray-600 mb-6">
              Great job! Would you like to save this session to your dive log?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Name (optional)
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder={activeTab === 'breathwork' ? 'Breathwork Session' : 
                             activeTab === 'o2' ? 'O2 Table Training' : 'CO2 Table Training'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiClock} className="text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Time</p>
                  <p className="font-semibold text-gray-900">{formatTime(elapsedTime)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiActivity} className="text-ocean-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Session Type</p>
                  <p className="font-semibold text-gray-900">
                    {activeTab === 'breathwork' ? 'Breathwork' : 
                     activeTab === 'o2' ? 'O2 Table' : 'CO2 Table'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSession}
                className="flex-1 bg-ocean-600 text-white py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
              >
                Save to Dive Log
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BreathworkTrainer;