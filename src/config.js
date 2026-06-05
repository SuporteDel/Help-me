export const DEFAULT_CONFIG = {
  companyName: "Help-me TI",
  adminEmails: [
    "auxiliar.ti@fvadvocacia.com.br",
    "admin2@empresa.com",
    "admin3@empresa.com",
    "admin4@empresa.com",
    "admin5@empresa.com"
  ],
  categorias: ["Computador", "Monitor", "Internet", "Sistema", "Impressora", "Acesso", "Outro"],
  prioridades: ["Baixa", "Média", "Alta", "Urgente"]
};

export const ADMIN_EMAILS = DEFAULT_CONFIG.adminEmails;

export function isAdminEmail(email, adminEmails = ADMIN_EMAILS) {
  if (!email) return false;
  return adminEmails
    .map((e) => String(e || "").trim().toLowerCase())
    .includes(String(email).trim().toLowerCase());
}

export function normalizarLista(valor, fallback = []) {
  if (Array.isArray(valor)) return valor.map((v) => String(v).trim()).filter(Boolean);
  return String(valor || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean).length
    ? String(valor || "")
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean)
    : fallback;
}
