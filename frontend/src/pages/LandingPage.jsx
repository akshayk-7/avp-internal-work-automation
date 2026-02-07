import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    BarChart2,
    Users,
    ArrowRight,
    Menu,
    X,
    Shield,
    Zap,
    Layout
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">T</div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">TaxOps</span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                        <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Workflow</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">Log in</Link>
                        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                            Request Demo
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900 p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="px-6 py-8 space-y-4">
                            <a href="#features" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600">Features</a>
                            <a href="#workflow" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600">Workflow</a>
                            <a href="#pricing" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-600 hover:text-blue-600">Pricing</a>
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center text-base font-medium text-slate-600 hover:text-blue-600">Log in</Link>
                                <button className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-base font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                                    Request Demo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
            {/* Background Gradients - Adjusted to prevent overflow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden w-full">
                <div className="absolute top-0 right-[-100px] w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-70 mix-blend-multiply animate-blob"></div>
                <div className="absolute bottom-0 left-[-100px] w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-70 mix-blend-multiply animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left: Text Content */}
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-6"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                            Built for Tax Offices
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
                        >
                            Manage Bulk <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ITR Filing</span> <br />
                            Without Chaos
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg"
                        >
                            Replace scattered Excel sheets with a unified dashboard. Track annexures, assignments, and e-verifications in real-time.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center group">
                                Get Started
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all hover:border-slate-300">
                                View Workflow
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Dashboard Preview */}
                    <div className="relative w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full transform scale-90"></div>

                        {/* Glass Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-900/5"
                        >
                            {/* Window Controls */}
                            <div className="bg-white/50 border-b border-slate-100 px-6 py-4 flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>

                            {/* Internal UI Mockup */}
                            <div className="p-6 bg-slate-50/50 min-h-[400px]">
                                {/* Top Stats Row */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <div className="text-slate-500 text-xs font-semibold uppercase mb-1">Total Filed</div>
                                        <div className="text-2xl font-bold text-slate-800">1,248</div>
                                        <div className="text-xs text-green-600 font-medium mt-1">+12% from yesterday</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                        <div className="text-slate-500 text-xs font-semibold uppercase mb-1">Pending</div>
                                        <div className="text-2xl font-bold text-slate-800">432</div>
                                        <div className="text-xs text-amber-600 font-medium mt-1">Due within 3 days</div>
                                    </div>
                                </div>

                                {/* Chart Area Mock */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                                        <div className="h-4 w-12 bg-blue-50 rounded text-blue-600 text-xs flex items-center justify-center">Week</div>
                                    </div>
                                    <div className="flex items-end space-x-2 h-24">
                                        {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                            <div key={i} className="flex-1 bg-blue-100 rounded-t-sm relative group">
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* List Items Mock */}
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                                                <div className="space-y-1">
                                                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                                                    <div className="h-2 w-12 bg-slate-50 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const DashboardPreviewSection = () => {
    return (
        <section className="relative overflow-hidden py-24 bg-slate-950">
            {/* Background Glows - Wrapped for overflow safety */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden w-full">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
                    >
                        Interactive Dashboard Demo
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400"
                    >
                        Charts, Grids, and Real-time Analytics
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-3xl bg-slate-900 border border-slate-800 p-2 shadow-2xl"
                >
                    <div className="rounded-2xl bg-slate-800/50 overflow-hidden ring-1 ring-white/5">
                        {/* App Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
                            <div className="flex items-center space-x-4">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="h-4 w-32 bg-slate-700/50 rounded-full"></div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-slate-700/50"></div>
                        </div>

                        {/* Dashboard Body */}
                        <div className="p-6 md:p-8 space-y-8">
                            {/* KPIs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Clients", value: "2,543", color: "blue" },
                                    { label: "Filed Today", value: "128", color: "green" },
                                    { label: "Pending", value: "432", color: "amber" },
                                    { label: "E-Verified", value: "1,980", color: "purple" }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -2 }}
                                        className="bg-slate-700/30 border border-slate-700/50 p-4 rounded-xl backdrop-blur-sm"
                                    >
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <div className={`h-1 w-full bg-${stat.color}-500/20 mt-3 rounded-full overflow-hidden`}>
                                            <div className={`h-full bg-${stat.color}-500 w-2/3 rounded-full`}></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Chart Section */}
                                <div className="md:col-span-2 bg-slate-700/30 border border-slate-700/50 rounded-xl p-6 relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-sm font-semibold text-slate-200">Filing Performance</h3>
                                        <div className="h-6 w-20 bg-slate-700/50 rounded text-xs flex items-center justify-center text-slate-400">Last 7 Days</div>
                                    </div>
                                    <div className="h-48 flex items-end justify-between gap-2">
                                        {[35, 55, 40, 70, 50, 85, 60, 75, 50, 65, 80, 45].map((h, i) => (
                                            <div key={i} className="flex-1 w-full bg-blue-500/10 rounded-t-sm relative group overflow-hidden">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    whileInView={{ height: `${h}%` }}
                                                    transition={{ duration: 1, delay: i * 0.05 }}
                                                    className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm group-hover:bg-blue-400 transition-colors"
                                                ></motion.div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Productivity Section */}
                                <div className="space-y-4">
                                    <div className="bg-slate-700/30 border border-slate-700/50 rounded-xl p-6">
                                        <h3 className="text-sm font-semibold text-slate-200 mb-4">Team Productivity</h3>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((_, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between text-xs text-slate-400">
                                                        <span>Range {i + 1}</span>
                                                        <span>{85 - i * 5}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${85 - i * 5}%` }}
                                                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                        ></motion.div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mini List */}
                                    <div className="bg-slate-700/30 border border-slate-700/50 rounded-xl p-6">
                                        <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {[1, 2].map((_, i) => (
                                                <div key={i} className="flex items-center space-x-3 text-sm">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="text-slate-400">Batch {204 + i} uploaded</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Preview */}
                            <div className="bg-slate-700/30 border border-slate-700/50 rounded-xl overflow-hidden">
                                <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-700/50 bg-slate-800/30 text-xs font-semibold text-slate-400 uppercase">
                                    <div className="col-span-1">Client Name</div>
                                    <div className="col-span-1">PAN</div>
                                    <div className="col-span-1">Status</div>
                                    <div className="col-span-1 text-right">Date</div>
                                </div>
                                {[1, 2, 3, 4, 5].map((row, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="grid grid-cols-4 gap-4 p-4 border-b border-slate-700/30 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="col-span-1 font-medium text-white">Ramesh Kumar</div>
                                        <div className="col-span-1 text-slate-500">ABCDE1234F</div>
                                        <div className="col-span-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                Filed
                                            </span>
                                        </div>
                                        <div className="col-span-1 text-right text-slate-500">Today</div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const Features = () => {
    const features = [
        {
            title: "CEO View",
            description: "Bird's eye view of office performance, range comparisons, and efficiency metrics.",
            icon: BarChart2
        },
        {
            title: "AO Management",
            description: "Assign districts, balance workloads among OAs, and track daily output.",
            icon: Users
        },
        {
            title: "OA Worklist",
            description: "Clear personal worklists with one-click status updates and e-verification tracking.",
            icon: Layout
        }
    ];

    return (
        <section id="features" className="relative overflow-hidden py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 w-full relative">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Built for Every Role</h2>
                    <p className="text-lg text-slate-600">Empower your entire hierarchy with purpose-built tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
                        >
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
            <Navbar />
            <Hero />
            <DashboardPreviewSection />
            <Features />

            {/* Short Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">© 2026 TaxOps Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-slate-900 text-sm">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 text-sm">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
