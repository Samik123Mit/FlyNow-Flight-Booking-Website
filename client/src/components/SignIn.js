import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../CSS/SignIn.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../authContext";


const API_BASE = process.env.REACT_APP_BACKEND_URL;

function SignIn() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmitUser(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.user);
        login(data.user);
        toast.success("Login successful!");
        navigate('/home');
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again later");
    }
  }

  return (
    <div className="signin-container rounded-lg">
      <form className="m-0 pl-4 pr-4 pb-4" onSubmit={handleSubmitUser}>
        <div className="pt-4">
          <input
            placeholder="Username"
            type="text"
            name="username"
            onChange={changeHandler}
            value={formData.username}
            required
          />
        </div>

        <div>
          <input
            placeholder="Password"
            type="password"
            name="password"
            onChange={changeHandler}
            value={formData.password}
            required
          />
        </div>

        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="inline text-white rounded text-l mt-6 font-bold p-2 sm:w-[8rem] transition duration-500 ease-in-out bg-blue-600 hover:bg-slate-300 hover:text-black transform hover:-translate-y-1 hover:scale-110"
          >
            Sign In
          </button>

          <Link className="ml-10 text-blue-500" to="/admin_login">
            Sign In as Admin
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
