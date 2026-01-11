import { useState, useEffect } from 'react';
import MainMenu from '@/components/game/MainMenu';
import GameScreen from '@/components/game/GameScreen';
import SettingsMenu from '@/components/game/SettingsMenu';
import AchievementsMenu from '@/components/game/AchievementsMenu';
import SavesMenu from '@/components/game/SavesMenu';

type GameState = 'menu' | 'playing' | 'settings' | 'achievements' | 'saves';

export interface GameSettings {
  graphics: 'low' | 'medium' | 'high' | 'ultra';
  volume: number;
  sensitivity: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
}

export interface GameSave {
  id: string;
  name: string;
  health: number;
  level: number;
  timestamp: number;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [playerName, setPlayerName] = useState<string>('');
  const [settings, setSettings] = useState<GameSettings>({
    graphics: 'high',
    volume: 70,
    sensitivity: 50,
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'Первая кровь', description: 'Убейте первого врага', unlocked: false, progress: 0 },
    { id: '2', title: 'Выживший', description: 'Проживите 5 минут', unlocked: false, progress: 0 },
    { id: '3', title: 'Мастер побега', description: 'Сбегите от врага 10 раз', unlocked: false, progress: 0 },
    { id: '4', title: 'Исследователь', description: 'Найдите все секретные комнаты', unlocked: false, progress: 0 },
    { id: '5', title: 'Неуязвимый', description: 'Пройдите уровень без урона', unlocked: false, progress: 0 },
  ]);

  const [saves, setSaves] = useState<GameSave[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('horrorGameSave');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.settings) setSettings(data.settings);
      if (data.achievements) setAchievements(data.achievements);
      if (data.saves) setSaves(data.saves);
    }
  }, []);

  const saveGame = (save: GameSave) => {
    const newSaves = [...saves.filter(s => s.id !== save.id), save];
    setSaves(newSaves);
    localStorage.setItem('horrorGameSave', JSON.stringify({ settings, achievements, saves: newSaves }));
  };

  const loadGame = (save: GameSave) => {
    setGameState('playing');
  };

  const deleteSave = (id: string) => {
    const newSaves = saves.filter(s => s.id !== id);
    setSaves(newSaves);
    localStorage.setItem('horrorGameSave', JSON.stringify({ settings, achievements, saves: newSaves }));
  };

  const updateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem('horrorGameSave', JSON.stringify({ settings: newSettings, achievements, saves }));
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => 
        a.id === id ? { ...a, unlocked: true, progress: 100 } : a
      );
      localStorage.setItem('horrorGameSave', JSON.stringify({ settings, achievements: updated, saves }));
      return updated;
    });
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0a0a]">
      {gameState === 'menu' && (
        <MainMenu 
          onNewGame={(name) => {
            setPlayerName(name);
            setGameState('playing');
          }}
          onContinue={() => setGameState('saves')}
          onSettings={() => setGameState('settings')}
          onAchievements={() => setGameState('achievements')}
        />
      )}
      
      {gameState === 'playing' && (
        <GameScreen 
          playerName={playerName}
          settings={settings}
          onExit={() => setGameState('menu')}
          onSave={saveGame}
          onUnlockAchievement={unlockAchievement}
        />
      )}
      
      {gameState === 'settings' && (
        <SettingsMenu 
          settings={settings}
          onSave={updateSettings}
          onBack={() => setGameState('menu')}
        />
      )}
      
      {gameState === 'achievements' && (
        <AchievementsMenu 
          achievements={achievements}
          onBack={() => setGameState('menu')}
        />
      )}
      
      {gameState === 'saves' && (
        <SavesMenu 
          saves={saves}
          onLoad={loadGame}
          onDelete={deleteSave}
          onBack={() => setGameState('menu')}
        />
      )}
    </div>
  );
};

export default Index;