import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Monitor, MapPin, Ticket, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FavoriteItem {
  id: string;
  type: 'device' | 'site' | 'ticket' | 'report';
  name: string;
  path: string;
  addedAt: Date;
}

// Initial favorites - would be persisted in real app
const initialFavorites: FavoriteItem[] = [
  { id: 'f1', type: 'device', name: 'TDB-1-001', path: '/devices/d1', addedAt: new Date() },
  { id: 'f2', type: 'site', name: '本店営業部', path: '/sites/s1', addedAt: new Date() },
  { id: 'f3', type: 'ticket', name: 'TKT-2024-00001', path: '/tickets/t1', addedAt: new Date() },
];

const typeConfig = {
  device: { icon: Monitor, class: 'text-primary' },
  site: { icon: MapPin, class: 'text-status-info' },
  ticket: { icon: Ticket, class: 'text-status-warning' },
  report: { icon: Star, class: 'text-status-healthy' },
};

interface FavoritesProps {
  editable?: boolean;
}

export function Favorites({ editable = false }: FavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  if (favorites.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">お気に入りがありません</p>
        <p className="text-xs mt-1">端末やチケットを★マークでお気に入りに追加</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {favorites.map((favorite) => {
        const config = typeConfig[favorite.type];
        const Icon = config.icon;

        return (
          <div
            key={favorite.id}
            className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <Link
              to={favorite.path}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <Icon className={cn('h-4 w-4 shrink-0', config.class)} />
              <span className="text-sm truncate">{favorite.name}</span>
            </Link>
            {editable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFavorite(favorite.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Hook for adding/removing favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);

  const addFavorite = (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      id: `f${Date.now()}`,
      addedAt: new Date(),
    };
    setFavorites([...favorites, newFavorite]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  const isFavorite = (path: string) => {
    return favorites.some(f => f.path === path);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
