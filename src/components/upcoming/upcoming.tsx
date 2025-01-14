import styles from "./upcoming.module.css"

type Arg = {
    show: string,
}

const Upcoming = (props:Arg) => {
    const classes = props.show==="hidden"?"hidden":"movie-container";
    return (
        <div className={styles[classes]}
        style={{
            backgroundImage: "url('/images/temp.png')",
            backgroundSize: "100% 80%",
            backgroundRepeat: "no-repeat",
        }}>
            <img src="/images/projector.png" className={styles["projector"]}/>
            <div className={styles["info"]}>
                <p className={styles["title"]}>Movie Title</p>
                <p className={styles["release"]}>Release Date</p>
            </div>
            <img src="/images/temp2.png" className={styles["poster"]}/>
        </div>
    );
}
export default Upcoming;