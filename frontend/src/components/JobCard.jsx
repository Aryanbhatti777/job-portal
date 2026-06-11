import styles from "../styles/JobCard.module.css";

const JobCard = ({ job, onClick }) => {
  const description =
    job.description?.substring(0, 120) ||
    "A great opportunity to join a growing team.";

  return (
    <div className={styles.card} onClick={onClick}>
      
      <div className={styles.top}>
        <div>
          <h3 className={styles.title}>{job.title}</h3>
          <p className={styles.company}>{job.company}</p>
        </div>

        <span
          className={
            job.status === "Open"
              ? styles.badgeOpen
              : styles.badgeClosed
          }
        >
          {job.status}
        </span>
      </div>

      <p className={styles.desc}>
        {description}
        {job.description?.length > 120 ? "..." : ""}
      </p>

      <div className={styles.meta}>
        <span className={styles.pill}>{job.location}</span>
        <span className={styles.pill}>{job.jobType}</span>
        <span className={styles.pill}>${job.salary.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default JobCard;