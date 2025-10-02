import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      icon: '🎯',
      title: 'Smart Organization',
      description: 'Organize your tasks with intelligent categorization and priority management.',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with modern technology for blazing fast performance and responsiveness.',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.',
    },
    {
      icon: '📱',
      title: 'Cross Platform',
      description: 'Access your tasks anywhere, anytime with our responsive design.',
    },
    {
      icon: '🤝',
      title: 'Team Collaboration',
      description: 'Share and collaborate on tasks with your team members seamlessly.',
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Track your productivity with detailed analytics and performance insights.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent mb-8 leading-tight">
              Master Your Tasks
              <br />
              <span className="text-4xl md:text-6xl">Achieve More ✨</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your productivity with Task Manager - the ultimate task management platform 
              designed for modern professionals who demand excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 hover:-translate-y-1"
              >
                🚀 Start Your Journey
              </Link>
              <Link
                to="/login"
                className="border-2 border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:scale-105"
              >
                🔑 Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Task Manager</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the features that make TaskFlow the preferred choice for productivity enthusiasts worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Join thousands of professionals who have already revolutionized their workflow with TaskFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-10 py-5 rounded-xl text-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 hover:-translate-y-1"
            >
              🎯 Get Started Free
            </Link>
            <div className="text-gray-400 flex items-center justify-center">
              <span className="text-sm">✨ No credit card required • 🚀 Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Task Manager. Crafted with ❤️ for productivity enthusiasts.
          </p>
        </div>
      </div>
    </div>
  );
}