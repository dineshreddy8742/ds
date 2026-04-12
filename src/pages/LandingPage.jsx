import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { inquiriesAPI } from '../services/api';
import { 
  ShieldCheck, 
  BarChart3, 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  Globe,
  Database,
  Bot,
  Mic,
  TrendingUp,
  Clock,
  Home,
  Megaphone,
  GraduationCap,
  Users,
  Search,
  MonitorCheck,
  Layers,
  Shield,
  CreditCard,
  HelpCircle,
  Quote,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '../components/common/Button';

export default function LandingPage() {
  const [inquiryForm, setInquiryForm] = useState({ email: '', industry: 'Education' });
  const [submitting, setSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.email) return toast.error('Please enter your email');
    
    setSubmitting(true);
    try {
      await inquiriesAPI.submit(inquiryForm);
      toast.success('Demo request sent! We will contact you shortly.');
      setInquiryForm({ email: '', industry: 'Education' });
    } catch (error) {
      toast.error('Failed to send request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

   return (
    <div className="landing-grid" style={{ position: 'relative', minHeight: '100vh', color: 'var(--text-main)', background: 'var(--bg-main)', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <div className="stars-container">
        <div className="stars star-layer-1" />
        <div className="stars star-layer-2" />
        <div className="stars star-layer-3" />
      </div>
      <div className="nebula-glow" />
      {/* Background Blobs for Premium Feel */}
      <div className="blob-container">
        <div className="blob blob-1" style={{ opacity: 0.15, filter: 'blur(100px)' }}></div>
        <div className="blob blob-2" style={{ opacity: 0.1, filter: 'blur(100px)' }}></div>
        <div className="blob blob-3" style={{ opacity: 0.1, filter: 'blur(100px)' }}></div>
      </div>
      
      {/* Navigation */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 8%',
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 800 }}>
          <div style={{ 
            width: '36px', height: '36px', 
            background: 'linear-gradient(135deg, var(--accent), #6366f1)', 
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Bot size={22} color="white" />
          </div>
          DialSmart<span style={{ color: 'var(--accent)' }}>.ai</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '2.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }} className="hide-mobile">
          <a href="#about" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>What is DialSmart?</a>
          <a href="#workflow" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Workflow</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login">
            <Button variant="ghost" size="sm">Admin Portal</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" style={{ background: '#3b82f6', borderRadius: '8px' }}>Join the Network</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* --- HERO SECTION --- */}
        <section style={{ 
          maxWidth: '1200px', margin: '0 auto', padding: '8rem 2rem 6rem', 
          textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <div className="stat-pill" style={{ 
            background: 'var(--accent-glow)', border: '1px solid var(--border)',
            color: 'var(--accent)', fontWeight: 600, padding: '0.5rem 1.25rem', borderRadius: '100px',
            marginBottom: '2rem', fontSize: '0.875rem'
          }}>
            ✨ Save 70% Operational Budget with Voice AI
          </div>

          <h1 className="hero-gradient-text" style={{
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.05em', margin: '0 0 2rem',
            maxWidth: '1000px', animation: 'fadeInUp 1s ease-out',
          }}>
            Automate Your Leads<br />Scale Your Impact.
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.4rem)', color: 'var(--text-muted)',
            maxWidth: '800px', lineHeight: 1.6, marginBottom: '3.5rem',
            animation: 'fadeInUp 1s ease-out 0.2s both',
          }}>
            Stop wasting manpower on manual calls. DialSmart uses Advanced Voice AI to 
            qualify, score, and distribute leads 24/7—saving you time while 
            improving conversion by up to 3x.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.25rem' }}>
            <Link to="/signup">
              <Button size="lg" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem', borderRadius: '12px' }}>
                Launch Now <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Button>
            </Link>
          </div>

          <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>24/7</div>
              <div style={{ color: '#4b5563', fontWeight: 600 }}>Active Monitoring</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>70%</div>
              <div style={{ color: '#4b5563', fontWeight: 600 }}>Budget Saved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>10k+</div>
              <div style={{ color: '#4b5563', fontWeight: 600 }}>Calls/Hr Capacity</div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="workflow" style={{ padding: '8rem 0', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>How It <span style={{ color: 'var(--accent)' }}>Works</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Three simple steps to total lead automation.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', position: 'relative' }}>
            <WorkflowStep 
              num="01"
              icon={<FileSpreadsheet size={32} color="var(--accent)" />}
              title="Sync Data"
              desc="Connect your Google Sheets or upload CSV. Leads flow in automatically."
            />
            <WorkflowStep 
              num="02"
              icon={<Bot size={32} color="#8b5cf6" />}
              title="AI Call & Qualify"
              desc="Our Voice AI calls leads within seconds, qualifies intent, and logs results."
            />
            <WorkflowStep 
              num="03"
              icon={<TrendingUp size={32} color="#10b981" />}
              title="Scale & Convert"
              desc="High-intent leads are flagged. Your team closes students with 100% focus."
            />
          </div>
        </section>

        {/* --- INDUSTRIES --- */}
        <section id="services" style={{ padding: '6rem 0', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <ServiceCard 
              icon={<GraduationCap size={32} color="#3b82f6" />}
              title="Admission Consulting"
              desc="Qualify student leads automatically. Segment by course preference, budget, and academic background within seconds."
              stats="85% Counseling Time Saved"
            />
            <ServiceCard 
              icon={<Home size={32} color="#10b981" />}
              title="Real Estate"
              desc="Never miss a buyer. Our AI handles initial property inquiries, budget checks, and location preferences 24/7."
              stats="3x Higher Call Rate"
            />
            <ServiceCard 
              icon={<Megaphone size={32} color="#f59e0b" />}
              title="Advertising & Sales"
              desc="Scale your outbound ops. Convert Facebook/Google lead forms into qualified prospects without adding a single SDR."
              stats="70% Cost Reduction"
            />
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section style={{ padding: '8rem 0', background: 'rgba(59, 130, 246, 0.03)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Trusted by <span style={{ color: 'var(--accent)' }}>Market Leaders</span></h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <TestimonialCard 
                name="Siddharth Mehta"
                role="Director, EduGlobal"
                quote="DialSmart changed how we handle admissions. We replaced 4 callers with one AI, and our enrollment grew by 40%."
              />
              <TestimonialCard 
                name="Ananya Sharma"
                role="Founder, RealConnect"
                quote="The Google Sheets sync is magic. Property inquiries are qualified instantly, even at 2 AM. Unreal efficiency."
              />
              <TestimonialCard 
                name="Vikram Singh"
                role="CEO, AdVantage"
                quote="We used to lose leads because of slow follow-ups. Now, our AI calls them in under 10 seconds. Highly recommended."
              />
            </div>
          </div>
        </section>



        {/* --- GLOBAL LANGUAGE SUPPORT --- */}
        <section style={{ padding: '8rem 0', background: 'rgba(59, 130, 246, 0.02)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <div className="stat-pill" style={{ margin: '0 auto 2rem', background: 'var(--accent-glow)', border: '1px solid var(--border)', color: 'var(--accent)' }}>Truly Global AI</div>
              <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Break the <span style={{ color: 'var(--accent)' }}>Language Barrier</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Our AI handles calls in 20+ languages with native fluency.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
              <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                    <Globe size={24} color="#3b82f6" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Indian Markets</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati'].map(lang => (
                    <span key={lang} style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600 }}>{lang}</span>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                    <Zap size={24} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Global Coverage</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {['English (US/UK/AU)', 'Spanish', 'French', 'German', 'Arabic', 'Japanese', 'Mandarin'].map(lang => (
                    <span key={lang} style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1000px', fontSize: '0.875rem', fontWeight: 600 }}>{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section style={{ padding: '8rem 0', maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FAQItem 
              q="Does the AI sound natural?" 
              a="Yes! We use high-fidelity neural text-to-speech that mimics human intonation and emotion. Most leads don't even realize they are talking to an AI."
            />
            <FAQItem 
              q="How does the Google Sheet sync work?" 
              a="You simply paste your Sheet ID and enable our Apps Script. Whenever a new row is added, it triggers the AI call instantly—even if you're sleeping."
            />
            <FAQItem 
              q="Is my data secure?" 
              a="We use enterprise-grade encryption and Supabase Row-Level Security. Each client's data is isolated and never shared between dashboards."
            />
          </div>
        </section>

        {/* --- LIVE DASHBOARD PREVIEW --- */}
        <section style={{ padding: '8rem 0', background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.05), transparent)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>AI Lead <span style={{ color: '#3b82f6' }}>Intelligence</span></h2>
              <p style={{ color: '#94a3b8', fontSize: '1.25rem' }}>See the result of 24/7 autonomous calling.</p>
            </div>

            <div className="glass-card" style={{ padding: '3rem', borderRadius: '40px', border: '1px solid rgba(59, 130, 246, 0.2)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>CONVERSION RATE</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>+245%</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>QUALIFIED LEADS</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6' }}>1,290</div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>AI CALL MINUTES</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#8b5cf6' }}>4,902</div>
                </div>
              </div>

              <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '2%', paddingBottom: '1rem' }}>
                {[60, 45, 80, 55, 90, 70, 95, 85, 100, 75, 40, 80].map((h, i) => (
                  <div key={i} style={{ 
                    flex: 1, 
                    height: `${h}%`, 
                    background: i === 8 ? 'linear-gradient(to top, #3b82f6, #60a5fa)' : 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px 8px 0 0',
                  }} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1rem', color: '#475569', fontSize: '0.8125rem', fontWeight: 700 }}>MONTHLY LEAD GROWTH PERFORMANCE</div>
            </div>
          </div>
        </section>

        {/* --- DIRECT INQUIRY FORM --- */}
        <section id="contact" style={{ padding: '8rem 0', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="glass-card" style={{ padding: '4rem', borderRadius: '40px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Talk to an <span style={{ color: '#3b82f6' }}>Expert</span></h2>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '2rem' }}>
                Ready to transform your lead management? Leave your details and we'll show you a personalized AI demo.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}>
                  <Shield size={20} color="#10b981" /> Data Sovereignty Guaranteed
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1' }}>
                  <Zap size={20} color="#f59e0b" /> 10-Minute Setup
                </div>
              </div>
            </div>

            <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input 
                placeholder="Work Email" 
                type="email"
                required
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', color: '#fff' }} 
              />
              <select 
                value={inquiryForm.industry}
                onChange={(e) => setInquiryForm({ ...inquiryForm, industry: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: '12px', color: '#94a3b8' }}
              >
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Solar/SaaS">Solar/SaaS</option>
              </select>
              <Button type="submit" size="lg" loading={submitting} style={{ borderRadius: '12px' }}>Request Live Demo</Button>
            </form>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section style={{ padding: '10rem 0', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.05em' }}>
            Ready for High-Scale Growth?
          </h2>
          <Link to="/signup">
            <Button size="lg" style={{ padding: '1.5rem 5rem', fontSize: '1.3rem', borderRadius: '100px', boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.4)' }}>
              Deploy My Dashboard
            </Button>
          </Link>
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#4b5563', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={18} /> 5,000+ Leads Synced Today</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Search size={18} /> Real-time Audit On</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '6rem 8% 3rem', 
        borderTop: '1px solid var(--border)', 
        background: 'var(--panel-bg)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              <Bot size={28} color="var(--accent)" /> DialSmart<span style={{ color: 'var(--accent)' }}>.ai</span>
            </div>
            <p style={{ maxWidth: '350px', lineHeight: 1.8 }}>
              Building the future of autonomous sales and support. 
              The ultimate multi-tenant platform for agencies and institutions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.5rem' }}>Product</span>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Voice AI Engine</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Sheets Integration</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Compliance</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <span style={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.5rem' }}>Solutions</span>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>EdTech</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Real Estate</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Solar/B2B</a>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '6rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} DialSmart Global AI Automation. Built for Scale.
        </div>
      </footer>
    </div>
  );
}

// Components
function WorkflowStep({ num, icon, title, desc }) {
  return (
    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-1rem', right: '1.5rem', fontSize: '5rem', fontWeight: 900, color: 'rgba(59, 130, 246, 0.05)', lineHeight: 1 }}>
        {num}
      </div>
      <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, quote }) {
  return (
    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Quote size={32} color="#3b82f6" opacity={0.3} />
      <p style={{ fontSize: '1.125rem', lineHeight: 1.7, fontStyle: 'italic', margin: 0, color: '#e2e8f0' }}>"{quote}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1e293b' }} />
        <div>
          <div style={{ fontWeight: 700, color: '#fff' }}>{name}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{role}</div>
        </div>
      </div>
    </div>
  );
}



function FAQItem({ q, a }) {
  return (
    <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HelpCircle size={20} color="#3b82f6" /> {q}
      </h3>
      <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{a}</p>
    </div>
  );
}

function ServiceCard({ icon, title, desc, stats }) {
  return (
    <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'transform 0.3s' }}>
      <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>{title}</h3>
        <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1rem', margin: 0 }}>{desc}</p>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem', fontWeight: 700, color: '#3b82f6' }}>
        🚀 {stats}
      </div>
    </div>
  );
}
