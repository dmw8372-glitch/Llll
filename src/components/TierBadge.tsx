import React from 'react';
import { TierId } from '../types';
import { TIERS_CONFIG } from '../lib/rankSystem';

interface TierBadgeProps {
  tier: TierId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  showPoints?: boolean;
  points?: number;
  animated?: boolean;
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = false,
  showPoints = false,
  points,
  animated = true,
  className = '',
}) => {
  const config = TIERS_CONFIG[tier] || TIERS_CONFIG.BRONZE;

  const sizePixels = {
    xs: 24,
    sm: 36,
    md: 52,
    lg: 76,
    xl: 110,
  }[size];

  const renderBadgeSVG = () => {
    switch (tier) {
      case 'BRONZE':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bronzeShield" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="40%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="bronzeBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            {/* Crossed daggers behind */}
            <path d="M22 24 L78 80 M78 24 L22 80" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            <path d="M22 24 L78 80 M78 24 L22 80" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
            {/* Main Shield */}
            <polygon
              points="50,14 82,24 80,64 50,90 20,64 18,24"
              fill="url(#bronzeShield)"
              stroke="url(#bronzeBorder)"
              strokeWidth="3.5"
            />
            {/* Inner Shield Inset */}
            <polygon
              points="50,22 74,30 72,60 50,81 28,60 26,30"
              fill="#451a03"
              opacity="0.5"
            />
            {/* Center Bronze Star */}
            <polygon
              points="50,34 54,46 66,46 56,54 60,66 50,58 40,66 44,54 34,46 46,46"
              fill="#fef3c7"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Rivets */}
            <circle cx="28" cy="28" r="2.2" fill="#fde68a" />
            <circle cx="72" cy="28" r="2.2" fill="#fde68a" />
            <circle cx="50" cy="85" r="2.2" fill="#fde68a" />
          </svg>
        );

      case 'SILVER':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="silverWings" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="silverPlate" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
            {/* Silver Wings spread */}
            <path
              d="M12 40 L28 20 L36 34 L18 52 Z M88 40 L72 20 L64 34 L82 52 Z"
              fill="url(#silverWings)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Chevron Shield */}
            <polygon
              points="50,12 80,26 76,68 50,92 24,68 20,26"
              fill="url(#silverWings)"
              stroke="#ffffff"
              strokeWidth="3"
            />
            <polygon
              points="50,22 72,32 68,64 50,83 32,64 28,32"
              fill="#1e293b"
              opacity="0.6"
            />
            {/* Double Silver Stars */}
            <polygon
              points="42,42 45,50 53,50 46,55 49,63 42,58 35,63 38,55 31,50 39,50"
              fill="#f1f5f9"
              stroke="#475569"
              strokeWidth="1"
            />
            <polygon
              points="58,42 61,50 69,50 62,55 65,63 58,58 51,63 54,55 47,50 55,50"
              fill="#f1f5f9"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Top Crest Tip */}
            <polygon points="50,10 56,20 44,20" fill="#ffffff" />
          </svg>
        );

      case 'GOLD':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldEagle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="goldShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
            </defs>
            {/* Majestic Eagle Wing Accents */}
            <path
              d="M8 42 C14 20, 36 18, 48 24 L44 36 C34 32, 18 36, 14 56 Z"
              fill="url(#goldEagle)"
              stroke="#713f12"
              strokeWidth="1.2"
            />
            <path
              d="M92 42 C86 20, 64 18, 52 24 L56 36 C66 32, 82 36, 86 56 Z"
              fill="url(#goldEagle)"
              stroke="#713f12"
              strokeWidth="1.2"
            />
            {/* Main Golden Crest */}
            <polygon
              points="50,14 84,28 78,74 50,94 22,74 16,28"
              fill="url(#goldEagle)"
              stroke="url(#goldShine)"
              strokeWidth="3.5"
            />
            {/* Dark inner layer */}
            <polygon
              points="50,22 76,34 72,70 50,86 28,70 24,34"
              fill="#451a03"
              opacity="0.6"
            />
            {/* PUBG Level 3 Helmet Silhouette in Center */}
            <path
              d="M36 44 C36 34, 64 34, 64 44 L66 58 C66 64, 34 64, 34 58 Z"
              fill="#eab308"
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            {/* Visor Slit */}
            <rect x="40" y="47" width="20" height="4.5" rx="2" fill="#1e293b" />
            <line x1="42" y1="49" x2="58" y2="49" stroke="#38bdf8" strokeWidth="1.2" />
            {/* 3 Golden Stars */}
            <polygon points="36,70 38,74 42,74 39,77 40,81 36,78 32,81 33,77 30,74 34,74" fill="#fef08a" />
            <polygon points="50,68 52,73 57,73 53,76 55,81 50,78 45,81 47,76 43,73 48,73" fill="#ffffff" />
            <polygon points="64,70 66,74 70,74 67,77 68,81 64,78 60,81 61,77 58,74 62,74" fill="#fef08a" />
          </svg>
        );

      case 'PLATINUM':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="platGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cffafe" />
                <stop offset="40%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
              <linearGradient id="platGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            {/* Crystal Wing Flakes */}
            <polygon points="12,28 32,18 26,42 8,50" fill="#06b6d4" opacity="0.8" />
            <polygon points="88,28 68,18 74,42 92,50" fill="#06b6d4" opacity="0.8" />
            <polygon points="16,48 34,42 28,68 12,62" fill="#22d3ee" opacity="0.6" />
            <polygon points="84,48 66,42 72,68 88,62" fill="#22d3ee" opacity="0.6" />
            {/* Faceted Main Shield */}
            <polygon
              points="50,10 86,26 78,74 50,96 22,74 14,26"
              fill="url(#platGrad)"
              stroke="url(#platGlow)"
              strokeWidth="3.5"
            />
            {/* Geometric Diamond Core */}
            <polygon points="50,22 74,46 50,78 26,46" fill="#083344" opacity="0.7" />
            <polygon points="50,24 68,46 50,72 32,46" fill="url(#platGrad)" opacity="0.9" />
            {/* Facet Lines */}
            <line x1="50" y1="24" x2="50" y2="72" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
            <line x1="32" y1="46" x2="68" y2="46" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            {/* Four Platinum Stars */}
            <circle cx="36" cy="80" r="3" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1" />
            <circle cx="45" cy="84" r="3" fill="#ffffff" stroke="#0891b2" strokeWidth="1" />
            <circle cx="55" cy="84" r="3" fill="#ffffff" stroke="#0891b2" strokeWidth="1" />
            <circle cx="64" cy="80" r="3" fill="#e0f2fe" stroke="#0891b2" strokeWidth="1" />
          </svg>
        );

      case 'DIAMOND':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="diaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="35%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="diaWings" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
            {/* Razor Sharp Platinum Side Wings */}
            <path
              d="M6 34 L32 18 L26 38 L42 28 L32 54 L12 62 Z"
              fill="url(#diaWings)"
              stroke="#1e3a8a"
              strokeWidth="1.2"
            />
            <path
              d="M94 34 L68 18 L74 38 L58 28 L68 54 L88 62 Z"
              fill="url(#diaWings)"
              stroke="#1e3a8a"
              strokeWidth="1.2"
            />
            {/* Outer Diamond Shield */}
            <polygon
              points="50,8 88,26 80,76 50,96 20,76 12,26"
              fill="url(#diaBlue)"
              stroke="#ffffff"
              strokeWidth="3.5"
            />
            {/* Large Glowing Diamond Facet */}
            <polygon points="50,18 78,38 50,78 22,38" fill="#1e1b4b" opacity="0.6" />
            <polygon points="50,22 72,40 50,72 28,40" fill="url(#diaBlue)" />
            {/* Gem Glints */}
            <polygon points="50,22 60,34 50,40 40,34" fill="#ffffff" opacity="0.9" />
            <polygon points="50,40 72,40 50,72" fill="#2563eb" opacity="0.7" />
            <polygon points="50,40 28,40 50,72" fill="#60a5fa" opacity="0.9" />
            {/* Diamond Crown Star */}
            <polygon points="50,6 53,13 60,13 54,17 56,24 50,20 44,24 46,17 40,13 47,13" fill="#ffffff" />
          </svg>
        );

      case 'CROWN':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="royalVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
            </defs>
            {/* Golden Laurel Wreath Backing */}
            <path
              d="M12 56 C10 32, 26 16, 42 16 M88 56 C90 32, 74 16, 58 16"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
            {/* Royal Velvet Shield */}
            <polygon
              points="50,14 84,28 78,76 50,96 22,76 16,28"
              fill="url(#royalVelvet)"
              stroke="url(#crownGold)"
              strokeWidth="4"
            />
            {/* Ornate Imperial Golden Crown */}
            <path
              d="M26 56 L30 36 L40 46 L50 28 L60 46 L70 36 L74 56 Z"
              fill="url(#crownGold)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            {/* Crown Base Band */}
            <rect x="24" y="56" width="52" height="9" rx="3" fill="#b45309" stroke="#fef08a" strokeWidth="1.5" />
            {/* Crown Jewels (Rubies & Emeralds) */}
            <circle cx="30" cy="36" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            <circle cx="50" cy="28" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="70" cy="36" r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            <circle cx="36" cy="60.5" r="2.2" fill="#10b981" />
            <circle cx="50" cy="60.5" r="2.8" fill="#ffffff" />
            <circle cx="64" cy="60.5" r="2.2" fill="#10b981" />
            {/* Golden Stars at bottom */}
            <polygon points="50,74 52,78 57,78 53,81 55,86 50,83 45,86 47,81 43,78 48,78" fill="#fef08a" />
          </svg>
        );

      case 'ACE':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="aceFlame" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="aceGoldWings" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
            {/* Crossed Assault Rifles Silhouettes */}
            <path
              d="M10 20 L86 86 M90 20 L14 86"
              stroke="#7f1d1d"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M10 20 L86 86 M90 20 L14 86"
              stroke="#facc15"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Ace Heavy Battle Wings */}
            <path
              d="M6 46 C12 24, 30 18, 44 26 L38 42 C28 36, 16 42, 12 58 Z"
              fill="url(#aceGoldWings)"
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />
            <path
              d="M94 46 C88 24, 70 18, 56 26 L62 42 C72 36, 84 42, 88 58 Z"
              fill="url(#aceGoldWings)"
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />
            {/* Heavy Shield Body */}
            <polygon
              points="50,12 86,26 80,76 50,96 20,76 14,26"
              fill="url(#aceFlame)"
              stroke="#fef08a"
              strokeWidth="3.5"
            />
            {/* Level 3 Helmet with Red Visor */}
            <path
              d="M34 38 C34 26, 66 26, 66 38 L68 56 C68 64, 32 64, 32 56 Z"
              fill="#1e293b"
              stroke="#facc15"
              strokeWidth="2"
            />
            {/* Distinctive Red PUBG Ace Visor */}
            <rect x="38" y="42" width="24" height="6.5" rx="2" fill="#dc2626" />
            <line x1="40" y1="45" x2="60" y2="45" stroke="#fef08a" strokeWidth="1.8" />
            {/* Ace Star Ribbon */}
            <polygon points="50,66 53,73 60,73 54,77 56,84 50,80 44,84 46,77 40,73 47,73" fill="#ffffff" stroke="#ef4444" strokeWidth="1" />
            {/* Top Ace Spike */}
            <polygon points="50,4 55,14 45,14" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
          </svg>
        );

      case 'CONQUEROR':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_18px_rgba(239,68,68,0.7)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="conqFlames" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
              <linearGradient id="conqGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fde047" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
            </defs>
            {/* Radiant Sunburst Solar Crest */}
            <circle cx="50" cy="50" r="42" stroke="url(#conqFlames)" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
            {/* Burning Flame Wings */}
            <path
              d="M4 42 C12 16, 32 12, 46 22 L40 38 C30 32, 14 36, 10 56 Z"
              fill="url(#conqFlames)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            <path
              d="M96 42 C88 16, 68 12, 54 22 L60 38 C70 32, 86 36, 90 56 Z"
              fill="url(#conqFlames)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            {/* Secondary Golden Wings */}
            <path
              d="M12 58 C18 42, 34 38, 46 44 L42 56 C34 52, 22 56, 18 68 Z"
              fill="url(#conqGold)"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            <path
              d="M88 58 C82 42, 66 38, 54 44 L58 56 C66 52, 78 56, 82 68 Z"
              fill="url(#conqGold)"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            {/* Main Blazing Conqueror Shield */}
            <polygon
              points="50,10 88,24 82,78 50,98 18,78 12,24"
              fill="url(#conqFlames)"
              stroke="url(#conqGold)"
              strokeWidth="4"
            />
            {/* Golden Level 3 Helmet of Supreme Victory */}
            <path
              d="M34 36 C34 22, 66 22, 66 36 L68 56 C68 64, 32 64, 32 56 Z"
              fill="url(#conqGold)"
              stroke="#ffffff"
              strokeWidth="2.2"
            />
            {/* Ruby Blazing Laser Visor */}
            <rect x="38" y="41" width="24" height="6.5" rx="2" fill="#7f1d1d" />
            <line x1="39" y1="44" x2="61" y2="44" stroke="#ff0044" strokeWidth="2.5" />
            {/* Radiant Flaming Crest Star */}
            <polygon
              points="50,68 54,75 62,75 56,80 58,88 50,83 42,88 44,80 38,75 46,75"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="2"
            />
            {/* Top Conqueror Flame Point */}
            <polygon points="50,2 56,12 44,12" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div
        style={{ width: sizePixels, height: sizePixels }}
        className={`relative shrink-0 flex items-center justify-center transition-transform ${
          animated ? 'hover:scale-110 duration-200' : ''
        }`}
      >
        {renderBadgeSVG()}
      </div>

      {showLabel && (
        <div className="mt-1 flex flex-col items-center leading-tight">
          <span
            style={{ color: config.themeColor }}
            className={`font-black tracking-tight ${
              size === 'xs'
                ? 'text-[10px]'
                : size === 'sm'
                ? 'text-xs'
                : size === 'md'
                ? 'text-sm'
                : 'text-base font-black'
            }`}
          >
            {config.name}
          </span>
          {showPoints && typeof points === 'number' && (
            <span className="text-[11px] text-slate-500 font-bold">
              {points} RP
            </span>
          )}
        </div>
      )}
    </div>
  );
};
