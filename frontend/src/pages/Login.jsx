import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [googleInitError, setGoogleInitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    });
  };

  useEffect(() => {
    let timer;
    if (!GOOGLE_CLIENT_ID) {
      setGoogleInitError('Missing Google Client ID configuration');
      return;
    }
    let attempts = 0;
    const maxAttempts = 30; // ~9s
    const tryInit = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response) => {
              setIsLoading(true);
              setError('');
              const result = await googleLogin(response.credential);
              setIsLoading(false);
              if (result.success) {
                navigate('/dashboard');
              } else {
                setError(result.error || 'Google sign-in failed');
              }
            },
          });
          const el = document.getElementById('googleSignInDiv');
          if (el) {
            window.google.accounts.id.renderButton(el, {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
            setGoogleLoaded(true);
          }
          clearInterval(timer);
        } catch (e) {
          console.warn('Google Identity init failed:', e);
          setGoogleInitError('Google sign-in initialization failed');
          clearInterval(timer);
        }
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          setGoogleInitError('Google script did not load');
          clearInterval(timer);
        }
      }
    };
    timer = setInterval(tryInit, 300);
    return () => clearInterval(timer);
  }, [GOOGLE_CLIENT_ID, googleLogin, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration (non-interactive) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-300">Sign in to your account to continue</p>
          </div>

          {/* Demo Credentials Helper */}
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-200">
                  <p className="font-medium">Demo Credentials:</p>
                <p>Email: <span className="font-mono text-blue-100">demo@example.com</span></p>
                <p>Password: <span className="font-mono text-blue-100">demo123</span></p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200 font-medium"
              >
                Fill
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg animate-shake">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠️</span>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Or separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="mx-3 text-gray-300 text-sm">or</span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>

          {/* Google Sign-in */}
          <div className="flex justify-center">
            <div id="googleSignInDiv"></div>
          </div>
          {!googleLoaded && (
            <div className="mt-4 text-center">
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 cursor-not-allowed shadow-sm"
                title={googleInitError || 'Loading Google sign-in...'}
              >
                Continue with Google
              </button>
              {googleInitError && (
                <p className="mt-2 text-red-200 text-sm">{googleInitError}</p>
              )}
            </div>
          )}

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 underline decoration-purple-400/50 hover:decoration-purple-300"
              >
                Create one here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Secure login powered by modern encryption 🔒
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;