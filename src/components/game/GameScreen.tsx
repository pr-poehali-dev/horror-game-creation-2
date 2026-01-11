import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import type { GameSettings, GameSave } from '@/pages/Index';

interface Enemy {
  x: number;
  y: number;
  state: 'patrol' | 'chase' | 'search';
  lastSeenPlayerX?: number;
  lastSeenPlayerY?: number;
}

interface GameScreenProps {
  playerName: string;
  settings: GameSettings;
  onExit: () => void;
  onSave: (save: GameSave) => void;
  onUnlockAchievement: (id: string) => void;
}

const GameScreen = ({ playerName, settings, onExit, onSave, onUnlockAchievement }: GameScreenProps) => {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [health, setHealth] = useState(100);
  const [stamina, setStamina] = useState(100);
  const [enemy, setEnemy] = useState<Enemy>({ x: 80, y: 80, state: 'patrol' });
  const [gameTime, setGameTime] = useState(0);
  const [paused, setPaused] = useState(false);
  const [running, setRunning] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (paused) return;

    const gameLoop = setInterval(() => {
      setGameTime(prev => prev + 1);

      if (keysPressed.current.has('w')) {
        setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - (running ? 2 : 1)) }));
      }
      if (keysPressed.current.has('s')) {
        setPlayerPos(prev => ({ ...prev, y: Math.min(100, prev.y + (running ? 2 : 1)) }));
      }
      if (keysPressed.current.has('a')) {
        setPlayerPos(prev => ({ ...prev, x: Math.max(0, prev.x - (running ? 2 : 1)) }));
      }
      if (keysPressed.current.has('d')) {
        setPlayerPos(prev => ({ ...prev, x: Math.min(100, prev.x + (running ? 2 : 1)) }));
      }

      if (running && keysPressed.current.size > 0) {
        setStamina(prev => Math.max(0, prev - 1));
      } else {
        setStamina(prev => Math.min(100, prev + 0.5));
      }

      setEnemy(prevEnemy => {
        const dx = playerPos.x - prevEnemy.x;
        const dy = playerPos.y - prevEnemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
          return {
            ...prevEnemy,
            state: 'chase',
            x: prevEnemy.x + (dx / distance) * 0.8,
            y: prevEnemy.y + (dy / distance) * 0.8,
            lastSeenPlayerX: playerPos.x,
            lastSeenPlayerY: playerPos.y,
          };
        } else if (prevEnemy.state === 'chase' && distance < 30) {
          const targetX = prevEnemy.lastSeenPlayerX ?? prevEnemy.x;
          const targetY = prevEnemy.lastSeenPlayerY ?? prevEnemy.y;
          const searchDx = targetX - prevEnemy.x;
          const searchDy = targetY - prevEnemy.y;
          const searchDist = Math.sqrt(searchDx * searchDx + searchDy * searchDy);

          if (searchDist < 2) {
            return { ...prevEnemy, state: 'patrol' };
          }

          return {
            ...prevEnemy,
            state: 'search',
            x: prevEnemy.x + (searchDx / searchDist) * 0.5,
            y: prevEnemy.y + (searchDy / searchDist) * 0.5,
          };
        } else {
          const patrolSpeed = 0.3;
          return {
            ...prevEnemy,
            state: 'patrol',
            x: prevEnemy.x + Math.sin(gameTime * 0.01) * patrolSpeed,
            y: prevEnemy.y + Math.cos(gameTime * 0.01) * patrolSpeed,
          };
        }
      });

      const enemyDx = playerPos.x - enemy.x;
      const enemyDy = playerPos.y - enemy.y;
      const enemyDistance = Math.sqrt(enemyDx * enemyDx + enemyDy * enemyDy);

      if (enemyDistance < 5) {
        setHealth(prev => Math.max(0, prev - 2));
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [paused, playerPos, enemy, gameTime, running]);

  useEffect(() => {
    if (gameTime === 6000) {
      onUnlockAchievement('2');
    }
  }, [gameTime, onUnlockAchievement]);

  useEffect(() => {
    if (health <= 0) {
      alert('Вы погибли!');
      onExit();
    }
  }, [health, onExit]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'shift') setRunning(true);
      if (e.key.toLowerCase() === 'escape') setPaused(prev => !prev);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
      if (e.key.toLowerCase() === 'shift') setRunning(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      name: `Сохранение ${new Date().toLocaleString()}`,
      health,
      level: 1,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: enemy.state === 'chase' 
            ? 'radial-gradient(circle at center, rgba(139, 0, 0, 0.3) 0%, rgba(10, 10, 10, 1) 70%)'
            : 'radial-gradient(circle at center, rgba(10, 61, 10, 0.2) 0%, rgba(10, 10, 10, 1) 70%)'
        }}
      />

      <div className="absolute top-6 left-6 space-y-4 z-20">
        <div className="bg-black/80 p-4 rounded-lg border border-gray-800 space-y-3 min-w-[250px]">
          <div className="border-b border-gray-700 pb-2 mb-2">
            <p className="text-[#ff8c00] font-bold text-lg">{playerName}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-red-500 flex items-center gap-2">
                <Icon name="Heart" size={16} />
                Здоровье
              </span>
              <span className="text-white font-bold">{Math.round(health)}%</span>
            </div>
            <Progress value={health} className="h-3 bg-red-950" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-green-500 flex items-center gap-2">
                <Icon name="Zap" size={16} />
                Выносливость
              </span>
              <span className="text-white font-bold">{Math.round(stamina)}%</span>
            </div>
            <Progress value={stamina} className="h-3 bg-green-950" />
          </div>

          <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
            <span className="text-gray-400">Время</span>
            <span className="text-white font-mono">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {enemy.state === 'chase' && (
          <div className="bg-red-950/80 p-3 rounded-lg border border-red-700 animate-pulse-danger">
            <p className="text-red-400 font-bold flex items-center gap-2">
              <Icon name="AlertTriangle" size={20} />
              ВАС ПРЕСЛЕДУЮТ!
            </p>
          </div>
        )}

        {enemy.state === 'search' && (
          <div className="bg-yellow-950/80 p-3 rounded-lg border border-yellow-700">
            <p className="text-yellow-400 font-bold flex items-center gap-2">
              <Icon name="Search" size={20} />
              Враг ищет вас...
            </p>
          </div>
        )}
      </div>

      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 border-gray-700 hover:bg-gray-900 hover:border-gray-500"
          onClick={handleSave}
        >
          <Icon name="Save" size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 border-gray-700 hover:bg-gray-900 hover:border-gray-500"
          onClick={() => setPaused(!paused)}
        >
          <Icon name={paused ? "Play" : "Pause"} size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-black/80 border-gray-700 hover:bg-red-900 hover:border-red-700"
          onClick={onExit}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      <div 
        className="absolute w-8 h-8 bg-blue-500 rounded-full shadow-lg transition-all duration-100 z-10 border-2 border-blue-300"
        style={{ 
          left: `${playerPos.x}%`, 
          top: `${playerPos.y}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
        }}
      />

      <div 
        className={`absolute w-12 h-12 rounded-full transition-all duration-200 z-10 ${
          enemy.state === 'chase' ? 'bg-red-600 animate-pulse' : 
          enemy.state === 'search' ? 'bg-orange-600' : 'bg-gray-600'
        }`}
        style={{ 
          left: `${enemy.x}%`, 
          top: `${enemy.y}%`,
          transform: 'translate(-50%, -50%)',
          boxShadow: enemy.state === 'chase' ? '0 0 30px rgba(220, 38, 38, 0.8)' : 'none'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="Skull" size={24} className="text-white" />
        </div>
      </div>

      {paused && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">ПАУЗА</h2>
            <Button onClick={() => setPaused(false)} className="bg-[#8B0000] hover:bg-[#a01010]">
              Продолжить
            </Button>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-gray-500 text-sm space-y-1 z-20">
        <p>WASD - Движение | Shift - Бег | ESC - Пауза</p>
        <p className="text-xs">Избегайте красного врага и выживайте как можно дольше</p>
      </div>
    </div>
  );
};

export default GameScreen;