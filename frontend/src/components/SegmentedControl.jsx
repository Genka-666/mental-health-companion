import React, { useId } from "react";
export default function SegmentedControl({
  options,
  value,
  onChange,
  label,
  disabled = false,
}) {
  const name = useId();
  return (
    <fieldset className="segmented-wrapper" disabled={disabled}>
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const val = typeof option === "object" ? option.value : option;
        const text = typeof option === "object" ? option.label : option;
        return (
          <label
            key={val}
            className={`segmented-item ${value === val ? "selected" : ""}`}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={val}
              checked={value === val}
              onChange={() => onChange(val)}
            />
            <span>{text}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
