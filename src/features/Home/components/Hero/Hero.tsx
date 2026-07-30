import "./Hero.css";

export type HeroPropsType ={
    onActionButtonClick : () => void,
}

const Hero = ({onActionButtonClick} : HeroPropsType) =>{

    return(
        <main className="hero">
            <img src="hero-image.avif" className="hero-bg" />

            <div className="hero-content">
                <h1 className="hero-title">MOVIE HUB</h1>
                <h3 className="hero-subtitle">Welcome to our website</h3>
                <button className="hero-action-btn" onClick={onActionButtonClick}>Lets go</button>
            </div>
        </main>
    );
};

export default Hero;