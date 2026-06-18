export interface ContactInput {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  locale?: unknown;
  company?: unknown;
}

export function sendContactEmails(
  body: ContactInput | unknown
): Promise<{ status: number; body: Record<string, unknown> }>;
