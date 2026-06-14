import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyApplications, uploadResume } from "../services/applicationService";
import Loader from "../components/Loader";
import styles from "../styles/profile.module.css";

const Profile = () => {
  const { user, loading, fetchUser } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data.applications || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setApplications([]);
      } else {
        console.log(err);
      }
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      await uploadResume(file);
      setMessage("Resume uploaded successfully.");
      await fetchUser();
    } catch (err) {
      setMessage(err.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Simple approach: Just open the URL directly (Cloudinary handles it with ?fl_inline)
  const handleViewResume = () => {
    if (!user?.resume?.url) return;

    setLoadingResume(true);
    setResumeUrl(user.resume.url);
    setLoadingResume(false);
  };

  const closeResume = () => {
    setResumeUrl(null);
  };

  if (loading) return <Loader />;

  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2>My Profile</h2>
          <p>Manage your account and applications</p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* PROFILE CARD */}
        <div className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{initials}</div>

            <div>
              <h3>{user?.name}</h3>
              <p className={styles.muted}>{user?.email}</p>
            </div>
          </div>

          <div className={styles.details}>
            <div>
              <strong>Role</strong>
              <p>{user?.role}</p>
            </div>

            {user?.resume?.url && (
              <>
                <div>
                  <strong>Resume</strong>
                  <p className={styles.resumeRow}>
                    <span>{user.resume.originalName || "Uploaded resume"}</span>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {/* ✅ View button - opens in modal */}
                      <button
                        onClick={handleViewResume}
                        disabled={loadingResume}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#007bff",
                          cursor: loadingResume ? "not-allowed" : "pointer",
                          textDecoration: "underline",
                          padding: 0,
                          opacity: loadingResume ? 0.6 : 1,
                          fontSize: "14px",
                          fontWeight: "500"
                        }}
                      >
                        {loadingResume ? "Loading..." : "View"}
                      </button>

                     
                    </div>
                  </p>
                </div>

                <div>
                  <strong>Uploaded</strong>
                  <p>
                    {user.resume.uploadedAt
                      ? new Date(user.resume.uploadedAt).toLocaleDateString()
                      : "Recent"}
                  </p>
                </div>
              </>
            )}
          </div>

          {user?.role !== "admin" ? (
            <label className={styles.upload}>
              <span>
                {uploading
                  ? "Uploading resume..."
                  : user?.resume?.url
                    ? "Update resume"
                    : "Upload resume"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
              />
            </label>
          ) : (
            <div className={styles.infoBox}>
              Resume upload is only available to job seekers.
            </div>
          )}

          {message && <div className={styles.alert}>{message}</div>}
        </div>

        {/* APPLICATIONS CARD */}
        <div className={styles.card}>
          <h3>My Applications</h3>

          {applications.length === 0 ? (
            <p className={styles.empty}>
              No applications yet. Start applying to jobs.
            </p>
          ) : (
            <ul className={styles.list}>
              {applications.map((app) => (
                <li key={app._id} className={styles.listItem}>
                  <div>
                    <strong>{app.job.title}</strong>
                    <p className={styles.muted}>
                      {app.job.location} · $
                      {app.job.salary.toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`${styles.badge} ${styles[app.status]}`}
                  >
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ✅ RESUME MODAL - displays PDF inline */}
      {resumeUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={closeResume}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "900px",
              height: "90vh",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ Embed PDF directly - ?fl_inline tells Cloudinary to show it inline */}
            <embed
              src={resumeUrl}
              type="application/pdf"
              style={{
                flex: 1,
                width: "100%",
                borderRadius: "8px 8px 0 0"
              }}
              title="resume"
            />

            <div
              style={{
                padding: "12px 20px",
                background: "#f8f9fa",
                borderTop: "1px solid #e9ecef",
                borderRadius: "0 0 8px 8px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end"
              }}
            >
              <button
                onClick={() => window.open(resumeUrl, "_blank")}
                style={{
                  padding: "8px 16px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Open in New Tab
              </button>
              <button
                onClick={closeResume}
                style={{
                  padding: "8px 16px",
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
