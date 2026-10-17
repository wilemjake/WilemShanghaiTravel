import React from 'react';
import { ShieldCheck, Smartphone, Train, Phone, Heart, CheckCircle2 } from 'lucide-react';

export const SingaporeTravelerTips: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 text-white shadow-sm space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Singaporean First-Time Family Travel Essentials</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Essential pre-departure checklist for Singapore passport holders traveling with elderly and children.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Visa Exemption */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>30-Day Mutual Visa Exemption</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Singapore citizens holding ordinary passports enjoy <strong>30 days visa-free entry</strong> to China for tourism, family visits, and transit. Ensure all family passports have at least 6 months validity from return date.
          </p>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            *Register with MFA eRegister before departure for consular assistance.
          </div>
        </div>

        {/* 2. Cashless Payments */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Smartphone className="w-4 h-4" />
            <span>Payment Setup (Alipay & WeChat Pay)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Link your Singapore credit cards (DBS, OCBC, UOB Visa/Mastercard) directly inside Alipay and WeChat before departing Changi.
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Transactions under 200 RMB incur 0% international processing fee. Cash is legally accepted as backup, but QR is standard everywhere.
          </p>
        </div>

        {/* 3. CRH High-Speed Rail for Suzhou & Hangzhou */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Train className="w-4 h-4" />
            <span>CRH Bullet Train Booking & Boarding</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Book tickets online via Trip.com or China Railway 12306. Use Singapore passport details exact to format.
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            At Shanghai Hongqiao Railway Station, enter through the manual passport lane (人工通道). Boarding starts 15 minutes before departure.
          </p>
        </div>

        {/* 4. Mobility & Non-Strenuous Transport */}
        <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold">
            <Heart className="w-4 h-4" />
            <span>Senior Comfort & DiDi Ride-Hailing</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            For a family of 3–6, hailing a DiDi 6-seater via the Alipay DiDi mini-program is often cheaper and far more relaxing than navigating crowded metro transfer tunnels.
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Major museums (Shanghai Museum, Suzhou Museum) provide free wheelchairs at visitor information desks on a first-come basis.
          </p>
        </div>
      </div>

      {/* Emergency Consular Contacts */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Consulate-General of the Republic of Singapore in Shanghai</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Address: 899 Lingling Road, Xuhui District, Shanghai 200030
          </p>
          <p className="text-slate-400 text-[11px] font-mono">
            Tel: +86-21-6278-5555 · 24-Hour Emergency Duty Mobile: +86-138-0194-9452
          </p>
        </div>
        <a
          href="https://www.mfa.gov.sg/shanghai"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium text-center whitespace-nowrap shrink-0"
        >
          MFA Shanghai Portal
        </a>
      </div>
    </div>
  );
};
