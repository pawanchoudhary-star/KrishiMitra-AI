import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Droplets, 
  Bug, 
  Sprout, 
  CheckCircle2, 
  Calendar, 
  ClipboardList, 
  Info, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../context/LanguageContext';

export default function CropCare() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskTogglingId, setTaskTogglingId] = useState(null);

  const farmerPhone = localStorage.getItem('registeredPhone') || '9876543210';

  // Fetch active crops for this farmer
  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/crops?phone=${encodeURIComponent(farmerPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setCrops(data);
        if (data.length > 0) {
          setSelectedCrop(data[0]);
        }
      } else {
        setError('Failed to fetch crops. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching crops:', err);
      setError('Connection to backend failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks for the selected crop
  const fetchTasks = async (cropId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks?cropId=${encodeURIComponent(cropId)}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [farmerPhone]);

  useEffect(() => {
    if (selectedCrop) {
      fetchTasks(selectedCrop._id);
    }
  }, [selectedCrop]);

  // Handle task completion toggle
  const handleToggleTask = async (taskId, currentCompleted) => {
    setTaskTogglingId(taskId);
    
    // Optimistic UI update
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t._id === taskId ? { ...t, completed: !currentCompleted } : t
      )
    );

    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !currentCompleted })
      });

      if (!res.ok) {
        // Rollback on failure
        setTasks(prevTasks => 
          prevTasks.map(t => 
            t._id === taskId ? { ...t, completed: currentCompleted } : t
          )
        );
        console.error('Failed to update task on backend');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      // Rollback on failure
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t._id === taskId ? { ...t, completed: currentCompleted } : t
        )
      );
    } finally {
      setTaskTogglingId(null);
    }
  };

  // Query Chatbot helper
  const handleAskAIGuide = (taskName, category) => {
    const cropName = selectedCrop ? selectedCrop.cropName : 'crops';
    const query = lang === 'hi' 
      ? `मुझे बताएं कि मैं ${cropName} में '${taskName}' (${category}) कार्य को कैसे पूरा करूं? कृपया विस्तार से चरण-दर-चरण सलाह दें।`
      : `How do I complete the task '${taskName}' (${category}) for my ${cropName} crop? Please provide a detailed step-by-step organic and chemical guide.`;
    
    navigate(`/chat?q=${encodeURIComponent(query)}`);
  };

  // Calculate crop age
  const calculateAge = (sowingDateString) => {
    const sowing = new Date(sowingDateString);
    const today = new Date();
    const diffTime = Math.abs(today - sowing);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get dynamic category icons and colors
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Irrigation':
        return {
          icon: <Droplets size={20} />,
          color: '#3b82f6',
          bg: '#e0f2fe',
          border: '#bae6fd'
        };
      case 'Fertilizer':
        return {
          icon: <Sprout size={20} />,
          color: '#10b981',
          bg: '#d1fae5',
          border: '#a7f3d0'
        };
      case 'Pesticide':
        return {
          icon: <Bug size={20} />,
          color: '#ef4444',
          bg: '#fee2e2',
          border: '#fecaca'
        };
      case 'Weeding':
        return {
          icon: <Sparkles size={20} />,
          color: '#f59e0b',
          bg: '#fef3c7',
          border: '#fde68a'
        };
      case 'Harvesting':
        return {
          icon: <CheckCircle2 size={20} />,
          color: '#8b5cf6',
          bg: '#ede9fe',
          border: '#ddd6fe'
        };
      default:
        return {
          icon: <ClipboardList size={20} />,
          color: '#6b7280',
          bg: '#f3f4f6',
          border: '#e5e7eb'
        };
    }
  };

  const getSowingText = (sowingDateString) => {
    const d = new Date(sowingDateString);
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <PageTransition>
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '32px' }}>
        
        {/* Header Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <Link to="/" style={{ color: 'var(--text-dark)' }}>
            <ArrowLeft size={28} />
          </Link>
          <h1 className="page-title" style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
            {t('crop_care_header')}
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(16, 185, 129, 0.1)', borderTop: '4px solid var(--primary-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <div className="text-body" style={{ color: 'var(--text-light)', fontWeight: 500 }}>
              {lang === 'hi' ? 'फसल विवरण लोड हो रहा है...' : 'Loading crop details...'}
            </div>
          </div>
        ) : error ? (
          <div className="glass" style={{ padding: '24px', textAlign: 'center', border: '1px solid #fee2e2' }}>
            <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: '#b91c1c' }}>{lang === 'hi' ? 'त्रुटि हुई' : 'Error Occurred'}</h3>
            <p className="text-sm" style={{ color: '#7f1d1d', marginBottom: '16px' }}>{error}</p>
            <button onClick={fetchCrops} style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
            </button>
          </div>
        ) : crops.length === 0 ? (
          /* Empty State - No Crops Registered */
          <div className="glass" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(20px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.5)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={42} />
            </div>
            <div style={{ maxWidth: '460px' }}>
              <h3 className="text-h3" style={{ marginBottom: '8px', fontSize: '20px', fontWeight: 700, color: 'var(--text-dark)' }}>
                {t('no_active_crops')}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-light)', lineHeight: 1.6 }}>
                {t('add_crops_profile')}
              </p>
            </div>
            <button 
              onClick={() => navigate('/profile')} 
              className="btn btn-primary"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                color: 'white', 
                border: 'none', 
                padding: '12px 28px', 
                borderRadius: '12px', 
                fontSize: '15px', 
                fontWeight: 700, 
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.4)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {t('go_to_profile')}
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          /* Main Content - Active Crops List */
          <div>
            
            {/* Horizontal Crop Tabs Switcher */}
            <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
              {crops.map((crop) => {
                const isActive = selectedCrop?._id === crop._id;
                const age = calculateAge(crop.sowingDate);
                
                return (
                  <button
                    key={crop._id}
                    onClick={() => setSelectedCrop(crop)}
                    style={{
                      flexShrink: 0,
                      background: isActive 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                        : 'rgba(255, 255, 255, 0.7)',
                      color: isActive ? 'white' : 'var(--text-dark)',
                      border: '1px solid',
                      borderColor: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.6)',
                      borderRadius: '16px',
                      padding: '12px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: isActive 
                        ? '0 4px 12px 0 rgba(16, 185, 129, 0.3)' 
                        : '0 2px 8px 0 rgba(0, 0, 0, 0.02)',
                      fontWeight: isActive ? 700 : 600,
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Sprout size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '14px' }}>{crop.cropName}</div>
                      <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>
                        {crop.area} {t('acres')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedCrop && (
              <>
                {/* Crop Progress Banner */}
                {(() => {
                  const age = calculateAge(selectedCrop.sowingDate);
                  const progressPercent = Math.min(100, Math.max(0, (age / 120) * 100));
                  
                  // Stage classification helper
                  let stageName = lang === 'hi' ? 'प्रारंभिक अवस्था' : 'Establishment Stage';
                  if (age > 15 && age <= 40) stageName = lang === 'hi' ? 'सक्रिय विकास अवस्था' : 'Active Growth Stage';
                  if (age > 40 && age <= 70) stageName = lang === 'hi' ? 'वानस्पतिक / फूल आने की अवस्था' : 'Vegetative / Flowering Stage';
                  if (age > 70 && age <= 100) stageName = lang === 'hi' ? 'फली / दाने भरने की अवस्था' : 'Pod Development / Grain Filling';
                  if (age > 100) stageName = lang === 'hi' ? 'परिपक्वता / कटाई अवस्था' : 'Maturity / Harvest Stage';

                  return (
                    <div className="glass" style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.5)', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-green)', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                              {selectedCrop.healthStatus === 'Healthy' ? (lang === 'hi' ? 'उत्कृष्ट स्वास्थ्य' : 'Excellent Health') : selectedCrop.healthStatus}
                            </span>
                            <span style={{ fontSize: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                              {stageName}
                            </span>
                          </div>
                          <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)' }}>
                            {selectedCrop.cropName}
                          </h2>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-light)', fontWeight: 500 }}>
                            {lang === 'hi' ? 'बुवाई की तारीख:' : 'Sown on:'} <strong style={{ color: 'var(--text-dark)' }}>{getSowingText(selectedCrop.sowingDate)}</strong> ({age} {lang === 'hi' ? 'दिन पुरानी' : 'days old'})
                          </p>
                        </div>

                        {/* Progress Circular visual representation */}
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-green)' }}>
                            {age < 120 ? `Day ${age}` : `Day 120+`}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600 }}>
                            {lang === 'hi' ? '120-दिवसीय जीवनचक्र' : 'of 120-Day Lifecycle'}
                          </div>
                        </div>
                      </div>

                      {/* Premium Progress Bar Track */}
                      <div style={{ width: '100%', height: '8px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div 
                          style={{ 
                            width: `${progressPercent}%`, 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', 
                            borderRadius: '4px', 
                            boxShadow: '0 2px 6px 0 rgba(16, 185, 129, 0.3)',
                            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                          }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-light)', fontWeight: 600 }}>
                        <span>{lang === 'hi' ? 'बुवाई (दिन 1)' : 'Sowing (Day 1)'}</span>
                        <span>{lang === 'hi' ? 'मध्य विकास (दिन 60)' : 'Mid Stage (Day 60)'}</span>
                        <span>{lang === 'hi' ? 'कटाई (दिन 120)' : 'Harvest (Day 120)'}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Checklist Section Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <h3 className="text-h3" style={{ margin: 0, fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClipboardList size={20} style={{ color: 'var(--primary-green)' }} />
                    {lang === 'hi' ? '120-दिवसीय कार्य अनुसूची' : '120-Day Crop Care Checklist'}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 600 }}>
                    {tasks.filter(t => t.completed).length}/{tasks.length} {lang === 'hi' ? 'पूरे हुए' : 'completed'}
                  </div>
                </div>

                {/* Timeline Checklist Feed */}
                {tasks.length === 0 ? (
                  <div className="glass" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
                    {t('no_tasks')}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
                    
                    {/* Vertical timeline connector line */}
                    <div style={{ 
                      position: 'absolute', 
                      left: '27px', 
                      top: '24px', 
                      bottom: '24px', 
                      width: '2px', 
                      background: 'rgba(16, 185, 129, 0.12)', 
                      zIndex: 0 
                    }} />

                    {tasks.map((task) => {
                      const theme = getCategoryTheme(task.category);
                      const isCompleted = task.completed;
                      const taskName = lang === 'hi' ? task.taskHindi : task.taskName;
                      const taskDesc = lang === 'hi' ? task.descriptionHindi : task.description;

                      return (
                        <div 
                          key={task._id} 
                          className="glass" 
                          style={{ 
                            padding: '18px 20px', 
                            background: isCompleted ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                            borderLeft: `4px solid ${isCompleted ? '#10b981' : theme.color}`,
                            opacity: isCompleted ? 0.75 : 1,
                            transform: 'translateZ(0)',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'flex-start',
                            zIndex: 1,
                            boxShadow: isCompleted ? 'none' : '0 4px 16px 0 rgba(0, 0, 0, 0.02)',
                            borderRadius: '20px'
                          }}
                        >
                          {/* Category Badge Icon */}
                          <div 
                            style={{ 
                              color: isCompleted ? '#ffffff' : theme.color, 
                              background: isCompleted ? '#10b981' : theme.bg, 
                              border: `1px solid ${isCompleted ? '#10b981' : theme.border}`,
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '12px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexShrink: 0,
                              boxShadow: isCompleted ? '0 3px 8px 0 rgba(16, 185, 129, 0.3)' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isCompleted ? <CheckCircle size={18} /> : theme.icon}
                          </div>

                          <div style={{ flex: 1 }}>
                            
                            {/* Card Header Info */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(0,0,0,0.04)', color: 'var(--text-dark)', padding: '2px 8px', borderRadius: '12px' }}>
                                {t('day')} {task.dayNumber}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: theme.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {t(task.category.toLowerCase())}
                              </span>
                            </div>

                            {/* Task name & details */}
                            <h4 style={{ 
                              margin: '0 0 6px 0', 
                              fontSize: '15px', 
                              fontWeight: 700, 
                              color: isCompleted ? 'var(--text-light)' : 'var(--text-dark)',
                              textDecoration: isCompleted ? 'line-through' : 'none',
                              transition: 'all 0.3s ease'
                            }}>
                              {taskName}
                            </h4>
                            
                            <p style={{ 
                              margin: '0 0 14px 0', 
                              fontSize: '13px', 
                              color: 'var(--text-light)', 
                              lineHeight: 1.5 
                            }}>
                              {taskDesc}
                            </p>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                              
                              {/* Complete Checkbox Toggle Button */}
                              <button 
                                onClick={() => handleToggleTask(task._id, isCompleted)}
                                disabled={taskTogglingId === task._id}
                                style={{ 
                                  background: isCompleted ? 'rgba(16, 185, 129, 0.08)' : 'transparent', 
                                  border: `1px solid ${isCompleted ? '#10b981' : 'var(--primary-green)'}`, 
                                  color: isCompleted ? '#059669' : 'var(--primary-green)', 
                                  padding: '6px 14px', 
                                  borderRadius: '8px', 
                                  fontSize: '12px', 
                                  fontWeight: 700, 
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  transition: 'all 0.2s ease',
                                  opacity: taskTogglingId === task._id ? 0.5 : 1
                                }}
                              >
                                {isCompleted ? (
                                  <>
                                    <CheckCircle size={14} />
                                    {t('completed_status')}
                                  </>
                                ) : (
                                  t('mark_done')
                                )}
                              </button>

                              {/* AI Guide Button */}
                              {!isCompleted && (
                                <button 
                                  onClick={() => handleAskAIGuide(taskName, task.category)}
                                  style={{ 
                                    background: 'rgba(255,255,255,0.6)', 
                                    border: '1px solid rgba(0,0,0,0.06)', 
                                    color: 'var(--text-dark)', 
                                    padding: '6px 14px', 
                                    borderRadius: '8px', 
                                    fontSize: '12px', 
                                    fontWeight: 600, 
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
                                >
                                  <Sparkles size={13} style={{ color: '#8b5cf6' }} />
                                  {lang === 'hi' ? 'AI सलाह गाइड' : 'AI Advice Guide'}
                                </button>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })}

                  </div>
                )}
              </>
            )}

          </div>
        )}

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </PageTransition>
  );
}
