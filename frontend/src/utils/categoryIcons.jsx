import React from 'react';
import {
  Wheat,
  Boxes,
  Droplets,
  Sparkles,
  Cookie,
  Package,
  Coffee,
  CupSoda,
  Heart,
  Sparkle,
  ShoppingBag,
  Milk,
  Layers,
} from 'lucide-react';

const iconMap = {
  Wheat: Wheat,
  Boxes: Boxes,
  Droplets: Droplets,
  Sparkles: Sparkles,
  Cookie: Cookie,
  Package: Package,
  Coffee: Coffee,
  CupSoda: CupSoda,
  Heart: Heart,
  Sparkle: Sparkle,
  ShoppingBag: ShoppingBag,
  Milk: Milk,
  Layers: Layers,
};

export function getCategoryIcon(name, className = 'w-5 h-5') {
  const IconComponent = iconMap[name] || ShoppingBag;
  return <IconComponent className={className} />;
}
