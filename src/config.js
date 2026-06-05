export const ADMIN_EMAILS = [
  "auxiliar.ti@fvadvocacia.com.br",
  "admin2@empresa.com",
  "admin3@empresa.com",
  "admin4@empresa.com",
  "admin5@empresa.com"
];

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.trim().toLowerCase()).includes(email.trim().toLowerCase());
}
