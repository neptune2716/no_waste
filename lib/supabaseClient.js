import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tyybgchyzgeqfjmkyxxq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eWJnY2h5emdlcWZqbWt5eHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjU4MjEsImV4cCI6MjAzNDg0MTgyMX0.-qU3PL6IhNu9jGD5zCmdR7PmB4ORip70eTkAEEIDckM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
