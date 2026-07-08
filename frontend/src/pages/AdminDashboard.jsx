import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Users, Landmark, AlertCircle, TrendingUp, RefreshCw, Trash2, Shield, Calendar, Clock, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const { showAlert } = useAuth();
  
  // States
  const [activeTab, setActiveTab] = useState("approvals"); // "approvals", "users", "bookings"
  const [metrics, setMetrics] = useState({ users: 0, venues: 0, approvedVenues: 0, pendingVenues: 0, bookings: 0, confirmedBookings: 0, revenue: 0 });
  const [pendingVenues, setPendingVenues] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get("/admin/stats");
      setMetrics(statsRes.data.metrics);
      setRecentBookings(statsRes.data.recentBookings || []);

      const pendingRes = await api.get("/admin/venues/pending");
      setPendingVenues(pendingRes.data);

      const usersRes = await api.get("/admin/users");
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error("Error loading admin stats:", err.message);
      showAlert("Could not load administrative details.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveVenue = async (venueId) => {
    try {
      await api.put(`/admin/venues/${venueId}/approve`);
      showAlert("Listing approved successfully and marked active!", "success");
      fetchAdminData();
    } catch (err) {
      showAlert("Approval operation failed.", "error");
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === "user" ? "owner" : currentRole === "owner" ? "admin" : "user";
    if (!window.confirm(`Promote user role to [${nextRole.toUpperCase()}]?`)) return;
    try {
      await api.put(`/admin/users/${userId}/role`, { role: nextRole });
      showAlert("User role updated successfully!", "success");
      fetchAdminData();
    } catch (err) {
      showAlert("Failed to update user role.", "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      showAlert("User profile deleted.", "success");
      fetchAdminData();
    } catch (err) {
      showAlert("Failed to delete user.", "error");
    }
  };

  return (
    <div className="w-full pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-display text-darkText">Admin Console</h1>
            <p className="text-sm text-gray-500 mt-1">Moderate listings, manage users, and view platform metrics.</p>
          </div>
          <button onClick={fetchAdminData} className="btn-secondary py-2 px-4 flex items-center gap-2">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Total Members</span>
              <span className="text-2xl font-extrabold text-darkText">{metrics.users}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 shrink-0">
              <Landmark size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Active Venues</span>
              <span className="text-2xl font-extrabold text-darkText">{metrics.approvedVenues}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Pending Approval</span>
              <span className="text-2xl font-extrabold text-yellow-600">{metrics.pendingVenues}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Total Revenue</span>
              <span className="text-2xl font-extrabold text-darkText">₹{metrics.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 pb-px overflow-x-auto hide-scrollbar">
          <button onClick={() => setActiveTab("approvals")} className={`pb-4 font-bold text-sm whitespace-nowrap relative ${activeTab === "approvals" ? "text-primary" : "text-gray-500"}`}>
            Approvals Queue <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{pendingVenues.length}</span>
            {activeTab === "approvals" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />}
          </button>
          <button onClick={() => setActiveTab("users")} className={`pb-4 font-bold text-sm whitespace-nowrap relative ${activeTab === "users" ? "text-primary" : "text-gray-500"}`}>
            Users Directory <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{allUsers.length}</span>
            {activeTab === "users" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />}
          </button>
          <button onClick={() => setActiveTab("bookings")} className={`pb-4 font-bold text-sm whitespace-nowrap relative ${activeTab === "bookings" ? "text-primary" : "text-gray-500"}`}>
            Platform Bookings <span className="ml-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{metrics.bookings}</span>
            {activeTab === "bookings" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20"><Clock className="animate-spin text-primary" size={32} /></div>
        ) : activeTab === "approvals" ? (
          <div className="space-y-4">
            {pendingVenues.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-bold text-darkText">Queue is Clear</h3>
                <p className="text-gray-500 mt-2 text-sm">No new listings are awaiting review verification.</p>
              </div>
            ) : (
              pendingVenues.map(venue => (
                <div key={venue._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <span className="bg-orange-100 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">{venue.category}</span>
                    <h3 className="text-lg font-bold text-darkText mt-2">{venue.venueName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{venue.location} | Capacity: {venue.capacity} pax</p>
                    <p className="text-[11px] text-gray-400 mt-2">Owner ID: {venue.ownerId?._id || "Unknown"}</p>
                  </div>
                  <div className="flex flex-col justify-between items-start md:items-end border-t md:border-0 border-gray-100 pt-4 md:pt-0">
                    <span className="text-xl font-extrabold text-primary mb-4 block">₹{venue.price.toLocaleString()} <span className="text-xs text-gray-500">/day</span></span>
                    <button onClick={() => handleApproveVenue(venue._id)} className="btn-primary py-2 px-6 shadow-sm">Approve Listing</button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === "users" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {allUsers.map(userRow => (
                    <tr key={userRow.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-darkText">{userRow.name}</td>
                      <td className="px-6 py-4 text-gray-600">{userRow.email}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRoleChange(userRow.id, userRow.role)}
                          className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border transition-colors ${
                            userRow.role === "admin" ? "bg-red-50 text-red-600 border-red-200" :
                            userRow.role === "owner" ? "bg-blue-50 text-blue-600 border-blue-200" :
                            "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {userRow.role}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(userRow.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {userRow.email !== "admin@venuehub.com" ? (
                          <button onClick={() => handleDeleteUser(userRow.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <Shield size={16} className="text-gray-300 ml-auto mr-2" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No bookings yet.</p>
            ) : (
              recentBookings.map(b => (
                <div key={b.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      b.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                      b.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                    }`}>{b.status}</span>
                    <h3 className="font-bold text-darkText mt-2">{b.venue}</h3>
                    <p className="text-xs text-gray-500 mt-1">Guest: {b.user} | Date: {b.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block uppercase font-bold mb-1">Paid</span>
                    <span className="font-extrabold text-primary text-lg">₹{b.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
