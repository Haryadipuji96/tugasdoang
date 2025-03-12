"use client"; // Karena kita menggunakan state dan event handler

import { useState, useEffect } from "react";

interface Booking {
  id: number;
  room: string;
  bookedDate: string;
  bookedBy: string;
  price: number;
}

export default function BookingPage() {
  // Ambil data dari localStorage jika ada
  const savedBookings = localStorage.getItem("bookings");
  const initialBookings: Booking[] = savedBookings ? JSON.parse(savedBookings) : [];

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Daftar kategori yang tersedia
  const categories = ["Standard Room", "Superior Room", "Deluxe Room", "Twin Room", "Single Room"];

  // Fungsi untuk membuka modal
  const openModal = (id?: number) => {
    if (id !== undefined) {
      const bookingToEdit = bookings.find((booking) => booking.id === id);
      if (bookingToEdit) {
        setFormData(bookingToEdit);
        setEditingId(id);
      }
    } else {
      setFormData({});
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditingId(null);
  };

  // Fungsi untuk mengubah nilai form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fungsi untuk menambah/mengedit data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.room || !formData.bookedDate || !formData.bookedBy || !formData.price) {
      alert("Semua field harus diisi!");
      return;
    }

    if (editingId !== null) {
      // Update data yang sedang diedit
      const updatedBookings = bookings.map((booking) =>
        booking.id === editingId ? { ...booking, ...formData } : booking
      );

      // Simpan ke localStorage
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      setBookings(updatedBookings);
    } else {
      // Tambah data baru
      const newBooking: Booking = {
        id: bookings.length > 0 ? bookings[bookings.length - 1].id + 1 : 1,
        room: formData.room || "",
        bookedDate: formData.bookedDate || "",
        bookedBy: formData.bookedBy || "",
        price: Number(formData.price) || 0,
      };

      const updatedBookings = [...bookings, newBooking];

      // Simpan ke localStorage
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      setBookings(updatedBookings);
    }

    // Reset form dan tutup modal
    closeModal();
  };

  // Fungsi untuk menghapus data
  const handleDelete = (id: number) => {
    const updatedBookings = bookings.filter((booking) => booking.id !== id);

    // Simpan ke localStorage
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    setBookings(updatedBookings);
  };

  // Filter data berdasarkan kata kunci pencarian
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Booking Management</h1>

      {/* Header dengan Tombol Tambah Room dan Pencarian */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Tambah Booking
        </button>
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Cari berdasarkan Room atau Booked By..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Booking" : "Tambah Booking"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="room"
                value={formData.room || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Pilih Kategori Room</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="bookedDate"
                value={formData.bookedDate || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="bookedBy"
                placeholder="Booked By"
                value={formData.bookedBy || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price || ""}
                onChange={handleChange}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  {editingId ? "Simpan Perubahan" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel Data */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">No</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Booked Date</th>
            <th className="border p-2">Booked By</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <tr key={booking.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{booking.room}</td>
                <td className="border p-2">{booking.bookedDate}</td>
                <td className="border p-2">{booking.bookedBy}</td>
                <td className="border p-2">{booking.price}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openModal(booking.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border p-2 text-center">
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}