import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full font-inter overflow-hidden bg-slate-50">
            {/* Left Side - Branding Area */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 text-white p-12 flex-col justify-between">
                {/* Animated Background Glow */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1
                        }}
                        className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]"
                    />
                </div>

                {/* Branding Content */}
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white text-xl">T</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">TaxOps</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mt-24 space-y-6"
                    >
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                            Simplify Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Tax Operations
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                            Experience the next generation of tax management. Automated, secure, and designed for modern finance teams.
                        </p>
                    </motion.div>
                </div>

                {/* Footer/Testimonial or just minimal footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 text-sm text-slate-500"
                >
                    © 2026 TaxOps Inc. Enterprise Grade Security.
                </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
                {/* Subtle background elements for right side to enhance glassmorphism */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Glass Card */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8 md:p-10">
                        <motion.div variants={fadeIn} className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back</h2>
                            <p className="text-slate-500 mt-2 text-sm">Please enter your details to sign in.</p>
                        </motion.div>

                        <form className="space-y-6">
                            <motion.div variants={fadeIn} className="space-y-4">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Forgot Password & Remember Me */}
                            <motion.div variants={fadeIn} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                                        Remember for 30 days
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Sign in
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </motion.button>

                            {/* Divider */}
                            <motion.div variants={fadeIn} className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white/50 text-slate-500 backdrop-blur-sm">Or continue with</span>
                                </div>
                            </motion.div>

                            {/* Google Button (Optional but adds to premium feel) */}
                            <motion.button
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                className="w-full flex justify-center items-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                            >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26+-.19-.58z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign in with Google
                            </motion.button>

                        </form>
                    </div>

                    <motion.p variants={fadeIn} className="text-center mt-8 text-sm text-slate-500">
                        Don't have an account?{' '}
                        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                            Sign up for free
                        </a>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
