import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-semibold text-slate-200">
            WilemShanghaiTravel
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>
            Dedicated Shanghai itinerary planner for Singaporean families.
          </span>
        </div>

        {/* Sub-goal 6: The footer credits the data source: "METEO, Nominatim, Overpass" */}
        <div className="text-center md:text-right font-mono text-[11px] text-slate-400">
          <span>Data sources: </span>
          <strong className="text-slate-200 font-semibold">METEO, Nominatim, Overpass</strong>
        </div>
      </div>
    </footer>
  );
};
