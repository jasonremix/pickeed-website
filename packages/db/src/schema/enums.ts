import { pgEnum } from "drizzle-orm/pg-core";

export const accountStatus = pgEnum("account_status", ["active", "paused", "suspended", "deleted"]);
export const pageType = pgEnum("page_type", ["creator", "business", "brand", "club", "provider"]);
export const pageRole = pgEnum("page_role", ["owner", "admin", "editor", "analyst"]);
export const followStatus = pgEnum("follow_status", ["pending", "accepted"]);
export const consentType = pgEnum("consent_type", ["terms", "privacy", "push", "calendar", "sensitive_data"]);
export const adminRole = pgEnum("admin_role", ["super_admin", "moderator", "support", "analyst"]);
export const authCodePurpose = pgEnum("auth_code_purpose", ["sign_in", "email_change"]);
