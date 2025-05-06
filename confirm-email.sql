-- Create a function to confirm a user's email by user ID
CREATE OR REPLACE FUNCTION confirm_user_email(user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Update the user's email_confirmed_at field in the auth.users table
  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION confirm_user_email TO service_role;
