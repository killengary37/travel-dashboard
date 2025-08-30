import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

/**
 *  Combines multiple class values into a single string using ' clsx and 'tailwind-merge'
 *  Useful for composing dynamic Tailwind CSS class names without conflict
 *  @params inputs - Array of conditional class values
 *  @returns A merged and deduplicated string of class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Formats a date string into a human-readable format.
export const formatDate = (dateString: string): string => {
    return dayjs(dateString).format("MMMM DD, YYYY");
};

// extracts and parses a JSON object from a markdown string that contains a fenced code block
export function parseMarkdownToJson(markdownText: string): unknown | null {
    const regex = /```json\n([\s\S]+?)\n```/;
    const match = markdownText.match(regex);

    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }
    console.error("No valid JSON found in markdown text.");
    return null;
}
// Parses a JSON string into a Trip object.
export function parseTripData(jsonString: string): Trip | null {
    try {
        const data: Trip = JSON.parse(jsonString);

        return data;
    } catch (error) {
        console.error("Failed to parse trip data:", error);
        return null;
    }
}

/**
 * Returns the first word from a string, Useful for displaying simplified labels or tags
 * @param input - A string input
 * @returns the first word in the string
 */
export function getFirstWord(input: string = ""): string {
    return input.trim().split(/\s+/)[0] || "";
}

/**
 * Calculates the trend (increment, decrement, or no change) between two numeric counts.
 *
 * @param countOfThisMonth - Current month’s value
 * @param countOfLastMonth - Previous month’s value
 * @returns A `TrendResult` object with type of trend and percentage change
 */
export const calculateTrendPercentage = (
    countOfThisMonth: number,
    countOfLastMonth: number
): TrendResult => {
    if (countOfLastMonth === 0) {
        return countOfThisMonth === 0
            ? { trend: "no change", percentage: 0 }
            : { trend: "increment", percentage: 100 };
    }

    const change = countOfThisMonth - countOfLastMonth;
    const percentage = Math.abs((change / countOfLastMonth) * 100);

    if (change > 0) {
        return { trend: "increment", percentage };
    } else if (change < 0) {
        return { trend: "decrement", percentage };
    } else {
        return { trend: "no change", percentage: 0 };
    }
};

/**
 * Formats camelCase or PascalCase keys into human-readable labels.
 *
 * @param key - A key from the `TripFormData` type
 * @returns A formatted string with spaces and capitalized words, e.g. "bestTimeToVisit" → "Best Time To Visit"
 */
export const formatKey = (key: keyof TripFormData) => {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
};