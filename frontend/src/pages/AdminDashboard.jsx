import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Users, Landmark, AlertCircle, TrendingUp, ShieldCheck, RefreshCw, Trash2, Shield, Calendar, Clock, DollarSign } from "lucide-react";

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
      // Fetch platform stats
      const statsRes = await api.get("/admin/stats");
      setMetrics(statsRes.data.metrics);
      setRecentBookings(statsRes.data.recentBookings || []);

      // Fetch pending listings
      const pendingRes = await api.get("/admin/venues/pending");
      setPendingVenues(pendingRes.data);

      // Fetch user directory
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display text-white">System Admin Console</h1>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Moderate listings approvals, monitor registrations, promote roles, and oversee platform performance
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-4"
        >
          <RefreshCw size={14} /> Refresh Dashboard
        </button>
      </div>

      {/* Admin Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Members</span>
            <span className="text-xl font-extrabold text-slate-200">{metrics.users}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-purple-400">
            <Landmark size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Spaces</span>
            <span className="text-xl font-extrabold text-slate-200">{metrics.approvedVenues}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-amber-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Needs Approval</span>
            <span className="text-xl font-extrabold text-amber-400">{metrics.pendingVenues}</span>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 text-emerald-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Turnover</span>
            <span className="text-xl font-extrabold text-slate-200">₹{metrics.revenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-4 border-b border-slate-900 mb-8 pb-px">
        <button
          onClick={() => setActiveTab("approvals")}
          className={`pb-4 text-sm font-semibold transition-all relative ${
            activeTab === "approvals" ? "text-brand-400 font-bold" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Approvals Queue ({pendingVenues.length})
          {activeTab === "approvals" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`pb-4 text-sm font-semibold transition-all relative ${
            activeTab === "users" ? "text-brand-400 font-bold" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Manage Users ({allUsers.length})
          {activeTab === "users" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-4 text-sm font-semibold transition-all relative ${
            activeTab === "bookings" ? "text-brand-400 font-bold" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          System Bookings Log ({metrics.bookings})
          {activeTab === "bookings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Clock className="animate-spin text-slate-500" size={24} />
        </div>
      ) : activeTab === "approvals" ? (
        /* APPROVALS TAB */
        pendingVenues.length === 0 ? (
          <div className="glass-card p-12 text-center border-slate-900/60 max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800 text-emerald-400">
              ✓
            </div>
            <h3 className="text-sm font-bold text-slate-300">Queue is Clear</h3>
            <p className="text-xs text-slate-400 mt-2">No new listings are awaiting review verification.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingVenues.map((venue) => (
              <div
                key={venue._id}
                className="glass-card p-6 border-slate-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-1">
                  <span className="bg-slate-950/80 border border-slate-800 text-slate-300 font-semibold text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {venue.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{venue.venueName}</h3>
                  <p className="text-xs text-slate-400">Location: {venue.location} | Capacity: {venue.capacity}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Submitted by: {venue.ownerId ? venue.ownerId.name : "Anonymous Owner"} ({venue.ownerId ? venue.ownerId.email : ""})
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-900/40">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-bold">Daily Rent</span>
                    <span className="text-sm font-extrabold text-brand-400">₹{venue.price.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handleApproveVenue(venue._id)}
                    className="btn-accent py-2 px-6 text-xs font-bold"
                  >
                    Approve Space
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "users" ? (
        /* USER LISTS TAB */
        <div className="glass-card border-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-900">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[9px] font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Full Name</th>
                  <th className="px-6 py-4 text-left">Email Address</th>
                  <th className="px-6 py-4 text-left">Role Status</th>
                  <th className="px-6 py-4 text-left">Registration Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50 text-xs text-slate-300 font-medium">
                {allUsers.map((userRow) => (
                  <tr key={userRow.id} className="hover:bg-slate-950/20">
                    <td className="px-6 py-4 font-bold text-slate-200">{userRow.name}</td>
                    <td className="px-6 py-4 text-slate-400">{userRow.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRoleChange(userRow.id, userRow.role)}
                        className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wide font-bold border transition-colors ${
                          userRow.role === "admin"
                            ? "bg-red-950/20 border-red-500/25 text-red-400"
                            : userRow.role === "owner"
                            ? "bg-brand-950/20 border-brand-500/25 text-brand-400"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                        title="Click to cycle role (user -> owner -> admin)"
                      >
                        {userRow.role}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(userRow.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {userRow.email !== "admin@venuehub.com" ? (
                        <button
                          onClick={() => handleDeleteUser(userRow.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Delete User account"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SYSTEM BOOKINGS TAB */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-200">Chronological Transactions</h2>
          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-500 font-semibold py-8">No transaction bookings registered on the platform.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.id} className="glass-card p-5 border-slate-900/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        b.status === "Confirmed"
                          ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                          : b.status === "Pending"
                          ? "bg-amber-950/40 border-amber-500/20 text-amber-400"
                          : "bg-red-950/40 border-red-500/20 text-red-400"
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">Date Slot: {b.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-2">{b.venue}</h3>
                  <p className="text-[10px] text-slate-400">Payer Name: {b.user}</p>
                </div>

                <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0 border-slate-900/60">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wide">Paid Rent</span>
                  <span className="text-sm font-extrabold text-brand-400 block">₹{b.amount.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
