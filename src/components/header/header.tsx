import styles from "./title.module.css"

const Header = () => {
    return (
        <header
            className="relative w-full h-[60px] sm:h-[70px] md:h-[100px] lg:h-[130px] bg-cover bg-center"
            style={{
                backgroundImage: "url('/images/header_image.jpg')",
                backgroundSize: '100% 100%',
            }}
            >
            {/* Background Image */}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-10"></div>
            
            {/* Styled Text */}
            <div className={styles["header-content"]}>
                <h1 className={styles["header-title"]}>movie&nbsp;review</h1>
            </div>
      </header>
    );
    }
export default Header;