import { motion } from "framer-motion";
import styles from "../styles/Contact.module.css";

const Contact = () => {
  return (
    <section className={styles.contactSection} id="contact">
      <motion.div
        className={styles.contactCopy}
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className={styles.sectionLabel}>
          Get In Touch
        </span>

        <h2>
          Have A Question Or Need Support?
        </h2>

        <p>
          Whether you're a candidate or an employer,
          our team is here to help you move forward
          with the right opportunity.
        </p>
      </motion.div>

      <motion.div
        className={styles.contactCard}
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3>Contact Our Team</h3>

        <p>
          Reach out for employer partnerships,
          candidate support, or product feedback.
        </p>

        <div className={styles.contactInfo}>
          <span className={styles.icon}>📧</span>

          <div>
            <strong>Email</strong>
            <p>bhattiaryan777@gmail.com</p>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <span className={styles.icon}>📞</span>

          <div>
            <strong>Phone</strong>
            <p>+91 81998 66932</p>
          </div>
        </div>

        <a
          href="mailto:bhattiaryan777@gmail.com"
          className={styles.btnPrimary}
        >
          Contact Now
        </a>

        <p className={styles.contactNote}>
          We typically reply within 24 hours.
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;