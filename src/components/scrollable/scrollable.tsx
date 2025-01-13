import styles from "./scrollable.module.css"
import Upcoming from "../upcoming/upcoming";
import Reel from "../reel/reel";

var Scrollable = (props:any) => {
    const upcoming = props.contentType==="upcoming"?"shown":"hidden";
    const reel = props.contentType==="reel"?"shown":"hidden";
    const scroll = props.contentType==="reel"?"scroll-container-reel":"scroll-container-upcoming";
    return (
        <div className={styles["main-container"]}
        style={{
            paddingTop: "50px",
        }}>
            <p className={styles["title"]}>{props.title}</p>
            <div className={styles[scroll]}>
                <input type="button" className={styles["scroll-button"]}
                style={{
                    backgroundImage: "url('/images/arrow_left.png')",
                    backgroundSize: 'auto clamp(20px, 3vw, 30px)',
                    backgroundPosition: '50% 50%',
                    backgroundRepeat: 'no-repeat',
                    paddingLeft: 'clamp(30px, 4vw, 40px)',
                }}></input>
                <div className={styles["items-container"]}>
                    <Upcoming show={upcoming}/>
                    <Reel show={reel}/>
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
export default Scrollable;