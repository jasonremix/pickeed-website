-- Integritätsregeln, die sich nicht als CHECK-Constraint ausdrücken lassen.

-- updated_at automatisch pflegen
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER pages_set_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- Blockieren entfernt bestehendes Folgen in beide Richtungen.
CREATE OR REPLACE FUNCTION blocks_remove_follows() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM follows
   WHERE (follower_id = NEW.blocker_id AND target_user_id = NEW.blocked_id)
      OR (follower_id = NEW.blocked_id AND target_user_id = NEW.blocker_id);
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER blocks_after_insert AFTER INSERT ON blocks
  FOR EACH ROW EXECUTE FUNCTION blocks_remove_follows();
--> statement-breakpoint

-- Kein Folgen, solange eine Blockierung in irgendeine Richtung besteht.
CREATE OR REPLACE FUNCTION follows_reject_blocked() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.target_user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM blocks
     WHERE (blocker_id = NEW.follower_id AND blocked_id = NEW.target_user_id)
        OR (blocker_id = NEW.target_user_id AND blocked_id = NEW.follower_id)
  ) THEN
    RAISE EXCEPTION 'follow not allowed: blocked' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER follows_before_write BEFORE INSERT OR UPDATE OF follower_id, target_user_id ON follows
  FOR EACH ROW EXECUTE FUNCTION follows_reject_blocked();
--> statement-breakpoint

-- Jede bestehende Seite hat beim Commit genau einen Inhaber (Übertragung innerhalb einer Transaktion möglich).
CREATE OR REPLACE FUNCTION page_members_require_owner() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  affected uuid;
BEGIN
  affected := CASE WHEN TG_OP = 'DELETE' THEN OLD.page_id ELSE NEW.page_id END;
  IF EXISTS (SELECT 1 FROM pages WHERE id = affected)
     AND (SELECT count(*) FROM page_members WHERE page_id = affected AND role = 'owner') <> 1 THEN
    RAISE EXCEPTION 'page % must have exactly one owner', affected USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END;
$$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER page_members_owner_check
  AFTER INSERT OR UPDATE OR DELETE ON page_members
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION page_members_require_owner();
--> statement-breakpoint

-- Eine neue Seite braucht beim Commit einen Inhaber.
CREATE OR REPLACE FUNCTION pages_require_owner() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM pages WHERE id = NEW.id)
     AND NOT EXISTS (SELECT 1 FROM page_members WHERE page_id = NEW.id AND role = 'owner') THEN
    RAISE EXCEPTION 'page % must have exactly one owner', NEW.id USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END;
$$;
--> statement-breakpoint
CREATE CONSTRAINT TRIGGER pages_owner_check
  AFTER INSERT ON pages
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION pages_require_owner();
--> statement-breakpoint

-- Audit-Log ist unveränderlich.
CREATE OR REPLACE FUNCTION audit_log_append_only() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only' USING ERRCODE = 'insufficient_privilege';
END;
$$;
--> statement-breakpoint
CREATE TRIGGER audit_log_no_update_delete BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_append_only();
