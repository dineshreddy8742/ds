import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, 
  ChevronRight, 
  Zap, 
  Shield, 
  Globe, 
  Smartphone, 
  CheckCircle, 
  Star, 
  Play,
  ArrowRight,
  MousePointer2,
  Cpu,
  BarChart3,
  MessageCircle,
  Users,
  Menu,
  X
} from 'lucide-react';
import { StarField } from '../components/common/StarField';
import { Button } from '../components/common/Button';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const reveals = document.querySelectorAll('.reveal-on-scroll');
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Gen Z Background */}
      <div className="cosmic-layer">
        <StarField />
        <div className="nebula-cloud" style={{ position: 'absolute', top: '10%', left: '10%', width: '60vw', height: '60vh', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div className="nebula-cloud" style={{ position: 'absolute', bottom: '10%', right: '10%', width: '50vw', height: '50vh', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div className="glow-mesh"></div>
      </div>

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(1200px, 92%)',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(16px) saturate(180%)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: scrolled ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05)' : 'none'
      }}>
        <div className="logo" style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>
            <Bot size={20} color="white" />
          </div>
          <span style={{ letterSpacing: '-0.02em' }}>Dailsmart <span style={{ color: '#3b82f6' }}>AI</span></span>
        </div>

        <div className="hide-mobile" style={{ display: 'flex', gap: '2rem' }}>
          {['Features', 'Workflow', 'Results', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ 
              color: 'rgba(255,255,255,0.7)', 
              textDecoration: 'none', 
              fontWeight: 700, 
              fontSize: '0.85rem', 
              transition: '0.3s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }} className="nav-link-premium">
              {item}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/login" className="hide-mobile" style={{ textDecoration: 'none' }}>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.85rem', marginRight: '1rem', cursor: 'pointer', opacity: 0.8 }}>Log In</span>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '0.75rem 1.75rem', 
              background: 'white', 
              color: 'black', 
              border: 'none', 
              borderRadius: '12px', 
              fontWeight: 900, 
              fontSize: '0.85rem', 
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(255,255,255,0.1)'
            }}>
              Start Building
            </button>
          </Link>
          <button 
            className="mobile-only" 
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(2, 6, 23, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 2000,
        display: isMobileMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'white' }}
        >
          <X size={32} />
        </button>
        {['Features', 'Workflow', 'Results', 'Pricing'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 900 }} className="hero-gradient-text">
            {item}
          </a>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', marginTop: '2rem' }}>
          <Button onClick={() => navigate('/login')} variant="secondary" fullWidth>Log In</Button>
          <Button onClick={() => navigate('/signup')} className="btn-genz" fullWidth>Start Free Trial</Button>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: '120px 5% 60px' 
      }}>
        <div className="reveal-on-scroll" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid var(--border)', marginBottom: '2.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <span style={{ padding: '0.1rem 0.6rem', background: 'var(--accent)', borderRadius: '100px', color: 'white', fontSize: '0.7rem' }}>NEW</span>
          Neural Voice v2.0 is now live ⚡
        </div>

        <h1 className="hero-gradient-text" style={{ 
          fontSize: 'clamp(3rem, 10vw, 7.5rem)', 
          fontWeight: 900, 
          lineHeight: 0.95, 
          letterSpacing: '-0.06em', 
          maxWidth: '1300px',
          marginBottom: '2.5rem',
          filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))'
        }}>
          AI that talks like a human,<br />
          vibe checks your leads.
        </h1>

        <p className="reveal-on-scroll" style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.4rem)', 
          color: 'var(--text-muted)', 
          maxWidth: '800px', 
          lineHeight: 1.6, 
          marginBottom: '3.5rem',
          fontWeight: 500
        }}>
          Dailsmart AI orchestrates autonomous voice agents that qualify, 
          follow up, and close leads 24/7. Zero latency. Infinite scale.
        </p>

        <div className="reveal-on-scroll" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button onClick={() => navigate('/signup')} className="btn-genz" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem' }}>
            Get Started Free <Bot size={20} />
          </Button>
          <Button variant="secondary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)' }}>
            Watch Demo <Play size={20} fill="currentColor" />
          </Button>
        </div>

        {/* Floating elements */}
        <div className="reveal-on-scroll floating-card hide-mobile" style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '5%', 
          padding: '1.5rem', 
          background: 'var(--panel-bg)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '20px', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} color="#00ff88" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>LATENCY</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>&lt; 200ms</div>
          </div>
        </div>

        <div className="reveal-on-scroll floating-card hide-mobile" style={{ 
          position: 'absolute', 
          bottom: '20%', 
          right: '5%', 
          padding: '1.5rem', 
          background: 'var(--panel-bg)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '20px', 
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animationDelay: '-3s',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONVERSION</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>+240%</div>
          </div>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255, 0, 127, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} color="var(--accent)" />
          </div>
        </div>
      </section>

      {/* Tech Chips */}
      <div className="reveal-on-scroll" style={{ padding: '4rem 5%', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', borderY: '1px solid var(--border)' }}>
        {['Advanced Neural Voice', 'Vocal Intent Analysis', 'Multi-Language Sync', 'Instant SSRL'].map(tech => (
          <div key={tech} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', boxShadow: 'var(--glow-pink)' }}></div>
            {tech.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <section id="features" style={{ padding: '120px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Built for the Hyper-Growth Era</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Everything you need to automate your outbound operations at lightspeed.</p>
        </div>

        <div className="grid-3">
          <FeatureCard 
            icon={<Cpu size={32} />} 
            title="Neural Voice Engine" 
            desc="Indistinguishable from human conversation. Adaptive tone, emotion, and pace handling."
            color="#ff007f"
          />
          <FeatureCard 
            icon={<Smartphone size={32} />} 
            title="Smart Integration" 
            desc="Syncs seamlessly with your existing CRM, Google Sheets, and custom API endpoints."
            color="#7000ff"
          />
          <FeatureCard 
            icon={<MessageCircle size={32} />} 
            title="Real-time Intent" 
            desc="Understands not just what people say, but what they mean. High-velocity qualification."
            color="#3b82f6"
          />
          <FeatureCard 
            icon={<Globe size={32} />} 
            title="Global Presence" 
            desc="Instantly deploy agents in 40+ languages with regional accents and cultural context."
            color="#00ff88"
          />
          <FeatureCard 
            icon={<Users size={32} />} 
            title="Infinite Concurrency" 
            desc="One agent or one million. Scale your team to handle any load without hiring anyone."
            color="#ffcc00"
          />
          <FeatureCard 
            icon={<Shield size={32} />} 
            title="Secure & Compliant" 
            desc="Enterprise encryption and strict compliance handling for sensitive data sectors."
            color="#ff3333"
          />
        </div>
      </section>

      {/* Powerful CTA */}
      <section style={{ padding: '120px 5%', textAlign: 'center' }}>
        <div className="premium-glass reveal-on-scroll" style={{ padding: '6rem 2rem', borderRadius: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(112, 0, 255, 0.2) 0%, transparent 70%)' }}></div>
          
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
            Ready to break the scale?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3.5rem', fontWeight: 500 }}>
            Join the elite teams using Dailsmart AI to dominate their markets. 
            Calibrate your first agent in under 5 minutes.
          </p>
          <Button onClick={() => navigate('/signup')} className="btn-genz" style={{ padding: '1.5rem 3.5rem', fontSize: '1.25rem' }}>
            Deploy Your First Agent <Smartphone size={24} />
          </Button>
        </div>
      </section>

      {/* Footer */}

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '100px 5%', textAlign: 'center' }}>
        <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1rem' }}>
          No Complex Math, Just High ROI 📈
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '4rem', fontWeight: 600 }}> Cheaper than market standards. Higher conversion than any rival agent.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="premium-glass reveal-on-scroll" style={{ padding: '3rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>Standard Node</h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 800, marginBottom: '2rem', letterSpacing: '0.1em' }}>MOST AFFORDABLE ENTRY</div>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--accent)" /> Pure Neural Audio (Zero Latency)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--accent)" /> Industry-Specific Dashboard</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--accent)" /> Real-time Lead IQ Analysis</li>
            </ul>
            <Button onClick={() => navigate('/signup')} className="btn-genz" fullWidth style={{ marginTop: '3rem' }}>Deploy Node Now</Button>
          </div>

          <div className="premium-glass reveal-on-scroll" style={{ padding: '4rem 3rem', borderRadius: '40px', border: '2px solid var(--accent)', transform: 'scale(1.05)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1.5rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 900 }}>ELITE BULK DEALS</div>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Bulk / Political</h3>
            <div style={{ fontSize: '1.1rem', color: 'var(--success)', fontWeight: 900, marginBottom: '2rem' }}>Cheapest Rates for Massive Scale</div>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--success)" /> Millions of Minutes per Day</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--success)" /> Dedicated 24/7 Support Line</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--success)" /> Custom Feature Injections</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={18} color="var(--success)" /> Lowest Talk Token Wholesale Price</li>
            </ul>
            <a href="tel:7989604033" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" fullWidth style={{ marginTop: '3rem', background: 'rgba(255,255,255,0.05)' }}>Call For Wholesale Rates</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Founders / Contact Section */}
      <section style={{ padding: '120px 5%', background: 'rgba(2, 6, 23, 0.4)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Talk to the Founders 🛠️</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 4rem', fontSize: '1.2rem', fontWeight: 500 }}>
          Direct technical access. No corporate gatekeeping.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div className="reveal-on-scroll" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--border)', width: '320px' }}>
            <div style={{ width: '100px', height: '100px', background: 'var(--accent)', borderRadius: '30px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={50} color="white" />
            </div>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Dinesh</h4>
            <p style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem' }}>FOUNDER & TECH LEAD</p>
            <a href="tel:7989604033" style={{ color: 'white', textDecoration: 'none', fontWeight: 900, fontSize: '1.4rem' }}>+91 7989604033</a>
          </div>

          <div className="reveal-on-scroll" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--border)', width: '320px' }}>
            <div style={{ width: '100px', height: '100px', background: 'var(--accent-secondary)', borderRadius: '30px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={50} color="white" />
            </div>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Yatish</h4>
            <p style={{ color: 'var(--accent-secondary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem' }}>FOUNDER & STRATEGY</p>
            <a href="tel:7989479005" style={{ color: 'white', textDecoration: 'none', fontWeight: 900, fontSize: '1.4rem' }}>+91 7989479005</a>
          </div>
        </div>
      </section>

      <footer style={{ padding: '100px 5% 50px', borderTop: '1px solid var(--border)', background: 'var(--panel-bg)' }}>
        <div className="grid-4" style={{ marginBottom: '5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="white" />
              </div>
              Dailsmart AI
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>Scaling human interaction beyond limits with neural orchestration.</p>
          </div>
          {['Product', 'Company', 'Security', 'Connect'].map(cat => (
              <div key={cat}>
                <h5 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'white' }}>{cat}</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Resource Core</a>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Network Status</a>
                  <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Encryption Protocol</a>
                </div>
              </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()} DAILSMART AI GLOBAL. BUILT BY DINESH & YATISH.
        </div>
      </footer>


      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <X size={40} />
        </button>
        {['Features', 'Workflow', 'Results', 'Pricing'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">
            {item}
          </a>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', marginTop: '2rem' }}>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" fullWidth style={{ padding: '1.25rem', borderRadius: '16px' }}>Log In</Button>
          </Link>
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Button className="btn-genz" fullWidth style={{ padding: '1.25rem', borderRadius: '16px', justifyContent: 'center' }}>Get Started</Button>
          </Link>
        </div>
      </div>

      <style>{`
        .nav-link-premium:hover { color: white !important; opacity: 1 !important; text-shadow: 0 0 10px rgba(59,130,246,0.5); transform: translateY(-1px); }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; }
        @media (max-width: 1024px) {
          .hide-mobile { display: none !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className="premium-glass reveal-on-scroll" style={{ 
      padding: '3rem 2rem', 
      borderRadius: '32px', 
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 20px 40px ${color}15`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.borderColor = 'var(--glass-border)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{ 
        width: '64px', 
        height: '64px', 
        background: `${color}15`, 
        borderRadius: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: '1.5rem',
        color: color,
        boxShadow: `0 8px 16px ${color}20`
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>{desc}</p>
    </div>
  );
}
