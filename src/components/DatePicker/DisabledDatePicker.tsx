"use client";
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./DisabledDatePicker.module.css";

type DisabledDatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  disabledDates?: string[];
};

function toDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

export default function DisabledDatePicker({
  value,
  onChange,
  disabledDates,
}: DisabledDatePickerProps) {
  const [blocked, setBlocked] = useState<string[]>(disabledDates ?? []);
  const selectedDate = value ? toDate(value) : new Date();

  useEffect(() => {
    if (disabledDates && disabledDates.length) {
      setBlocked(disabledDates);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/citas?action=fechasNoDisponibles");
        const json = await res.json();
        if (!cancelled && json?.success && Array.isArray(json?.data)) {
          setBlocked(json.data as string[]);
        }
      } catch (e) {
        console.error("Error cargando fechas no disponibles", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [disabledDates]);

  const blockedDates = useMemo(
    () => blocked.map(toDate),
    [blocked]
  );

  return (
    <div className={styles.rdrCalendarWrapper}>
      <Calendar
        date={selectedDate}
        onChange={(d: Date) => onChange(d.toISOString().split("T")[0])}
        disabledDates={blockedDates}
        locale={undefined}
      />
    </div>
  );
}
