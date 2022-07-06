import logo from './logo.svg';
import './App.css';
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link, BrowserRouter
} from "react-router-dom";
import BookActions from "../src/components/BookActions";
import 'bootstrap/dist/css/bootstrap.min.css';
import CupboardActions from "./components/CupboardActions";
import SubscriptionActions from "./components/SubscriptionActions";
import StudentActions from "./components/StudentActions";
import BookChange from "./components/BookChange";
import CupboardChange from "./components/CupboardChange";
import StudentChange from "./components/StudentChange";
import CupboardDetails from "./components/CupboardDetails";
import StudentDetails from "./components/StudentDetails";
import SubscriptionChange from "./components/SubscriptionChange";
function Navbar(props){

    return(
        <nav className="navbar navbar-expand-lg navbar-dark " style={{backgroundColor:'#154360'}}>
            <div className="container">
                <a className="navbar-brand" href="#" style={{fontWeight:"bold"}}>ILibrary</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarTogglerDemo02">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link to="/books" className="nav-link" style={{color:"white"}}>Books</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/students" className="nav-link" style={{color:"white"}}>Students</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/subscriptions" className="nav-link" style={{color:"white"}}>Subscriptions</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-link" style={{color:"white"}}>CupBoard</Link>
                        </li>

                    </ul>

                </div>
            </div>





        </nav>
    );
}
function MainFrame(props) {
  return(

      <div>
          <BrowserRouter>
            <Navbar/>
                <div className="container mt-5 mb-5">

                      <Routes>
                        <Route  path="/"  element={<CupboardActions/>}></Route>
                        <Route  path="/books"  element={<BookActions/>}></Route>
                        <Route  path="/subscriptions"  element={<SubscriptionActions/>}></Route>
                        <Route  path="/students"  element={<StudentActions/>}></Route>
                        <Route  path="/books/edit/:id"  element={<BookChange/>}></Route>
                          <Route  path="/subscriptions/edit/:id"  element={<SubscriptionChange/>}></Route>
                        <Route  path="/students/edit/:id"  element={<StudentChange/>}></Route>
                        <Route  path="/students/sum/:id"  element={<StudentDetails/>}></Route>
                        <Route  path="/cupboards/edit/:id"  element={<CupboardChange/>}></Route>
                        <Route  path="/cupboards/details/:id"  element={<CupboardDetails/>}></Route>
                      </Routes>

                </div>
          </BrowserRouter>
      </div>
  );
}
function App() {
  return (
      <MainFrame ></MainFrame>
  );
}

export default App;
