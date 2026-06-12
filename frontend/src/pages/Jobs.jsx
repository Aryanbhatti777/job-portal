import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { getAllJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import Loader from "../components/Loader";

import styles from "../styles/Jobs.module.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  // pagination state
  const [visibleCount, setVisibleCount] = useState(8);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data.jobs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();

    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    );
  });

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  if (loading) return <Loader />;

  return (
    <div className={styles.page} id="jobs">
      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h2>Open Positions</h2>
          <p>Browse available opportunities and click to view details.</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(8); // reset pagination on search
          }}
          className={styles.searchInput}
        />

        {searchQuery && (
          <p className={styles.searchResultsInfo}>
            {filteredJobs.length} job(s) found
          </p>
        )}
      </div>

      {/* GRID */}
      <div className={styles.gridList}>
        {visibleJobs.length === 0 ? (
          <div className={styles.emptyState}>
            No jobs found
          </div>
        ) : (
          visibleJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <JobCard
                job={job}
                onClick={() => navigate(`/jobs/${job._id}`)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* LOAD MORE BUTTON */}
      {visibleCount < filteredJobs.length && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreBtn} onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;