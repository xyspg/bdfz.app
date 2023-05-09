import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

//@ts-ignore
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    const {
      visitorId,
      question,
      answer,
      timestamp,
      deviceInfo,
      hasFlaggedContent,
    } = req.body;

    try {
      const { error } = await supabase.from('statistics').insert([
        {
          visitor_id: visitorId,
          question,
          answer,
          timestamp,
          platform: deviceInfo.platform,
          os_cpu: deviceInfo.osCpu,
          browser_vendor: deviceInfo.browserVendor,
          screen_resolution: deviceInfo.screenResolution,
          has_flagged_content: hasFlaggedContent,
        },
      ]);

      if (error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(200).json({ message: 'Data inserted successfully' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
