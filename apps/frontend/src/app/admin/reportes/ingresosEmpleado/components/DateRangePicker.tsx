"use client";

import { useState, useRef, useEffect } from "react";
import { DateRangePicker as ReactDateRangePicker, Range, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./DateRangePicker.module.css";
import { DateRange } from "./types";


interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectionRange: Range = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: "selection",
  };

  function handleSelect(ranges: RangeKeyDict) {
    const selection = ranges.selection;

    if (!selection.startDate || !selection.endDate) return;

    onDateRangeChange({
      ...dateRange,
      startDate: selection.startDate,
      endDate: selection.endDate,
    });

    setShowPicker(false);
  }


  // 🔥 Cerrar al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formattedRange = `${format(
    dateRange.startDate,
    "dd/MM/yyyy",
    { locale: es }
  )} - ${format(dateRange.endDate, "dd/MM/yyyy", { locale: es })}`;

  return (
    <div ref={pickerRef} className="relative inline-block">
      {/* Botón */}
      <button
        onClick={() => setShowPicker((prev) => !prev)}
        className="border-2 border-[#8B4513] rounded-lg px-4 py-2 bg-white text-left hover:bg-gray-50 transition"
      >
        📅 {formattedRange}
      </button>

      {/* Overlay */}
      {showPicker && (
        <div className="absolute left-0 mt-2 z-50">
          <div className={`${styles.wrapper} bg-white shadow-xl rounded-lg`}>
            <ReactDateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              rangeColors={["#8B4513"]}
              staticRanges={[]}
              inputRanges={[]}
              showDateDisplay={false}
              editableDateInputs={false}
              moveRangeOnFirstSelection={false}
              showMonthAndYearPickers={true}
              months={1}
              direction="horizontal"
              maxDate={new Date()}
            />
          </div>
        </div>
      )}
    </div>

  );
}
