import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1>Project Management Platform</h1>
        <p>Streamline your projects and collaborate with ease</p>
      </header>
      <Container className="content">
        <Row className="text-center">
          <Col md={4}>
            <div className="feature-box">
              <i className="fas fa-users fa-3x"></i>
              <h3>Collaborate</h3>
              <p>Work together with your team efficiently and effectively.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box">
              <i className="fas fa-tasks fa-3x"></i>
              <h3>Manage Tasks</h3>
              <p>Keep track of your tasks and stay organized.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-box">
              <i className="fas fa-lock fa-3x"></i>
              <h3>Secure</h3>
              <p>Your data is safe and secure with our platform.</p>
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <Button variant="primary" className="cta-button" href="/register">Get Started</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
