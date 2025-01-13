import styles from "./reel.module.css"

type Arg = {
    show: string,
}

const Reel = (props:Arg) => {
    const classes = props.show==="hidden"?"hidden":"flex";
    return (
        <div className={styles[classes]}>
            <div className={styles["reel"]}>
                <div className={styles["movie-container"]}
                style={{
                    backgroundImage: "url('/images/temp.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}>
                    <div className={styles["info"]}>
                        <p className={styles["title"]}>Movie Title</p>
                        <div className={styles["stats"]}
                        style={{
                        display: "flex",
                        flexDirection: "row",
                        }}>
                            <p className={styles["rating"]}>4.3</p>
                            <p className={styles["likes"]}>5.7K</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["reel"]}>
                <div className={styles["movie-container"]}
                style={{
                    backgroundImage: "url('/images/temp.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}>
                    <div className={styles["info"]}>
                        <p className={styles["title"]}>Movie Title</p>
                        <div className={styles["stats"]}
                        style={{
                        display: "flex",
                        flexDirection: "row",
                        }}>
                            <p className={styles["rating"]}>4.3</p>
                            <p className={styles["likes"]}>5.7K</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["reel"]}>
                <div className={styles["movie-container"]}
                style={{
                    backgroundImage: "url('/images/temp.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }}>
                    <div className={styles["info"]}>
                        <p className={styles["title"]}>Movie Title</p>
                        <div className={styles["stats"]}
                        style={{
                        display: "flex",
                        flexDirection: "row",
                        }}>
                            <p className={styles["rating"]}>4.3</p>
                            <p className={styles["likes"]}>5.7K</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Reel;