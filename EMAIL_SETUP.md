# Email Setup Instructions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@vidyavriddhi.com
ADMIN_EMAIL=your_email@example.com
```

## Steps to Configure

1. **Get Resend API Key**
   - Go to [Resend Dashboard](https://resend.com/dashboard)
   - Sign up or log in
   - Go to API Keys section
   - Create a new API key
   - Copy the API key

2. **Verify Domain**
   - In Resend dashboard, go to Domains
   - Add your domain (e.g., vidyavriddhi.com)
   - Follow the DNS verification steps
   - Wait for domain verification

3. **Update Environment Variables**
   - Replace `your_resend_api_key_here` with your actual Resend API key
   - Replace `noreply@vidyavriddhi.com` with your verified domain email
   - Replace `your_email@example.com` with your admin email where you want to receive notifications

4. **Restart Development Server**
   - Stop your Next.js server
   - Run `npm run dev` again to load the new environment variables

## How It Works

When a student submits the admission enquiry form:
1. The form data is validated
2. The enquiry is saved to the database
3. An email notification is sent to your admin email with:
   - Student's name, email, phone, city, and category
   - Professional HTML email template
   - Direct reply button to respond to the student
   - Timestamp of when the enquiry was received

## Testing

To test the email functionality:
1. Fill out the admission enquiry form on your website
2. Check your admin email inbox for the notification
3. Check the console logs for any errors

## Troubleshooting

- **Email not sending**: Check your Resend API key and domain verification
- **Domain not verified**: Follow Resend's DNS setup instructions
- **Environment variables not loading**: Ensure `.env.local` is in project root and restart server
