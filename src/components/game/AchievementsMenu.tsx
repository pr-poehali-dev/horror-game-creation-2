import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import type { Achievement } from '@/pages/Index';

interface AchievementsMenuProps {
  achievements: Achievement[];
  onBack: () => void;
}

const AchievementsMenu = ({ achievements, onBack }: AchievementsMenuProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 overflow-auto">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.05) 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 w-full max-w-4xl space-y-6 my-8">
        <Card className="bg-black/90 border-gray-800 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                <Icon name="Trophy" size={40} className="text-yellow-500" />
                Достижения
              </h2>
              <p className="text-gray-400 text-lg">
                Открыто {unlockedCount} из {totalCount}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <Icon name="X" size={24} />
            </Button>
          </div>

          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Общий прогресс</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-6 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-yellow-950/50 to-orange-950/50 border-yellow-700/50'
                    : 'bg-gray-900/50 border-gray-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-yellow-600 shadow-lg shadow-yellow-600/50'
                        : 'bg-gray-800'
                    }`}
                  >
                    <Icon
                      name={achievement.unlocked ? "Award" : "Lock"}
                      size={32}
                      className={achievement.unlocked ? "text-white" : "text-gray-600"}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className={`text-xl font-bold ${
                            achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            achievement.unlocked ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="flex flex-col items-center">
                          <Icon name="Check" size={24} className="text-green-500" />
                          <span className="text-xs text-green-500 font-semibold mt-1">
                            ОТКРЫТО
                          </span>
                        </div>
                      )}
                    </div>

                    {!achievement.unlocked && achievement.progress > 0 && (
                      <div className="space-y-1">
                        <Progress value={achievement.progress} className="h-2" />
                        <p className="text-xs text-gray-500">
                          Прогресс: {achievement.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={onBack}
            size="lg"
            className="bg-[#8B0000] hover:bg-[#a01010] text-white px-12"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад в меню
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsMenu;
