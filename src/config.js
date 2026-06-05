export const ADMIN_EMAILS = [
  "Auxiliar.ti@fvadvocacia.com.br",
  "admin2@empresa.com",
  "admin3@empresa.com",
  "admin4@empresa.com",
  "admin5@empresa.com"
];

export function isAdminEmail(email) {
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes((email || "").toLowerCase());
}
