import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

export default function Schemes() {
  const schemes = [
    {
      id: 1,
      title: "PM Kisan Samman Nidhi",
      desc: "Get up to ₹6,000 per year directly in your bank account to help with farming expenses.",
      url: "https://pmkisan.gov.in/"
    },
    {
      id: 2,
      title: "PM Fasal Bima Yojana (PMFBY)",
      desc: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
      url: "https://pmfby.gov.in/"
    },
    {
      id: 3,
      title: "Kisan Credit Card (KCC)",
      desc: "Timely and adequate credit support under single window for agricultural needs with flexible repayment options.",
      url: "https://www.myscheme.gov.in/schemes/kcc"
    },
    {
      id: 4,
      title: "National Agriculture Market (e-NAM)",
      desc: "Pan-India electronic trading portal to network the existing APMC mandis to create a unified national market for agricultural commodities.",
      url: "https://enam.gov.in/web/"
    }
  ];

  return (
    <PageTransition>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <Link to="/" style={{ color: 'var(--text-dark)' }}>
          <ArrowLeft size={28} />
        </Link>
        <h1 className="page-title" style={{ margin: 0 }}>Govt. Schemes</h1>
      </div>

      <p className="page-desc" style={{ marginBottom: '24px' }}>
        Explore and apply for various government schemes designed for your benefit. Clicking on 'Apply Now' will take you to the official government portal.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {schemes.map((scheme) => (
          <div key={scheme.id} className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ background: '#dbeafe', color: '#3b82f6', padding: '10px', borderRadius: '12px' }}>
                <ShieldCheck size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="text-body" style={{ fontWeight: 700, marginBottom: '4px' }}>{scheme.title}</h3>
                <p className="text-sm" style={{ lineHeight: 1.4 }}>{scheme.desc}</p>
              </div>
            </div>
            <button 
              onClick={() => window.open(scheme.url, '_blank')}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'var(--primary-green)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: 'bold', 
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              Apply Now <ExternalLink size={18} />
            </button>
          </div>
        ))}
      </div>
    </PageTransition>
  );
}
