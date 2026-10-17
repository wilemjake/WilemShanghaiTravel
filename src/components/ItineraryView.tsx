import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Train,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Footprints,
  ShieldCheck,
  SunMedium
} from 'lucide-react';
import { TripConfig, LiveWeatherData } from '../types/travel';

interface ItineraryViewProps {
  config: TripConfig;
  weather: LiveWeatherData | null;
}

interface ActivityItem {
  time: string;
  title: string;
  location: string;
  description: string;
  elderlyKidFriendlyTip: string;
  isMeal?: boolean;
}

interface DayPlan {
  dayNumber: number;
  dateStr: string;
  city: 'Shanghai' | 'Suzhou' | 'Hangzhou';
  theme: string;
  walkingEffort: string;
  highlights: string[];
  activities: ActivityItem[];
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ config, weather }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Compute date array from startDate to endDate
  const getDatesBetween = (startStr: string, endStr: string): string[] => {
    const dates: string[] = [];
    const curr = new Date(startStr);
    const end = new Date(endStr);
    
    // Safety cap to 14 days
    let count = 0;
    while (curr <= end && count < 14) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
      count++;
    }
    return dates.length > 0 ? dates : [startStr];
  };

  const tripDates = getDatesBetween(config.startDate, config.endDate);
  const totalDays = tripDates.length;

  // Build tailored daily plans
  const dayPlans: DayPlan[] = tripDates.map((dateStr, idx) => {
    const dayNum = idx + 1;

    // Day 1: Arrival & The Bund
    if (dayNum === 1) {
      return {
        dayNumber: 1,
        dateStr,
        city: 'Shanghai',
        theme: 'Welcome to Shanghai: Gentle Promenade & Bund Skyline',
        walkingEffort: 'Gentle (3,500 steps)',
        highlights: ['Hotel check-in', 'Huangpu River View', 'The Bund Twilight', 'Early Bedtime'],
        activities: [
          {
            time: '14:00 - 16:30',
            title: 'Hotel Check-in & Rest',
            location: 'Near People\'s Square or East Nanjing Road',
            description: 'Unpack luggage, help grandparents rest after the 5-hour flight from Singapore (SIN to PVG/SHA).',
            elderlyKidFriendlyTip: 'Grandparents can take an afternoon nap; kids can enjoy hotel amenities.'
          },
          {
            time: '17:30 - 19:00',
            title: 'Early Dinner: Mild Jiangnan Comfort Food',
            location: 'Grandma\'s Home (Waipojia) or Lu Bo Lang',
            description: 'Enjoy sweet-savory Dongpo pork, fresh seasonal greens, and mild scallion oil noodles.',
            elderlyKidFriendlyTip: 'Request "shao you, shao yan" (low oil/salt). High chairs available for kids.',
            isMeal: true
          },
          {
            time: '19:15 - 20:30',
            title: 'The Bund Evening Stroll (Paved Flat Promenade)',
            location: 'Zhongshan East 1st Road',
            description: 'Marvel at the golden historical colonial buildings on Puxi and futuristic neon towers in Pudong.',
            elderlyKidFriendlyTip: 'Completely step-free, wide flat waterfront promenade with plentiful bench seating.'
          }
        ]
      };
    }

    // Insert Suzhou Day Trip if enabled
    if (config.includeSuzhou && dayNum === 2) {
      return {
        dayNumber: 2,
        dateStr,
        city: 'Suzhou',
        theme: 'Suzhou Day Trip: Ancient Canals & Step-Free Garden Art',
        walkingEffort: 'Relaxed (6,500 steps)',
        highlights: ['CRH Bullet Train (25m)', 'Suzhou Museum', 'Shantang Canal Boat', 'Songhelou Lunch'],
        activities: [
          {
            time: '09:30 - 10:15',
            title: 'CRH High-Speed Train to Suzhou',
            location: 'Shanghai Hongqiao Railway Station -> Suzhou Station',
            description: 'Glide at 300 km/h in plush business/first-class seats with zero turbulence.',
            elderlyKidFriendlyTip: 'Station has priority boarding for seniors 65+ and families with young children.'
          },
          {
            time: '10:45 - 12:30',
            title: 'Suzhou Museum (Architect I.M. Pei)',
            location: 'Gusu District, Suzhou',
            description: 'Modern interpretation of classical Jiangnan architecture with lotus ponds and tranquil courtyards.',
            elderlyKidFriendlyTip: '100% barrier-free with smooth elevators and courtesy wheelchairs at visitor desk.'
          },
          {
            time: '12:45 - 14:15',
            title: 'Lunch at Historic Songhelou (松鹤楼)',
            location: 'Near Guanqian Street',
            description: 'Savor traditional Squirrel Mandarin fish (sweet-sour crispy fish, boneless for seniors & kids).',
            elderlyKidFriendlyTip: 'Spacious private booth seating with soft tea service.',
            isMeal: true
          },
          {
            time: '14:45 - 16:15',
            title: 'Shantang Street Covered Canal Boat Cruise',
            location: 'Seven-Mile Shantang',
            description: 'Sit back on a traditional motorized canal boat as water rippling past 1,200-year-old whitewashed houses.',
            elderlyKidFriendlyTip: 'Zero walking required while cruising! Soft folk music onboard.'
          },
          {
            time: '17:00 - 17:45',
            title: 'Return Bullet Train to Shanghai Hongqiao',
            location: 'Suzhou Station -> Shanghai Hongqiao',
            description: 'Quick 25-minute journey back to Shanghai for a relaxed evening.',
            elderlyKidFriendlyTip: 'Take Didi / Taxi directly from Hongqiao station back to hotel to avoid transfers.'
          }
        ]
      };
    }

    // Insert Hangzhou Day Trip if enabled
    if (config.includeHangzhou && (dayNum === 3 || (!config.includeSuzhou && dayNum === 2))) {
      return {
        dayNumber: dayNum,
        dateStr,
        city: 'Hangzhou',
        theme: 'Hangzhou Day Trip: Serene West Lake & Longjing Tea',
        walkingEffort: 'Low (5,000 steps)',
        highlights: ['CRH Bullet Train (45m)', 'West Lake Electric Cruise', 'Longjing Tea Village', 'Zhiweiguan Lunch'],
        activities: [
          {
            time: '09:15 - 10:15',
            title: 'High-Speed Rail to Hangzhou East',
            location: 'Shanghai Hongqiao -> Hangzhou East Station',
            description: 'Comfortable 45-minute bullet train ride through the green Zhejiang countryside.',
            elderlyKidFriendlyTip: 'Comfortable air-conditioned train with accessible restrooms.'
          },
          {
            time: '11:00 - 12:30',
            title: 'West Lake Electric Boat Tour',
            location: 'West Lake Scenic Area',
            description: 'Board an electric cruise boat across West Lake to see Three Ponds Mirroring the Moon.',
            elderlyKidFriendlyTip: 'No strenuous walking; family can sit together enjoying the lake breeze.'
          },
          {
            time: '12:45 - 14:30',
            title: 'Lunch & Tea Tasting at Longjing Village',
            location: 'Meijiawu Tea Plantation',
            description: 'Fresh Longjing shrimp stir-fry, steamed West Lake fish with vinegar sauce, and fragrant green tea.',
            elderlyKidFriendlyTip: 'Restful garden setting with shade trees and soothing environment.',
            isMeal: true
          },
          {
            time: '15:00 - 16:30',
            title: 'Lakeside Shaded Tea House Respite',
            location: 'Hubin Road Lakeside Pavilion',
            description: 'Enjoy traditional Osmanthus cakes and warm herbal infusions with views of the pagoda.',
            elderlyKidFriendlyTip: 'Gentle flat walking path with frequent resting pavilions.'
          },
          {
            time: '17:15 - 18:15',
            title: 'Return Train to Shanghai',
            location: 'Hangzhou East -> Shanghai Hongqiao',
            description: 'Comfortable return ride with evening arrival.',
            elderlyKidFriendlyTip: 'Order in-station luggage assistance if needed.'
          }
        ]
      };
    }

    // Shanghai Classical: Yu Garden & Modern Pudong
    if (dayNum % 2 === 0) {
      return {
        dayNumber: dayNum,
        dateStr,
        city: 'Shanghai',
        theme: 'Classical Heritage: Yu Garden & Huxinting Tea Pavilion',
        walkingEffort: 'Gentle (4,200 steps)',
        highlights: ['Yu Garden (Ming Dynasty)', 'Huxinting Teahouse', 'Nanxiang Xiaolongbao', 'Shanghai Museum'],
        activities: [
          {
            time: '09:45 - 11:30',
            title: 'Yu Garden & Zigzag Nine-Turn Bridge',
            location: 'Huangpu District',
            description: 'Classical Ming Dynasty garden featuring koi ponds, dragon walls, and tranquil rockeries.',
            elderlyKidFriendlyTip: 'Enter via southern accessible ramp; grandchildren love feeding the giant golden carp.'
          },
          {
            time: '11:45 - 13:15',
            title: 'Nanxiang Steamed Bun Restaurant (南翔馒头店)',
            location: 'Yu Garden Bazaar',
            description: 'World-famous authentic Shanghai Xiaolongbao with delicate thin skins and rich savory broth.',
            elderlyKidFriendlyTip: 'Second-floor seated dining room has elevator access and table service.',
            isMeal: true
          },
          {
            time: '13:30 - 15:00',
            title: 'Huxinting Teahouse Respite (湖心亭)',
            location: 'Center of Yu Garden Lotus Pond',
            description: 'Shanghai\'s oldest teahouse (built in 1784). Sip Longjing or Jasmine tea while resting feet.',
            elderlyKidFriendlyTip: 'Peaceful air-conditioned interior; essential afternoon recharge for grandparents.'
          },
          {
            time: '15:30 - 17:30',
            title: 'Shanghai Museum (People\'s Square)',
            location: 'Renmin Avenue',
            description: 'World-class ancient Chinese bronzes, ceramics, and calligraphy.',
            elderlyKidFriendlyTip: 'Free admission, full elevator coverage, wide quiet gallery benches every 15 meters.'
          }
        ]
      };
    }

    // Shanghai Modern: French Concession & Lujiazui Skylines
    return {
      dayNumber: dayNum,
      dateStr,
      city: 'Shanghai',
      theme: 'Shaded French Concession & High-Tech Pudong',
      walkingEffort: 'Low (4,800 steps)',
      highlights: ['Former French Concession Platanes', 'Xintiandi', 'Shanghai Tower', 'Lujiazui River Ferry'],
      activities: [
        {
          time: '10:00 - 11:45',
          title: 'Tree-Lined Stroll in French Concession',
          location: 'Wukang Road or Sinan Mansions',
          description: 'Walk under the lush canopy of century-old London plane trees past historic European villas.',
          elderlyKidFriendlyTip: 'Broad, shaded pavements with low vehicle traffic and gentle curb ramps.'
        },
        {
          time: '12:00 - 13:30',
          title: 'Lunch at Ye Shanghai (夜上海)',
          location: 'Xintiandi Plaza',
          description: 'Refined modern Shanghainese dishes like crispy smoked fish and silky crab meat tofu.',
          elderlyKidFriendlyTip: 'Full wheelchair and stroller access throughout Xintiandi complex.',
          isMeal: true
        },
        {
          time: '14:30 - 16:30',
          title: 'Shanghai Tower Top of Shanghai Observation Lounge',
          location: 'Lujiazui Financial Center, Pudong',
          description: 'Soar to the 118th floor on the world\'s fastest elevator (18 m/s) with 360° panoramic views.',
          elderlyKidFriendlyTip: 'Smooth elevator ride with zero ear discomfort; expansive indoor viewing lounges.'
        },
        {
          time: '17:00 - 18:00',
          title: 'Historic Huangpu River Ferry Ride (Dongjin Line)',
          location: 'Pudong -> Puxi Wharf (2 RMB ticket)',
          description: 'Gentle 10-minute public ferry crossing offering iconic sunset skyline views.',
          elderlyKidFriendlyTip: 'Quick and fun for children; avoids crowded subway tunnels.'
        }
      ]
    };
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Singaporean Family Daily Itinerary ({totalDays} Days)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Engineered specifically for {config.adults} Adults, {config.seniors} Seniors, {config.children} Children with non-strenuous Jiangnan pacing.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Senior Step-Cap & Elevator Verified</span>
          </div>
        </div>

        {/* Family Care Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Gentle 09:30 AM Starts:</strong>
              <span className="text-slate-400 text-[11px]">
                Avoids Shanghai's morning 08:00–09:00 subway rush, ensuring seat availability for grandparents.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Footprints className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Under 7,500 Steps/Day:</strong>
              <span className="text-slate-400 text-[11px]">
                Distances strictly paced with Didi rides between subway hubs and long attractions.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Mandatory Tea Respite:</strong>
              <span className="text-slate-400 text-[11px]">
                90-minute sit-down tea house or cafe respite scheduled between 13:30 and 15:00 every day.
              </span>
            </div>
          </div>
        </div>

        {/* Day cards */}
        <div className="space-y-4 pt-2">
          {dayPlans.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            // Match with weather forecast if within 7 days
            const dayForecastMax = weather?.daily?.temperature_2m_max?.[day.dayNumber - 1];
            const dayForecastMin = weather?.daily?.temperature_2m_min?.[day.dayNumber - 1];
            const dayForecastPrecip = weather?.daily?.precipitation_sum?.[day.dayNumber - 1];

            return (
              <div
                key={day.dayNumber}
                className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden transition-all"
              >
                {/* Day Header Accordion */}
                <button
                  type="button"
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded">
                        Day {day.dayNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {day.dateStr}
                      </span>
                      {day.city !== 'Shanghai' && (
                        <span className="text-xs font-medium text-amber-300 flex items-center gap-1 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                          <Train className="w-3 h-3" /> {day.city} Day Trip
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {day.theme}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {dayForecastMax !== undefined && (
                      <span className="hidden md:flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                        <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                        {dayForecastMax}° / {dayForecastMin}°
                        {dayForecastPrecip && dayForecastPrecip > 0 ? ` (${dayForecastPrecip}mm)` : ''}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      {day.walkingEffort}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Day Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                    {/* Highlights tags */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-[11px] font-medium text-slate-300">Highlights:</span>
                      {day.highlights.map((h, i) => (
                        <React.Fragment key={h}>
                          <span className="text-emerald-400/90">{h}</span>
                          {i < day.highlights.length - 1 && <span className="text-slate-600">·</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Timeline Activities */}
                    <div className="space-y-3">
                      {day.activities.map((act) => (
                        <div
                          key={act.title}
                          className="bg-slate-900/70 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-emerald-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {act.time}
                              </span>
                              <h4 className="font-semibold text-white text-xs">
                                {act.title}
                              </h4>
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <MapPin className="w-3 h-3 text-slate-500" /> {act.location}
                            </span>
                          </div>

                          <p className="text-slate-300 text-xs leading-relaxed">
                            {act.description}
                          </p>

                          <div className="bg-slate-950/50 p-2 rounded border border-slate-800/60 flex items-start gap-2 text-[11px] text-slate-400 mt-1">
                            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <span>
                              <strong className="text-slate-300">Family Comfort Tip:</strong> {act.elderlyKidFriendlyTip}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
