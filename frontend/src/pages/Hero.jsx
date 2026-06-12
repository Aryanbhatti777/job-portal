import React, { useEffect, useState } from "react";
import styles from "../styles/Jobs.module.css";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/jobService";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

const Hero = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <section className={styles.hero} id="hero">
      <motion.div
        className={styles.heroCopy}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.span
          className={styles.heroPill}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🚀 Job Placement Made Simple
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
          }}
        >
          Discover Your Next Role With Confidence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.7,
          }}
        >
          Browse curated openings from top companies,
          save the best matches, and apply in just a few
          clicks.
        </motion.p>

        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.7,
            duration: 0.6,
          }}
        >
          <a
            href="#contact"
            className={styles.btnSecondary}
          >
            Get In Touch
          </a>

          <Link
            to="/#jobs"
            className={styles.btnSignup}
          >
            Explore Jobs
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.heroCard}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.9,
          delay: 0.4,
          ease: "easeOut",
        }}
      >
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
        >
          <p>Live Jobs</p>
          <strong>{jobs.length}</strong>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
        >
          <p>Top Employers</p>
          <strong>45+</strong>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
        >
          <p>Premium Support</p>
          <strong>24/7</strong>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;