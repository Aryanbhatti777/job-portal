import styles from "../styles/Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderSpinner} />
      <p className={styles.loaderText}>Loading...</p>
    </div>
  );
};

export default Loader;