import styles from "./ModeTabs.module.css";

export type AnalysisMode = "single" | "multiple";

interface ModeTabsProps {
  mode: AnalysisMode;
  disabled: boolean;
  onChange: (mode: AnalysisMode) => void;
}

const modes: { id: AnalysisMode; label: string; hint: string }[] = [
  { id: "single", label: "Single review", hint: "Analyze one review" },
  { id: "multiple", label: "Multiple reviews", hint: "Compare up to 100" },
];

export default function ModeTabs({ mode, disabled, onChange }: ModeTabsProps) {
  return (
    <div className={styles.tabs} aria-label="Input mode">
      {modes.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${styles.tab} ${mode === item.id ? styles.active : ""}`}
          aria-pressed={mode === item.id}
          disabled={disabled}
          onClick={() => onChange(item.id)}
        >
          <span>{item.label}</span>
          <small>{item.hint}</small>
        </button>
      ))}
    </div>
  );
}
