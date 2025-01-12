import styles from "./search.module.css"

const Search = () => {
    return (
        <div className={styles["search-bar-container"]}>
            <input type="text" placeholder="Search..." className={styles["search-bar"]}
            style={{
                backgroundImage: "url('/images/search_icon.png')",
                backgroundSize: 'auto clamp(20px, 3vw, 30px)',
                backgroundPosition: '7px 50%',
                backgroundRepeat: 'no-repeat',
                paddingLeft: 'clamp(30px, 4vw, 40px)',
            }}></input>
            <input type="button" className={styles["search-filters"]}
            style={{
                backgroundImage: "url('/images/filter_icon.png')",
                backgroundSize: 'auto clamp(20px, 3vw, 30px)',
                backgroundPosition: '50% 50%',
                backgroundRepeat: 'no-repeat',
            }}></input>
        </div>
    );
    }
export default Search;