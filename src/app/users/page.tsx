"use client";

import { useState, useMemo, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersPage() {
  // Ambil data dari localStorage jika ada
  const savedUsers = localStorage.getItem("users");
  const initialUsers: User[] = savedUsers ? JSON.parse(savedUsers) : [];

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal
  const [newUser, setNewUser] = useState<Partial<User>>({}); // State untuk menyimpan data user baru
  const [editingUserId, setEditingUserId] = useState<number | null>(null); // State untuk ID user yang sedang diedit

  const pageSize = 5;

  // Simpan data ke localStorage setiap kali state users berubah
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const filteredData = useMemo(() => {
    let filtered = users.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [search, sortBy, sortOrder, users]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Fungsi untuk membuka modal untuk menambahkan user
  const openAddModal = () => {
    setIsModalOpen(true);
    setNewUser({});
    setEditingUserId(null);
  };

  // Fungsi untuk membuka modal untuk mengedit user
  const openEditModal = (user: User) => {
    setIsModalOpen(true);
    setNewUser(user);
    setEditingUserId(user.id);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({}); // Reset form input
    setEditingUserId(null);
  };

  // Fungsi untuk menambahkan/mengedit user
  const handleSaveUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Nama dan Email wajib diisi!");
      return;
    }

    if (editingUserId !== null) {
      // Update user yang sedang diedit
      const updatedUsers = users.map((user) =>
        user.id === editingUserId ? { ...user, ...newUser } : user
      );

      setUsers(updatedUsers);
    } else {
      // Tambahkan user baru
      const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1; // Generate ID baru
      const newUserToAdd = { ...newUser, id: newId } as User;

      setUsers([...users, newUserToAdd]);
    }

    closeModal(); // Tutup modal
  };

  // Fungsi untuk menghapus user
  const handleDeleteUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);

    // Simpan ke localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUsers(updatedUsers);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>

      {/* Header dengan Tombol Tambah User dan Pencarian */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Tambah User
        </button>
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Modal untuk Menambahkan/Mengedit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingUserId ? "Edit User" : "Tambah User"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={newUser.name || ""}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email || ""}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
                onClick={handleSaveUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                {editingUserId ? "Simpan Perubahan" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabel Data */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("id")}
            >
              ID {sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Nama {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("email")}
            >
              Email{" "}
              {sortBy === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-2 text-center">
                Tidak ada data yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}