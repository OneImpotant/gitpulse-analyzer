import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [repos, setRepos] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Effect to check for access token in the URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Clean up the URL by removing the token for security and aesthetics
      window.history.pushState({}, null, "/"); 
      fetchRepos(tokenFromUrl);
    }
  }, []);

  /**
   * Fetches user repositories from GitHub API using the Bearer token.
   */
  const fetchRepos = async (authToken) => {
    setLoading(true);
    try {
      const res = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=10', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setRepos(res.data);
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
    }
    setLoading(false);
  };

  /**
   * Triggers the backend flow for GitHub Authentication.
   */
  const loginWithGitHub = () => {
    window.location.assign('http://localhost:5000/login/github');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>GitPulse Analyzer 🚀</h1>
        <p>Analyze your repository activity and health status</p>
      </header>

      {!token ? (
        <button onClick={loginWithGitHub} style={loginBtnStyle}>Login with GitHub</button>
      ) : (
        <div style={listStyle}>
          <h2>Your Dashboard:</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            repos.map(repo => {
              // Calculate difference in days since the last update
              const diffDays = Math.ceil((new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24));
              // Health logic: less than 14 days is considered "Healthy"
              const isHealthy = diffDays < 14;

              return (
                <div key={repo.id} style={{...cardStyle, borderLeft: isHealthy ? '6px solid #2ea44f' : '6px solid #d73a49'}}>
                  <div style={cardHeaderStyle}>
                    <strong>{repo.name}</strong>
                    <span style={badgeStyle(isHealthy)}>{isHealthy ? 'Healthy' : 'Stale'}</span>
                  </div>
                  <p style={textStyle}>Updated {diffDays} days ago</p>
                  
                  {/* Visual progress bar representing project "freshness" */}
                  <div style={progressContainer}>
                    <div style={progressBar(Math.max(0, 100 - diffDays * 2), isHealthy)}></div>
                  </div>
                </div>
              );
            })
          )}
          <button onClick={() => setToken(null)} style={logoutBtnStyle}>Logout</button>
        </div>
      )}
    </div>
  );
}

// Inline Styles
const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '800px', margin: '0 auto', color: '#24292e' };
const headerStyle = { textAlign: 'center', marginBottom: '40px' };
const loginBtnStyle = { display: 'block', margin: '0 auto', padding: '12px 24px', backgroundColor: '#2ea44f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' };
const listStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const cardStyle = { padding: '20px', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const cardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const textStyle = { fontSize: '14px', color: '#57606a', margin: '10px 0' };
const badgeStyle = (h) => ({ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', backgroundColor: h ? '#dafbe1' : '#ffebe9', color: h ? '#1a7f37' : '#cf222e' });
const progressContainer = { height: '8px', background: '#ebf0f4', borderRadius: '4px', marginTop: '10px' };
const progressBar = (w, h) => ({ width: `${w}%`, height: '100%', background: h ? '#2ea44f' : '#fca32d', borderRadius: '4px', transition: 'width 0.5s' });
const logoutBtnStyle = { marginTop: '20px', background: 'none', border: 'none', color: '#0969da', cursor: 'pointer', textDecoration: 'underline' };

export default App;