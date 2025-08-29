// utils/llmLogger.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export async function logAndReturn({
  runId,
  model,
  prompt,
  rawResponse,
  finalResponse,
  extra = {},
}: {
  runId: string;
  model: string;
  prompt: string;
  rawResponse: string;
  finalResponse: any;
  extra?: Record<string, unknown>;
}) {
  // store raw LLM response + metadata
  await supabase.from("llm_results").insert({
    run_id: runId,
    model,
    prompt,
    raw_response: rawResponse,
    latency_ms: extra.latency_ms ?? null,
  });

  // return whatever your Edge function is supposed to return
  return new Response(JSON.stringify(finalResponse), {
    headers: { "Content-Type": "application/json" },
  });
}