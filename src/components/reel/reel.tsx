import styles from "./reel.module.css"
import Upcoming from "../upcoming/upcoming";

var Reel = (props:any) => {
    return (
        <div className={styles["main-container"]}
        style={{
            paddingTop: "50px",
        }}>
            <p className={styles["title"]}>Title</p>
            <div className={styles["scroll-container"]}>
                <input type="button" className={styles["scroll-button"]}
                style={{
                    backgroundImage: "url('/images/arrow_left.png')",
                    backgroundSize: 'auto clamp(20px, 3vw, 30px)',
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat',
                    paddingLeft: 'clamp(30px, 4vw, 40px)',
                }}></input>
                <div className={styles["items-container"]}>
                    <Upcoming />
                </div>
                <input type="button" className={styles["scroll-button"]}
                style={{
                    backgroundImage: "url('/images/arrow_right.png')",
                    backgroundSize: 'auto clamp(20px, 3vw, 30px)',
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat',
                    paddingRight: 'clamp(30px, 4vw, 40px)',
                }}></input>
            </div>
        </div>
    );
    }
export default Reel;