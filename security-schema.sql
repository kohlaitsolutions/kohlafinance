-- Create security logs table for audit trail
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create backup codes table for MFA
CREATE TABLE IF NOT EXISTS user_backup_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  codes TEXT[] NOT NULL,
  used_codes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 year'
);

-- Add security-related columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) DEFAULT 'pending_verification';
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_level VARCHAR(20) DEFAULT 'basic';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create RLS policies for security
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_backup_codes ENABLE ROW LEVEL SECURITY;

-- Security logs can only be read by admins and the user themselves
CREATE POLICY "Users can view their own security logs" ON security_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all security logs" ON security_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Backup codes can only be accessed by the user themselves
CREATE POLICY "Users can manage their own backup codes" ON user_backup_codes
  FOR ALL USING (auth.uid() = user_id);

-- Create function to automatically log login events
CREATE OR REPLACE FUNCTION log_login_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    INSERT INTO security_logs (user_id, event_type, metadata)
    VALUES (NEW.id, 'LOGIN_SUCCESS', jsonb_build_object(
      'last_sign_in_at', NEW.last_sign_in_at,
      'sign_in_count', NEW.sign_in_count
    ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for login events
DROP TRIGGER IF EXISTS trigger_log_login_event ON auth.users;
CREATE TRIGGER trigger_log_login_event
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_login_event();
