// components/Navbar.js
'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // State untuk halaman aktif

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return (
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600">
            This is your main dashboard page. You can add charts, tables, or other components here to display important data.
          </p>

          {/* Example Card */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Total Users</h2>
              <p className="text-gray-600 mt-2">1,250</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Active Rooms</h2>
              <p className="text-gray-600 mt-2">50</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
              <p className="text-gray-600 mt-2">750</p>
            </div>
          </div>
        </div>
      );
    }

    // Default content (Home page)
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">SELAMAT DATANG</h1>
      </div>
    );
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-red-500 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button onClick={() => setCurrentPage('home')} className="text-lg font-bold cursor-pointer">
                Puji Haryadi
              </button>
            </div>

            {/* Menu Items */}
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="hover:bg-red-400 hover:text-white px-4 py-2 rounded text-white"
              >
                <span>Dashboard</span>
              </button>
              <Link href="/room" className="hover:bg-red-400 hover:text-white px-4 py-2 rounded text-white">
                <span>Room</span>
              </Link>
              <Link href="/users" className="hover:bg-red-400 hover:text-white px-4 py-2 rounded text-white">
                <span>User</span>
              </Link>

              {/* Dropdown for Transaction */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="hover:bg-red-400 hover:text-white px-4 py-2 rounded flex items-center text-white"
                >
                  <span>Transaction</span>
                  <svg
                    className="ml-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-red-500 rounded-md shadow-lg">
                    <Link
                      href="/booking"
                      className="block px-4 py-2 text-sm text-white hover:bg-red-400 hover:text-white"
                    >
                      <span>Booking</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{renderContent()}</main>
    </div>
  );
};

export default Navbar;