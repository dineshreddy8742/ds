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
  X,
  Building2,
  GraduationCap,
  Vote,
  HelpCircle,
  Plus,
  Minus,
  TrendingUp,
  Award,
  FastForward,
  Activity,
  Download,
  Target,
  Linkedin
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
        <div className="logo" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem',
          cursor: 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            background: 'linear-gradient(135deg, var(--accent) 0%, #00d2ff 100%)', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'translateY(-100%)', animation: 'logo-shine 3s infinite' }}></div>
            <Bot size={24} color="white" />
          </div>
          <span style={{ 
            fontSize: '1.6rem', 
            fontWeight: 900, 
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to right, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}>
            DAILSMART <span style={{ color: 'var(--accent)', WebkitTextFillColor: 'initial', filter: 'drop-shadow(0 0 10px var(--accent))' }}>AI</span>
          </span>
        </div>

        <div className="hide-mobile" style={{ display: 'flex', gap: '2rem' }}>
          {['Features', 'Verticals', 'Growth', 'Pricing'].map(item => (
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
              Access Data Hub
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
        {['Features', 'Verticals', 'Growth', 'Pricing'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 900 }} className="hero-gradient-text">
            {item}
          </a>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', marginTop: '2rem' }}>
          <Button onClick={() => navigate('/login')} variant="secondary" fullWidth>Log In</Button>
          <Button onClick={() => navigate('/signup')} className="btn-genz" fullWidth>Get Started Now</Button>
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
          AI that qualifies your leads,<br />
          You just download results.
        </h1>

        <p className="reveal-on-scroll" style={{ 
          fontSize: 'clamp(1rem, 2vw, 1.4rem)', 
          color: 'var(--text-muted)', 
          maxWidth: '800px', 
          lineHeight: 1.6, 
          marginBottom: '3.5rem',
          fontWeight: 500
        }}>
          Dailsmart AI handles the autonomous voice orchestration in **Telugu, Hindi, English, Tamil, Kannada, and Bengali**. 
          We orchestrate **1,000 to 10,000+ calls daily** so you can scale and promote your business without limits. Zero setup. Instant downloads.
        </p>

        <div className="reveal-on-scroll" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            Get Data Access Now <ChevronRight size={20} />
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




      {/* Neural Quote Engine - Automatically Scrolling */}
      <section style={{ padding: '60px 5% 100px', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div className="reveal-on-scroll" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QuoteTicker />
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

      {/* Hyper Growth & Unfair Advantages Section */}
      <section id="growth" style={{ padding: '120px 5%', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '5rem', alignItems: 'center' }}>
          <div className="reveal-on-scroll">
            <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
              The Unfair<br />Advantage 📈
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: 500, lineHeight: 1.6 }}>
              Dailsmart AI doesn't just verify contacts; it engineers growth. Our Intelligence Engine grows smarter with every interaction, identifying patterns that human teams miss.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <AdvantageItem 
                icon={<FastForward size={24} />} 
                title="10x Speed-to-Lead" 
                desc="Instantly engage leads while they are still thinking about you. No wait times." 
              />
              <AdvantageItem 
                icon={<Award size={24} />} 
                title="99.9% Call Integrity" 
                desc="Perfect compliance, zero mistakes, and indistinguishable human-vibe interactions." 
              />
              <AdvantageItem 
                icon={<TrendingUp size={24} />} 
                title="Hyper-Scaling Engine" 
                desc="Go from 10 calls to 10,000 calls in a single click without hiring a single human." 
              />
            </div>
          </div>

          <div className="reveal-on-scroll" style={{ position: 'relative' }}>
            <div className="floating-animation" style={{ borderRadius: '48px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}>
              <img 
                src="/neural_growth.png" 
                alt="Neural Growth Visualization" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            {/* Animated Impact Chips */}
            <div style={{ position: 'absolute', top: '10%', right: '-10%', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.2)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3b82f6' }}>4.8M+</div>
               <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.7 }}>Minutes Orchestrated</div>
            </div>
            <div style={{ position: 'absolute', bottom: '10%', left: '-10%', padding: '1.5rem', background: 'rgba(0, 255, 136, 0.2)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00ff88' }}>92%</div>
               <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.7 }}>Quality Score Avg</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '120px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem' }}>Hands-Free Lead Intelligence</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>We provide the service. Our AI qualifies. You download the final qualified lead data.</p>
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
            desc="Instantly provide coverage in 40+ languages with regional accents and cultural context."
            color="#00ff88"
          />
          <FeatureCard 
            icon={<Users size={32} />} 
            title="10k+ Daily Calls" 
            desc="Our infrastructure handles 1,000 to 10,000+ calls effortlessly every single day. Promote your brand at a scale humans can't reach."
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
      {/* Industry Verticals - What we focus mainly */}
      <section id="verticals" style={{ padding: '120px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
            Domain-Specific Intelligence
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', fontWeight: 500 }}>
            Our Lead Intelligence Systems are pre-trained for the most demanding industry verticals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <VerticalCard 
            icon={<GraduationCap size={40} />}
            title="Education & Institutions"
            points={[
              "Automate 100% of student admission inquiries",
              "Counseling sessions with native language support",
              "Instant fee structure & document verification",
              "24/7 reactive follow-ups for higher enrollment"
            ]}
            color="#3b82f6"
          />
          <VerticalCard 
            icon={<Building2 size={40} />}
            title="Real Estate & Property"
            points={[
              "Qualify high-intent buyers in under 60 seconds",
              "Automated site-visit scheduling & reminders",
              "Multi-property inventory data injection",
              "Global NRI outreach with regional vibe-checks"
            ]}
            color="#00ff88"
          />
          <VerticalCard 
            icon={<Vote size={40} />}
            title="Political & Civil Ops"
            points={[
              "Real-time grievance tracking & escalation",
              "Constituency-wide survey orchestration",
              "Sentiment mapping for policy-making",
              "Personalized candidate outreach at scale"
            ]}
            color="#ff007f"
          />
          <VerticalCard 
            icon={<Activity size={40} />}
            title="Healthcare & Clinics"
            points={[
              "Automated patient appointment scheduling",
              "Pre-consultation symptom intelligence",
              "Diagnostic report delivery & follow-ups",
              "Insurance claim inquiry orchestration"
            ]}
            color="#ff4444"
          />
          <VerticalCard 
            icon={<Shield size={40} />}
            title="Finance & Insurance"
            points={[
              "Lead qualification for credit & loans",
              "Policy renewal reminders & verification",
              "Personalized investment interest analysis",
              "Fraud & anomaly detection in lead data"
            ]}
            color="#ffd700"
          />
          <VerticalCard 
            icon={<Star size={40} />}
            title="Automobile & Showrooms"
            points={[
              "Test-drive scheduling & qualification",
              "New launch promotion at 10k+ scale",
              "Service reminder & feedback loops",
              "Insurance & financing interest checks"
            ]}
            color="#ff8800"
          />
          <VerticalCard 
            icon={<Globe size={40} />}
            title="Hospitality & Tourism"
            points={[
              "Instant booking verification & inquiries",
              "Regional tour package promotions",
              "Feedback loops for hotel stays",
              "Loyalty program outreach"
            ]}
            color="#00d2ff"
          />
          <VerticalCard 
            icon={<TrendingUp size={40} />}
            title="Enterprise & Retail"
            points={[
              "B2B partner and vendor qualification",
              "Automated delivery feedback orchestration",
              "Promotion awareness at 10k+ scale",
              "Loyalty program re-engagement"
            ]}
            color="#f0f"
          />
        </div>
      </section>

      {/* Linguistic Intelligence Overlay */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 5%', background: 'rgba(59,130,246,0.02)', textAlign: 'center' }}>
          <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '3rem' }}>
            Native Linguistic Intelligence 🌍
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(1rem, 2vw, 3rem)' }}>
              {['తెలుగు', 'हिन्दी', 'ENGLISH', 'தமிழ்', 'ಕನ್ನಡ', 'বাংলা'].map(lang => (
                  <div key={lang} className="premium-glass" style={{ padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 3rem)', borderRadius: '20px', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 900, color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                      {lang}
                  </div>
              ))}
          </div>
          <p style={{ marginTop: '3rem', fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)', fontWeight: 600, maxWidth: '800px', margin: '3rem auto 0' }}>
             Full dialect support for regional vibe-checks and deep sentiment analysis.
          </p>
      </section>

      {/* Expanded Services / Features */}
      <section style={{ padding: '120px 5%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
              <FeatureCard 
                icon={<Activity size={32} />} 
                title="Cold Lead Revival" 
                desc="Our AI breathes life into your dead databases, re-qualifying old leads with fresh energy."
                color="#00efff"
              />
              <FeatureCard 
                icon={<Target size={32} />} 
                title="Demographic Deep-Dive" 
                desc="Get rich metadata on every lead—income bracket, interest level, and urgency score."
                color="#f0f"
              />
              <FeatureCard 
                icon={<BarChart3 size={32} />} 
                title="Market Sentiment Hub" 
                desc="Instant reports on why people are saying YES or NO. Adjust your strategy in real-time."
                color="#ff8800"
              />
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" style={{ padding: '120px 5%' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 className="hero-gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textAlign: 'center', marginBottom: '4rem' }}>
              Neural FAQ 🧠
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FAQItem 
                question="What exactly is Dailsmart AI?"
                answer="We are a lead intelligence service. Our AI handles all the difficult voice calls to find out who is actually interested in your product. You don't have to do anything except download the list of interested people."
              />
              <FAQItem 
                question="Do I need to know coding or set up any bots?"
                answer="No. It is a 100% hands-free service. We manage the technology and the AI nodes. You just log into your dashboard and download your qualified data."
              />
              <FAQItem 
                question="How do I get my qualified leads?"
                answer="Once our system qualifies a lead, it appears instantly in your Lead Hub. You can download the entire list as an Excel or PDF file with one click."
              />
              <FAQItem 
                question="What languages do you support?"
                answer="We specialize in regional Indian languages including Telugu, Hindi, Tamil, Kannada, and Bengali, along with perfect English."
              />
              <FAQItem 
                question="Is my customer data safe with you?"
                answer="Yes, 100%. Your lead data is encrypted and private. We never share your data with anyone else. It's for your eyes only."
              />
            </div>
          </div>
      </section>

      {/* Powerful CTA */}
      <section style={{ padding: '120px 5%', textAlign: 'center' }}>
        <div className="premium-glass reveal-on-scroll" style={{ padding: '6rem 2rem', borderRadius: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(112, 0, 255, 0.2) 0%, transparent 70%)' }}></div>
          
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>
            Ready for Pure Results?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3.5rem', fontWeight: 500 }}>
            Join the elite teams using Dailsmart AI to dominate their markets. 
            Instant access to verified leads—just click download.
          </p>
          <Button onClick={() => navigate('/signup')} className="btn-genz" style={{ padding: '1.5rem 3.5rem', fontSize: '1.25rem' }}>
            Get My Qualified Data <Download size={24} />
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
            <Button onClick={() => navigate('/signup')} className="btn-genz" fullWidth style={{ marginTop: '3rem' }}>Access Premium Data Hub</Button>
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
          <div className="reveal-on-scroll" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--border)', width: '320px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '100px', overflow: 'hidden', margin: '0 auto 2rem', border: '5px solid var(--accent)', boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)' }}>
              <img src="/yatish.png" alt="Dinesh - Founder" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', transform: 'scale(1.4)' }} />
            </div>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Dinesh Reddy</h4>
            <p style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem' }}>FOUNDER & TECH LEAD</p>
            <a href="tel:7989604033" style={{ color: 'white', textDecoration: 'none', fontWeight: 900, fontSize: '1.4rem', display: 'block', marginBottom: '1rem' }}>+91 7989604033</a>
            <a href="https://www.linkedin.com/in/palavala-dinesh-kumar-reddy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Linkedin size={20} /> LinkedIn Profile
            </a>
          </div>

          <div className="reveal-on-scroll" style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid var(--border)', width: '320px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '200px', height: '200px', borderRadius: '100px', overflow: 'hidden', margin: '0 auto 2rem', border: '5px solid var(--accent-secondary)', boxShadow: '0 0 50px rgba(168, 85, 247, 0.5)' }}>
              <img src="/dinesh.png" alt="Yatish - Founder" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transform: 'scale(1.2)' }} />
            </div>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Yatish Gottapu</h4>
            <p style={{ color: 'var(--accent-secondary)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem' }}>FOUNDER & STRATEGY</p>
            <a href="tel:7989479005" style={{ color: 'white', textDecoration: 'none', fontWeight: 900, fontSize: '1.4rem', display: 'block', marginBottom: '1rem' }}>+91 7989479005</a>
            <a href="https://www.linkedin.com/in/yatish-gottapu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Linkedin size={20} /> LinkedIn Profile
            </a>
          </div>
        </div>
      </section>

      <footer style={{ padding: '100px 5% 50px', borderTop: '1px solid var(--border)', background: 'var(--panel-bg)', position: 'relative' }}>
        <div className="grid-4" style={{ marginBottom: '5rem' }}>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--accent) 0%, #00d2ff 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
                <Bot size={20} color="white" />
              </div>
              DAILSMART <span style={{ color: 'var(--accent)' }}>AI</span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>Delivering verified AI-qualified lead intelligence at global scale.</p>
          </div>
          {['Product', 'Company', 'Security', 'Connect'].map(cat => (
              <div key={cat}>
                <h5 style={{ fontWeight: 900, marginBottom: '1.5rem', color: 'white' }}>{cat}</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {cat === 'Connect' ? (
                    <>
                      <a href="https://www.linkedin.com/company/dailsmart-ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Linkedin size={16} /> LinkedIn Page
                      </a>
                      <a href="tel:7989604033" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Official Support</a>
                    </>
                  ) : (
                    <>
                      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Resource Hub</a>
                      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Network Logic</a>
                      <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Encryption Core</a>
                    </>
                  )}
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
        {['Features', 'Verticals', 'Growth', 'Pricing'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">
            {item}
          </a>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%', marginTop: '2rem' }}>
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Button variant="secondary" fullWidth style={{ padding: '1.25rem', borderRadius: '16px' }}>Log In</Button>
          </Link>
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Button className="btn-genz" fullWidth style={{ padding: '1.25rem', borderRadius: '16px', justifyContent: 'center' }}>Get Started Now</Button>
          </Link>
        </div>
      </div>

      <style>{`
        .nav-link-premium:hover { color: white !important; opacity: 1 !important; text-shadow: 0 0 10px rgba(59,130,246,0.5); transform: translateY(-1px); }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; }
        @media (max-width: 768px) {
          .nav-link-premium { display: none; }
          .hero-gradient-text { font-size: clamp(2.5rem, 12vw, 4rem) !important; }
          .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
          section { padding: 80px 5% !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .floating-animation { animation: float 6s ease-in-out infinite; }
        .faq-item:hover { border-color: var(--accent) !important; background: rgba(255,255,255,0.03) !important; }
        .mobile-overlay { position: fixed; inset: 0; background: rgba(2,6,23,0.98); backdrop-filter: blur(20px); z-index: 5000; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .mobile-overlay.active { opacity: 1; pointer-events: auto; }
        .mobile-link { font-size: 2rem; fontWeight: 900; color: white; text-decoration: none; margin-bottom: 2rem; transition: 0.3s; }
        .mobile-link:hover { color: var(--accent); transform: scale(1.1); }
        @keyframes logo-shine {
          0% { transform: translateY(-100%) rotate(45deg); }
          100% { transform: translateY(200%) rotate(45deg); }
        }
        .logo:hover { transform: translateY(-2px); }
        @keyframes portrait-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 50px rgba(59, 130, 246, 0.7); }
        }
        .founder-portrait { transition: 0.5s; }
        .founder-portrait:hover { transform: scale(1.05) !important; }
      `}</style>
    </div>
  );
}

function AdvantageItem({ icon, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', color: '#3b82f6' }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{title}</h4>
        <p style={{ color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

function VerticalCard({ icon, title, points, color }) {
  return (
    <div className="premium-glass reveal-on-scroll" style={{ 
      padding: '2rem 1.75rem', 
      borderRadius: '28px', 
      border: `1px solid ${color}15`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'default',
      background: 'rgba(255,255,255,0.01)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = `${color}15`;
      e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
    }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: color, filter: 'blur(60px)', opacity: 0.1, pointerEvents: 'none' }}></div>
      
      <div style={{ 
        width: '50px', 
        height: '50px', 
        background: `${color}10`, 
        borderRadius: '16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: color, 
        marginBottom: '1.5rem',
        border: `1px solid ${color}20`
      }}>
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.02em', color: 'white' }}>{title}</h3>
      
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {points.map((p, i) => (
          <li key={i} style={{ 
            color: 'var(--text-muted)', 
            fontWeight: 600, 
            fontSize: '0.9rem', 
            display: 'flex', 
            gap: '0.75rem',
            lineHeight: 1.3
          }}>
            <CheckCircle size={14} color={color} style={{ flexShrink: 0, marginTop: '0.2rem' }} />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="premium-glass faq-item" 
      onClick={() => setIsOpen(!isOpen)}
      style={{ padding: '1.5rem 2rem', borderRadius: '20px', cursor: 'pointer', transition: '0.3s', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{question}</h4>
        {isOpen ? <Minus size={20} color="var(--accent)" /> : <Plus size={20} color="var(--accent)" />}
      </div>
      {isOpen && (
        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500, animation: 'fadeIn 0.3s ease-out' }}>
          {answer}
        </p>
      )}
    </div>
  );
}
function QuoteTicker() {
  const quotes = [
    "THIS IS DIALSMART. THIS IS THE FUTURE OF AI.",
    "BUILDING BUSINESSES. PROMOTING GROWTH.",
    "10,000+ DAILY CALLS. INFINITE SCALE. ZERO LIMITS.",
    "AI QUALIFIES. YOU DOWNLOAD. PURE DATA.",
    "MARKET DOMINATION IS NOW AUTONOMOUS."
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {quotes.map((quote, i) => (
        <div 
          key={i}
          style={{ 
            fontSize: 'clamp(1.2rem, 4vw, 2.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.2, 
            letterSpacing: '0.05em', 
            background: 'linear-gradient(to right, #fff 0%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: i === index ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: i === index ? 'drop-shadow(0 0 15px rgba(255,255,255,0.05))' : 'none',
            padding: '1rem 0',
            textShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
          }}
        >
          {quote}
        </div>
      ))}
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
