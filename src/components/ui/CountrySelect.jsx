import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

const CountrySelect = ({ value, onChange, isAr, placeholder, countries }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const searchRef = useRef(null);

  const selected = countries.find(c => c.en === value);
  const label = selected ? (isAr ? selected.ar : selected.en) : '';

  const filtered = countries.filter(c => {
    const q = search.toLowerCase();
    return c.en.toLowerCase().includes(q) || c.ar.includes(search);
  });

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const select = (country) => {
    onChange(country.en);
    setOpen(false);
    setSearch('');
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  return (
    <div ref={ref} className="relative" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition-all bg-white ${
          open ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-gray-300 hover:border-gray-400'
        } ${isAr ? 'text-right' : 'text-left'}`}
      >
        <span className={`flex-1 truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? label : placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <span
              onClick={clear}
              className="p-0.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className={`absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden ${isAr ? 'right-0' : 'left-0'}`}>
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={isAr ? 'ابحث عن دولة...' : 'Search country...'}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 min-w-0"
                dir={isAr ? 'rtl' : 'ltr'}
              />
              {search && (
                <button type="button" onClick={() => setSearch('')}>
                  <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                {isAr ? 'لا توجد نتائج' : 'No results found'}
              </li>
            ) : filtered.map((c, i) => (
              <li
                key={i}
                onClick={() => select(c)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                  value === c.en
                    ? 'bg-cyan-50 text-cyan-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                } ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <span className="flex-1 truncate">{isAr ? c.ar : c.en}</span>
                {value === c.en && (
                  <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
