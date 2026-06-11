import { useEffect, useState } from "react";
import { getAllApplications, changeApplicationStatus } from "../../services/adminService";
import Loader from "../../components/Loader";
import styles from "../../styles/Applications.module.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getAllApplications();
        setApplications(res.data.applications || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setStatusUpdatingId(applicationId);

      const res = await changeApplicationStatus(applicationId, status);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? {
                ...app,
                status: res.data.application.status,
              }
            : app
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update status"
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h2>All Applications</h2>
        <p>See every candidate application across the platform.</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}

        {applications.length === 0 ? (
          <p className={styles.empty}>
            No applications submitted yet.
          </p>
        ) : (
          <ul className={styles.applicationList}>
            {applications.map((app) => (
              <li
                key={app._id}
                className={styles.applicationItem}
              >
                {/* Job Info */}
                <div className={styles.jobInfo}>
                  <strong>
                    {app.job?.title || "Job Title"}
                  </strong>

                  <p>
                    {app.job?.location || "Location"} · $
                    {app.job?.salary?.toLocaleString() || "0"}
                  </p>
                </div>

                {/* User Info */}
                <div className={styles.userInfo}>
                  <p className={styles.userName}>
                    {app.user?.name || "Candidate"}
                  </p>

                  <p className={styles.userEmail}>
                    {app.user?.email || "Email"}
                  </p>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                  <span
                    className={`${styles.badge} ${
                      styles[app.status] || styles.pending
                    }`}
                  >
                    {app.status}
                  </span>

                  {app.resumeSnapshot && (
                    <button
                      className={`${styles.button} ${styles.resumeBtn}`}
                      onClick={() =>
                        window.open(app.resumeSnapshot, "_blank")
                      }
                    >
                      View Resume
                    </button>
                  )}

                  <button
                    className={`${styles.button} ${styles.approveBtn}`}
                    onClick={() =>
                      updateStatus(app._id, "approved")
                    }
                    disabled={statusUpdatingId === app._id}
                  >
                    {statusUpdatingId === app._id
                      ? "Updating..."
                      : "Approve"}
                  </button>

                  <button
                    className={`${styles.button} ${styles.rejectBtn}`}
                    onClick={() =>
                      updateStatus(app._id, "rejected")
                    }
                    disabled={statusUpdatingId === app._id}
                  >
                    {statusUpdatingId === app._id
                      ? "Updating..."
                      : "Reject"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Applications;