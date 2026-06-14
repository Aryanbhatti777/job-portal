import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getApplicants,
  changeApplicationStatus,
} from "../../services/adminService";
import Loader from "../../components/Loader";
import styles from "../../styles/Applicants.module.css";

const Applicants = () => {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        const res = await getApplicants(jobId);
        setApplicants(res.data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load applicants");
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    try {
      setStatusUpdatingId(id);

      const res = await changeApplicationStatus(id, status);

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status: res.data.application.status }
            : app
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>All Applications</h2>
        <p>See every candidate application across the platform.</p>
      </div>

      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}

        {applicants.length === 0 ? (
          <p className={styles.empty}>No applicants yet.</p>
        ) : (
          <div className={styles.list}>
            {applicants.map((app) => (
              <div key={app._id} className={styles.item}>
                
                {/* LEFT */}
                <div className={styles.left}>
                  <h3>{app.user.name}</h3>
                  <p>{app.user.email}</p>

                  {app.resumeSnapshot && (
                    <button
                      className={styles.resumeBtn}
                      onClick={() => setResumeUrl(app.resumeSnapshot)}
                    >
                      View Resume
                    </button>
                  )}
                </div>

                {/* RIGHT */}
                <div className={styles.right}>
                  <span
                    className={`${styles.badge} ${styles[app.status]}`}
                  >
                    {app.status}
                  </span>

                  <button
                    className={styles.approveBtn}
                    onClick={() => updateStatus(app._id, "approved")}
                    disabled={statusUpdatingId === app._id}
                  >
                    {statusUpdatingId === app._id ? "..." : "Approve"}
                  </button>

                  <button
                    className={styles.rejectBtn}
                    onClick={() => updateStatus(app._id, "rejected")}
                    disabled={statusUpdatingId === app._id}
                  >
                    {statusUpdatingId === app._id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESUME MODAL */}
      {resumeUrl && (
  <div
    className={styles.modalBackdrop}
    onClick={() => setResumeUrl(null)}
  >
    <div
      className={styles.modal}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Option 1: Embed PDF viewer (better for PDFs) */}
      <embed
        src={resumeUrl}
        type="application/pdf"
        width="100%"
        height="100%"
      />
      
      {/* OR Option 2: Open in new tab (fallback) */}
      {/* <a href={resumeUrl} target="_blank" rel="noreferrer">
        Open Resume in New Tab
      </a> */}
      
      <button
        className={styles.closeBtn}
        onClick={() => setResumeUrl(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Applicants;