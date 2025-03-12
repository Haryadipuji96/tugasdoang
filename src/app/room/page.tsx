"use client"; // Karena kita menggunakan state dan event handler

import { useState, useEffect } from "react";

interface Room {
  id: number;
  no: string;
  nama: string;
  kapasitas: number;
  kategori: string;
  price: number;
  status: "pending" | "approved" | "rejected";
}

export default function RoomPage() {
  // Ambil data dari localStorage jika ada
  const savedRooms = localStorage.getItem("rooms");
  const initialRooms: Room[] = savedRooms ? JSON.parse(savedRooms) : [];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({});
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Daftar kategori yang tersedia
  const categories = ["Standard Room", "Superior Room", "Deluxe Room", "Twin Room", "Single Room"];

  // Fungsi untuk membuka/tutup modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewRoom({});
    setEditingRoom(null);
  };

  // Fungsi untuk menambahkan data baru
  const handleAddRoom = () => {
    if (!newRoom.no || !newRoom.nama || !newRoom.kapasitas || !newRoom.kategori || !newRoom.price) {
      alert("Semua field harus diisi!");
      return;
    }

    const newId = rooms.length > 0 ? rooms[rooms.length - 1].id + 1 : 1;
    const roomToAdd = { ...newRoom, id: newId, status: "pending" as const };
    const updatedRooms = [...rooms, roomToAdd as Room];

    // Simpan ke localStorage
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    setRooms(updatedRooms);
    setNewRoom({});
    closeModal();
  };

  // Fungsi untuk menghapus data
  const handleDeleteRoom = (id: number) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);

    // Simpan ke localStorage
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    setRooms(updatedRooms);
  };

  // Fungsi untuk memulai edit
  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setNewRoom(room);
    openModal();
  };

  // Fungsi untuk menyimpan perubahan
  const handleSaveEdit = () => {
    if (!editingRoom) return;

    const updatedRooms = rooms.map((room) =>
      room.id === editingRoom.id ? { ...room, ...newRoom } : room
    );

    // Simpan ke localStorage
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    setRooms(updatedRooms);
    setEditingRoom(null);
    setNewRoom({});
    closeModal();
  };

  // Fungsi untuk mengubah status ke Approved
  const handleApprove = (id: number) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id ? { ...room, status: "approved" as const } : room
    );

    // Simpan ke localStorage
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    setRooms(updatedRooms);
  };

  // Fungsi untuk mengubah status ke Rejected
  const handleReject = (id: number) => {
    const updatedRooms = rooms.map((room) =>
      room.id === id ? { ...room, status: "rejected" as const } : room
    );

    // Simpan ke localStorage
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));

    setRooms(updatedRooms);
  };

  // Filter rooms berdasarkan search query
  const filteredRooms = rooms.filter((room) =>
    room.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Room Management</h1>

      {/* Header dengan Tombol Tambah Room dan Pencarian */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Tambah Room
        </button>
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
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
            <h2 className="text-xl font-semibold mb-4">{editingRoom ? "Edit Room" : "Tambah Room"}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="No"
                value={newRoom.no || ""}
                onChange={(e) => setNewRoom({ ...newRoom, no: e.target.value })}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Nama"
                value={newRoom.nama || ""}
                onChange={(e) => setNewRoom({ ...newRoom, nama: e.target.value })}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Kapasitas"
                value={newRoom.kapasitas || ""}
                onChange={(e) => setNewRoom({ ...newRoom, kapasitas: Number(e.target.value) })}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newRoom.kategori || ""}
                onChange={(e) => setNewRoom({ ...newRoom, kategori: e.target.value })}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price"
                value={newRoom.price || ""}
                onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Batal
              </button>
              <button
                onClick={editingRoom ? handleSaveEdit : handleAddRoom}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                {editingRoom ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabel Data */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">No</th>
            <th className="border p-2">Nama</th>
            <th className="border p-2">Kapasitas</th>
            <th className="border p-2">Kategori</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <tr key={room.id}>
                <td className="border p-2">{room.no}</td>
                <td className="border p-2">{room.nama}</td>
                <td className="border p-2">{room.kapasitas}</td>
                <td className="border p-2">{room.kategori}</td>
                <td className="border p-2">{room.price}</td>
                <td className="border p-2">
                  {room.status === "pending" && "Pending"}
                  {room.status === "approved" && "Approved"}
                  {room.status === "rejected" && "Rejected"}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleApprove(room.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(room.id)}
                    className="bg-red-700 text-white px-2 py-1 rounded hover:bg-red-800 transition duration-300"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="border p-2 text-center">
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}