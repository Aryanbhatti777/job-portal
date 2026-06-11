import { motion } from "framer-motion";
import styles from "../styles/About.module.css";

const About = () => {
  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className={styles.aboutSection} id="about">
      <motion.div
        className={styles.sectionHeading}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <span className={styles.sectionLabel}>
          About Us
        </span>

        <h2>
          The Career Platform Built For Hiring
          Confidence
        </h2>

        <p>
          We help job seekers discover roles with
          real growth potential and allow employers
          to connect with qualified talent quickly.
        </p>
      </motion.div>

      <div className={styles.aboutGrid}>
        <motion.div
          className={styles.aboutCopy}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div
            className={`${styles.featureCard} ${styles.featureHighlight}`}
          >
            <h3>Trusted Hiring Experience</h3>

            <p>
              Every listing is verified and paired
              with a seamless application journey,
              so candidates and companies move
              forward with clarity.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Resume-Ready Applications</h3>

            <p>
              Upload once, manage your profile,
              and apply to jobs with confidence
              from any device.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>Insight-Driven Matching</h3>

            <p>
              Our portal focuses on strong matches,
              detailed job insights, and employer
              transparency.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={styles.aboutPhoto}
          initial={{
            opacity: 0,
            x: 80,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
          }}
        />
      </div>
    </section>
  );
};

export default About;