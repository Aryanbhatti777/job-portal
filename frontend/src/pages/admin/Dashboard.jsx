import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardStats,
  getMyJobs,
  deleteJob,
} from "../../services/adminService";
import Loader from "../../components/Loader";
import styles from "../../styles/Dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          getDashboardStats(),
          getMyJobs(),
        ]);

        setStats(statsRes.data);
        setJobs(jobsRes.data.jobs || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load admin dashboard"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Delete this job and all related applications?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingJobId(jobId);

      await deleteJob(jobId);

      setJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== jobId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete job"
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h2>Admin Dashboard</h2>
            <p>Review job stats and manage your listings.</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2>Admin Dashboard</h2>
          <p>
            Review job stats and manage your listings.
          </p>
        </div>

        <div className={styles.dashboardActions}>
          <Link
            to="/admin/create-job"
            className={styles.createBtn}
          >
            + Create Job
          </Link>

          <Link
            to="/admin/applications"
            className={styles.applicationBtn}
          >
            View Applications
          </Link>
        </div>
      </div>

      <div className={styles.gridList}>
        {/* Stats Section */}
        <div className={styles.card}>
          <h3>Platform Statistics</h3>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <strong>{stats?.totalJobs || 0}</strong>
              <p>Total Jobs</p>
            </div>

            <div className={styles.statCard}>
              <strong>
                {stats?.totalApplications || 0}
              </strong>
              <p>Total Applications</p>
            </div>

            <div className={styles.statCard}>
              <strong>
                {stats?.pendingApplications || 0}
              </strong>
              <p>Pending</p>
            </div>

            <div className={styles.statCard}>
              <strong>
                {stats?.approvedApplications || 0}
              </strong>
              <p>Approved</p>
            </div>

            <div className={styles.statCard}>
              <strong>
                {stats?.rejectedApplications || 0}
              </strong>
              <p>Rejected</p>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className={styles.card}>
          <h3>My Jobs</h3>

          {jobs.length === 0 ? (
            <p>No jobs created yet.</p>
          ) : (
            <ul className={styles.jobList}>
              {jobs.map((job) => (
                <li
                  key={job._id}
                  className={styles.jobItem}
                >
                  <div className={styles.jobInfo}>
                    <strong>{job.title}</strong>
                    <p>
                      {job.company} • {job.location}
                    </p>
                  </div>

                  <div className={styles.actionLinks}>
                    <Link
                      to={`/admin/edit-job/${job._id}`}
                      className={styles.editBtn}
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/admin/applicants/${job._id}`}
                      className={styles.applicantsBtn}
                    >
                      Applicants
                    </Link>

                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        handleDeleteJob(job._id)
                      }
                      disabled={
                        deletingJobId === job._id
                      }
                    >
                      {deletingJobId === job._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;