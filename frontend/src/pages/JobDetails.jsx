import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { applyForJob, uploadResume, checkApplicationStatus } from "../services/applicationService";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import styles from '../styles/JobDetails.module.css'

const JobDetails = () => {

    const { id } = useParams();
    const { user, loading, fetchUser } = useContext(AuthContext);

    const [job, setJob] = useState(null);
    const [applying, setApplying] = useState(false);
    const [message, setMessage] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [resumeMessage, setResumeMessage] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [checkingApplication, setCheckingApplication] = useState(false);

    const fetchJob = async () => {
        try {
            const res = await getJobById(id);
            setJob(res.data.job);
        } catch (err) {
            console.log(err);
            setMessage(err.response?.data?.message || "Failed to load job");
        }
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    useEffect(() => {
        if (user && !loading && id) {
            checkApplicationStatus(id).then(result => {
                setHasApplied(!!result);
            });
        }
    }, [user, loading, id]);

    const handleApply = async () => {
        if (!user) {
            setMessage("Please login to apply.");
            return;
        }

        setApplying(true);
        setMessage(null);

        try {
            await applyForJob(id);
            setMessage("Application submitted successfully.");
            setHasApplied(true);
        } catch (err) {
            setMessage(err.response?.data?.message || "Unable to apply");
        } finally {
            setApplying(false);
        }
    };

    const handleResumeUpload = async (event) => {
        const file = event.target.files?.[0];
        setResumeMessage(null);
        setResumeFile(file || null);
    };

    const handleUploadAndApply = async () => {
        if (!resumeFile) {
            setResumeMessage("Please choose a resume file first.");
            return;
        }

        setUploadingResume(true);
        setResumeMessage(null);
        setMessage(null);

        try {
            await uploadResume(resumeFile);
            await fetchUser();
            await applyForJob(id);
            setResumeMessage("Resume uploaded and application submitted successfully.");
            setHasApplied(true);
        } catch (err) {
            setResumeMessage(err.response?.data?.message || "Unable to upload resume or apply.");
        } finally {
            setUploadingResume(false);
            setResumeFile(null);
        }
    };

    if (loading || !job) return <Loader />;

    return (
  <div className={styles.page}>
    <div className={styles.detailGrid}>
      <div className={`${styles.card} ${styles.cardDetail}`}>
        <div className={styles.detailHeader}>
          <div>
            <p className={styles.muted}>{job.company}</p>
            <h2>{job.title}</h2>
            <p className={styles.muted}>{job.location}</p>
          </div>

          <span
            className={`${styles.badge} ${
              job.status === "Open"
                ? styles.badgeOpen
                : styles.badgeClosed
            }`}
          >
            {job.status}
          </span>
        </div>

        <div className={styles.detailMeta}>
          <span className={styles.metaPill}>{job.jobType}</span>
          <span className={styles.metaPill}>
            ₹{job.salary?.toLocaleString()}
          </span>
          <span className={styles.metaPill}>
            {job.createdAt
              ? new Date(job.createdAt).toLocaleDateString()
              : "Recent"}
          </span>
        </div>

        <div className={styles.cardContent}>
          <h3>About the Role</h3>
          <p>{job.description}</p>

          {job.requirements?.length > 0 && (
            <div className={styles.requirementsCard}>
              <h3>Requirements</h3>

              <ul>
                {job.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <aside className={`${styles.card} ${styles.applyPanel}`}>
        <div className={styles.panelHeader}>
          <p className={styles.muted}>Apply for this role</p>
          <h3>Ready to grow your career?</h3>
        </div>

        <div className={styles.panelRow}>
          <strong>Salary</strong>
          <span>₹{job.salary?.toLocaleString()}</span>
        </div>

        <div className={styles.panelRow}>
          <strong>Type</strong>
          <span>{job.jobType}</span>
        </div>

        <div className={styles.panelRow}>
          <strong>Location</strong>
          <span>{job.location}</span>
        </div>

        <div className={styles.panelRow}>
          <strong>Status</strong>
          <span>{job.status}</span>
        </div>

        {message && (
          <div className={styles.alert}>
            {message}
          </div>
        )}

        {resumeMessage && (
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            {resumeMessage}
          </div>
        )}

        {user ? (
          user.role === "admin" ? (
            <div className={styles.alert}>
              Admin users cannot apply for jobs.
            </div>
          ) : hasApplied ? (
            <div
              className={`${styles.alert} ${styles.alertSuccess}`}
            >
              <strong>✓ Application Submitted</strong>
              <p>
                We've received your application and will review it
                soon.
              </p>
            </div>
          ) : (
            <>
              {user.resume?.url ? (
                <div className={styles.resumeActionBlock}>
                  <div className={styles.resumeInfo}>
                    <strong>Current Resume</strong>

                    <p>
                      {user.resume.originalName ||
                        "Uploaded Resume"}
                    </p>

                    {user.resume.uploadedAt && (
                      <small>
                        Updated{" "}
                        {new Date(
                          user.resume.uploadedAt
                        ).toLocaleDateString()}
                      </small>
                    )}
                  </div>

                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleApply}
                    disabled={
                      applying || job.status === "Closed"
                    }
                  >
                    {job.status === "Closed"
                      ? "Position Closed"
                      : applying
                      ? "Applying..."
                      : "Apply with Current Resume"}
                  </button>
                </div>
              ) : (
                <div className={styles.resumeActionBlock}>
                  <p className={styles.muted}>
                    Upload your resume to apply.
                  </p>
                </div>
              )}

              <div className={styles.resumeUploadBlock}>
                <label className={styles.fileUpload}>
                  <span>
                    {resumeFile
                      ? resumeFile.name
                      : "Upload a New Resume"}
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                  />
                </label>

                <button
                  className={`${styles.btn} ${styles.btnOutline}`}
                  onClick={handleUploadAndApply}
                  disabled={
                    uploadingResume ||
                    job.status === "Closed"
                  }
                >
                  {uploadingResume
                    ? "Uploading..."
                    : job.status === "Closed"
                    ? "Position Closed"
                    : "Upload & Apply"}
                </button>
              </div>
            </>
          )
        ) : (
          <Link
            to="/login"
            className={`${styles.btn} ${styles.btnOutline}`}
          >
            Sign In to Apply
          </Link>
        )}
      </aside>
    </div>

    <section className={styles.jobInsights}>
      <div
        className={`${styles.jobInfoCard} ${styles.photoCard}`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522204523234-872e6b8d6276?auto=format&fit=crop&w=900&q=80')",
        }}
      >
        <div>
          <h3>Why this role matters</h3>
          <p>
            Position yourself for growth with a role that
            connects your skills to real business impact.
          </p>
        </div>
      </div>

      <div
        className={`${styles.jobInfoCard} ${styles.photoCard}`}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80')",
        }}
      >
        <div>
          <h3>Fast, modern hiring</h3>
          <p>
            Apply with one resume, track your application,
            and stay connected with the hiring team.
          </p>
        </div>
      </div>
    </section>
  </div>
);
};

export default JobDetails;