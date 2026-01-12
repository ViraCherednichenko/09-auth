"use client";

import { useEffect, useState } from "react";

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void; // сюди віддаємо вже “дебаунсене” значення
  delay?: number; // debounce у мс (за замовчуванням 400)
}

export default function SearchBox({ value, onChange, delay = 400 }: SearchBoxProps) {
  const [localValue, setLocalValue] = useState<string>(value);

  // синхронізуємо localValue, якщо value зміниться ззовні
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // debounce
  useEffect(() => {
    const id = window.setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => window.clearTimeout(id);
  }, [localValue, delay, onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder="Search notes..."
    />
  );
}