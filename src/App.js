import { Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/Common/Header";
import Home from "./components/Layout/Home";
import CreateUser from "./components/User/CreateUser";
import EditUser from "./components/User/EditUser";
import ShowUser from "./components/User/ShowUser";
import User from "./components/User/User";

function App() {
  return (
    <div className="App">
      <header className="container">
        <div className="">
          <HashRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/user/:id" element={<User />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/show-user" element={<ShowUser />} />
            </Routes>
          </HashRouter>
        </div>
      </header>
    </div>
  );
}

export default App;
