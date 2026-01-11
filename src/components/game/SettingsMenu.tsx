import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import type { GameSettings } from '@/pages/Index';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsMenuProps {
  settings: GameSettings;
  onSave: (settings: GameSettings) => void;
  onBack: () => void;
}

const SettingsMenu = ({ settings, onSave, onBack }: SettingsMenuProps) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onBack();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.05) 0%, transparent 50%)`
        }}
      />

      <Card className="relative z-10 w-full max-w-2xl bg-black/90 border-gray-800 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              <Icon name="Settings" size={40} className="text-[#8B0000]" />
              Настройки
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              <Icon name="X" size={24} />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg text-white flex items-center gap-2">
                <Icon name="Monitor" size={20} className="text-[#0a3d0a]" />
                Качество графики
              </Label>
              <Select
                value={localSettings.graphics}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'ultra') =>
                  setLocalSettings({ ...localSettings, graphics: value })
                }
              >
                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="low" className="text-white hover:bg-gray-800">
                    Низкое (Лучшая производительность)
                  </SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-800">
                    Среднее
                  </SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-gray-800">
                    Высокое
                  </SelectItem>
                  <SelectItem value="ultra" className="text-white hover:bg-gray-800">
                    Ультра (Лучшая графика)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                Текущее: <span className="text-[#0a3d0a] font-semibold">{localSettings.graphics.toUpperCase()}</span>
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-lg text-white flex items-center gap-2">
                <Icon name="Volume2" size={20} className="text-[#8B0000]" />
                Громкость: {localSettings.volume}%
              </Label>
              <Slider
                value={[localSettings.volume]}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, volume: value[0] })
                }
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Регулирует громкость звуковых эффектов и музыки
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-lg text-white flex items-center gap-2">
                <Icon name="MousePointer" size={20} className="text-gray-400" />
                Чувствительность: {localSettings.sensitivity}%
              </Label>
              <Slider
                value={[localSettings.sensitivity]}
                onValueChange={(value) =>
                  setLocalSettings({ ...localSettings, sensitivity: value[0] })
                }
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Скорость поворота камеры и реакции на движения
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-800">
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#8B0000] hover:bg-[#a01010] text-white py-6 text-lg"
            >
              <Icon name="Save" className="mr-2" size={20} />
              Сохранить
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 border-2 border-gray-700 hover:border-gray-500 bg-black/50 hover:bg-gray-900 text-white py-6 text-lg"
            >
              <Icon name="X" className="mr-2" size={20} />
              Отмена
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsMenu;
