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

  const navigate = useNavigate();
  const location = useLocation();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

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

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();

    return (
      job.title?.toLowerCase().includes(query) ||
      job.company?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [location]);

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      {/* PAGE HEADER */}

      <motion.div
        className={styles.pageHeader}
        id="jobs"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div>
          <h2>Open Positions</h2>

          <p>
            Browse available opportunities and click on a role
            to view complete details.
          </p>
        </div>
      </motion.div>

      {/* SEARCH BAR */}

      <motion.div
        className={styles.searchBarContainer}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          delay: 0.2,
        }}
      >
        <input
          type="text"
          placeholder="Search by job title, company, location or skills..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className={styles.searchInput}
        />

        {searchQuery && (
          <p className={styles.searchResultsInfo}>
            {filteredJobs.length} job
            {filteredJobs.length !== 1 ? "s" : ""} found
          </p>
        )}
      </motion.div>

      {/* JOBS GRID */}

      <div className={styles.gridList}>
        {filteredJobs.length === 0 ? (
          <motion.div
            className={styles.emptyState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchQuery
              ? `No jobs match "${searchQuery}".`
              : "No jobs found."}
          </motion.div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <JobCard
                job={job}
                onClick={() =>
                  navigate(`/jobs/${job._id}`)
                }
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;