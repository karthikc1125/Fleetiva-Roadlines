import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getApiBaseUrl } from "../api/baseUrl";
import { safeStorage } from "../utils/storage";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api

      .get("/customer/bookings")
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]))

      .get("/booking/customer/bookings")
      .then((res) => setBookings(res.data))
      .catch((error) => console.error("Fetch error:", error))

      .finally(() => setLoading(false));
  }, []);

  const API_BASE = getApiBaseUrl();

  const downloadBilty = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/bilty?token=${safeStorage.get("accessToken")}`,
      "_blank",
    );

  const downloadInvoice = (id) =>
    window.open(
      `${API_BASE}/booking/${id}/invoice?token=${safeStorage.get("accessToken")}`,
      "_blank",
    );

  return (
    <div className="page dashboard-page">
      <div className="page-content">
        <div className="page-header dashboard-header">
          <div className="dashboard-header-text">
            <h2 className="page-title">Customer Dashboard</h2>
            <p className="page-subtitle">
              Track your active shipments and post new loads in seconds.
            </p>
          </div>
          <button
            className="btn btn-primary dashboard-cta"
            onClick={() => navigate("/post-load")}
          >
            Post New Load
          </button>
        </div>

        <section className="stack dashboard-section">
          <h3 className="section-title">Your Bookings</h3>
          {loading ? (
            <div className="dashboard-card dashboard-card-empty">
              <div className="dashboard-loading" aria-hidden="true" />
              <p className="dashboard-empty-title">Loading bookings…</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="dashboard-card dashboard-card-empty">
              <span className="dashboard-empty-icon" aria-hidden="true">
                📦
              </span>
              <p className="dashboard-empty-title">No bookings yet</p>
              <p className="dashboard-empty-desc">
                Post your first load to start receiving matches.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/post-load")}
              >
                Post a load
              </button>
            </div>
          ) : (
            <div className="dashboard-booking-list">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="dashboard-card dashboard-booking-card"
                >
                  <div className="dashboard-booking-main">
                    <p className="dashboard-booking-title">
                      {b.load?.material || "Load"}
                    </p>
                    <p className="dashboard-booking-route text-muted">
                      {b.from} → {b.to}
                    </p>
                  </div>
                  <span
                    className={`tag ${
                      b.status === "delivered"
                        ? "success"
                        : b.status === "in-transit"
                          ? "info"
                          : "warning"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
