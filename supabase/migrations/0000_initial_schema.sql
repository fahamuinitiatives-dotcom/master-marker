CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TABLE profiles (id UUID PRIMARY KEY, role user_role DEFAULT 'student');
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), subject TEXT, mark_type INTEGER, 
  text TEXT, source_label TEXT, verified BOOLEAN DEFAULT false
);
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID, marks NUMERIC(4,2), 
  weakness_tags TEXT[], result_json JSONB
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON questions FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');