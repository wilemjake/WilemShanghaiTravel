import React, { useState } from 'react';
import { Building2, Plus, Trash2, Calendar, MapPin, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { HotelStay } from '../types/travel';

interface HotelManagerProps {
  hotels: HotelStay[];
  onAddHotel: (hotel: HotelStay) => void;
  onDeleteHotel: (id: string) => void;
  tripStartDate: string;
  tripEndDate: string;
}

const POPULAR_RECOMMENDATIONS = [
  {
    name: 'Grand Central Hotel Shanghai',
    district: 'Huangpu (People\'s Square / Nanjing Road)',
    address: 'No. 505 Jiujiang Road, Huangpu',
    accessibilityNotes: 'Step-free entrance, elevators to all floors, 200m flat walk to Metro Line 2 East Nanjing Rd. Quiet spacious rooms for grandparents.'
  },
  {
    name: 'The Langham, Shanghai, Xintiandi',
    district: 'Huangpu (Xintiandi)',
    address: 'No. 99 Madang Road, Xintiandi',
    accessibilityNotes: 'Direct elevator access, calm neighborhood, shaded walking streets, next to Line 10/13 metro with elevators.'
  },
  {
    name: 'Jing An Shangri-La, Shanghai',
    district: 'Jing\'an (Kerry Centre)',
    address: 'No. 1218 Middle Yan\'an Road',
    accessibilityNotes: 'Direct indoor connection to Kerry Centre shopping mall and Metro Lines 2 & 7. Excellent for wheelchair and stroller navigation.'
  }
];

export const HotelManager: React.FC<HotelManagerProps> = ({
  hotels,
  onAddHotel,
  onDeleteHotel,
  tripStartDate,
  tripEndDate
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Huangpu (People\'s Square)');
  const [address, setAddress] = useState('');
  const [checkInDate, setCheckInDate] = useState(tripStartDate);
  const [checkOutDate, setCheckOutDate] = useState(tripEndDate);
  const [accessibilityNotes, setAccessibilityNotes] = useState('Elevator access, step-free entrance, crib/extra bed available.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newHotel: HotelStay = {
      id: 'hotel_' + Date.now(),
      name: name.trim(),
      district: district.trim(),
      address: address.trim() || 'Shanghai Central District',
      checkInDate,
      checkOutDate,
      accessibilityNotes: accessibilityNotes.trim()
    };

    onAddHotel(newHotel);
    setName('');
    setAddress('');
    setShowForm(false);
  };

  const handleApplyPreset = (preset: typeof POPULAR_RECOMMENDATIONS[0]) => {
    setName(preset.name);
    setDistrict(preset.district);
    setAddress(preset.address);
    setAccessibilityNotes(preset.accessibilityNotes);
    setShowForm(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Hotels & Family Stays</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Input where your family is staying. Your hotels automatically link to each day's itinerary for smooth morning starts and low walking distances.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Close Form' : 'Add New Hotel Stay'}</span>
        </button>
      </div>

      {/* Add Hotel Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-950 p-5 rounded-lg border border-slate-800 space-y-4">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
            New Hotel Stay Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Hotel Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grand Central Hotel Shanghai"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">District / Neighborhood</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Huangpu / People's Square / Xintiandi"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Check-in Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Check-out Date</label>
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Address / Transit Details</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 505 Jiujiang Road, 200m from East Nanjing Road station exit 4"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Elderly & Child Accessibility Notes</label>
            <input
              type="text"
              value={accessibilityNotes}
              onChange={(e) => setAccessibilityNotes(e.target.value)}
              placeholder="e.g. Elevator access, wheelchair ramp, quiet high floor, breakfast included"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm"
            >
              Save Hotel
            </button>
          </div>
        </form>
      )}

      {/* Hotel Cards List */}
      {hotels.length === 0 ? (
        <div className="bg-slate-950/60 p-6 rounded-lg border border-slate-800 text-center space-y-3">
          <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-300">
            No hotel stays added yet. Add your accommodation so each day in the itinerary shows your departure base and travel tips!
          </p>
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 block mb-2 font-mono">
              Or pick a popular Singaporean family hotel recommendation:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_RECOMMENDATIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors text-left"
                >
                  <span className="font-semibold block">{preset.name}</span>
                  <span className="text-[10px] text-slate-400 block">{preset.district}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {hotel.name}
                  </h4>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {hotel.district}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteHotel(hotel.id)}
                  title="Remove hotel"
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-slate-300 font-mono flex items-center gap-2 bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Staying: {hotel.checkInDate} → {hotel.checkOutDate}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {hotel.address}
              </p>

              {hotel.accessibilityNotes && (
                <div className="text-[11px] text-slate-300 bg-emerald-950/30 p-2 rounded border border-emerald-900/40 flex items-start gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hotel.accessibilityNotes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
