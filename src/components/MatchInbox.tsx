import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { ProfileInteraction, Biodata } from '../types';

const calculateAge = (dob?: string) => {
  if (!dob) return 25;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

interface MatchInboxProps {
  interactions: ProfileInteraction[];
  profiles: Biodata[];
  activeUserId: string;
  onAccept: (interactionId: string) => void;
  onDecline: (interactionId: string) => void;
  onViewContact: (profile: Biodata) => void;
}

const MatchInbox: React.FC<MatchInboxProps> = ({ interactions, profiles, activeUserId, onAccept, onDecline, onViewContact }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'received' | 'matches' | 'sent'>('received');

  // We need the active user's biodataId to know if they are the receiver
  const activeUserBiodata = profiles.find(p => p.userId === activeUserId);
  const activeBiodataId = activeUserBiodata?.biodataId;

  // Filter interactions
  const receivedPending = interactions.filter(i => i.toProfileId === activeBiodataId && i.type === 'interest_sent');
  const sentPending = interactions.filter(i => i.fromUserId === activeUserId && i.type === 'interest_sent');
  const mutualMatches = interactions.filter(i => 
    (i.toProfileId === activeBiodataId || i.fromUserId === activeUserId) && 
    i.type === 'match_accepted'
  );

  const getProfile = (biodataId: string) => profiles.find(p => p.biodataId === biodataId);
  const getProfileByUserId = (userId: string) => profiles.find(p => p.userId === userId);

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabHeader}>
        <button 
          style={{ ...styles.tabBtn, ...(activeTab === 'received' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('received')}
        >
          {t('inbox_received')} ({receivedPending.length})
        </button>
        <button 
          style={{ ...styles.tabBtn, ...(activeTab === 'matches' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('matches')}
        >
          {t('inbox_matches')} ({mutualMatches.length})
        </button>
        <button 
          style={{ ...styles.tabBtn, ...(activeTab === 'sent' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('sent')}
        >
          {t('inbox_sent')}
        </button>
      </div>

      {/* List */}
      <div style={styles.listContainer}>
        
        {/* RECEIVED */}
        {activeTab === 'received' && (
          receivedPending.length === 0 ? (
            <div style={styles.emptyState}>No pending requests.</div>
          ) : (
            receivedPending.map(int => {
              const sender = getProfileByUserId(int.fromUserId);
              if (!sender) return null;
              return (
                <div key={int.interactionId} style={styles.card} className="animate-fade">
                  <img src={sender.photoUrl} alt={sender.fullName} style={styles.avatar} />
                  <div style={styles.cardInfo}>
                    <h4 style={styles.name}>{sender.fullName}</h4>
                    <p style={styles.meta}>{calculateAge(sender.dateOfBirth)} yrs • {sender.profession}</p>
                  </div>
                  <div style={styles.actionCol}>
                    <button onClick={() => onAccept(int.interactionId)} style={styles.btnAccept} aria-label="Accept">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <button onClick={() => onDecline(int.interactionId)} style={styles.btnDecline} aria-label="Decline">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )
        )}

        {/* MUTUAL MATCHES */}
        {activeTab === 'matches' && (
          mutualMatches.length === 0 ? (
            <div style={styles.emptyState}>No mutual matches yet. Keep browsing!</div>
          ) : (
            mutualMatches.map(int => {
              // Find the OTHER person in the match
              const matchProfile = int.fromUserId === activeUserId 
                ? getProfile(int.toProfileId) 
                : getProfileByUserId(int.fromUserId);
                
              if (!matchProfile) return null;
              
              return (
                <div key={int.interactionId} style={{ ...styles.card, borderLeft: '4px solid var(--gold-primary)' }} className="animate-fade">
                  <img src={matchProfile.photoUrl} alt={matchProfile.fullName} style={styles.avatar} />
                  <div style={styles.cardInfo}>
                    <h4 style={styles.name}>{matchProfile.fullName}</h4>
                    <span style={styles.matchBadge}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px', display: 'inline-block', verticalAlign: 'middle'}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      Mutual Match
                    </span>
                  </div>
                  <div style={styles.actionCol}>
                    <button onClick={() => onViewContact(matchProfile)} style={styles.btnContact}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      Contact
                    </button>
                  </div>
                </div>
              );
            })
          )
        )}

        {/* SENT */}
        {activeTab === 'sent' && (
          sentPending.length === 0 ? (
            <div style={styles.emptyState}>You haven't sent any interests yet.</div>
          ) : (
            sentPending.map(int => {
              const receiver = getProfile(int.toProfileId);
              if (!receiver) return null;
              return (
                <div key={int.interactionId} style={styles.card} className="animate-fade">
                  <img src={receiver.photoUrl} alt={receiver.fullName} style={{ ...styles.avatar, opacity: 0.7 }} />
                  <div style={styles.cardInfo}>
                    <h4 style={styles.name}>{receiver.fullName}</h4>
                    <p style={styles.meta}>Status: <span style={{color: 'var(--primary)'}}>Pending</span></p>
                  </div>
                </div>
              );
            })
          )
        )}

      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'var(--bg-card)',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-light)'
  },
  tabHeader: {
    display: 'flex',
    borderBottom: '1px solid var(--border-light)',
    background: 'var(--bg-app)'
  },
  tabBtn: {
    flex: 1,
    padding: '1.2rem 1rem',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  tabActive: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)',
    background: 'var(--bg-card)'
  },
  listContainer: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem 1rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    background: 'var(--bg-app)'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover' as const
  },
  cardInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem'
  },
  name: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-headers)'
  },
  meta: {
    margin: 0,
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  matchBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--gold-primary)',
    background: 'rgba(212,175,55,0.1)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    width: 'fit-content'
  },
  actionCol: {
    display: 'flex',
    gap: '0.5rem'
  },
  btnAccept: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(76,175,80,0.1)',
    color: '#2e7d32',
    border: '1px solid rgba(76,175,80,0.2)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDecline: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(244,67,54,0.1)',
    color: '#c62828',
    border: '1px solid rgba(244,67,54,0.2)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnContact: {
    padding: '0.6rem 1rem',
    background: 'linear-gradient(135deg, var(--gold-primary), hsl(45,80%,65%))',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};

export default MatchInbox;
