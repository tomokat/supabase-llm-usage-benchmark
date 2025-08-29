# supabase-llm-usage-benchmark

As I was building my app using Supabase Edge functions, I can't stop thinking my desire to quickly run my Supabase Edge functions with various LLM models and quickly compare their results. I can't seem to find something similar, so I decided to build one myself.

## setup

### Supabase modifications
1. Create new Supabase table by running sql under `sql/create-llm-benchmark-result.sql`
1. I need you to create a folder `lib` under your Supabase Functions and place `utils/llmLogger.ts` in it.
1. Go to Edge function and place capture() right after the LLM call

### local environment
1. **Set up your environment variables:**

   Copy the example `.env.example` file to a new `.env` file:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and add your Supabase project URL and public anonymous key.

   ```
   SUPABASE_URL=YOUR_SUPABASE_URL
   SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

### Prepare input file
1. create new scenario file - at minimum it should contains `models` and `inputs`

## Usage

Run the script from your terminal, passing the name of the table you want to check as an argument. You can also provide an optional count to limit the number of records returned in the output.

You can run the script directly with `node`:

```bash
node run.js <function-name> <path-to-scenario>
```