drop table if exists llm_usage_benchmark;
create table llm_usage_benchmark (
  id uuid primary key default gen_random_uuid(),

  -- inserted from the Edge Function
  execution_id uuid not null, -- allows to locate record later
  input jsonb not null, -- raw input payload
  output jsonb, -- raw LLM response
  latency_ms double precision,

  -- inserted from the Node script
  run_id uuid, -- groups all scenario results for a single run
  model text, -- e.g. "gpt-4o"
  scenario_name text, -- filename or label

  --prompt_tokens integer,
  --completion_tokens integer,
  --total_tokens integer,
  created_at timestamptz default now()
);

-- Optional: index for grouping
create index on llm_usage_benchmark (execution_id);