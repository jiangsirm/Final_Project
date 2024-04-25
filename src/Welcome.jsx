import Header from "./Header/Header"
import { Link } from 'react-router-dom';
import "./css/Welcome.css"
function Welcome() {
    return (
        <>
            <Header title1="PassWord Manager" title2="Scroll Down to See More" />
            <section>
                <div className="welcome-container">

                    <div class="orbContainer">
                        <Link to="/login">
                            <div class="orb">
                                <h1>Login</h1>
                            </div>
                        </Link>
                    </div>

                    <div class="orbContainer">
                        <Link to="/register">
                            <div class="orb two">
                                <h1>Register</h1>
                            </div>
                        </Link>
                    </div>
                    <div class="orbContainer">
                        <Link to="/account">
                            <div class="orb three">
                                <h1>MyAccount</h1>
                            </div>
                        </Link>
                    </div>
                    <div class="orbContainer">
                        <Link to="/">
                            <div class="orb">
                                <h1>Home</h1>
                            </div>
                        </Link>
                    </div>


                </div>
            </section>


        </>
    )
}

export default Welcome