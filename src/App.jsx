import React, { useState, useEffect } from 'react';
import {
  WashingMachine,
  BarChart3,
  User,
  Calendar as CalendarIcon,
  AlertTriangle,
  X,
  ChevronDown,
  Plus,
  CheckCircle2,
  Info,
  Shirt,
  RotateCw,
  Clock,
  LogOut,
  Key,
  Target,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Edit3,
  Repeat,
  MessageSquare,
  Filter,
} from 'lucide-react';
import {
  format,
  differenceInMinutes,
  getHours,
  addDays,
  startOfWeek,
  endOfWeek,
  parse,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import { createClient } from '@supabase/supabase-js';

// --- KẾT NỐI SUPABASE THẬT 100% ---
const SUPABASE_URL = 'https://nwbmbmpwvgvpiojithnf.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Ym1ibXB3dmd2cGlvaml0aG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMzc0MzAsImV4cCI6MjEwNTkxMzQzMH0.UoXSMQeiY8cQaYxtXucYGalMd45hSSbmBroWf6rfca0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const checkTheme = () => {
      const currentHour = getHours(new Date());
      if (currentHour >= 6 && currentHour < 18) {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      } else {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    };
    checkTheme();
    const interval = setInterval(checkTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!currentUser) return <AuthScreen onLogin={setCurrentUser} />;
  return (
    <MainLayout
      currentUser={currentUser}
      theme={theme}
      onLogout={() => setCurrentUser(null)}
    />
  );
}

// --- MÀN HÌNH ĐĂNG NHẬP ---
function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rb, setRb] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const RBs = [
    'ad',
    'adidas',
    'nike',
    'puma',
    'under armour',
    'decathlon',
    'gpd',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'baohuynh') {
      onLogin({ username: 'baohuynh', role: 'admin', rb: rb || 'ADIDAS' });
    } else {
      onLogin({
        username: username || 'tech_user',
        role: 'user',
        rb: rb || 'adidas',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold dark:text-white mb-2 tracking-tighter">
            lab.
          </h1>
          <p className="text-gray-400 text-sm tracking-widest">GPBAO</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full bg-gray-100 dark:bg-gray-700/50 border-transparent focus:border-transparent focus:ring-0 rounded-full px-5 py-3 dark:text-white outline-none font-bold"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full bg-gray-100 dark:bg-gray-700/50 border-transparent focus:border-transparent focus:ring-0 rounded-full px-5 py-3 dark:text-white outline-none font-bold"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isLogin && (
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full px-5 py-3 dark:text-white flex justify-between items-center cursor-pointer"
              >
                <span
                  className={
                    rb
                      ? 'text-black dark:text-white uppercase font-bold'
                      : 'text-gray-400'
                  }
                >
                  {rb || 'Select RB'}
                </span>
                <ChevronDown size={20} className="text-gray-500" />
              </div>
              {showDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-700 rounded-2xl shadow-xl border dark:border-gray-600 overflow-hidden z-50">
                  {RBs.map((brand) => (
                    <div
                      key={brand}
                      onClick={() => {
                        setRb(brand);
                        setShowDropdown(false);
                      }}
                      className="px-5 py-3 hover:bg-blue-500 hover:text-white cursor-pointer transition-colors dark:text-white uppercase font-bold text-sm"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className="w-full bg-black text-white dark:bg-white dark:text-black font-bold rounded-full py-3 mt-4 hover:opacity-90 transition">
            {isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <p
          className="text-center mt-6 text-sm text-gray-500 dark:text-white cursor-pointer hover:underline transition"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "don't have an account? Sign up"
            : 'already have an account? Sign in'}
        </p>
      </div>
    </div>
  );
}

// --- GIAO DIỆN CHÍNH & BOTTOM NAV ---
function MainLayout({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('washing');
  const [resetWashingTrigger, setResetWashingTrigger] = useState(0);

  const [globalTurnsData, setGlobalTurnsData] = useState({});
  const [globalProgressData, setGlobalProgressData] = useState({});
  const [targetRunKey, setTargetRunKey] = useState(null);

  // LOAD DỮ LIỆU TỪ SUPABASE KHI MỞ APP
  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const { data: turns, error: turnsError } = await supabase
          .from('turns')
          .select('*');
        if (turns && turns.length > 0) {
          const loadedTurns = {};
          turns.forEach((t) => {
            loadedTurns[t.id] = {
              turnName: t.turn_name,
              number: t.item_number,
              type: t.item_type,
              totalCycles: t.total_cycles,
              borrowedRB: t.borrowed_rb,
              turn: t.turn_name,
              machine: t.machine_number,
              rb: t.rb_name,
              savedBy: t.saved_by,
              createdDate: t.created_date,
            };
          });
          setGlobalTurnsData(loadedTurns);
        }

        const { data: logs, error: logsError } = await supabase
          .from('cycle_logs')
          .select('*');
        if (logs && logs.length > 0) {
          const loadedProg = {};
          logs.forEach((l) => {
            loadedProg[l.turn_id] = {
              currentCycle: l.cycle_number,
              isFinished:
                l.cycle_number >=
                (globalTurnsData[l.turn_id]?.totalCycles || 1),
              isStarted: true,
              lastEndedTime: l.end_time
                ? format(new Date(l.end_time), 'dd-MMM, HH:mm')
                : null,
              lastSavedBy: l.who_ended || l.who_started,
              remarksObj: { [l.cycle_number]: l.admin_remark },
            };
          });
          setGlobalProgressData(loadedProg);
        }
      } catch (err) {
        console.log('Fetch Supabase error:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  const handleWashingClick = () => {
    setActiveTab('washing');
    setTargetRunKey(null);
    setResetWashingTrigger((prev) => prev + 1);
  };

  const handleNavigateToRun = (turnKey) => {
    setTargetRunKey(turnKey);
    setActiveTab('washing');
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 text-black dark:text-white font-sans transition-colors relative">
      <div className={activeTab === 'washing' ? 'block' : 'hidden'}>
        <WashingPage
          currentUser={currentUser}
          resetTrigger={resetWashingTrigger}
          targetRunKey={targetRunKey}
          onTurnsChange={setGlobalTurnsData}
          onProgressChange={setGlobalProgressData}
        />
      </div>

      <div className={activeTab === 'tracking' ? 'block' : 'hidden'}>
        <TrackingPage
          turnsData={globalTurnsData}
          progressData={globalProgressData}
          onOpenTurn={handleNavigateToRun}
        />
      </div>

      <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
        <DashboardPage
          turnsData={globalTurnsData}
          progressData={globalProgressData}
        />
      </div>

      <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
        <ProfilePage user={currentUser} onLogout={onLogout} />
      </div>

      <div className="fixed bottom-0 w-full max-w-md mx-auto inset-x-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t dark:border-gray-700 flex justify-around p-4 rounded-t-3xl z-40">
        <button
          onClick={handleWashingClick}
          className={`flex flex-col items-center transition ${
            activeTab === 'washing'
              ? 'text-black dark:text-white scale-110'
              : 'text-gray-400'
          }`}
        >
          <WashingMachine size={24} />
          <span className="text-[10px] font-bold mt-1">Washing</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`flex flex-col items-center transition ${
            activeTab === 'tracking'
              ? 'text-black dark:text-white scale-110'
              : 'text-gray-400'
          }`}
        >
          <Target size={24} />
          <span className="text-[10px] font-bold mt-1">Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center transition ${
            activeTab === 'dashboard'
              ? 'text-black dark:text-white scale-110'
              : 'text-gray-400'
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center transition ${
            activeTab === 'profile'
              ? 'text-black dark:text-white scale-110'
              : 'text-gray-400'
          }`}
        >
          <User size={24} />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}

// --- TRANG WASHING VÀ QUẢN LÝ TIẾN TRÌNH ---
function WashingPage({
  currentUser,
  resetTrigger,
  targetRunKey,
  onTurnsChange,
  onProgressChange,
}) {
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [date, setDate] = useState(format(new Date(), 'dd-MMM'));
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDayDate, setSelectedDayDate] = useState(
    format(new Date(), 'dd-MMM')
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const [selectedRB, setSelectedRB] = useState(null);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineCustomNames, setMachineCustomNames] = useState({});
  const [editingMachineName, setEditingMachineName] = useState(false);
  const [tempMachineName, setTempMachineName] = useState('');

  const [viewMode, setViewMode] = useState('setup');
  const [activeRunnerId, setActiveRunnerId] = useState(null);
  const [savedTurns, setSavedTurns] = useState({});
  const [turnProgress, setTurnProgress] = useState({});
  const [modalTurn, setModalTurn] = useState(null);
  const [isBorrowModal, setIsBorrowModal] = useState(false);

  const [rippleRB, setRippleRB] = useState(null);
  const [rippleMachine, setRippleMachine] = useState(null);
  const [cyclesWarningModal, setCyclesWarningModal] = useState(false);
  const [busyTurnName, setBusyTurnName] = useState(null);

  useEffect(() => {
    onTurnsChange(savedTurns);
  }, [savedTurns]);

  useEffect(() => {
    onProgressChange(turnProgress);
  }, [turnProgress]);

  useEffect(() => {
    if (targetRunKey && savedTurns[targetRunKey]) {
      const config = savedTurns[targetRunKey];
      setSelectedRB(config.rb);
      setSelectedMachine(config.machine);
      setActiveRunnerId(targetRunKey);
      setViewMode('runner');
    }
  }, [targetRunKey, savedTurns]);

  useEffect(() => {
    if (resetTrigger > 0) {
      setSelectedRB(null);
      setSelectedMachine(null);
      setViewMode('setup');
    }
  }, [resetTrigger]);

  useEffect(() => {
    const timer = setInterval(
      () => setTime(format(new Date(), 'HH:mm')),
      60000
    );
    return () => clearInterval(timer);
  }, []);

  const RBs = [
    'ad',
    'adidas',
    'nike',
    'puma',
    'under armour',
    'decathlon',
    'gpd',
  ];
  const machines = [11, 12, 13, 14, 15];

  const calculateWeeklyCycles = (rb, machineNum) => {
    let total = 0;
    Object.values(savedTurns).forEach((turn) => {
      const effectiveRB = turn.borrowedRB || turn.rb;
      if (effectiveRB === rb && turn.machine === machineNum) {
        total += Number(turn.totalCycles || 0);
      }
    });
    return total;
  };

  const currentMachineCycles =
    selectedRB && selectedMachine
      ? calculateWeeklyCycles(selectedRB, selectedMachine)
      : 0;
  const remainingCycles = Math.max(0, 120 - currentMachineCycles);

  const handleStartRun = (turnId) => {
    const currentConfig = savedTurns[turnId];

    let busyTurnFound = null;
    Object.entries(savedTurns).forEach(([k, cfg]) => {
      if (k !== turnId && cfg.machine === currentConfig.machine) {
        const prog = turnProgress[k];
        if (prog?.isStarted && !prog?.isFinished) {
          busyTurnFound = cfg.turnName || `Turn ${cfg.turn}`;
        }
      }
    });

    if (busyTurnFound) {
      setBusyTurnName(busyTurnFound);
      return;
    }

    setActiveRunnerId(turnId);
    setViewMode('runner');
  };

  const updateTurnProgress = async (
    turnId,
    currentCycle,
    isFinished,
    isStarted,
    lastEndedTime,
    lastSavedBy,
    remarksObj
  ) => {
    setTurnProgress((prev) => ({
      ...prev,
      [turnId]: {
        currentCycle,
        isFinished,
        isStarted,
        lastEndedTime,
        lastSavedBy,
        remarksObj,
      },
    }));

    // CẬP NHẬT TIẾN TRÌNH VÀO SUPABASE
    try {
      await supabase.from('cycle_logs').upsert([
        {
          turn_id: turnId,
          cycle_number: currentCycle,
          who_started: isStarted ? lastSavedBy : null,
          who_ended: isFinished ? lastSavedBy : null,
          admin_remark: remarksObj ? remarksObj[currentCycle] : null,
          record_date: selectedDayDate,
        },
      ]);
    } catch (e) {
      console.log('Supabase cycle_logs update err:', e);
    }
  };

  const handleSelectRB = (rb) => {
    setRippleRB(rb);
    setTimeout(() => {
      setSelectedRB(rb);
      setRippleRB(null);
    }, 250);
  };

  const handleSelectMachine = (num) => {
    setRippleMachine(num);
    setTimeout(() => {
      setSelectedMachine(num);
      setRippleMachine(null);
    }, 250);
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(currentWeekStart, i)
  );

  const handleSelectHeaderDate = (dStr) => {
    setDate(dStr);
    setSelectedDayDate(dStr);
    try {
      const parsedDate = parse(`${dStr}-2026`, 'dd-MMM-yyyy', new Date());
      setCurrentWeekStart(startOfWeek(parsedDate, { weekStartsOn: 1 }));
    } catch (e) {}
  };

  const handleSelectDayOnWeek = (dayStr) => {
    setSelectedDayDate(dayStr);
    setDate(dayStr);
  };

  const getTurnsForDate = (rb, machine, dayDateStr) => {
    const targetDateObj = parse(
      `${dayDateStr}-2026`,
      'dd-MMM-yyyy',
      new Date()
    );

    return Object.entries(savedTurns).filter(([key, config]) => {
      if (config.rb !== rb || config.machine !== machine) return false;
      const createdDateObj = parse(
        `${config.createdDate}-2026`,
        'dd-MMM-yyyy',
        new Date()
      );

      if (config.createdDate === dayDateStr) return true;

      const prog = turnProgress[key];
      if (!prog?.isFinished && isBefore(createdDateObj, targetDateObj))
        return true;

      return false;
    });
  };

  const dayTurnsList =
    selectedRB && selectedMachine
      ? getTurnsForDate(selectedRB, selectedMachine, selectedDayDate)
      : [];

  const getAllWeeklyTurnsCount = (rb, machine) => {
    return Object.values(savedTurns).filter(
      (t) => t.rb === rb && t.machine === machine
    ).length;
  };

  const selectedDateObj = parse(
    `${selectedDayDate}-2026`,
    'dd-MMM-yyyy',
    new Date()
  );
  const todayObj = startOfDay(new Date());
  const isPastDate = isBefore(selectedDateObj, todayObj);
  const canEditOrAdd = currentUser.role === 'admin' || !isPastDate;

  const getMachineDisplayName = (mNum) => {
    return machineCustomNames[mNum] || `Machine ${mNum}`;
  };

  // LƯU TURN MỚI VÀO SUPABASE
  const saveTurnToSupabase = async (key, newTurnData) => {
    setSavedTurns((prev) => ({ ...prev, [key]: newTurnData }));

    try {
      await supabase.from('turns').upsert([
        {
          id: key,
          rb_name: newTurnData.rb,
          borrowed_rb: newTurnData.borrowedRB,
          machine_number: newTurnData.machine,
          turn_name: newTurnData.turnName,
          item_number: Number(newTurnData.number || 0),
          item_type: newTurnData.type,
          total_cycles: newTurnData.totalCycles,
          saved_by: newTurnData.savedBy,
          created_date: newTurnData.createdDate,
        },
      ]);
    } catch (e) {
      console.log('Supabase insert turn error:', e);
    }
  };

  return (
    <div className="w-full">
      <div
        className={
          viewMode === 'setup'
            ? 'block p-4 max-w-md mx-auto relative'
            : 'hidden'
        }
      >
        <div className="relative flex justify-center items-center mb-10 mt-2 z-20 min-h-[3rem]">
          <div
            onClick={() => setShowCalendar(true)}
            className="absolute left-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm border dark:border-gray-700 hover:bg-gray-50 transition z-10"
          >
            <CalendarIcon size={16} />
            <span className="font-bold text-sm">{date}</span>
          </div>
          <div className="text-center pointer-events-none z-0">
            <h2 className="font-black text-xl leading-tight">
              Washing
              <br />
              Cycles Count
            </h2>
          </div>
          <div className="absolute right-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm border dark:border-gray-700 z-10">
            <span className="font-bold text-sm">{time}</span>
          </div>
        </div>

        {!selectedRB ? (
          <div className="mt-8">
            <div className="flex justify-center mb-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-400 dark:bg-blue-600 rounded-full animate-[ping_3s_ease-in-out_infinite] opacity-20"></div>
                <div className="relative p-5 bg-blue-100 dark:bg-blue-900/40 rounded-full shadow-inner z-10">
                  <WashingMachine
                    size={48}
                    className="text-blue-500"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
            <h3 className="text-center text-gray-500 mb-6 font-bold text-sm">
              Choose your RB
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {RBs.map((rb) => (
                <div
                  key={rb}
                  onClick={() => handleSelectRB(rb)}
                  className={`relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 flex items-center justify-center cursor-pointer hover:ring-2 ring-blue-400 transition active:scale-95 h-32 overflow-hidden ${
                    rippleRB === rb ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {rippleRB === rb && (
                    <span className="absolute inset-0 rounded-3xl bg-blue-400/20 dark:bg-blue-500/30 animate-[ping_0.3s_ease-out_1]"></span>
                  )}
                  <RBLogo rbName={rb} className="max-h-16" />
                </div>
              ))}
            </div>
          </div>
        ) : !selectedMachine ? (
          <div className="mt-8 animate-in fade-in slide-in-from-right-4">
            <button
              onClick={() => setSelectedRB(null)}
              className="mb-4 text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition"
            >
              {'< Back to RB'}
            </button>
            <div className="flex flex-col items-center justify-center mb-6">
              <RBLogo rbName={selectedRB} className="max-h-12 mb-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {machines.map((num) => (
                <div
                  key={num}
                  onClick={() => handleSelectMachine(num)}
                  className={`relative bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 flex flex-col items-center justify-center cursor-pointer shadow-md hover:ring-2 ring-blue-400 transition active:scale-95 overflow-hidden ${
                    rippleMachine === num ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {rippleMachine === num && (
                    <span className="absolute inset-0 rounded-3xl bg-blue-400/20 dark:bg-blue-500/30 animate-[ping_0.3s_ease-out_1]"></span>
                  )}
                  <WashingMachine
                    size={40}
                    className="mb-2 text-blue-500 relative z-10"
                    strokeWidth={1.5}
                  />
                  <span className="font-bold relative z-10 text-center">
                    {getMachineDisplayName(num)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 animate-in fade-in slide-in-from-right-4">
            <button
              onClick={() => setSelectedMachine(null)}
              className="mb-4 text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition"
            >
              {'< Back to Machine'}
            </button>

            <div className="flex flex-col items-center justify-center mb-4">
              <RBLogo rbName={selectedRB} className="max-h-10 mb-2" />
              <div className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 font-extrabold text-xs">
                Remaining Cycles: {remainingCycles} / 120
              </div>
            </div>

            <div className="text-center mb-4">
              {editingMachineName && currentUser.role === 'admin' ? (
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <input
                    value={tempMachineName}
                    onChange={(e) => setTempMachineName(e.target.value)}
                    className="p-2 border rounded-xl font-bold text-center dark:bg-gray-800 dark:text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      setMachineCustomNames({
                        ...machineCustomNames,
                        [selectedMachine]:
                          tempMachineName || `Machine ${selectedMachine}`,
                      });
                      setEditingMachineName(false);
                    }}
                    className="bg-green-500 text-white p-2 rounded-xl text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h3
                  onDoubleClick={() => {
                    if (currentUser.role === 'admin') {
                      setTempMachineName(
                        getMachineDisplayName(selectedMachine)
                      );
                      setEditingMachineName(true);
                    }
                  }}
                  className="font-black text-xl text-center cursor-pointer select-none hover:opacity-80 transition"
                  title={
                    currentUser.role === 'admin'
                      ? 'Double click to edit machine name'
                      : ''
                  }
                >
                  {getMachineDisplayName(selectedMachine)}
                </h3>
              )}
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-2xl mb-4 border border-gray-100 dark:border-gray-700 shadow-sm">
              <button
                onClick={() =>
                  setCurrentWeekStart(addDays(currentWeekStart, -7))
                }
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-gray-500"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-black text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300">
                {format(currentWeekStart, 'dd MMM')} -{' '}
                {format(
                  endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
                  'dd MMM'
                )}
              </span>
              <button
                onClick={() =>
                  setCurrentWeekStart(addDays(currentWeekStart, 7))
                }
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-gray-500"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {weekDays.map((day) => {
                const dayStr = format(day, 'dd-MMM');
                const isSelected = selectedDayDate === dayStr;
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={dayStr}
                    onClick={() => handleSelectDayOnWeek(dayStr)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer transition-all border
                    ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105'
                        : isToday
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 border-blue-300'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase opacity-80">
                      {format(day, 'EEE')}
                    </span>
                    <span className="font-black text-xs mt-0.5">
                      {format(day, 'd')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Turns for {selectedDayDate}
                </span>
                {canEditOrAdd && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (remainingCycles <= 0) {
                          setCyclesWarningModal(true);
                        } else {
                          const nextStt =
                            getAllWeeklyTurnsCount(
                              selectedRB,
                              selectedMachine
                            ) + 1;
                          setIsBorrowModal(true);
                          setModalTurn(nextStt);
                        }
                      }}
                      className="bg-yellow-400 text-black px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-yellow-500 transition shadow-sm active:scale-95"
                    >
                      <Repeat size={14} /> Borrow
                    </button>

                    <button
                      onClick={() => {
                        if (remainingCycles <= 0) {
                          setCyclesWarningModal(true);
                        } else {
                          const nextStt =
                            getAllWeeklyTurnsCount(
                              selectedRB,
                              selectedMachine
                            ) + 1;
                          setIsBorrowModal(false);
                          setModalTurn(nextStt);
                        }
                      }}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-blue-600 transition shadow-sm active:scale-95"
                    >
                      <Plus size={16} /> Add Turn
                    </button>
                  </div>
                )}
              </div>

              {dayTurnsList.length === 0 ? (
                <div className="bg-gray-100 dark:bg-gray-800/40 border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 rounded-3xl text-center">
                  <p className="font-bold text-gray-400 text-xs mb-3">
                    No Turns created for this date yet
                  </p>
                  {canEditOrAdd && (
                    <button
                      onClick={() => {
                        if (remainingCycles <= 0) {
                          setCyclesWarningModal(true);
                        } else {
                          const nextStt =
                            getAllWeeklyTurnsCount(
                              selectedRB,
                              selectedMachine
                            ) + 1;
                          setIsBorrowModal(false);
                          setModalTurn(nextStt);
                        }
                      }}
                      className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-bold text-xs hover:opacity-90 transition active:scale-95"
                    >
                      Create Turn{' '}
                      {getAllWeeklyTurnsCount(selectedRB, selectedMachine) + 1}
                    </button>
                  )}
                </div>
              ) : (
                dayTurnsList.map(([turnKey, turnData]) => {
                  const prog = turnProgress[turnKey];
                  const isFinished = prog?.isFinished;

                  return (
                    <div
                      key={turnKey}
                      onClick={() => handleStartRun(turnKey)}
                      className={`p-5 rounded-3xl shadow-sm border-2 cursor-pointer transition active:scale-95 flex justify-between items-center
                      ${
                        isFinished
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                          : 'bg-white dark:bg-gray-800 border-blue-500 hover:bg-blue-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-black text-base ${
                              isFinished
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-blue-500'
                            }`}
                          >
                            {turnData.turnName}
                          </h4>
                          {turnData.borrowedRB && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase">
                              Borrowed by: {turnData.borrowedRB}
                            </span>
                          )}
                          {turnData.createdDate < selectedDayDate &&
                            !isFinished && (
                              <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">
                                Carried Over
                              </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">
                          {turnData.totalCycles} Cycles • {turnData.number}{' '}
                          {turnData.type}s
                        </p>
                      </div>

                      {isFinished ? (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> Finished
                        </span>
                      ) : (
                        <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          Run <ChevronRight size={14} />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className={viewMode === 'runner' ? 'block' : 'hidden'}>
        {Object.entries(savedTurns).map(([turnKey, config]) => (
          <div
            key={turnKey}
            className={activeRunnerId === turnKey ? 'block' : 'hidden'}
          >
            <CycleRunner
              config={config}
              currentUser={currentUser}
              currentDate={date}
              canEditOrAdd={canEditOrAdd}
              onBack={() => setViewMode('setup')}
              onProgressUpdate={(
                currentCycle,
                isFinished,
                isStarted,
                lastEndedTime,
                lastSavedBy,
                remarksObj
              ) =>
                updateTurnProgress(
                  turnKey,
                  currentCycle,
                  isFinished,
                  isStarted,
                  lastEndedTime,
                  lastSavedBy,
                  remarksObj
                )
              }
            />
          </div>
        ))}
      </div>

      {busyTurnName && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl max-w-xs w-full text-center border-2 border-red-500 shadow-2xl animate-in zoom-in-95">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Machine Busy!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium leading-relaxed">
              Máy giặt này đang bận chạy{' '}
              <strong className="text-red-500 dark:text-red-400 font-extrabold">
                {busyTurnName}
              </strong>
              , vui lòng hoàn thành trước khi Start Turn mới!
            </p>
            <button
              onClick={() => setBusyTurnName(null)}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {cyclesWarningModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl max-w-xs w-full text-center border-2 border-red-500 shadow-2xl animate-in zoom-in-95">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Limit Reached</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium">
              Không thể nhập thêm cycles, please change the machine!
            </p>
            <button
              onClick={() => setCyclesWarningModal(false)}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {modalTurn && (
        <TurnFormModal
          turn={modalTurn}
          isBorrow={isBorrowModal}
          currentRB={selectedRB}
          remainingCycles={remainingCycles}
          onClose={() => setModalTurn(null)}
          onSave={(data) => {
            const key = `${selectedRB}_${selectedMachine}_${selectedDayDate}_${modalTurn}`;
            const newTurnData = {
              ...data,
              turn: modalTurn,
              machine: selectedMachine,
              rb: selectedRB,
              savedBy: currentUser.username,
              createdDate: selectedDayDate,
            };
            saveTurnToSupabase(key, newTurnData);
            setModalTurn(null);
          }}
        />
      )}

      {showCalendar && (
        <CalendarModal
          currentDate={date}
          onClose={() => setShowCalendar(false)}
          onSelect={handleSelectHeaderDate}
        />
      )}
    </div>
  );
}

// --- TRANG DASHBOARD - TRỤC HOÀNH RB STATISTICS ĐÃ ĐỔI THÀNH HÌNH LOGO THẬT ---
function DashboardPage({ turnsData, progressData }) {
  const [filterPeriod, setFilterPeriod] = useState('Week');
  const [selectedMachineRBFilter, setSelectedMachineRBFilter] = useState('ALL');
  const [showMachineRBFilterDropdown, setShowMachineRBFilterDropdown] =
    useState(false);

  const RBs = [
    'ad',
    'adidas',
    'nike',
    'puma',
    'under armour',
    'decathlon',
    'gpd',
  ];
  const machinesList = [11, 12, 13, 14, 15];

  const defaultMachineOwners = {
    11: 'puma',
    12: 'adidas',
    13: 'ad',
    14: 'decathlon',
    15: 'nike',
  };

  const rbStats = RBs.map((rb) => {
    let totalCycles = 0;
    let totalTurns = 0;
    let totalDurationMins = 0;

    Object.entries(turnsData).forEach(([turnKey, config]) => {
      const effectiveRB = config.borrowedRB || config.rb;
      if (effectiveRB === rb) {
        totalTurns += 1;
        const prog = progressData[turnKey];
        if (prog?.isFinished) {
          totalCycles += Number(config.totalCycles || 0);
        } else if (prog?.isStarted) {
          totalCycles += Number(prog.currentCycle || 1);
        }
        totalDurationMins += Number(config.totalCycles || 1) * 60;
      }
    });

    return {
      rb,
      totalCycles,
      totalTurns,
      totalHours: Math.round(totalDurationMins / 60),
    };
  });

  const machineStats = machinesList.map((mNum) => {
    let totalCycles = 0;
    let totalTurns = 0;
    let totalDurationMins = 0;
    let lastUsedRB = defaultMachineOwners[mNum] || 'puma';

    Object.entries(turnsData).forEach(([turnKey, config]) => {
      const effectiveRB = config.borrowedRB || config.rb;
      if (config.machine === mNum) {
        if (
          selectedMachineRBFilter === 'ALL' ||
          effectiveRB === selectedMachineRBFilter
        ) {
          totalTurns += 1;
          lastUsedRB = effectiveRB;
          const prog = progressData[turnKey];
          if (prog?.isFinished) {
            totalCycles += Number(config.totalCycles || 0);
          } else if (prog?.isStarted) {
            totalCycles += Number(prog.currentCycle || 1);
          }
          totalDurationMins += Number(config.totalCycles || 1) * 60;
        }
      }
    });

    return {
      machine: `M.${mNum}`,
      rbOwner: lastUsedRB,
      totalCycles,
      totalTurns,
      totalHours: Math.round(totalDurationMins / 60),
    };
  });

  const grandTotalCycles = rbStats.reduce(
    (sum, item) => sum + item.totalCycles,
    0
  );

  const maxRbVal = Math.max(
    10,
    ...rbStats.map((s) => Math.max(s.totalCycles, s.totalTurns, s.totalHours))
  );
  const maxMachineVal = Math.max(
    10,
    ...machineStats.map((s) =>
      Math.max(s.totalCycles, s.totalTurns, s.totalHours)
    )
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center mb-6 mt-2">
        <h2 className="font-black text-2xl tracking-tight">
          Analytics Dashboard
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-1">
          Operational breakdown and performance metrics
        </p>
      </div>

      <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl mb-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        {['Day', 'Week', 'Month'].map((period) => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition-all ${
              filterPeriod === period
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* 1. RB STATISTICS - TRỤC HOÀNH ĐÃ ĐỔI THÀNH HÌNH LOGO THẬT */}
      <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl border border-gray-800 mb-6">
        <h3 className="font-black text-center text-lg mb-4 tracking-wide">
          RB Statistics
        </h3>

        <div className="flex justify-center gap-6 mb-6 text-xs font-bold">
          <span className="flex items-center gap-1.5 text-blue-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Cycles
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span> Turns
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>{' '}
            Duration (h)
          </span>
        </div>

        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex items-end gap-6 min-w-[500px] h-48 px-2 pt-6 border-b border-gray-800">
            {rbStats.map((item) => {
              const cycHeight = Math.max(
                12,
                Math.round((item.totalCycles / maxRbVal) * 100)
              );
              const trnHeight = Math.max(
                12,
                Math.round((item.totalTurns / maxRbVal) * 100)
              );
              const hrsHeight = Math.max(
                12,
                Math.round((item.totalHours / maxRbVal) * 100)
              );

              return (
                <div
                  key={item.rb}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div className="flex items-end gap-1 w-full justify-center h-36">
                    <div className="flex flex-col items-center flex-1 max-w-[18px]">
                      <span className="text-[9px] font-black text-blue-400 mb-1">
                        {item.totalCycles}
                      </span>
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 shadow-lg shadow-blue-500/20"
                        style={{ height: `${cycHeight}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[18px]">
                      <span className="text-[9px] font-black text-cyan-400 mb-1">
                        {item.totalTurns}
                      </span>
                      <div
                        className="w-full bg-cyan-400 rounded-t-lg transition-all duration-500 shadow-lg shadow-cyan-400/20"
                        style={{ height: `${trnHeight}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[18px]">
                      <span className="text-[9px] font-black text-emerald-400 mb-1">
                        {item.totalHours}
                      </span>
                      <div
                        className="w-full bg-emerald-400 rounded-t-lg transition-all duration-500 shadow-lg shadow-emerald-400/20"
                        style={{ height: `${hrsHeight}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-8 h-6 flex items-center justify-center mt-3">
                    <RBLogo rbName={item.rb} className="max-h-5 max-w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ TRÒN BREAKDOWN */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="font-black text-base mb-4 flex items-center gap-2">
          <RotateCw size={18} className="text-blue-500" /> Cycles Breakdown by
          RB
        </h3>

        <div className="flex items-center justify-center my-4">
          <div className="relative w-36 h-36 rounded-full border-8 border-blue-500 flex items-center justify-center shadow-inner">
            <div className="text-center">
              <span className="font-black text-2xl block">
                {grandTotalCycles}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                Total Cycles
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {rbStats.map((item) => {
            const pct =
              grandTotalCycles > 0
                ? Math.round((item.totalCycles / grandTotalCycles) * 100)
                : 0;
            return (
              <div
                key={item.rb}
                className="bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl flex justify-between items-center text-xs"
              >
                <span className="font-bold uppercase text-gray-500">
                  {item.rb}
                </span>
                <span className="font-black">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MACHINE METRICS */}
      <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl border border-gray-800 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-base flex items-center gap-2">
            <WashingMachine size={18} className="text-blue-500" /> Machine
            Performance
          </h3>

          <div className="relative">
            <button
              onClick={() =>
                setShowMachineRBFilterDropdown(!showMachineRBFilterDropdown)
              }
              className="px-3 py-1.5 rounded-xl bg-gray-800 text-xs font-bold uppercase flex items-center gap-1.5 text-gray-300 border border-gray-700"
            >
              <Filter size={12} /> {selectedMachineRBFilter}{' '}
              <ChevronDown size={14} />
            </button>

            {showMachineRBFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden z-50 animate-in fade-in">
                <div
                  onClick={() => {
                    setSelectedMachineRBFilter('ALL');
                    setShowMachineRBFilterDropdown(false);
                  }}
                  className="p-2.5 hover:bg-blue-500 hover:text-white cursor-pointer font-bold uppercase text-xs"
                >
                  ALL RBs
                </div>
                {RBs.map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setSelectedMachineRBFilter(r);
                      setShowMachineRBFilterDropdown(false);
                    }}
                    className="p-2.5 hover:bg-blue-500 hover:text-white cursor-pointer font-bold uppercase text-xs"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex items-end gap-6 min-w-[400px] h-48 px-2 pt-6 border-b border-gray-800">
            {machineStats.map((item) => {
              const cycHeight = Math.max(
                12,
                Math.round((item.totalCycles / maxMachineVal) * 100)
              );
              const trnHeight = Math.max(
                12,
                Math.round((item.totalTurns / maxMachineVal) * 100)
              );
              const hrsHeight = Math.max(
                12,
                Math.round((item.totalHours / maxMachineVal) * 100)
              );

              return (
                <div
                  key={item.machine}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div className="flex items-end gap-1 w-full justify-center h-36">
                    <div className="flex flex-col items-center flex-1 max-w-[18px]">
                      <span className="text-[9px] font-black text-blue-400 mb-1">
                        {item.totalCycles}
                      </span>
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${cycHeight}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[18px]">
                      <span className="text-[9px] font-black text-cyan-400 mb-1">
                        {item.totalTurns}
                      </span>
                      <div
                        className="w-full bg-cyan-400 rounded-t-lg transition-all duration-500"
                        style={{ height: `${trnHeight}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-col items-center flex-1 max-w-[18px]">
                      <span className="text-[9px] font-black text-emerald-400 mb-1">
                        {item.totalHours}
                      </span>
                      <div
                        className="w-full bg-emerald-400 rounded-t-lg transition-all duration-500"
                        style={{ height: `${hrsHeight}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 mt-3">
                    <div className="w-5 h-4 flex items-center justify-center">
                      <RBLogo
                        rbName={item.rbOwner}
                        className="max-h-4 max-w-full"
                      />
                    </div>
                    <span className="text-xs font-extrabold uppercase text-gray-300 tracking-wider">
                      {item.machine}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TRANG TRACKING ---
function TrackingPage({ turnsData, progressData, onOpenTurn }) {
  const RBs = [
    'ad',
    'adidas',
    'nike',
    'puma',
    'under armour',
    'decathlon',
    'gpd',
  ];
  const machinesList = [11, 12, 13, 14, 15];

  const [selectedRBs, setSelectedRBs] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'dd-MMM'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const timer = setInterval(
      () => setTime(format(new Date(), 'HH:mm')),
      60000
    );
    return () => clearInterval(timer);
  }, []);

  const toggleRB = (rb) => {
    if (selectedRBs.includes(rb)) {
      setSelectedRBs(selectedRBs.filter((r) => r !== rb));
    } else {
      setSelectedRBs([...selectedRBs, rb]);
    }
  };

  const handleSelectAll = () => {
    setSelectedRBs([]);
  };

  const activeRBsToDisplay = selectedRBs.length > 0 ? selectedRBs : RBs;
  const allMachineCards = [];

  activeRBsToDisplay.forEach((rbName) => {
    machinesList.forEach((mNum) => {
      const matchedEntries = Object.entries(turnsData).filter(
        ([key, config]) => {
          const matchesDate = config.createdDate
            ? config.createdDate === date
            : true;
          const effectiveRB = config.borrowedRB || config.rb;
          return (
            effectiveRB === rbName && config.machine === mNum && matchesDate
          );
        }
      );

      if (matchedEntries.length > 0) {
        matchedEntries.sort((a, b) => {
          const progA = progressData[a[0]] || {};
          const progB = progressData[b[0]] || {};
          if (progA.isStarted && !progA.isFinished) return -1;
          if (progB.isStarted && !progB.isFinished) return 1;
          return b[1].turn - a[1].turn;
        });

        const bestTurn = matchedEntries[0];
        allMachineCards.push({
          key: bestTurn[0],
          rb: rbName,
          machine: mNum,
          config: bestTurn[1],
          progress: progressData[bestTurn[0]] || {
            currentCycle: 1,
            isFinished: false,
            isStarted: false,
          },
        });
      } else {
        allMachineCards.push({
          key: `${rbName}_${mNum}_idle`,
          rb: rbName,
          machine: mNum,
          config: null,
          progress: { currentCycle: 0, isFinished: false, isStarted: false },
        });
      }
    });
  });

  return (
    <div className="p-4 max-w-md mx-auto relative">
      <div className="relative flex justify-center items-center mb-10 mt-2 z-20 min-h-[3rem]">
        <div
          onClick={() => setShowCalendar(true)}
          className="absolute left-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm border dark:border-gray-700 hover:bg-gray-50 transition z-10"
        >
          <CalendarIcon size={16} />
          <span className="font-bold text-sm">{date}</span>
        </div>

        <div className="text-center pointer-events-none z-0">
          <h2 className="font-black text-xl leading-tight">
            Washing Machine
            <br />
            Tracking
          </h2>
        </div>

        <div className="absolute right-0 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm border dark:border-gray-700 z-10">
          <span className="font-bold text-sm">{time}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 mb-6 px-1 snap-x no-scrollbar">
        <button
          onClick={handleSelectAll}
          className={`snap-center px-5 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-sm flex items-center justify-center min-w-[60px] h-12
          ${
            selectedRBs.length === 0
              ? 'bg-blue-500 text-white shadow-blue-500/30'
              : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
          }`}
        >
          All
        </button>

        {RBs.map((rb) => {
          const isSelected = selectedRBs.includes(rb);
          return (
            <div
              key={rb}
              onClick={() => toggleRB(rb)}
              className={`snap-center min-w-[70px] h-12 px-2 rounded-2xl border flex items-center justify-center cursor-pointer transition-all shadow-sm relative overflow-hidden
              ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-2 ring-blue-500/50 scale-105'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
              }`}
            >
              <RBLogo rbName={rb} className="max-h-6" />
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {allMachineCards.map((item) => {
          const { key, rb, machine, config, progress } = item;

          if (!config) {
            return (
              <div
                key={key}
                className="bg-white/60 dark:bg-gray-800/40 p-6 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 transition-all opacity-80"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-2xl text-gray-400">
                      <WashingMachine size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="h-6 flex items-center mb-1">
                        <RBLogo rbName={rb} className="max-h-6" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase">
                        Machine {machine}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400 flex items-center gap-1.5">
                    <Clock size={14} /> Idle
                  </span>
                </div>
              </div>
            );
          }

          const currentC = progress.isFinished
            ? config.totalCycles
            : progress.isStarted
            ? progress.currentCycle
            : 0;
          const percentage = Math.min(
            100,
            Math.round((currentC / config.totalCycles) * 100)
          );

          let statusText = 'Idle';
          let statusBadge =
            'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300';
          let statusIcon = <Clock size={14} />;

          if (progress.isFinished) {
            statusText = 'Finished';
            statusBadge = 'bg-green-500 text-white';
            statusIcon = <CheckCircle2 size={14} />;
          } else if (progress.isStarted) {
            statusText = 'In Progress';
            statusBadge = 'bg-blue-500 text-white animate-pulse';
            statusIcon = <RotateCw size={14} className="animate-spin" />;
          }

          return (
            <div
              key={key}
              onClick={() => onOpenTurn && onOpenTurn(key)}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg cursor-pointer active:scale-98"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-2xl">
                    <WashingMachine
                      size={28}
                      className="text-blue-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <div className="h-6 flex items-center mb-1">
                      <RBLogo
                        rbName={config.borrowedRB || config.rb}
                        className="max-h-6"
                      />
                      {config.borrowedRB && (
                        <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Borrowed
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">
                      Machine {config.machine}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${statusBadge}`}
                >
                  {statusIcon} {statusText}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-sm">{config.turnName}</span>
                  <span className="text-xs font-bold text-gray-400 capitalize">
                    {config.number} {config.type}s
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <RotateCw size={12} /> Total Cycles
                  </span>
                  <span className="text-black dark:text-white font-black">
                    {currentC} / {config.totalCycles} Cycles ({percentage}%)
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      progress.isFinished ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-gray-400 font-medium px-1 border-t dark:border-gray-700/50 pt-2 mt-2">
                <div className="flex justify-between">
                  <span>
                    Last Saved By:{' '}
                    <strong className="text-gray-600 dark:text-gray-300">
                      {config.savedBy}
                    </strong>
                  </span>
                  <span>
                    Last Ended:{' '}
                    <strong className="text-gray-600 dark:text-gray-300">
                      {progress.lastEndedTime || 'N/A'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCalendar && (
        <CalendarModal
          currentDate={date}
          onClose={() => setShowCalendar(false)}
          onSelect={(d) => {
            setDate(d);
            setShowCalendar(false);
          }}
        />
      )}
    </div>
  );
}

// --- HELPER SHOW LOGO ---
function RBLogo({ rbName, className = 'h-12' }) {
  const keepOriginalColor = rbName === 'ad' || rbName === 'decathlon';
  if (rbName === 'gpd') {
    return (
      <span className="font-black text-xl uppercase tracking-wider dark:text-gray-100">
        GPD
      </span>
    );
  }
  return (
    <img
      src={`/${rbName}.png`}
      alt={rbName}
      className={`${className} max-w-[85%] object-contain transition-all ${
        keepOriginalColor ? '' : 'dark:brightness-0 dark:invert'
      }`}
      onError={(e) => {
        e.target.style.display = 'none';
        if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
      }}
    />
  );
}

// --- MODAL LỊCH CUSTOM ---
function CalendarModal({ currentDate, onClose, onSelect }) {
  const [view, setView] = useState('days');
  const [currentMonth, setCurrentMonth] = useState('Sep');
  const [currentYear, setCurrentYear] = useState('2026');

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const days = Array.from({ length: 30 }).map((_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl border dark:border-gray-800 animate-in zoom-in-95">
        {view === 'days' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition p-2 -ml-2 rounded-xl"
                onClick={() => setView('months')}
              >
                <h3 className="font-black text-xl">
                  {currentMonth} {currentYear}
                </h3>
                <ChevronDown size={20} className="text-gray-500" />
              </div>
              <button onClick={onClose}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-6">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                <div
                  key={Math.random()}
                  className="text-xs font-bold text-gray-400"
                >
                  {d}
                </div>
              ))}
              {days.map((d) => {
                const dayStr = `${d}-${currentMonth}`;
                const isSelectedDate = currentDate === dayStr;

                return (
                  <div
                    key={d}
                    onClick={() => onSelect(dayStr)}
                    className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center cursor-pointer font-bold text-sm transition-all
                       ${
                         isSelectedDate
                           ? 'bg-blue-500 text-white dark:bg-white dark:text-black shadow-md scale-110'
                           : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200'
                       }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => onSelect(format(new Date(), 'dd-MMM'))}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Today
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl">Select Month</h3>
              <button onClick={() => setView('days')}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-xl mb-6 font-black text-lg">
              <span className="cursor-pointer text-gray-400 hover:text-black dark:hover:text-white">
                {'<'}
              </span>
              <span>{currentYear}</span>
              <span className="cursor-pointer text-gray-400 hover:text-black dark:hover:text-white">
                {'>'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {months.map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    setCurrentMonth(m);
                    setView('days');
                  }}
                  className={`p-4 rounded-xl text-center font-bold cursor-pointer transition 
                     ${
                       m === currentMonth
                         ? 'bg-blue-500 text-white'
                         : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                     }`}
                >
                  {m}
                </div>
              ))}
            </div>
            <button
              onClick={() => setView('days')}
              className="w-full p-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition"
            >
              Back to Days
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// --- TRANG CHẠY CYCLES ---
function CycleRunner({
  config,
  currentUser,
  currentDate,
  canEditOrAdd,
  onBack,
  onProgressUpdate,
}) {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [startedBy, setStartedBy] = useState(null);
  const [cyclesData, setCyclesData] = useState([]);
  const [warning, setWarning] = useState('');

  const [selectedCycleInfo, setSelectedCycleInfo] = useState(null);
  const [liveDurationMinutes, setLiveDurationMinutes] = useState(0);

  const [remarks, setRemarks] = useState({});
  const [editingRemark, setEditingRemark] = useState('');

  const isFinished = currentCycle > config.totalCycles;

  useEffect(() => {
    if (onProgressUpdate) {
      const lastDone = cyclesData[cyclesData.length - 1];
      const lastEndedFormatted = lastDone
        ? `${lastDone.recordDate}, ${format(lastDone.end, 'HH:mm')}`
        : null;
      onProgressUpdate(
        currentCycle,
        isFinished,
        !!startTime,
        lastEndedFormatted,
        currentUser.username,
        remarks
      );
    }
  }, [currentCycle, isFinished, startTime, cyclesData, remarks]);

  useEffect(() => {
    let interval = null;
    if (startTime && !isFinished) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = differenceInMinutes(now, startTime);
        setLiveDurationMinutes(diff);
      }, 1000);
    } else {
      setLiveDurationMinutes(0);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const playBeep = (freq = 800, duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleStart = () => {
    if (isFinished || !canEditOrAdd) return;
    playBeep(800, 0.1);
    setStartTime(new Date());
    setStartedBy(currentUser.username);
  };

  const handleDone = () => {
    if (!startTime || isFinished || !canEditOrAdd) return;
    const now = new Date();
    const durationMinutes = differenceInMinutes(now, startTime);

    if (durationMinutes < 1) {
      playBeep(400, 0.3);
      setWarning('Duration less than 1 hour! Cannot mark as done.');
      return;
    }

    playBeep(1200, 0.15);
    const hour = getHours(now);

    let color = 'bg-gray-200 text-black';
    if (durationMinutes > 120) {
      color = 'bg-red-500 text-white';
    } else if (hour >= 6 && hour < 18) {
      color = 'bg-yellow-400 text-black';
    } else {
      color = 'bg-blue-900 text-white';
    }

    if (currentCycle === config.totalCycles) color = 'bg-green-500 text-white';

    const newData = {
      cycle: currentCycle,
      start: startTime,
      end: now,
      duration: durationMinutes,
      color,
      whoStarted: startedBy,
      whoEnded: currentUser.username,
      recordDate: currentDate || format(new Date(), 'dd-MMM'),
    };

    setCyclesData([...cyclesData, newData]);

    if (currentCycle <= config.totalCycles) {
      setCurrentCycle((prev) => prev + 1);
      if (currentCycle < config.totalCycles) {
        setStartTime(new Date());
        setStartedBy(currentUser.username);
      } else {
        setStartTime(null);
        setStartedBy(null);
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition"
      >
        {'< Back to Turn'}
      </button>

      <div
        className={`mb-8 p-6 rounded-3xl shadow-lg border-2 transition-colors ${
          isFinished
            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
            : 'bg-white dark:bg-gray-800 border-transparent dark:border-gray-700'
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="mb-2 h-10 flex items-center gap-2">
              <RBLogo rbName={config.rb} className="max-h-10" />
              {config.borrowedRB && (
                <span className="text-[10px] bg-yellow-400 text-black font-extrabold px-2.5 py-1 rounded-full uppercase">
                  Borrowed by: {config.borrowedRB}
                </span>
              )}
            </div>
            <p className="text-gray-500 font-bold flex items-center gap-1">
              <WashingMachine size={16} /> Machine {config.machine}
            </p>
          </div>
          {isFinished && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle2 size={14} /> Finished
            </div>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Info size={18} className="text-blue-500" /> {config.turnName}
          </h3>
          <div className="flex gap-4 text-sm font-medium">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <RotateCw size={16} /> {config.totalCycles} Cycles
            </span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300 capitalize">
              <Shirt size={16} /> {config.number} {config.type}s
            </span>
          </div>
        </div>
      </div>

      {warning && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl max-w-xs w-full text-center border-2 border-red-500 shadow-2xl animate-in zoom-in-95">
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Warning</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {warning}
            </p>
            <button
              onClick={() => setWarning('')}
              className="w-full bg-red-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-3 mb-8 justify-items-center">
        {Array.from({ length: config.totalCycles }).map((_, i) => {
          const cNum = i + 1;
          const data = cyclesData.find((d) => d.cycle === cNum);
          const isCurrent = cNum === currentCycle && startTime;
          const isSelected =
            selectedCycleInfo?.cycle === cNum ||
            (selectedCycleInfo === 'current' && isCurrent);

          return (
            <div
              key={cNum}
              onClick={() => {
                if (data) {
                  setSelectedCycleInfo(
                    selectedCycleInfo?.cycle === cNum ? null : data
                  );
                  setEditingRemark(remarks[cNum] || '');
                } else if (isCurrent) {
                  setSelectedCycleInfo('current');
                }
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all cursor-pointer
              ${
                data
                  ? data.color
                  : 'bg-white dark:bg-gray-700 text-gray-400 border'
              } 
              ${isCurrent ? 'ring-4 ring-blue-500/50 animate-pulse' : ''}
              ${
                isSelected
                  ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 scale-105'
                  : ''
              }`}
            >
              {cNum}
            </div>
          );
        })}
      </div>

      {!isFinished && canEditOrAdd && (
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handleStart}
            className={`flex-1 py-4 rounded-full font-black shadow-lg active:scale-95 transition-all
              ${
                startTime
                  ? 'bg-blue-500 text-white shadow-blue-500/30'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
          >
            {startTime ? 'In Progress' : 'Start'}
          </button>

          <button
            onClick={handleDone}
            className="flex-1 py-4 border-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 rounded-full font-black active:scale-95 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            Done
          </button>
        </div>
      )}

      {selectedCycleInfo && selectedCycleInfo !== 'current' ? (
        <div className="mt-8 p-6 bg-blue-50/50 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-blue-200 dark:border-blue-900/50 animate-in slide-in-from-bottom-4 relative">
          <button
            onClick={() => setSelectedCycleInfo(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 text-gray-500 transition"
          >
            <X size={16} />
          </button>

          <h4 className="font-black border-b dark:border-gray-600 pb-3 mb-4 text-xl flex items-center gap-2 text-blue-500">
            <Clock size={20} /> Cycle {selectedCycleInfo.cycle} Details
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Time start</span>
              <span className="font-bold">
                {selectedCycleInfo.recordDate || currentDate},{' '}
                {format(selectedCycleInfo.start, 'HH:mm')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Time ended</span>
              <span className="font-bold">
                {selectedCycleInfo.recordDate || currentDate},{' '}
                {format(selectedCycleInfo.end, 'HH:mm')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Duration</span>
              <span className="font-bold text-blue-500">
                {Math.round(selectedCycleInfo.duration / 60)}h (
                {selectedCycleInfo.duration}m)
              </span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t dark:border-gray-700">
              <span className="font-medium text-gray-500">Who started</span>
              <span className="font-bold">{selectedCycleInfo.whoStarted}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Who ended</span>
              <span className="font-bold">{selectedCycleInfo.whoEnded}</span>
            </div>

            <div className="mt-4 pt-3 border-t dark:border-gray-700">
              <span className="font-bold text-xs text-gray-500 block mb-1.5 flex items-center gap-1">
                <MessageSquare size={14} /> Admin Remark:
              </span>
              {currentUser.role === 'admin' ? (
                <div className="flex gap-2">
                  <input
                    value={editingRemark}
                    onChange={(e) => setEditingRemark(e.target.value)}
                    placeholder="Add technical remark..."
                    className="flex-1 p-2 bg-white dark:bg-gray-700 rounded-xl text-xs border dark:border-gray-600 outline-none font-medium"
                  />
                  <button
                    onClick={() =>
                      setRemarks({
                        ...remarks,
                        [selectedCycleInfo.cycle]: editingRemark,
                      })
                    }
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-600 transition"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-xs italic text-gray-600 dark:text-gray-300 font-medium">
                  {remarks[selectedCycleInfo.cycle] ||
                    'No remark added for this cycle.'}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : startTime && !isFinished ? (
        <div className="mt-8 p-6 bg-blue-50/50 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-blue-200 dark:border-blue-900/50 animate-in slide-in-from-bottom-4 relative">
          {selectedCycleInfo === 'current' && (
            <button
              onClick={() => setSelectedCycleInfo(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 text-gray-500 transition"
            >
              <X size={16} />
            </button>
          )}
          <h4 className="font-black border-b dark:border-gray-600 pb-3 mb-4 text-xl flex items-center gap-2 text-blue-500">
            <Clock size={20} className="animate-spin" /> Cycle {currentCycle}{' '}
            (In Progress)
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Time start</span>
              <span className="font-bold">
                {currentDate}, {format(startTime, 'HH:mm')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Duration</span>
              <span className="font-bold text-blue-500">
                {Math.floor(liveDurationMinutes / 60)}h ({liveDurationMinutes}{' '}
                mins)
              </span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t dark:border-gray-700">
              <span className="font-medium text-gray-500">Who started</span>
              <span className="font-bold">{startedBy}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// --- FORM NHẬP TURN ---
function TurnFormModal({
  turn,
  isBorrow,
  currentRB,
  remainingCycles,
  onClose,
  onSave,
}) {
  const [turnName, setTurnName] = useState(`Turn ${turn}`);
  const [number, setNumber] = useState('');
  const [type, setType] = useState('sample');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [cycles, setCycles] = useState('');
  const [borrowedRB, setBorrowedRB] = useState('');
  const [showBorrowDropdown, setShowBorrowDropdown] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');

  const RBs = [
    'ad',
    'adidas',
    'nike',
    'puma',
    'under armour',
    'decathlon',
    'gpd',
  ];

  const handleSave = () => {
    const totalC = Number(cycles);
    if (!totalC || totalC <= 0) {
      setWarningMsg('Please enter valid number of cycles');
      return;
    }
    if (totalC > remainingCycles) {
      setWarningMsg(
        `không thể nhập thêm cycles, please change the machine! (Max remaining: ${remainingCycles})`
      );
      return;
    }
    if (isBorrow && !borrowedRB) {
      setWarningMsg('Please select which RB is borrowing this machine!');
      return;
    }
    onSave({
      turnName,
      number,
      type,
      totalCycles: totalC,
      borrowedRB: isBorrow ? borrowedRB : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95">
        <h3 className="font-black text-xl mb-4 flex items-center justify-between">
          <span>Turn {turn} Info</span>
          {isBorrow && (
            <span className="text-xs bg-yellow-400 text-black px-2.5 py-1 rounded-full uppercase font-black">
              Borrow
            </span>
          )}
        </h3>

        <div className="space-y-4">
          {isBorrow && (
            <div className="relative">
              <label className="text-xs font-bold text-yellow-600 dark:text-yellow-400 mb-1 block">
                Borrowing RB
              </label>
              <div
                onClick={() => setShowBorrowDropdown(!showBorrowDropdown)}
                className="w-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 p-3 rounded-xl dark:text-white font-bold flex justify-between items-center cursor-pointer select-none"
              >
                <span className="uppercase">
                  {borrowedRB || 'Select Borrowing RB'}
                </span>
                <ChevronDown size={18} className="text-gray-500" />
              </div>

              {showBorrowDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {RBs.filter((r) => r !== currentRB).map((brand) => (
                    <div
                      key={brand}
                      onClick={() => {
                        setBorrowedRB(brand);
                        setShowBorrowDropdown(false);
                      }}
                      className="p-3 hover:bg-yellow-400 hover:text-black cursor-pointer font-bold transition-colors uppercase text-sm"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Turn Name
            </label>
            <input
              value={turnName}
              onChange={(e) => setTurnName(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-xl dark:text-white outline-none font-bold"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                Number
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-xl dark:text-white outline-none font-bold"
              />
            </div>

            <div className="flex-1 relative">
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                Type
              </label>
              <div
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-xl dark:text-white font-bold flex justify-between items-center cursor-pointer select-none"
              >
                <span className="capitalize">{type}</span>
                <ChevronDown size={18} className="text-gray-500" />
              </div>

              {showTypeDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div
                    onClick={() => {
                      setType('sample');
                      setShowTypeDropdown(false);
                    }}
                    className="p-3 hover:bg-blue-500 hover:text-white cursor-pointer font-bold transition-colors dark:text-white text-sm"
                  >
                    Sample
                  </div>
                  <div
                    onClick={() => {
                      setType('bag');
                      setShowTypeDropdown(false);
                    }}
                    className="p-3 hover:bg-blue-500 hover:text-white cursor-pointer font-bold transition-colors dark:text-white text-sm"
                  >
                    Bag
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-500">
                Total Cycles
              </label>
              <span className="text-[10px] font-extrabold text-blue-500">
                Available: {remainingCycles}
              </span>
            </div>
            <input
              type="number"
              value={cycles}
              onChange={(e) => {
                setCycles(e.target.value);
                setWarningMsg('');
              }}
              className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-xl dark:text-white outline-none font-black text-xl text-center"
              placeholder="0"
            />
          </div>

          {warningMsg && (
            <p className="text-xs font-bold text-red-500 text-center animate-shake">
              {warningMsg}
            </p>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 p-4 rounded-xl font-bold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:opacity-80 transition active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 p-4 rounded-xl font-bold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition active:scale-95"
          >
            Save Info
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TRANG PROFILE ---
function ProfilePage({ user, onLogout }) {
  const currentHour = getHours(new Date());
  let greeting = 'Good evening';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Good morning';
  else if (currentHour >= 12 && currentHour < 18) greeting = 'Good afternoon';

  const [techUsers, setTechUsers] = useState([
    { id: 1, name: 'user_tech_01', canEditPast: false },
    { id: 2, name: 'user_tech_02', canEditPast: true },
  ]);

  const togglePermission = (id) => {
    setTechUsers(
      techUsers.map((u) =>
        u.id === id ? { ...u, canEditPast: !u.canEditPast } : u
      )
    );
  };

  const deleteUser = (id) => {
    setTechUsers(techUsers.filter((u) => u.id !== id));
  };

  const isAdmin =
    user.username.toLowerCase() === 'baohuynh' || user.role === 'admin';

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-sm font-bold text-gray-500 mb-1">{greeting},</h2>
      <h2 className="text-3xl font-black mb-1 flex items-center gap-2">
        {user.username}{' '}
        {isAdmin && <ShieldCheck size={24} className="text-yellow-400" />}
      </h2>
      {isAdmin ? (
        <p className="text-yellow-500 font-extrabold text-xs mb-8 uppercase tracking-widest">
          Administrator
        </p>
      ) : (
        <p className="text-blue-500 font-bold text-sm mb-8 uppercase">
          RB: {user.rb}
        </p>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm mb-6 border dark:border-gray-700">
        <h3 className="font-black mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between border-b dark:border-gray-700 pb-2">
            <span className="text-sm font-bold text-gray-400">RB</span>{' '}
            <span className="font-bold">Puma</span>
          </div>
          <div className="flex justify-between border-b dark:border-gray-700 pb-2">
            <span className="text-sm font-bold text-gray-400">Machine No</span>{' '}
            <span className="font-bold">14</span>
          </div>
          <div className="flex justify-between border-b dark:border-gray-700 pb-2">
            <span className="text-sm font-bold text-gray-400">Turn</span>{' '}
            <span className="font-bold">Turn 1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-bold text-gray-400">Cycle</span>{' '}
            <span className="font-bold">5</span>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-black text-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg mt-8 border border-yellow-500/30">
          <h3 className="font-black mb-6 text-yellow-400 flex items-center gap-2">
            <ShieldCheck size={20} /> Management Control
          </h3>

          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              User Accounts & Permissions
            </h4>
            <div className="space-y-2">
              {techUsers.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-gray-900 dark:bg-gray-700 p-3.5 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-sm block">{tech.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {tech.canEditPast
                        ? 'Edit Past: Granted'
                        : 'Edit Past: Blocked'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePermission(tech.id)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                        tech.canEditPast
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteUser(tech.id)}
                      className="text-xs bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
              Record Modification
            </h4>
            <button className="w-full text-left bg-gray-900 dark:bg-gray-700 p-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition mb-2 flex justify-between items-center">
              <span>Edit Time Start / Duration</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button className="w-full text-left bg-gray-900 dark:bg-gray-700 p-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition flex justify-between items-center">
              <span>View All Tech Activity Logs</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <button className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition active:scale-95">
          <Key size={18} className="text-gray-500" /> Change Password
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-2xl font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition active:scale-95"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
}
