import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Users,
    Upload,
    LayoutDashboard,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['CEO', 'AO', 'OA'] },
        { name: 'Clients', path: '/clients', icon: Users, roles: ['CEO', 'AO', 'OA'] },
        { name: 'Import', path: '/import', icon: Upload, roles: ['CEO', 'AO'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user?.user_role));

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <aside className="hidden w-64 bg-white shadow-md md:flex md:flex-col">
                <div className="flex items-center justify-center h-16 border-b">
                    <span className="text-xl font-bold text-gray-800">TaxOps Check</span>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {filteredNavItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-gray-700 rounded-md transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center mb-4">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                            <p className="text-xs text-gray-500">{user?.user_role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header - Mobile */}
                <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm md:hidden">
                    <span className="text-xl font-bold text-gray-800">TaxOps Check</span>
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Sidebar - Mobile */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
                        <div className="relative flex flex-col w-64 bg-white shadow-xl">
                            <div className="flex items-center justify-between h-16 px-4 border-b">
                                <span className="text-xl font-bold text-gray-800">TaxOps Check</span>
                                <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-2">
                                {filteredNavItems.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 text-gray-700 rounded-md ${isActive ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </nav>
                            <div className="p-4 border-t">
                                <div className="flex items-center mb-4">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                                        <p className="text-xs text-gray-500">{user?.user_role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
