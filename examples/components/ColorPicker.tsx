interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  description?: string;
}

export default function ColorPicker({ label, color, onChange, description }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-default">{label}</span>
          <span className="text-xs font-mono text-muted">{color}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border-2 border-border"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-2 text-sm font-mono rounded border border-border bg-default text-default focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>

        {description && (
          <p className="text-xs text-muted mt-1">{description}</p>
        )}
      </label>
    </div>
  );
}
