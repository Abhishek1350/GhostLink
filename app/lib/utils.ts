export type ValidationResult = {
    valid: boolean;
    error?: string;
};

export function validateRedirectTarget(rawValue: string): ValidationResult {
    const value = rawValue.trim();

    if (!value) {
        return {
            valid: false,
            error: "Target path is required.",
        };
    }

    // Allow homepage shorthand
    if (value === "/") {
        return { valid: true };
    }

    // Allow relative paths starting with "/"
    if (value.startsWith("/")) {
        // Basic sanity checks (you can adjust as needed)
        if (value.includes(" ")) {
            return {
                valid: false,
                error: "Target path must not contain spaces.",
            };
        }

        if (!/^\/[^\s]*$/.test(value)) {
            return {
                valid: false,
                error:
                    "Enter a valid path starting with / (for example, /collections/all).",
            };
        }

        return { valid: true };
    }

    // Allow full http(s) URLs
    try {
        const url = new URL(value);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return { valid: true };
        }

        return {
            valid: false,
            error: "Only http:// or https:// URLs are allowed.",
        };
    } catch {
        return {
            valid: false,
            error:
                "Enter a relative path (for example, /collections/all) or a full URL.",
        };
    }
}


export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
