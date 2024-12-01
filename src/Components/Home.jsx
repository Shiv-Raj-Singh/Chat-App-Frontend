import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
const HomePage = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en"); // Default to English
  const [noDataFound, setNoDataFound] = useState(false); // Track if no data is found

  const API_KEY = "127c17c8a5f643aab718e5985a67a4fb"; // Replace with your News API key
  const API_URL = "https://newsapi.org/v2/everything"; // Base URL for News API to get all news

  // Fetching news when the component mounts or when the search query or language changes
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setNoDataFound(false); // Reset 'No Data Found' message
      try {
        // Fetch news based on search query (if any) and language
        let response;
        if (localStorage.getItem("response") && !searchQuery.trim().length) {
          response = JSON.parse(localStorage.getItem("response"));
          console.log("News API response from localstorage..:");
        } else {
          response = await axios.get(API_URL, {
            params: {
              apiKey: API_KEY,
              q: searchQuery || "latest", // Search query entered by the user or default to 'latest'
              language: language, // Language parameter
              sortBy: "relevancy", // Sort by relevance (you can also use 'popularity' or 'publishedAt')
            },
          });
          localStorage.setItem("response", JSON.stringify(response));
        }

        console.log("News API response:", response.data); // Log the response for debugging

        // Filter out articles that don't have valid images or content
        const validArticles = response.data.articles.filter(
          (article) =>
            article.urlToImage && article.title && article.description
        );

        if (validArticles.length === 0) {
          setNoDataFound(true); // Show no data found message if no valid articles
        }

        setNews(validArticles); // Set the filtered articles to the state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news");
        setLoading(false);
      }
    };

    fetchNews();
  }, [searchQuery, language]); // Re-fetch news when the search query or language changes

  // Toggle between English and Hindi language
  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "hi" : "en"); // Toggle between English (en) and Hindi (hi)
  };

  return (
    <div
      className="home-page"
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f4f4f9",
      }}
    >
      <h1
        className="page-title"
        style={{
          textAlign: "center",
          fontSize: "32px",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Latest News
      </h1>

      {/* Language Toggle Button */}
      <button
        onClick={handleLanguageToggle}
        className="language-toggle-btn"
        style={{
          padding: "10px 15px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {language === "en" ? "Switch to Hindi" : "Switch to English"}
      </button>

      {/* Search Bar for Dynamic News Search */}
      <div
        className="search-bar"
        style={{ marginBottom: "20px", textAlign: "center" }}
      >
        <input
          type="text"
          placeholder="Search for news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
            backgroundColor: "#fff", // Ensure white background
            color: "#333", // Ensure text is visible
          }}
        />
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading news...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {/* Render news or "No News Found" message */}
      {noDataFound ? (
        <div className="no-news" style={{ textAlign: "center", width: "100%" }}>
          <p> Sorry News Not Found...</p>
          <img
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGtxZzBua293YnVqZ2s3MXR5NnhjbWg5dndpb2RrN2pheTExeTI0bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d7rvF20PqNuGKSQGhf/giphy.gif" // Sad gif URL
            alt="No news found"
            style={{ maxWidth: "500px", marginBottom: "200px" }}
          />
        </div>
      ) : (
        <div
          className="news-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {news.length > 0 ? (
            news.map((article, index) => (
              <div
                key={index}
                className="news-card"
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "300px",
                  height: "auto",
                  textAlign: "center",
                  transition: "transform 0.3s",
                }}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                )}
                <h3
                  style={{
                    fontSize: "18px",
                    margin: "15px 0",
                    color: "#333",
                    fontWeight: "bold",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {article.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                >
                  {article.description || "No description available"}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "14px",
                    color: "#007BFF",
                    textDecoration: "none",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  Read more
                </a>
              </div>
            ))
          ) : (
            <div
              className="no-news"
              style={{ textAlign: "center", width: "100%" }}
            >
              <img
                src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGtxZzBua293YnVqZ2s3MXR5NnhjbWg5dndpb2RrN2pheTExeTI0bCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d7rvF20PqNuGKSQGhf/giphy.gif" // Sad gif URL
                alt="No news found"
                style={{ maxWidth: "100px", marginBottom: "20px" }}
              />
              <p>No news found for your query</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
