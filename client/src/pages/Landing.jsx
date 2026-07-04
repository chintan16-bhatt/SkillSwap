import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>SkillSwap</h1>
        <p style={styles.tagline}>
          Trade skills, not money. Learn what you want by teaching what you know.
        </p>
        <div style={styles.ctaRow}>
          <Link to="/register" style={styles.primaryBtn}>Get Started Free</Link>
          <Link to="/login" style={styles.secondaryBtn}>Login</Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.icon}>🔍</div>
          <h3 style={styles.featureTitle}>Find Your Match</h3>
          <p style={styles.featureText}>
            Search for people who teach what you want to learn.
          </p>
        </div>
        <div style={styles.feature}>
          <div style={styles.icon}>✨</div>
          <h3 style={styles.featureTitle}>AI-Powered Suggestions</h3>
          <p style={styles.featureText}>
            Get smart, personalized skill swap recommendations.
          </p>
        </div>
        <div style={styles.feature}>
          <div style={styles.icon}>⭐</div>
          <h3 style={styles.featureTitle}>Earn Credits</h3>
          <p style={styles.featureText}>
            Teach a skill, earn a credit. Use credits to learn from others.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  hero: {
    textAlign: 'center',
    padding: '100px 24px 60px',
    background: 'linear-gradient(135deg, #6c63ff 0%, #8b7fff 100%)',
    color: 'white',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  tagline: {
    fontSize: '18px',
    maxWidth: '500px',
    margin: '0 auto 32px',
    opacity: 0.95,
  },
  ctaRow: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: 'white',
    color: '#6c63ff',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '16px',
    border: '2px solid white',
  },
  features: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '60px 24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '32px',
  },
  feature: {
    textAlign: 'center',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  featureText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
};

export default Landing;