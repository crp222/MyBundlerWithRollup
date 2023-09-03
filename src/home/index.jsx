
import React from "react";
import { createRoot } from 'react-dom/client';
import Home from "./home.jsx";
import Nav from "./Nav.jsx";

const home = createRoot(document.getElementById('home'));
home.render(<Home></Home>);

const navbar = createRoot(document.getElementById('nav'));
navbar.render(<Nav></Nav>);