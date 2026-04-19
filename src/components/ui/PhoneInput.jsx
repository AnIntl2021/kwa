import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const COUNTRIES = [
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', dial: '+971', flag: '🇦🇪' },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲' },
  { code: 'EG', name: 'Egypt', dial: '+20', flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan', dial: '+962', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', dial: '+961', flag: '🇱🇧' },
  { code: 'SY', name: 'Syria', dial: '+963', flag: '🇸🇾' },
  { code: 'IQ', name: 'Iraq', dial: '+964', flag: '🇮🇶' },
  { code: 'YE', name: 'Yemen', dial: '+967', flag: '🇾🇪' },
  { code: 'PS', name: 'Palestine', dial: '+970', flag: '🇵🇸' },
  { code: 'MA', name: 'Morocco', dial: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', dial: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', dial: '+216', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', dial: '+218', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', dial: '+249', flag: '🇸🇩' },
  { code: 'PK', name: 'Pakistan', dial: '+92', flag: '🇵🇰' },
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩' },
  { code: 'PH', name: 'Philippines', dial: '+63', flag: '🇵🇭' },
  { code: 'TR', name: 'Turkey', dial: '+90', flag: '🇹🇷' },
  { code: 'IR', name: 'Iran', dial: '+98', flag: '🇮🇷' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dial: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dial: '+82', flag: '🇰🇷' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
  { code: 'ET', name: 'Ethiopia', dial: '+251', flag: '🇪🇹' },
  { code: 'KE', name: 'Kenya', dial: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'SN', name: 'Senegal', dial: '+221', flag: '🇸🇳' },
  { code: 'ID', name: 'Indonesia', dial: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', dial: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dial: '+84', flag: '🇻🇳' },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵' },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰' },
  { code: 'IT', name: 'Italy', dial: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dial: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dial: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dial: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dial: '+41', flag: '🇨🇭' },
];

const PhoneInput = ({ value, onChange, placeholder = 'XXXX XXXX', label, required = false, className = '' }) => {
  const [dialCode, setDialCode] = useState('+965');
  const [number, setNumber] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  // sync full value out
  useEffect(() => {
    const full = number ? `${dialCode} ${number}` : '';
    onChange(full);
  }, [dialCode, number]); // eslint-disable-line react-hooks/exhaustive-deps

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const selected = COUNTRIES.find(c => c.dial === dialCode) || COUNTRIES[0];

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}{required && ' *'}
        </label>
      )}
      <div className="flex gap-0" dir="ltr" ref={ref}>
        {/* Country code button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setOpen(o => !o); setSearch(''); }}
            className="flex items-center gap-1.5 px-3 h-[42px] border-2 border-r-0 border-gray-200 rounded-l-xl hover:border-cyan-400 focus:border-cyan-400 focus:outline-none transition-colors bg-white text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            <span className="text-base">{selected.flag}</span>
            <span>{dialCode}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-64 overflow-hidden">
              <div className="p-2 border-b">
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-400"
                  onClick={e => e.stopPropagation()}
                />
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filtered.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { setDialCode(c.dial); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-cyan-50 transition-colors text-left ${c.dial === dialCode ? 'bg-cyan-50 font-semibold text-cyan-700' : 'text-gray-700'}`}
                  >
                    <span className="text-base flex-shrink-0">{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-gray-400 flex-shrink-0">{c.dial}</span>
                  </button>
                ))}
                {filtered.length === 0 && <p className="text-center py-4 text-sm text-gray-400">No results</p>}
              </div>
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={e => setNumber(e.target.value.replace(/[^0-9\s\-]/g, ''))}
          placeholder={placeholder}
          className="flex-1 px-3 h-[42px] border-2 border-gray-200 rounded-r-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm"
        />
      </div>
    </div>
  );
};

export default PhoneInput;
