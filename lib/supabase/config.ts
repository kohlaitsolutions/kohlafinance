export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce" as const,
  },
  global: {
    headers: {
      "X-Client-Info": "kohlawise-web",
    },
  },
}

// Email template configuration
export const emailConfig = {
  templates: {
    confirmSignup: {
      subject: "Welcome to Kohlawise - Verify Your Email",
      template: "confirm_signup",
    },
    recovery: {
      subject: "Reset Your Kohlawise Password",
      template: "recovery",
    },
    magicLink: {
      subject: "Your Kohlawise Magic Link",
      template: "magic_link",
    },
    emailChange: {
      subject: "Confirm Your New Email Address",
      template: "email_change",
    },
  },
  redirectUrls: {
    confirmSignup: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    recovery: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`,
    magicLink: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    emailChange: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  },
}

// Security configuration
export const securityConfig = {
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
}
