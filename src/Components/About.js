import React from "react";
import "./About.css"; // Optional for custom styling, if needed

const About = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4">About Our App</h1>
        <p className="lead">
          Stay updated with the latest news, engage in vibrant chat rooms, and
          connect with like-minded individuals seamlessly.
        </p>
      </div>
      <div className="row g-4">
        {/* News Feature */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <img
              src="https://via.placeholder.com/350x200"
              className="card-img-top"
              alt="Latest News"
            />
            <div className="card-body">
              <h5 className="card-title">Latest News</h5>
              <p className="card-text">
                Stay informed with the most recent updates in crime, sports,
                business, and more. News curated just for you!
              </p>
            </div>
          </div>
        </div>

        {/* Chat Room Feature */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <img
              src="https://via.placeholder.com/350x200"
              className="card-img-top"
              alt="Chat Room"
            />
            <div className="card-body">
              <h5 className="card-title">Chat Room</h5>
              <p className="card-text">
                Join dynamic chat rooms where conversations are lively,
                interactive, and engaging. Connect instantly!
              </p>
            </div>
          </div>
        </div>

        {/* User Connectivity Feature */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <img
              src="https://via.placeholder.com/350x200"
              className="card-img-top"
              alt="User Connectivity"
            />
            <div className="card-body">
              <h5 className="card-title">User Connectivity</h5>
              <p className="card-text">
                Seamless user interactions with a modern, responsive design.
                Stay connected with ease!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
