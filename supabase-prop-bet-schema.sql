// This is a migration helper for Supabase SQL editor
// Run this SQL in your Supabase project to create the prop bet tables

-- Table for user prop bet answers
create table if not exists prop_bet_answers (
  id uuid primary key default uuid_generate_v4(),
  user_name text not null,
  prop_id text not null,
  answer text not null,
  inserted_at timestamp with time zone default timezone('utc', now())
);

-- Table for prop bet leaderboard
create table if not exists prop_bet_leaderboard (
  user_name text primary key,
  points integer not null default 0
);

-- Table for prop bet questions (optional, for admin control)
create table if not exists prop_bet_questions (
  id text primary key,
  question text not null,
  options jsonb,
  correct_answer text,
  closed boolean not null default false
);
