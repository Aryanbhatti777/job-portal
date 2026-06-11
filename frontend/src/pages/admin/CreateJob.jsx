import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addJob } from "../../services/adminService";
import styles from "../../styles/CreateJob.module.css";

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    description: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        requirements: form.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await addJob(payload);

      navigate("/admin", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2>Create New Job</h2>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <label className={styles.label}>
          Job Title
          <input
            className={styles.input}
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Frontend Developer"
            required
          />
        </label>

        <label className={styles.label}>
          Company
          <input
            className={styles.input}
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Google"
            required
          />
        </label>

        <label className={styles.label}>
          Location
          <input
            className={styles.input}
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
            required
          />
        </label>

        <label className={styles.label}>
          Salary
          <input
            className={styles.input}
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="120000"
            required
          />
        </label>

        <label className={styles.label}>
          Job Type
          <select
            className={styles.select}
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
          >
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </label>

        <label className={styles.label}>
          Description
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the role, responsibilities, and expectations..."
            required
          />
        </label>

        <label className={styles.label}>
          Requirements (comma separated)
          <input
            className={styles.input}
            type="text"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Git"
            required
          />
        </label>

        <button
          className={styles.submitBtn}
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Job..." : "Create Job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;