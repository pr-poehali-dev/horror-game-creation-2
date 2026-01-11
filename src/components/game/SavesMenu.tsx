import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { GameSave } from '@/pages/Index';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavesMenuProps {
  saves: GameSave[];
  onLoad: (save: GameSave) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const SavesMenu = ({ saves, onLoad, onDelete, onBack }: SavesMenuProps) => {
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
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                <Icon name="FolderOpen" size={40} className="text-[#8B0000]" />
                Сохранения
              </h2>
              <p className="text-gray-400 text-lg">
                {saves.length === 0 ? 'Нет сохранённых игр' : `Найдено ${saves.length} ${saves.length === 1 ? 'сохранение' : 'сохранений'}`}
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

          {saves.length === 0 ? (
            <div className="text-center py-16">
              <Icon name="Inbox" size={64} className="mx-auto text-gray-700 mb-4" />
              <p className="text-xl text-gray-500 mb-2">Нет сохранённых игр</p>
              <p className="text-gray-600">Начните новую игру и сохраните прогресс</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {saves.sort((a, b) => b.timestamp - a.timestamp).map((save) => (
                <Card
                  key={save.id}
                  className="p-6 bg-gray-900/50 border-gray-800 hover:border-[#8B0000] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Icon name="Save" size={24} className="text-[#8B0000]" />
                        <h3 className="text-xl font-bold text-white">{save.name}</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-500">Здоровье</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <Icon name="Heart" size={16} className="text-red-500" />
                            {save.health}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Уровень</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <Icon name="Map" size={16} className="text-[#0a3d0a]" />
                            {save.level}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500">Дата</p>
                          <p className="text-white font-semibold flex items-center gap-2">
                            <Icon name="Clock" size={16} className="text-gray-400" />
                            {new Date(save.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-6">
                      <Button
                        onClick={() => onLoad(save)}
                        className="bg-[#8B0000] hover:bg-[#a01010] text-white"
                      >
                        <Icon name="Play" className="mr-2" size={18} />
                        Загрузить
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-gray-700 hover:border-red-700 hover:bg-red-950"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 border-gray-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Удалить сохранение?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                              Это действие необратимо. Сохранение "{save.name}" будет удалено навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-800 border-gray-700 hover:bg-gray-700">
                              Отмена
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(save.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
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

export default SavesMenu;
