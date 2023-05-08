import Navbar from "./components/navbar";
import "./App.css";
import {
  Route,
  Routes,
  BrowserRouter,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, createContext, useReducer, useContext } from "react";
import Home from "./components/screens/Home";
import Signup from "./components/screens/Signup";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPost from "./components/screens/SubscribedUserPost";
import { reducer, initialState } from "./reducers/userReducer";
import Reset from "./components/screens/reset";
import NewPassword from "./components/screens/Newpassword";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      navigate("/");
    } else {
      if (!location.pathname.startsWith("/reset")) navigate("/signin");
    }
  }, []);

  return (
    <>
      <Routes path="/">
        <Route index element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/p/:userId" element={<UserProfile />} />
        <Route path="/myfollowingpost" element={<SubscribedUserPost />} />
        <Route exact path="/reset" element={<Reset />} />
        <Route path="/reset/:token" element={<NewPassword />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
