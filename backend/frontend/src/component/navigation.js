import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuth(!!token); // true if token exists
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">JWT Authentication</Navbar.Brand>
      <Nav className="me-auto">
        {isAuth && <Nav.Link href="/">Home</Nav.Link>}
      </Nav>
      <Nav>
        {isAuth ? (
          <Nav.Link href="/logout">Logout</Nav.Link>
        ) : (
          <Nav.Link href="/login">Login</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}