import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resendApiKey = process.env.RESEND_API_KEY;
const resendAudienceId = process.env.RESEND_AUDIENCE_ID;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface WaitlistRequest {
  email: string;
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
    const { email } = req.body as WaitlistRequest;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Basic email validation with more comprehensive regex
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
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
          // You might want to collect these in a more comprehensive form
          // first_name: '', 
          // last_name: '',
        });
        
        // Optionally send confirmation email
        await resend.emails.send({
          from: 'Clendr <hello@clendr.app>',
          to: email,
          subject: 'Welcome to the Clendr Waitlist!',
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; color: #1f2937; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #0ea5e9, #3b82f6); padding: 4px; border-radius: 8px;">
                  <div style="background-color: white; border-radius: 6px; padding: 24px;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">You're on the list!</h1>
                    <p style="margin-bottom: 16px; color: #4b5563; line-height: 1.6;">
                      Thanks for joining the Clendr waitlist! We'll keep you updated on our progress and let you know when Clendr is ready for you to try.
                    </p>
                    <p style="margin-bottom: 16px; color: #4b5563; line-height: 1.6;">
                      In the meantime, you can follow us on
                      <a href="https://twitter.com/clendrapp" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Twitter</a>
                      to stay in the loop.
                    </p>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
                      The Clendr Team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          `,
        });
      } catch (resendError) {
        console.error('Resend API error:', resendError);
        // We don't want to fail the request if just the email sending fails
        // Just log and continue
      }
    } else {
      // For development when Resend isn't configured
      console.log(`[DEV] Added to waitlist: ${email}`);
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