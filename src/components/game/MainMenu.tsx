import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface MainMenuProps {
  onNewGame: (playerName: string) => void;
  onContinue: () => void;
  onSettings: () => void;
  onAchievements: () => void;
}

const MainMenu = ({ onNewGame, onContinue, onSettings, onAchievements }: MainMenuProps) => {
  const [flicker, setFlicker] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(Math.random() > 0.85);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0000] to-black opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(10, 61, 10, 0.1) 0%, transparent 50%)
          `
        }}
      />

      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 
            className={`creepster text-7xl md:text-9xl text-[#ff8c00] text-shadow-glow ${flicker ? 'animate-flicker' : ''}`}
          >
            NIGHTMARE
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 tracking-widest uppercase">
            Enter if you dare
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-md mx-auto mt-12">
          {!showNameInput ? (
            <Button
              size="lg"
              className="bg-[#8B0000] hover:bg-[#a01010] text-white text-xl py-6 border border-red-900 hover:shadow-[0_0_20px_rgba(139,0,0,0.5)] transition-all"
              onClick={() => setShowNameInput(true)}
            >
              <Icon name="Play" className="mr-2" size={24} />
              Новая игра
            </Button>
          ) : (
            <div className="space-y-4 p-6 bg-black/70 rounded-lg border border-gray-800">
              <p className="text-white text-lg mb-2">Введите ваше имя:</p>
              <Input
                type="text"
                placeholder="Ваше имя"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white text-xl py-6"
                maxLength={20}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="flex-1 bg-[#8B0000] hover:bg-[#a01010] text-white"
                  onClick={() => {
                    if (playerName.trim()) {
                      onNewGame(playerName.trim());
                    }
                  }}
                  disabled={!playerName.trim()}
                >
                  <Icon name="Check" className="mr-2" size={20} />
                  Начать
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 hover:border-gray-500 bg-black/50"
                  onClick={() => {
                    setShowNameInput(false);
                    setPlayerName('');
                  }}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>
          )}

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-700 hover:border-[#8B0000] bg-black/50 hover:bg-[#1a0000] text-white text-xl py-6 transition-all"
            onClick={onContinue}
          >
            <Icon name="FolderOpen" className="mr-2" size={24} />
            Загрузить
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-700 hover:border-[#0a3d0a] bg-black/50 hover:bg-[#0a1a0a] text-white text-xl py-6 transition-all"
            onClick={onAchievements}
          >
            <Icon name="Trophy" className="mr-2" size={24} />
            Достижения
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-gray-700 hover:border-gray-500 bg-black/50 hover:bg-gray-900 text-white text-xl py-6 transition-all"
            onClick={onSettings}
          >
            <Icon name="Settings" className="mr-2" size={24} />
            Настройки
          </Button>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          🎧 Используйте наушники для лучшего эффекта
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
};

export default MainMenu;