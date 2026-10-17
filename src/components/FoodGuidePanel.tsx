import React, { useState } from 'react';
import {
  Utensils,
  Award,
  Search,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Heart,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { NominatimPlace, MichelinRestaurant } from '../types/travel';

interface FoodGuidePanelProps {
  foodData: {
    loading: boolean;
    data: NominatimPlace[] | null;
    error: string | null;
  };
  onSearchFood: (query: string) => void;
}

// Authentic Michelin Guide Shanghai Selection (2025/2026 Guide)
const MICHELIN_RESTAURANTS: MichelinRestaurant[] = [
  {
    id: 'wu-you-xian',
    nameEn: 'Wu You Xian',
    nameCn: '屋有鲜',
    distinction: '1-Star',
    cuisine: 'Dim Sum & Xiaolongbao (Soup Dumplings)',
    district: 'Pudong / Nanxiang Heritage',
    address: 'Near Nanxiang Old Street & Century Avenue area',
    priceLevel: '¥¥',
    specialties: ['Pure Crab Roe Xiaolongbao', 'Hairy Crab Meat Dumplings', 'Crab Paste Soup'],
    familySeniorTip: 'First dim sum restaurant in Shanghai to earn a Michelin Star! Extremely tender thin skins with pure sweet crab broth, easily digestible for grandparents and young kids.',
    reservationNeeded: true
  },
  {
    id: 'fu-he-hui',
    nameEn: 'Fu He Hui',
    nameCn: '福和慧',
    distinction: '2-Star',
    cuisine: 'Refined Vegetarian Fine Dining',
    district: 'Changning (Yuyuan Road)',
    address: 'No. 1037 Yuyuan Road, Changning District',
    priceLevel: '¥¥¥¥',
    specialties: ['Smoked Matsutake Mushroom Broth', 'Taro Lotus Cake', 'Braised Wild Morel with Truffle'],
    familySeniorTip: 'Tranquil Zen villa setting with private dining suites. 100% plant-based, light sodium, zero grease—the ultimate soothing health banquet for seniors.',
    reservationNeeded: true
  },
  {
    id: 'canton-8',
    nameEn: 'Canton 8 (Runan Street)',
    nameCn: '喜粤8号',
    distinction: '2-Star',
    cuisine: 'Traditional Cantonese & Dim Sum',
    district: 'Huangpu',
    address: 'No. 63 Runan Street, Huangpu District',
    priceLevel: '¥¥',
    specialties: ['Crispy Roast Pork Belly', 'Barbecued Char Siu', 'Steamed Shrimp Har Gow', 'Baked Egg Tarts'],
    familySeniorTip: 'Famed as the most value-friendly 2-Star Michelin in the world. Gentle Cantonese roasting and delicate steamed dim sum that both children and grandparents adore.',
    reservationNeeded: true
  },
  {
    id: 'imperial-treasure',
    nameEn: 'Imperial Treasure Fine Chinese Cuisine',
    nameCn: '御宝轩',
    distinction: '2-Star',
    cuisine: 'Elite Cantonese & Roasted Meats',
    district: 'Huangpu (Yi Feng Galleria near The Bund)',
    address: '4F Yi Feng Galleria, No. 99 East Beijing Road',
    priceLevel: '¥¥¥',
    specialties: ['Imperial Roast Duck', 'Crispy Golden Tofu', 'Steamed Marble Goby', 'Almond Walnut Cream'],
    familySeniorTip: 'Beloved Singapore-heritage restaurant with 2 Michelin stars on The Bund! Full elevator access, elegant booth seating, impeccable high-end service.',
    reservationNeeded: true
  },
  {
    id: 'da-hu-chun',
    nameEn: 'Da Hu Chun (Sichuan Middle Road)',
    nameCn: '大壶春',
    distinction: 'Bib Gourmand',
    cuisine: 'Traditional Shanghai Pan-Fried Buns (Shengjianbao)',
    district: 'Huangpu (Near The Bund)',
    address: 'No. 136 Sichuan Middle Road, Huangpu District',
    priceLevel: '¥',
    specialties: ['Classic Pork Shengjianbao', 'Prawn Pan-Fried Buns', 'Curried Beef Vermicelli Soup'],
    familySeniorTip: 'Iconic heritage brand founded in 1932. Uses semi-fermented dough without soup explosion hazard, making it safer and cleaner for kids and seniors to eat.',
    reservationNeeded: false
  },
  {
    id: 'cheng-long-hang',
    nameEn: 'Cheng Long Hang Crab King',
    nameCn: '成隆行蟹王府',
    distinction: '1-Star',
    cuisine: 'Classic Shanghai Hairy Crab Feasts',
    district: 'Huangpu (Near East Nanjing Road / Bund)',
    address: 'No. 216 Jiujiang Road, Huangpu District',
    priceLevel: '¥¥¥',
    specialties: ['Hand-Peeled Whole Hairy Crab', 'Crab Tofu Casserole', 'Crab Roe Noodles'],
    familySeniorTip: 'Servers meticulously de-shell the fresh crabs tableside into delicate bite-sized morsels so grandparents do not need to struggle with shells or crab crackers.',
    reservationNeeded: true
  },
  {
    id: 'old-jesse',
    nameEn: 'Old Jesse',
    nameCn: '老吉士',
    distinction: 'Selected',
    cuisine: 'Authentic Shanghai Home-Style (Benbang)',
    district: 'Xuhui (French Concession)',
    address: 'No. 41 Tianping Road, Xuhui District',
    priceLevel: '¥¥',
    specialties: ['Scallion-Oil Cod Head (Congyou Yutou)', 'Red-Braised Pork (Hongshao Rou)', 'River Shrimp'],
    familySeniorTip: 'Legendary Shanghai comfort food. Flavors are subtly sweet and comforting, ideal with bowls of fragrant steamed white rice.',
    reservationNeeded: true
  },
  {
    id: 'yi-long-court',
    nameEn: 'Yi Long Court',
    nameCn: '逸龙阁',
    distinction: '1-Star',
    cuisine: 'High-End Cantonese & Dim Sum',
    district: 'The Peninsula Shanghai (The Bund)',
    address: '2F The Peninsula, No. 32 Zhongshan East 1st Road',
    priceLevel: '¥¥¥¥',
    specialties: ['Steamed Crab Claw with Egg White', 'Bird\'s Nest Dumplings', 'Abalone Pastry'],
    familySeniorTip: 'Direct elevator access inside The Peninsula hotel. Five-star barrier-free bathrooms and peaceful, private dining away from street noise.',
    reservationNeeded: true
  },
  {
    id: 'nanxiang-steamed-bun',
    nameEn: 'Nanxiang Steamed Bun Restaurant',
    nameCn: '南翔馒头店',
    distinction: 'Selected',
    cuisine: 'Authentic Traditional Xiaolongbao',
    district: 'Huangpu (Yu Garden Bazaar)',
    address: 'No. 87 Yuyuan Old Street (Inside Yu Garden Bazaar)',
    priceLevel: '¥¥',
    specialties: ['Traditional Pork Xiaolongbao', 'Crab Meat Steamed Buns', 'Straw-Sipped Giant Crab Bun'],
    familySeniorTip: 'Located right next to the Zigzag Bridge. Choose the 2nd or 3rd floor seated dining area (with elevator) to avoid the long ground-floor queue.',
    reservationNeeded: false
  },
  {
    id: 'taian-table',
    nameEn: 'Taian Table',
    nameCn: '泰安门',
    distinction: '3-Star',
    cuisine: 'Innovative Western & Seasonal Chinese Terroir',
    district: 'Changning District',
    address: 'No. 161 Lane 465 Zhenning Road',
    priceLevel: '¥¥¥¥',
    specialties: ['Multi-Course Tasting Menu', 'Seasonal River Fish', 'Wagyu Beef Casserole'],
    familySeniorTip: 'Shanghai\'s celebrated 3-Star Michelin venue. Counter and table seating with world-class open kitchen theater. Best reserved 1 month in advance.',
    reservationNeeded: true
  }
];

export const FoodGuidePanel: React.FC<FoodGuidePanelProps> = ({ foodData, onSearchFood }) => {
  const [activeSubTab, setActiveSubTab] = useState<'michelin' | 'nominatim'>('michelin');
  const [michelinFilter, setMichelinFilter] = useState<string>('all');
  const [michelinSearch, setMichelinSearch] = useState<string>('');
  const [nominatimSearchInput, setNominatimSearchInput] = useState<string>('');

  const filteredMichelin = MICHELIN_RESTAURANTS.filter((r) => {
    const matchesFilter =
      michelinFilter === 'all' ||
      (michelinFilter === '3-Star' && r.distinction === '3-Star') ||
      (michelinFilter === '2-Star' && r.distinction === '2-Star') ||
      (michelinFilter === '1-Star' && r.distinction === '1-Star') ||
      (michelinFilter === 'Bib Gourmand' && r.distinction === 'Bib Gourmand') ||
      (michelinFilter === 'Dim Sum' && r.cuisine.includes('Dim Sum'));

    const searchLower = michelinSearch.toLowerCase();
    const matchesSearch =
      !michelinSearch ||
      r.nameEn.toLowerCase().includes(searchLower) ||
      r.nameCn.includes(michelinSearch) ||
      r.district.toLowerCase().includes(searchLower) ||
      r.specialties.some((s) => s.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  const handleNominatimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nominatimSearchInput.trim()) {
      onSearchFood(nominatimSearchInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Shanghai Food Guides & Michelin Selection
              </h3>
              <p className="text-xs text-slate-400">
                Official online Michelin Guide Shanghai honorees + Live OpenStreetMap Nominatim search.
              </p>
            </div>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('michelin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'michelin'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Michelin Guide Shanghai</span>
            </button>
            <button
              onClick={() => setActiveSubTab('nominatim')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'nominatim'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Nominatim Live Search</span>
            </button>
          </div>
        </div>

        {/* Singapore Family Dining Advice */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Singaporean Family Guide: Gentle Jiangnan & Cantonese Dining</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Shanghai Michelin dining offers the world's highest concentration of non-spicy, gentle braised, and steamed delicacies—perfect for elderly digestion and children who love soup dumplings!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
            <div>
              <strong className="text-emerald-400 block mb-0.5">Crab Dumplings & Dim Sum:</strong>
              Try Wu You Xian (1-star dim sum) or Da Hu Chun for pan-fried shengjianbao without piping soup burns.
            </div>
            <div>
              <strong className="text-emerald-400 block mb-0.5">Vegetarian & Light Broths:</strong>
              Fu He Hui (2-star) offers pure Zen courses with no MSG and low sodium for grandparents.
            </div>
            <div>
              <strong className="text-emerald-400 block mb-0.5">Reservations & Payments:</strong>
              Star-rated venues book 1–2 weeks ahead via Dianping or WeChat. Alipay / Singapore credit cards work seamlessly.
            </div>
          </div>
        </div>

        {/* VIEW 1: Michelin Guide Shanghai Selection */}
        {activeSubTab === 'michelin' && (
          <div className="space-y-4">
            {/* Filter buttons & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'All Michelin', val: 'all' },
                  { label: '3-Star (★★★)', val: '3-Star' },
                  { label: '2-Star (★★)', val: '2-Star' },
                  { label: '1-Star (★)', val: '1-Star' },
                  { label: 'Bib Gourmand (Good Value)', val: 'Bib Gourmand' },
                  { label: 'Dim Sum & Xiaolongbao', val: 'Dim Sum' }
                ].map((f) => (
                  <button
                    key={f.val}
                    onClick={() => setMichelinFilter(f.val)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      michelinFilter === f.val
                        ? 'bg-rose-950/80 border-rose-600 text-rose-200 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={michelinSearch}
                  onChange={(e) => setMichelinSearch(e.target.value)}
                  placeholder="Filter Michelin restaurants..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Restaurant Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMichelin.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">
                          {restaurant.nameEn}
                        </h4>
                        <span className="text-xs text-slate-400 font-sans">
                          {restaurant.nameCn}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {restaurant.cuisine} · {restaurant.district}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          restaurant.distinction.includes('3-Star')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : restaurant.distinction.includes('2-Star')
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : restaurant.distinction.includes('1-Star')
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        {restaurant.distinction}
                      </span>
                      <span className="block text-[11px] font-mono text-slate-400 mt-0.5">
                        Price {restaurant.priceLevel}
                      </span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Signature Family Dishes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {restaurant.specialties.map((s) => (
                        <span
                          key={s}
                          className="bg-slate-900 px-2 py-0.5 rounded text-[11px] text-emerald-300 border border-slate-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Family & Senior tip */}
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-400">Senior & Kid Suitability: </strong>
                      {restaurant.familySeniorTip}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {restaurant.address}
                    </span>
                    <span className="text-slate-300">
                      {restaurant.reservationNeeded ? 'Reservation Recommended' : 'Walk-in Welcome'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Nominatim OpenStreetMap Search */}
        {activeSubTab === 'nominatim' && (
          <div className="space-y-4">
            {/* Search form */}
            <form onSubmit={handleNominatimSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={nominatimSearchInput}
                  onChange={(e) => setNominatimSearchInput(e.target.value)}
                  placeholder="Search custom eateries on OpenStreetMap (e.g. 'Jing'an restaurant', 'Nanjing Road tea house')..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={foodData.loading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                {foodData.loading ? 'Searching...' : 'Search Nominatim'}
              </button>
            </form>

            {/* Nominatim states */}
            {foodData.loading && (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                <span>Querying Nominatim OpenStreetMap for live food places...</span>
              </div>
            )}

            {!foodData.loading && foodData.error && (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-4 text-xs text-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Nominatim Food Guide Notice</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-800">
                  {foodData.error}
                </p>
              </div>
            )}

            {!foodData.loading && !foodData.error && foodData.data && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400">
                  Found <strong className="text-white font-mono">{foodData.data.length}</strong> live places from OpenStreetMap.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {foodData.data.map((place) => (
                    <div
                      key={place.place_id}
                      className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-slate-100 text-xs leading-snug">
                          {place.display_name.split(',')[0]}
                        </h4>
                        <span className="text-[10px] text-amber-400/90 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 uppercase">
                          {place.type || 'Eatery'}
                        </span>
                      </div>

                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                        {place.display_name}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          Lat {parseFloat(place.lat).toFixed(4)}, Lon {parseFloat(place.lon).toFixed(4)}
                        </span>
                        <a
                          href={`https://www.openstreetmap.org/${place.osm_type}/${place.osm_id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline"
                        >
                          View on OSM
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
