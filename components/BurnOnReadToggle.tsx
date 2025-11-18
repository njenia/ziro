'use client';

interface BurnOnReadToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function BurnOnReadToggle({ value, onChange, disabled = false }: BurnOnReadToggleProps) {
  return (
    <div className="relative">
      <label className="block text-sm text-cyan-400 mb-2">Burn on Read</label>
      <button
        type="button"
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`w-full p-3 bg-black border rounded-lg text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-between transition-all ${
          value
            ? 'border-cyan-500 bg-cyan-500/10 hover:border-cyan-400 hover:bg-cyan-500/20'
            : 'border-cyan-500/30 hover:border-cyan-500/50'
        }`}
      >
        <span className="font-mono text-sm">{value ? 'Enabled' : 'Disabled'}</span>
        <div className="flex items-center">
          {value ? (
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-cyan-400/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
}

