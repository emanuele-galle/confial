/**
 * Sanitize CSV value to prevent formula injection attacks
 * Excel/Google Sheets execute formulas starting with =, +, -, @, tab, CR
 * Prefix these with single quote to treat as text
 */
function sanitizeCSVValue(value: unknown): string {
  if (value == null) return "";

  const str = String(value);
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r"];

  if (dangerousChars.some((char) => str.startsWith(char))) {
    return "'" + str;
  }

  return str;
}

/**
 * Sanitize all string values in a row object
 * Returns new object with sanitized values
 */
export function sanitizeRow<T extends Record<string, unknown>>(
  row: T
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(row)) {
    sanitized[key] = sanitizeCSVValue(value);
  }

  return sanitized;
}
