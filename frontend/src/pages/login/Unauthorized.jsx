import { Link } from "react-router-dom";

function Unauthorized(){
    return(

        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Unauthorized</h1>
            <p>You do not have permission to access this page.</p>

            <Link to={"/login"}>
                <button>Login again</button>
            </Link>
        </div>
    )
}

export default Unauthorized;