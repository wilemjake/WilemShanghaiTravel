import React, { useState } from 'react';
import { Landmark, MapPin, RefreshCw, AlertTriangle, BookOpen, ExternalLink, ShieldCheck, Map } from 'lucide-react';
import { OverpassAttraction } from '../types/travel';

interface AttractionsMapPanelProps {
  attractions: {
    loading: boolean;
    data: OverpassAttraction[] | null;
    error: string | null;
  };
  chinaMap: {
    loading: boolean;
    data: any | null;
    error: string | null;
  };
  wikivoyage: {
    loading: boolean;
    data: any | null;
    error: string | null;
  };
  onRefreshAttractions: () => void;
  onRefreshChinaMap: () => void;
  onRefreshWikivoyage: () => void;
}

export const AttractionsMapPanel: React.FC<AttractionsMapPanelProps> = ({
  attractions,
  chinaMap,
  wikivoyage,
  onRefreshAttractions,
  onRefreshChinaMap,
  onRefreshWikivoyage
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  // Extract clean text from wikitext if available
  const getExcerpt = (wikitext: string) => {
    if (!wikitext) return '';
    // Strip wiki markup tags, templates {{...}}, [[...]]
    const clean = wikitext
      .replace(/\{\{[^}]+\}\}/g, '')
      .replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, '$1')
      .replace(/={2,}[^=]+={2,}/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/'''?/g, '')
      .trim();
    return clean.slice(0, 900) + '...';
  };

  const filteredAttractions = (attractions.data || []).filter((item) => {
    const name = item.tags?.name || item.tags?.['name:en'] || '';
    return name.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* 1. Attractions near Bund from Overpass */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Attractions Near The Bund (Within 3,000m)
              </h3>
              <p className="text-xs text-slate-400">
                Source: Overpass API (around: 3000m, Lat 31.2397, Lon 121.4903)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshAttractions}
              disabled={attractions.loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${attractions.loading ? 'animate-spin' : ''}`} />
              <span>{attractions.loading ? 'Querying Overpass...' : 'Refresh Bund Attractions'}</span>
            </button>
          </div>
        </div>

        {/* State handling: Loading */}
        {attractions.loading && (
          <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
            <span>Executing Overpass QL query for Bund attractions (may take 5–15 seconds)...</span>
          </div>
        )}

        {/* State handling: Sub-goal 4 - Empty, slow, or refused */}
        {!attractions.loading && attractions.error && (
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-4 text-xs text-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Attraction Data Unavailable (Slow, Empty, or Refused)</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-800">
              {attractions.error}
            </p>
            <p className="text-slate-400 text-[11px]">
              *Guardrail note: In accordance with project requirements, no placeholder attractions are fabricated when the Overpass provider fails or times out.
            </p>
          </div>
        )}

        {/* State handling: Success with live data */}
        {!attractions.loading && !attractions.error && attractions.data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Found <strong className="text-white font-mono">{attractions.data.length}</strong> live attraction points near The Bund.
              </span>
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter attractions by name..."
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredAttractions.map((item) => {
                const nameEn = item.tags?.['name:en'];
                const nameCn = item.tags?.name || 'Historic Attraction';
                const tourismType = item.tags?.tourism || 'Sight';
                const wheelchair = item.tags?.wheelchair;

                return (
                  <div
                    key={item.id}
                    className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-100 text-xs leading-snug">
                        {nameCn}
                      </h4>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0 font-mono">
                        {tourismType}
                      </span>
                    </div>

                    {nameEn && nameEn !== nameCn && (
                      <p className="text-[11px] text-emerald-400/90">{nameEn}</p>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                      <span>Lat {item.lat?.toFixed(4) || 'N/A'}, Lon {item.lon?.toFixed(4) || 'N/A'}</span>
                      {wheelchair === 'yes' && (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Step-free
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. China Map / Shanghai Geographic Viewer (Overpass QL + OSM) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                China Map & Transit Corridor (Shanghai, Suzhou, Hangzhou)
              </h3>
              <p className="text-xs text-slate-400">
                Source: OpenStreetMap & Overpass API (URL-encoded Overpass QL boundary query)
              </p>
            </div>
          </div>
          <button
            onClick={onRefreshChinaMap}
            disabled={chinaMap.loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${chinaMap.loading ? 'animate-spin' : ''}`} />
            <span>{chinaMap.loading ? 'Querying Overpass...' : 'Refresh Map Data'}</span>
          </button>
        </div>

        {chinaMap.error && (
          <div className="bg-amber-950/30 border border-amber-800/60 rounded-lg p-3 text-xs text-amber-200">
            <p className="font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Overpass Map Notice
            </p>
            <p className="text-slate-300 text-[11px] mt-1">{chinaMap.error}</p>
          </div>
        )}

        {/* Live Interactive OpenStreetMap View */}
        <div className="rounded-lg overflow-hidden border border-slate-800 h-80 relative bg-slate-950">
          <iframe
            title="Shanghai Regional Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src="https://www.openstreetmap.org/export/embed.html?bbox=120.35%2C30.20%2C121.95%2C31.55&amp;layer=mapnik&amp;marker=31.2304%2C121.4737"
            className="w-full h-full"
          />
          <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-xs text-[11px] text-slate-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shanghai (Center), Suzhou (Northwest ~25m CRH), Hangzhou (Southwest ~45m CRH)</span>
          </div>
        </div>

        {chinaMap.data && (
          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800">
            <span className="text-emerald-400 font-mono font-medium">Overpass QL Query Verified: </span>
            {chinaMap.data.elements?.length || 0} administrative boundary elements loaded from provider.
          </div>
        )}
      </div>

      {/* 3. Shanghai Travel Guide from Wikivoyage */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Shanghai Travel Guide (Wikivoyage)
              </h3>
              <p className="text-xs text-slate-400">
                Source: Wikivoyage API (parse action=parse&page=Shanghai)
              </p>
            </div>
          </div>
          <button
            onClick={onRefreshWikivoyage}
            disabled={wikivoyage.loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${wikivoyage.loading ? 'animate-spin' : ''}`} />
            <span>{wikivoyage.loading ? 'Fetching Guide...' : 'Refresh Guide'}</span>
          </button>
        </div>

        {wikivoyage.loading ? (
          <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            <span>Retrieving Shanghai page from Wikivoyage API...</span>
          </div>
        ) : wikivoyage.error ? (
          /* Sub-goal 4: Plain error message */
          <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-3 text-xs text-rose-200">
            <p className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Wikivoyage Travel Guide Refused or Empty
            </p>
            <p className="text-slate-300 text-[11px] mt-1">{wikivoyage.error}</p>
          </div>
        ) : wikivoyage.data ? (
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-300 border-b border-slate-800/80 pb-2">
              <span className="font-semibold text-white">
                Page: {wikivoyage.data.title} (Page ID: {wikivoyage.data.pageid})
              </span>
              <a
                href="https://en.wikivoyage.org/wiki/Shanghai"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Read full guide on Wikivoyage</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {getExcerpt(wikivoyage.data.wikitext)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
