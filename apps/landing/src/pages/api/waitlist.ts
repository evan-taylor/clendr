import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resendApiKey = process.env.RESEND_API_KEY;
const resendAudienceId = process.env.RESEND_AUDIENCE_ID;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface WaitlistRequest {
  email: string;
  name: string;
}

interface WaitlistResponse {
  success: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WaitlistResponse>
): Promise<void> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body as WaitlistRequest;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Parse name into first and last name
    let firstName = '';
    let lastName = '';
    
    if (name && typeof name === 'string') {
      const nameParts = name.trim().split(/\s+/);
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    // Rate limiting check (you would replace this with proper rate limiting)
    // This is a placeholder - in production you would use a dedicated solution
    // such as Redis or database-based rate limiting
    
    // If Resend API key is configured, add to audience
    if (resend && resendAudienceId) {
      try {
        await resend.contacts.create({
          email,
          audience_id: resendAudienceId,
          first_name: firstName,
          last_name: lastName,
        });
        
        // Optionally send confirmation email - now in plain text
        const firstNameOrDefault = firstName || 'there';
        
        await resend.emails.send({
          from: 'Evan from Clendr <evan@clendr.com>',
          to: email,
          subject: 'Welcome to the Clendr Waitlist!',
          text: `Hey ${firstNameOrDefault},

Thanks for joining the Clendr waitlist! I'll let you know when Clendr is ready for you to try.

In the meantime, have any questions, suggestions, or things you would like to see in Clendr? If so, please reply to this email - your feedback means a TON. 🙏

Best,
evan taylor
founder @ clendr
call/text: (360) 207-1844 | email: evan@clendr.com

ps: want to keep up with the latest updates? follow me on Twitter!
https://twitter.com/evantaylor1104
`,
        });
      } catch (resendError) {
        console.error('Resend API error:', resendError);
        // We don't want to fail the request if just the email sending fails
        // Just log and continue
      }
    } else {
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully joined the waitlist' 
    });
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}