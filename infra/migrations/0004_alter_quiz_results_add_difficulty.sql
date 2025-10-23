ALTER TABLE quiz_results ADD COLUMN difficulty_id TEXT NOT NULL DEFAULT '';
ALTER TABLE quiz_results ADD COLUMN difficulty_value INTEGER NOT NULL DEFAULT 0;
ALTER TABLE quiz_results ADD COLUMN creature_id TEXT NOT NULL DEFAULT '';
ALTER TABLE quiz_results ADD COLUMN creature_name TEXT NOT NULL DEFAULT '';
ALTER TABLE quiz_results ADD COLUMN creature_emoji TEXT NOT NULL DEFAULT '';
