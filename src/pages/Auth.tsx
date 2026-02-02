import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sprout, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({ password: '', confirmPassword: '' });
  
  // OTP states
  const [signupStep, setSignupStep] = useState<'form' | 'otp' | 'complete'>('form');
  const [otpValue, setOtpValue] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // View states
  const [view, setView] = useState<'auth' | 'forgot-password' | 'reset-password'>('auth');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check for password reset token in URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setView('reset-password');
    }
  }, [searchParams]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse(loginData);
    if (!validation.success) {
      toast({ title: validation.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(loginData.email, loginData.password);
    setIsLoading(false);

    if (error) {
      toast({ title: error.message || 'Login failed', variant: 'destructive' });
    } else {
      toast({ title: 'Login successful!' });
      navigate('/');
    }
  };

  const handleSendOTP = async () => {
    const validation = signupSchema.safeParse(signupData);
    if (!validation.success) {
      toast({ title: validation.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setOtpSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: signupData.phone, action: 'send' }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'OTP sent to your phone!' });
      setSignupStep('otp');
      setResendTimer(60);
    } catch (error: any) {
      toast({ title: error.message || 'Failed to send OTP', variant: 'destructive' });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) {
      toast({ title: 'Please enter the complete 6-digit OTP', variant: 'destructive' });
      return;
    }

    setOtpVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone: signupData.phone, action: 'verify', otp: otpValue }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.verified) {
        setPhoneVerified(true);
        toast({ title: 'Phone verified successfully!' });
        
        // Now proceed with signup
        setIsLoading(true);
        const { error: signUpError } = await signUp(
          signupData.email, 
          signupData.password, 
          signupData.fullName, 
          signupData.phone
        );
        setIsLoading(false);

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            toast({ title: 'This email is already registered. Please login instead.', variant: 'destructive' });
          } else {
            toast({ title: signUpError.message || 'Signup failed', variant: 'destructive' });
          }
        } else {
          setSignupStep('complete');
          toast({ title: 'Account created! Please check your email to verify.' });
        }
      }
    } catch (error: any) {
      toast({ title: error.message || 'Invalid OTP', variant: 'destructive' });
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = forgotPasswordSchema.safeParse({ email: forgotPasswordEmail });
    if (!validation.success) {
      toast({ title: validation.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
      redirectTo: `${window.location.origin}/auth?type=recovery`,
    });
    setIsLoading(false);

    if (error) {
      toast({ title: error.message || 'Failed to send reset email', variant: 'destructive' });
    } else {
      setResetEmailSent(true);
      toast({ title: 'Password reset email sent!' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = resetPasswordSchema.safeParse(resetPasswordData);
    if (!validation.success) {
      toast({ title: validation.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: resetPasswordData.password
    });
    setIsLoading(false);

    if (error) {
      toast({ title: error.message || 'Failed to reset password', variant: 'destructive' });
    } else {
      toast({ title: 'Password updated successfully!' });
      navigate('/');
    }
  };

  // Reset Password View
  if (view === 'reset-password') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <Sprout className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Set New Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={resetPasswordData.password}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Forgot Password View
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <Sprout className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">Forgot Password</CardTitle>
            <CardDescription>
              {resetEmailSent 
                ? 'Check your email for the reset link' 
                : 'Enter your email to receive a reset link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetEmailSent ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                <p className="text-muted-foreground">
                  We've sent a password reset link to <strong>{forgotPasswordEmail}</strong>
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => { setView('auth'); setResetEmailSent(false); }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your@email.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Send Reset Link
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setView('auth')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Auth View
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">KrishiConnect Maharashtra</CardTitle>
          <CardDescription>Login or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => { setSignupStep('form'); setOtpValue(''); }}>Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Button 
                      type="button"
                      variant="link" 
                      className="px-0 h-auto text-sm text-primary"
                      onClick={() => setView('forgot-password')}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {signupStep === 'form' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your full name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="9876543210"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">We'll send an OTP to verify your phone</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="button" 
                    className="w-full" 
                    disabled={otpSending}
                    onClick={handleSendOTP}
                  >
                    {otpSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Continue & Verify Phone
                  </Button>
                </div>
              )}

              {signupStep === 'otp' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      We've sent a 6-digit code to
                    </p>
                    <p className="font-medium">+91 {signupData.phone}</p>
                  </div>
                  
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={setOtpValue}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button 
                    type="button" 
                    className="w-full" 
                    disabled={otpVerifying || isLoading || otpValue.length !== 6}
                    onClick={handleVerifyOTP}
                  >
                    {(otpVerifying || isLoading) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Verify & Create Account
                  </Button>

                  <div className="text-center">
                    <Button 
                      type="button"
                      variant="link" 
                      className="text-sm"
                      disabled={resendTimer > 0}
                      onClick={handleResendOTP}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </Button>
                  </div>

                  <Button 
                    type="button"
                    variant="ghost" 
                    className="w-full"
                    onClick={() => { setSignupStep('form'); setOtpValue(''); }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Change Phone Number
                  </Button>
                </div>
              )}

              {signupStep === 'complete' && (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">Account Created!</h3>
                  <p className="text-muted-foreground">
                    Please check your email ({signupData.email}) to verify your account before logging in.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => { 
                      setSignupStep('form'); 
                      setSignupData({ fullName: '', email: '', phone: '', password: '' });
                      setOtpValue('');
                    }}
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
