import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById, updateJob } from "../../services/adminService";
import styles from "../../styles/EditJob.module.css";
import Loader from "../../components/Loader";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    description: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await getJobById(id);
        const job = res.data.job;

        setForm({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          salary: job.salary || "",
          jobType: job.jobType || "Full-Time",
          description: job.description || "",
          requirements: job.requirements?.join(", ") || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        requirements: form.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await updateJob(id, payload);

      navigate("/admin", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingBox}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Edit Job</h1>
        <p className={styles.subheading}>
          Update and manage your job listing information.
        </p>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Job Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Salary ($)</label>
                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Job Type</label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={styles.textarea}
                rows="6"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Requirements (comma separated)</label>
              <input
                type="text"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                className={styles.input}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={saving}
            >
              {saving ? "Updating Job..." : "Update Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;