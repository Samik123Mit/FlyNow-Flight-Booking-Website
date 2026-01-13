import Navbar from "../components/Navbar";
import Nav2 from "../components/Nav2";
import Footer from "../components/Footer";
import { useState, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/Contact.css";
import AuthContext from "../authContext";
import Loading from "../components/Loading";

// backend base url
const API_BASE = process.env.REACT_APP_BACKEND_URL;

function Contact({ username }) {
  const { isAuthenticated } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => setIsLoading(false), 1500);

  const [formData, setFormData] = useState({
    user: "",
    email: "",
    subject: "",
    message: "",
    mobile: "",
    username: username,
  });

  function changeHandler(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.error("Login to send message");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE}/api/feedback/addFeedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully");
        setFormData({
          user: "",
          email: "",
          subject: "",
          message: "",
          mobile: "",
          username: username,
        });
      } else {
        toast.error(data.message || "Error occurred");
      }
    } catch (error) {
      toast.error("Network error, please try again later");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={isLoading ? "loading" : "loaded"}>
      <Loading isLoading={isLoading} />
      <div className="content_">
        <Navbar />
        <Nav2>Contact Us</Nav2>

        <div className="h-screen bg-slate-200">
          <div className="h-[70px]"></div>

          <div className="contact-container">
            <form onSubmit={submitHandler}>
              <div className="first1-line">
                <input
                  type="text"
                  name="user"
                  placeholder="Name"
                  value={formData.user}
                  onChange={changeHandler}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="second1-line">
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile No."
                  value={formData.mobile}
                  onChange={changeHandler}
                  required
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="third1-line">
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="inline text-white rounded text-l mt-4 font-bold p-2 sm:w-[8rem] transition duration-500 ease-in-out bg-blue-600 hover:bg-slate-300 hover:text-black"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Contact;
