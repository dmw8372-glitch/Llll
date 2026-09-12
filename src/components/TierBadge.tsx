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
              <linearGradient id="bronzeShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="30%" stopColor="#d97706" />
                <stop offset="70%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="bronzeSteelBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="bronzeGoldRim" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>
            {/* Crossed Roman Gladius Blades behind */}
            <path d="M16 18 L84 86 M84 18 L16 86" stroke="url(#bronzeSteelBlade)" strokeWidth="6" strokeLinecap="round" />
            <path d="M16 18 L84 86 M84 18 L16 86" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            {/* Sword Hilts and Pommels */}
            <circle cx="16" cy="18" r="4.5" fill="#b45309" stroke="#fef3c7" strokeWidth="1" />
            <circle cx="84" cy="18" r="4.5" fill="#b45309" stroke="#fef3c7" strokeWidth="1" />
            <line x1="12" y1="24" x2="22" y2="14" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
            <line x1="88" y1="24" x2="78" y2="14" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
            {/* Main Bronze Heavy Shield */}
            <polygon
              points="50,12 84,24 80,68 50,92 20,68 16,24"
              fill="url(#bronzeShieldGrad)"
              stroke="url(#bronzeGoldRim)"
              strokeWidth="3.5"
            />
            {/* Inner Hammered Armor Layer */}
            <polygon
              points="50,20 74,30 70,62 50,82 30,62 26,30"
              fill="#451a03"
              stroke="#92400e"
              strokeWidth="2"
            />
            {/* Chevron Plates */}
            <polygon points="50,30 66,40 50,50 34,40" fill="#b45309" opacity="0.6" />
            <polygon points="50,44 66,54 50,64 34,54" fill="#b45309" opacity="0.4" />
            {/* Central Polished Bronze Star */}
            <polygon
              points="50,36 53.5,46 64,46 55.5,52 59,62 50,56 41,62 44.5,52 36,46 46.5,46"
              fill="#fef3c7"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            <circle cx="50" cy="51" r="2.5" fill="#b45309" />
            {/* Bronze Armor Rivets */}
            <circle cx="28" cy="28" r="2.2" fill="#fde68a" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="72" cy="28" r="2.2" fill="#fde68a" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="50" cy="85" r="2.5" fill="#fde68a" stroke="#78350f" strokeWidth="0.8" />
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
              <linearGradient id="silverWingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#e2e8f0" />
                <stop offset="70%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="silverSheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
            {/* Multi-layered Outstretched Silver Valkyrie Wings */}
            <path
              d="M8 36 L28 16 L38 30 L22 48 Z M92 36 L72 16 L62 30 L78 48 Z"
              fill="url(#silverWingsGrad)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            <path
              d="M12 50 L28 34 L36 46 L20 62 Z M88 50 L72 34 L64 46 L80 62 Z"
              fill="url(#silverSheen)"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Angular Chromium Shield */}
            <polygon
              points="50,10 82,24 78,70 50,94 22,70 18,24"
              fill="url(#silverWingsGrad)"
              stroke="#ffffff"
              strokeWidth="3.5"
            />
            {/* Dark Graphite Inset */}
            <polygon
              points="50,18 72,28 68,64 50,84 32,64 28,28"
              fill="#1e293b"
              stroke="#94a3b8"
              strokeWidth="1.8"
            />
            {/* Polished Silver Knight Visor Silhouette */}
            <polygon points="50,26 66,38 50,50 34,38" fill="url(#silverSheen)" />
            <line x1="38" y1="38" x2="62" y2="38" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            {/* Twin Shining Silver Stars */}
            <polygon
              points="40,58 42.5,64 49,64 43.5,68 45.5,74 40,70 34.5,74 36.5,68 31,64 37.5,64"
              fill="#ffffff"
              stroke="#475569"
              strokeWidth="1"
            />
            <polygon
              points="60,58 62.5,64 69,64 63.5,68 65.5,74 60,70 54.5,74 56.5,68 51,64 57.5,64"
              fill="#ffffff"
              stroke="#475569"
              strokeWidth="1"
            />
            {/* Top Crown Apex Spike */}
            <polygon points="50,6 56,16 44,16" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
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
              <linearGradient id="goldEagleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#facc15" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="goldShineBright" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
            {/* Grand Imperial Golden Eagle Wings */}
            <path
              d="M4 38 C14 14, 38 12, 48 20 L44 32 C34 26, 16 30, 12 50 Z"
              fill="url(#goldEagleGrad)"
              stroke="#713f12"
              strokeWidth="1.5"
            />
            <path
              d="M96 38 C86 14, 62 12, 52 20 L56 32 C66 26, 84 30, 88 50 Z"
              fill="url(#goldEagleGrad)"
              stroke="#713f12"
              strokeWidth="1.5"
            />
            {/* Lower Golden Wing Feathers */}
            <path
              d="M10 52 C18 36, 32 34, 44 40 L40 48 C32 44, 20 46, 16 62 Z"
              fill="url(#goldShineBright)"
              stroke="#713f12"
              strokeWidth="1"
            />
            <path
              d="M90 52 C82 36, 68 34, 56 40 L60 48 C68 44, 80 46, 84 62 Z"
              fill="url(#goldShineBright)"
              stroke="#713f12"
              strokeWidth="1"
            />
            {/* Main Golden Crest Shield */}
            <polygon
              points="50,10 86,26 80,72 50,96 20,72 14,26"
              fill="url(#goldEagleGrad)"
              stroke="url(#goldShineBright)"
              strokeWidth="4"
            />
            {/* Dark Mahogany Shield Chamber */}
            <polygon
              points="50,18 76,30 72,66 50,86 28,66 24,30"
              fill="#451a03"
              stroke="#a16207"
              strokeWidth="2"
            />
            {/* PUBG Iconic Level 3 Spetsnaz Helmet */}
            <path
              d="M34 38 C34 24, 66 24, 66 38 L68 54 C68 62, 32 62, 32 54 Z"
              fill="url(#goldEagleGrad)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            {/* Luminescent Blue Visor Slit */}
            <rect x="38" y="42" width="24" height="6.5" rx="2.5" fill="#0f172a" />
            <line x1="40" y1="45" x2="60" y2="45" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
            {/* Triple Brilliant Golden Stars at Base */}
            <polygon points="36,68 38,72 43,72 39,75 41,80 36,77 31,80 33,75 29,72 34,72" fill="#fde047" stroke="#713f12" strokeWidth="0.8" />
            <polygon points="50,65 52.5,70 58,70 53.5,74 55.5,80 50,76 44.5,80 46.5,74 42,70 47.5,70" fill="#ffffff" stroke="#713f12" strokeWidth="1" />
            <polygon points="64,68 66,72 71,72 67,75 69,80 64,77 59,80 61,75 57,72 62,72" fill="#fde047" stroke="#713f12" strokeWidth="0.8" />
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
              <linearGradient id="platIceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ecfeff" />
                <stop offset="25%" stopColor="#67e8f9" />
                <stop offset="60%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
              <linearGradient id="platPureWhite" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#a5f3fc" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            {/* Quad Sharp Crystal Wings */}
            <polygon points="8,26 34,14 26,42 6,52" fill="url(#platIceGrad)" stroke="#164e63" strokeWidth="1.2" />
            <polygon points="92,26 66,14 74,42 94,52" fill="url(#platIceGrad)" stroke="#164e63" strokeWidth="1.2" />
            <polygon points="12,50 36,40 28,68 8,62" fill="url(#platPureWhite)" stroke="#0e7490" strokeWidth="1" />
            <polygon points="88,50 64,40 72,68 92,62" fill="url(#platPureWhite)" stroke="#0e7490" strokeWidth="1" />
            {/* Faceted Main Platinum Shield */}
            <polygon
              points="50,8 88,24 80,74 50,96 20,74 12,24"
              fill="url(#platIceGrad)"
              stroke="url(#platPureWhite)"
              strokeWidth="3.5"
            />
            {/* Deep Glacial Core Chamber */}
            <polygon
              points="50,18 76,30 70,68 50,86 30,68 24,30"
              fill="#083344"
              stroke="#22d3ee"
              strokeWidth="2"
            />
            {/* Central Multifaceted Ice Diamond */}
            <polygon points="50,26 70,48 50,76 30,48" fill="url(#platIceGrad)" />
            {/* Internal Crystal Cut Lines */}
            <line x1="50" y1="26" x2="50" y2="76" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="30" y1="48" x2="70" y2="48" stroke="#ffffff" strokeWidth="2" />
            <polygon points="50,26 60,48 50,56 40,48" fill="#ffffff" opacity="0.8" />
            {/* 4 Floating Platinum Stars */}
            <circle cx="34" cy="78" r="3.2" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.2" />
            <circle cx="44" cy="82" r="3.2" fill="#ffffff" stroke="#0891b2" strokeWidth="1.2" />
            <circle cx="56" cy="82" r="3.2" fill="#ffffff" stroke="#0891b2" strokeWidth="1.2" />
            <circle cx="66" cy="78" r="3.2" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.2" />
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
              <linearGradient id="diaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bfdbfe" />
                <stop offset="30%" stopColor="#60a5fa" />
                <stop offset="65%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="diaChromeWing" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            {/* Razor Swept-Back Aerodynamic Titanium Blade Wings */}
            <path
              d="M4 32 L34 14 L26 36 L44 26 L34 54 L10 64 Z"
              fill="url(#diaChromeWing)"
              stroke="#1e3a8a"
              strokeWidth="1.5"
            />
            <path
              d="M96 32 L66 14 L74 36 L56 26 L66 54 L90 64 Z"
              fill="url(#diaChromeWing)"
              stroke="#1e3a8a"
              strokeWidth="1.5"
            />
            {/* Outer Sapphire Shield */}
            <polygon
              points="50,6 90,24 82,76 50,98 18,76 10,24"
              fill="url(#diaBlueGrad)"
              stroke="#ffffff"
              strokeWidth="3.8"
            />
            {/* Midnight Blue Obsidian Core */}
            <polygon
              points="50,16 78,30 72,70 50,88 28,70 22,30"
              fill="#0f172a"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            {/* 3D Radiant Cut Brilliant Diamond Centerpiece */}
            <polygon points="50,22 74,42 50,76 26,42" fill="url(#diaBlueGrad)" />
            {/* Multi-Angle Facets */}
            <polygon points="50,22 62,36 50,44 38,36" fill="#ffffff" opacity="0.95" />
            <polygon points="50,44 74,42 50,76" fill="#1d4ed8" opacity="0.85" />
            <polygon points="50,44 26,42 50,76" fill="#60a5fa" opacity="0.9" />
            <line x1="50" y1="22" x2="50" y2="76" stroke="#ffffff" strokeWidth="2.5" />
            {/* Diamond Apex 8-point Burst */}
            <polygon points="50,2 53,10 61,10 54,15 57,22 50,17 43,22 46,15 39,10 47,10" fill="#ffffff" stroke="#3b82f6" strokeWidth="1" />
            {/* Light Sparkles */}
            <circle cx="34" cy="30" r="1.8" fill="#ffffff" />
            <circle cx="66" cy="30" r="1.8" fill="#ffffff" />
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
              <linearGradient id="crownGoldLustre" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="royalVelvetRed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="60%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
            </defs>
            {/* Lush Golden Imperial Laurel Wreath */}
            <path
              d="M10 56 C8 30, 24 12, 42 12 M90 56 C92 30, 76 12, 58 12"
              stroke="url(#crownGoldLustre)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="5 6"
            />
            {/* Royal Velvet Shield */}
            <polygon
              points="50,12 86,26 80,76 50,96 20,76 14,26"
              fill="url(#royalVelvetRed)"
              stroke="url(#crownGoldLustre)"
              strokeWidth="4"
            />
            {/* Inner Gold Filigree Trim */}
            <polygon
              points="50,20 78,32 72,70 50,86 28,70 22,32"
              fill="#450a0a"
              stroke="#facc15"
              strokeWidth="2"
            />
            {/* Ornate Imperial Golden Crown */}
            <path
              d="M24 58 L28 34 L38 46 L50 24 L62 46 L72 34 L76 58 Z"
              fill="url(#crownGoldLustre)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            {/* Crown Base Velvet Band */}
            <rect x="22" y="58" width="56" height="10" rx="3.5" fill="#78350f" stroke="#fef08a" strokeWidth="2" />
            {/* Crown Jewels (Gleaming Rubies & Emeralds) */}
            <circle cx="28" cy="34" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="50" cy="24" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.8" />
            <circle cx="72" cy="34" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="34" cy="63" r="2.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="50" cy="63" r="3.2" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
            <circle cx="66" cy="63" r="2.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
            {/* Imperial Royal Star at Base */}
            <polygon points="50,74 52.5,79 58,79 53.5,83 55.5,89 50,85 44.5,89 46.5,83 42,79 47.5,79" fill="#fde047" stroke="#b45309" strokeWidth="1" />
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
              <linearGradient id="aceFlameRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <linearGradient id="aceGoldTrim" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            {/* Crossed High-Caliber Sniper Rifles */}
            <path
              d="M8 18 L92 88 M92 18 L8 88"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M8 18 L92 88 M92 18 L8 88"
              stroke="#facc15"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Muzzle flash / silencers */}
            <circle cx="8" cy="18" r="3.5" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
            <circle cx="92" cy="18" r="3.5" fill="#ef4444" stroke="#fef08a" strokeWidth="1" />
            {/* Ace Flaming Battle Wings */}
            <path
              d="M4 42 C10 18, 30 14, 44 22 L38 38 C28 32, 14 36, 10 56 Z"
              fill="url(#aceFlameRed)"
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            <path
              d="M96 42 C90 18, 70 14, 56 22 L62 38 C72 32, 86 36, 90 56 Z"
              fill="url(#aceFlameRed)"
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            {/* Heavy Armored Body */}
            <polygon
              points="50,10 88,24 82,76 50,96 18,76 12,24"
              fill="url(#aceFlameRed)"
              stroke="url(#aceGoldTrim)"
              strokeWidth="4"
            />
            {/* Tactical Black-Ops Chamber */}
            <polygon
              points="50,18 78,30 72,70 50,86 28,70 22,30"
              fill="#09090b"
              stroke="#ef4444"
              strokeWidth="2"
            />
            {/* Iconic Level 3 Spetsnaz Helmet */}
            <path
              d="M34 36 C34 22, 66 22, 66 36 L68 54 C68 62, 32 62, 32 54 Z"
              fill="#27272a"
              stroke="#facc15"
              strokeWidth="2.2"
            />
            {/* Glowing Laser-Red Tactical Visor */}
            <rect x="38" y="40" width="24" height="6.5" rx="2" fill="#7f1d1d" />
            <line x1="39" y1="43" x2="61" y2="43" stroke="#ff0033" strokeWidth="2.8" strokeLinecap="round" />
            {/* Ace Star Ribbon */}
            <polygon points="50,66 53.5,73 61,73 55,78 57.5,86 50,81 42.5,86 45,78 39,73 46.5,73" fill="#ffffff" stroke="#dc2626" strokeWidth="1.5" />
            {/* Top Ace Flame Spike */}
            <polygon points="50,2 56,12 44,12" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        );

      case 'CONQUEROR':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_0_20px_rgba(239,68,68,0.85)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="conqCorona" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#f97316" />
                <stop offset="85%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
              <linearGradient id="conqMasterGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
            </defs>
            {/* Blazing Solar Corona Flame Ring */}
            <circle cx="50" cy="50" r="44" stroke="url(#conqCorona)" strokeWidth="3" strokeDasharray="8 5" opacity="0.9" />
            <circle cx="50" cy="50" r="40" stroke="#fde047" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.8" />
            {/* Celestial Phoenix Flame Wings */}
            <path
              d="M2 38 C12 12, 34 8, 48 18 L42 34 C30 28, 14 32, 8 54 Z"
              fill="url(#conqCorona)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            <path
              d="M98 38 C88 12, 66 8, 52 18 L58 34 C70 28, 86 32, 92 54 Z"
              fill="url(#conqCorona)"
              stroke="#fef08a"
              strokeWidth="2"
            />
            {/* Secondary Golden Dragon Wings */}
            <path
              d="M10 54 C16 38, 34 34, 46 40 L42 52 C32 48, 20 52, 16 66 Z"
              fill="url(#conqMasterGold)"
              stroke="#713f12"
              strokeWidth="1.5"
            />
            <path
              d="M90 54 C84 38, 66 34, 54 40 L58 52 C68 48, 80 52, 84 66 Z"
              fill="url(#conqMasterGold)"
              stroke="#713f12"
              strokeWidth="1.5"
            />
            {/* Master Crossed Blades behind */}
            <path d="M14 20 L86 86 M86 20 L14 86" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="20" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <circle cx="86" cy="20" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            {/* Main Blazing Conqueror Shield */}
            <polygon
              points="50,8 90,22 84,78 50,98 16,78 10,22"
              fill="url(#conqCorona)"
              stroke="url(#conqMasterGold)"
              strokeWidth="4.5"
            />
            {/* Obsidian Dragon Heart Chamber */}
            <polygon
              points="50,16 80,28 74,72 50,88 26,72 20,28"
              fill="#18181b"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            {/* Golden Level 3 Helmet of Supreme Supremacy */}
            <path
              d="M34 34 C34 18, 66 18, 66 34 L68 54 C68 62, 32 62, 32 54 Z"
              fill="url(#conqMasterGold)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
            {/* Ruby Blazing Laser Visor */}
            <rect x="38" y="38" width="24" height="7" rx="2.5" fill="#450a0a" />
            <line x1="39" y1="41.5" x2="61" y2="41.5" stroke="#ff0055" strokeWidth="3" strokeLinecap="round" />
            {/* Master Radiant Crown Star */}
            <polygon
              points="50,66 54,74 63,74 56,80 59,88 50,83 41,88 44,80 37,74 46,74"
              fill="#ffffff"
              stroke="#facc15"
              strokeWidth="2"
            />
            {/* Supreme Apex Diamond Crystal */}
            <polygon points="50,0 56,10 50,14 44,10" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
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
