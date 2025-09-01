import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs';
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function run(functionName, scenarioPath) {
  const scenarioData = JSON.parse(fs.readFileSync(scenarioPath, 'utf-8'));
  //console.log(`Loaded scenario data from ${scenarioPath}`);
  //console.log(scenarioData);
  const { models, inputs } = scenarioData;
  
  try {
    const runId = crypto.randomUUID();
    await Promise.all(models.map(async (model) => {
      const llmUsageBenchmarkToken = crypto.randomUUID(); 
      const body = { ...inputs, model, llmUsageBenchmarkToken };
      console.log(`Invoking function for model: ${model} with body: ${JSON.stringify(body)}`)
      await supabase.functions.invoke(functionName, { body });

      console.log(`About to insert additional record for ${llmUsageBenchmarkToken}`);
      const {data, error} = await supabase.from('llm_usage_benchmark').update({
        run_id: runId,
        model,
        scenario_name: functionName
      }).eq('execution_id', llmUsageBenchmarkToken);

      if (error) {
        console.error('Update failed:', error);
      } else {
        console.log('Updated row:', data);
      }      
    }));
    console.log('All function invocations completed successfully.');
  } catch (error) {
    console.error(`Error during function invocations:`, error);
  }
}

const functionName = process.argv[2];
const scenarioPath = process.argv[3];

if(!functionName || !scenarioPath) {
  console.error('Please provide Supabase Edge function and scenario name as arguments.')
  console.log('Usage: npm start <function_name> <scenario_path>')
  process.exit(1);
}

run(functionName, scenarioPath);

