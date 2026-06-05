export const ADMIN_EMAILS = [
  "admin1@empresa.com",
  "admin2@empresa.com",
  "admin3@empresa.com",
  "admin4@empresa.com",
  "admin5@empresa.com"
];

export function isAdminEmail(email) {
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes((email || "").toLowerCase());
}
