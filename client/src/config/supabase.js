import { createClient }
from '@supabase/supabase-js'

const supabaseUrl =
'https://snfajahmoismxqiqjfoq.supabase.co'

const supabaseKey =
'sb_publishable_ydbYqH0eMMcBkP59hVcbmg_d298nBFg'

export const supabase =
createClient(
  supabaseUrl,
  supabaseKey
)