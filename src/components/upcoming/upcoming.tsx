import styles from "./upcoming.module.css"

const Upcoming = () => {
    return (
        <div className={styles["movie-container"]}
        style={{
            backgroundImage: "url('/images/temp.png')",
            backgroundSize: "100% 80%",
            backgroundRepeat: "no-repeat",
        }}>
            <img src="http://localhost:3000/images/projector.png" className={styles["projector"]}/>
            <div className={styles["info"]}>
                <p className={styles["title"]}>Movie Title</p>
                <p className={styles["release"]}>Release Date</p>
            </div>
            <img src="http://localhost:3000/images/temp2.png" className={styles["poster"]}/>
        </div>
    );
}
export default Upcoming;