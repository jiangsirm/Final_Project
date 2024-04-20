import React from 'react'
import ReactDOM from 'react-dom/client'
import AccountPage from './AccountPage.jsx'
import NavBar from './Navbar.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Welcome from './Welcome.jsx';
import LoginProvider from './LoginProvider.jsx';

import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <NavBar/>,
    children: [
      {
        path: "/",
        element: <Welcome />
      }
      ,
      {
        path: "login",
        element: <Login />
      }
      ,
      {
        path: "account",
        element: <AccountPage />
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  }
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginProvider>
      <RouterProvider router={router}/>
    </LoginProvider>
  </React.StrictMode>,
)
