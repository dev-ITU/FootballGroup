import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn.js";
import { useI18n } from "@/shared/i18n/index.jsx";

export default function Select({
  options = [],
  value = null,
  onChange,
  placeholder,
  disabled = false,
  name,
  className,
  triggerClassName,
  menuClassName,
}) {
  const { t } = useI18n();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value) || null;
  }, [options, value]);
  const resolvedPlaceholder = placeholder || t("common.selectValue");

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleToggle() {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => !prev);
  }

  function handleSelect(option) {
    onChange?.(option.value, option);
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}

      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleToggle}
        className={cn(
          "flex min-h-[52px] w-full cursor-pointer items-center justify-between gap-3 rounded-[20px] border border-[rgba(10,44,94,0.12)] bg-white/85 px-4 text-left text-slate-900 shadow-[0_14px_34px_rgba(8,31,61,0.08)] backdrop-blur transition",
          "hover:-translate-y-0.5 hover:border-[rgba(10,44,94,0.18)] hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60",
          triggerClassName,
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-400")}>
          {selectedOption ? selectedOption.label : resolvedPlaceholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition", isOpen && "rotate-180")} strokeWidth={1.9} />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-[22px] border border-[rgba(10,44,94,0.1)] bg-white/95 p-2 shadow-[0_22px_54px_rgba(8,31,61,0.14)] backdrop-blur",
            menuClassName,
          )}
        >
          <div className="max-h-72 overflow-auto">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm transition",
                    isSelected ? "bg-sky-50 text-sky-900" : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check className="h-4 w-4 shrink-0" strokeWidth={2} /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
