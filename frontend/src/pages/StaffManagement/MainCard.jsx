import { Link } from "react-router-dom";

function MainCard({ icon, title, desc, path }) {
    return (
        <Link to={path} className="block">
            <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">{icon}</div>
                    <div>
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <p className="text-gray-600">{desc}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default MainCard;
