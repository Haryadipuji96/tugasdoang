'use client';
import React, { useState } from 'react';

const Dashboard = () => {
  // Contoh data dummy untuk dashboard
  const hotelOverview = {
    totalBookings: 120,
    totalRevenue: '$15,000',
    availableRooms: 45,
    occupancyRate: '75%',
  };

  // State untuk recent bookings
  const [recentBookings, setRecentBookings] = useState([
    { id: 1, room: 'Deluxe Room', guest: 'John Doe', checkIn: '2023-10-15', checkOut: '2023-10-20' },
    { id: 2, room: 'Suite Room', guest: 'Jane Smith', checkIn: '2023-10-16', checkOut: '2023-10-18' },
    { id: 3, room: 'Standard Room', guest: 'Alice Johnson', checkIn: '2023-10-17', checkOut: '2023-10-19' },
  ]);

  // State untuk modal konfirmasi
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState<number | null>(null);

  // State untuk notifikasi
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // Fungsi untuk membuka modal konfirmasi
  const openConfirmModal = (id: number) => {
    setBookingIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  // Fungsi untuk menutup modal konfirmasi
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setBookingIdToDelete(null);
  };

  // Fungsi untuk menghapus data
  const handleDelete = () => {
    if (bookingIdToDelete === null) return;

    // Hapus booking dengan ID tertentu
    const updatedBookings = recentBookings.filter((booking) => booking.id !== bookingIdToDelete);
    setRecentBookings(updatedBookings);

    // Tutup modal konfirmasi
    closeConfirmModal();

    // Tampilkan notifikasi
    setIsNotificationVisible(true);

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
      setIsNotificationVisible(false);
    }, 3000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Hotel Booking Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your hotel's performance.</p>
      </header>

      {/* Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Bookings</h2>
          <p className="text-2xl text-blue-600">{hotelOverview.totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Total Revenue</h2>
          <p className="text-2xl text-green-600">{hotelOverview.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Available Rooms</h2>
          <p className="text-2xl text-yellow-600">{hotelOverview.availableRooms}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">Occupancy Rate</h2>
          <p className="text-2xl text-purple-600">{hotelOverview.occupancyRate}</p>
        </div>
      </section>

      {/* Recent Bookings Section */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Bookings</h2>
        <table className="w-full text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="py-2">Room Type</th>
              <th className="py-2">Guest Name</th>
              <th className="py-2">Check-In Date</th>
              <th className="py-2">Check-Out Date</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3">{booking.room}</td>
                  <td className="py-3">{booking.guest}</td>
                  <td className="py-3">{booking.checkIn}</td>
                  <td className="py-3">{booking.checkOut}</td>
                  <td className="py-3">
                    <button
                      onClick={() => openConfirmModal(booking.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-3 text-center">
                  Tidak ada data yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal Konfirmasi */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Konfirmasi Penghapusan</h2>
            <p>Apakah Anda yakin ingin menghapus data ini?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeConfirmModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
              >
                Tidak
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi */}
      {isNotificationVisible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out">
          Data berhasil dihapus!
        </div>
      )}
    </div>
  );
};

export default Dashboard;