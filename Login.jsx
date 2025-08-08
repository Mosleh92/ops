import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Sign in to your account</h2>
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-right text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-right text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors font-bold"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center text-gray-500 text-sm">
          Don't have an account? <a href="#" className="text-purple-600 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
