const DEFAULT_STORAGE_KEY = "team-leave-calendar-requests";
const DEFAULT_ROTATION_START_DATE = "2026-06-15";
const FALLBACK_ON_CALL_WEEK_COUNT = 8;
const FALLBACK_ON_CALL_WEEK_COUNT_OPTIONS = [4, 8, 12];

function readString(value: string | undefined, fallback: string): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : fallback;
}

function readPositiveInteger(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readPositiveIntegerList(value: string | undefined, fallback: number[]): number[] {
    const parsedValues = value
        ?.split(",")
        .map((entry) => Number.parseInt(entry.trim(), 10))
        .filter((entry) => Number.isFinite(entry) && entry > 0);

    return parsedValues && parsedValues.length > 0 ? parsedValues : fallback;
}

export const STORAGE_KEY = readString(import.meta.env.VITE_STORAGE_KEY, DEFAULT_STORAGE_KEY);

export const ROTATION_START_DATE = readString(
    import.meta.env.VITE_ROTATION_START_DATE,
    DEFAULT_ROTATION_START_DATE,
);

export const DEFAULT_ON_CALL_WEEK_COUNT = readPositiveInteger(
    import.meta.env.VITE_DEFAULT_ON_CALL_WEEK_COUNT,
    FALLBACK_ON_CALL_WEEK_COUNT,
);

export const ON_CALL_WEEK_COUNT_OPTIONS = readPositiveIntegerList(
    import.meta.env.VITE_ON_CALL_WEEK_COUNT_OPTIONS,
    FALLBACK_ON_CALL_WEEK_COUNT_OPTIONS,
);
