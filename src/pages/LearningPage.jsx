import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BookOpen, Plus, Trash2, ExternalLink, Award, GraduationCap, Clock, Save, X, BookOpenCheck } from 'lucide-react';
import axios from 'axios';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import Skeleton from '../components/UI/Skeleton';
import { showToast } from '../store/uiSlice';
import styles from './Learning.module.css';

export default function LearningPage() {
  const dispatch = useDispatch();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form state
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Learning');
  const [resource, setResource] = useState('');
  const [notes, setNotes] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedSkills = localStorage.getItem('launchpad_learning');
    if (savedSkills) {
      try {
        setSkills(JSON.parse(savedSkills));
      } catch (e) {
        setSkills([]);
      }
    } else {
      // Mock initial skills for students
      const initialSkills = [
        {
          id: '1',
          name: 'React JS & Redux',
          category: 'Frontend',
          progress: 80,
          status: 'Learning',
          resource: 'https://react.dev',
          notes: 'Covering hooks, state management, and Redux Toolkit.'
        },
        {
          id: '2',
          name: 'Data Structures & Algorithms',
          category: 'DSA',
          progress: 100,
          status: 'Mastered',
          resource: 'https://leetcode.com',
          notes: 'Completed 150 Array and Dynamic Programming problems.'
        }
      ];
      setSkills(initialSkills);
      localStorage.setItem('launchpad_learning', JSON.stringify(initialSkills));
    }
    setLoading(false);
  }, []);

  // Save to localStorage helper
  const saveSkillsToLocalStorage = (updatedSkills) => {
    setSkills(updatedSkills);
    localStorage.setItem('launchpad_learning', JSON.stringify(updatedSkills));
  };

  const handleOpenModal = () => {
    setSkillName('');
    setCategory('Frontend');
    setProgress(0);
    setStatus('Learning');
    setResource('');
    setNotes('');
    setModalOpen(true);
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) {
      dispatch(showToast({ message: 'Skill name is required', type: 'danger' }));
      return;
    }

    setApiLoading(true);

    const newSkill = {
      id: Date.now().toString(),
      name: skillName.trim(),
      category,
      progress: Number(progress),
      status: Number(progress) === 100 ? 'Mastered' : status,
      resource: resource.trim(),
      notes: notes.trim(),
    };

    try {
      // API Integration Demonstration (POST)
      // JSONPlaceholder mimics saving it to the server
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: newSkill.name,
        body: JSON.stringify(newSkill),
        userId: 1,
      });

      if (response.status === 201) {
        const updatedSkills = [newSkill, ...skills];
        saveSkillsToLocalStorage(updatedSkills);
        dispatch(showToast({ message: `Successfully saved "${newSkill.name}" to cloud database!`, type: 'success' }));
        setModalOpen(false);
      }
    } catch (error) {
      dispatch(showToast({ message: 'API POST failed. Saving locally instead.', type: 'warning' }));
      const updatedSkills = [newSkill, ...skills];
      saveSkillsToLocalStorage(updatedSkills);
      setModalOpen(false);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteSkill = (id, name) => {
    const updatedSkills = skills.filter((item) => item.id !== id);
    saveSkillsToLocalStorage(updatedSkills);
    dispatch(showToast({ message: `Removed "${name}"`, type: 'success' }));
  };

  const handleUpdateProgress = (id, newProgress) => {
    const updatedSkills = skills.map((item) => {
      if (item.id === id) {
        const val = Number(newProgress);
        return {
          ...item,
          progress: val,
          status: val === 100 ? 'Mastered' : val > 0 ? 'Learning' : 'Planned',
        };
      }
      return item;
    });
    saveSkillsToLocalStorage(updatedSkills);
  };

  // Stats calculation
  const totalSkills = skills.length;
  const masteredSkills = skills.filter((s) => s.progress === 100).length;
  const learningSkills = skills.filter((s) => s.progress > 0 && s.progress < 100).length;
  const plannedSkills = skills.filter((s) => s.progress === 0).length;

  if (loading) {
    return (
      <div className={styles.container}>
        <Skeleton height="80px" />
        <div className={styles.stats_grid} style={{ marginTop: '20px' }}>
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} height="100px" />
          ))}
        </div>
        <div className={styles.skills_grid} style={{ marginTop: '24px' }}>
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} height="180px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Learning Progress Tracker</h2>
          <p className={styles.subtitle}>Log your coding skills, courses, and certifications in real-time.</p>
        </div>
        <Button variant="primary" onClick={handleOpenModal}>
          <Plus size={16} style={{ marginRight: '4px' }} />
          Add Skill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={styles.stats_grid}>
        <div className={styles.stat_card}>
          <div className={styles.stat_icon__wrapper + ' ' + styles.indigo}>
            <GraduationCap size={20} />
          </div>
          <div>
            <div className={styles.stat_num}>{totalSkills}</div>
            <div className={styles.stat_lbl}>Total Skills</div>
          </div>
        </div>

        <div className={styles.stat_card}>
          <div className={styles.stat_icon__wrapper + ' ' + styles.success}>
            <Award size={20} />
          </div>
          <div>
            <div className={styles.stat_num}>{masteredSkills}</div>
            <div className={styles.stat_lbl}>Mastered (100%)</div>
          </div>
        </div>

        <div className={styles.stat_card}>
          <div className={styles.stat_icon__wrapper + ' ' + styles.warning}>
            <Clock size={20} />
          </div>
          <div>
            <div className={styles.stat_num}>{learningSkills}</div>
            <div className={styles.stat_lbl}>In Progress</div>
          </div>
        </div>

        <div className={styles.stat_card}>
          <div className={styles.stat_icon__wrapper + ' ' + styles.info}>
            <BookOpenCheck size={20} />
          </div>
          <div>
            <div className={styles.stat_num}>{plannedSkills}</div>
            <div className={styles.stat_lbl}>Planned / Wishlist</div>
          </div>
        </div>
      </div>

      {/* Skills list grid */}
      {skills.length === 0 ? (
        <div className={styles.empty_state}>
          <BookOpen size={48} className={styles.empty_icon} />
          <h3>No skills logged yet</h3>
          <p>Start tracking your study progress and certifications to boost your placements profile.</p>
          <Button variant="primary" style={{ marginTop: '16px' }} onClick={handleOpenModal}>
            Add your first skill
          </Button>
        </div>
      ) : (
        <div className={styles.skills_grid}>
          {skills.map((skill) => (
            <div key={skill.id} className={styles.skill_card}>
              <div className={styles.card_header}>
                <div>
                  <span className={styles.skill_category}>{skill.category}</span>
                  <h3 className={styles.skill_name}>{skill.name}</h3>
                </div>
                <button
                  className={styles.delete_btn}
                  onClick={() => handleDeleteSkill(skill.id, skill.name)}
                  title="Remove Skill"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={styles.card_body}>
                <div className={styles.progress_row}>
                  <div className={styles.progress_lbl}>
                    <span>Progress</span>
                    <span className={styles.progress_val}>{skill.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    className={styles.range_slider}
                    value={skill.progress}
                    onChange={(e) => handleUpdateProgress(skill.id, e.target.value)}
                  />
                </div>

                {skill.notes && <p className={styles.skill_notes}>{skill.notes}</p>}
              </div>

              <div className={styles.card_footer}>
                <span className={styles.status_badge}>
                  <Badge 
                    type="priority" 
                    value={skill.progress === 100 ? 'High' : skill.progress > 0 ? 'Medium' : 'Low'} 
                  />
                  <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {skill.progress === 100 ? 'Mastered' : skill.progress > 0 ? 'Learning' : 'Planned'}
                  </span>
                </span>
                
                {skill.resource && (
                  <a
                    href={skill.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.resource_link}
                  >
                    <ExternalLink size={14} style={{ marginRight: '4px' }} />
                    Resources
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal Dialbox */}
      {modalOpen && (
        <div className={styles.modal_backdrop}>
          <div className={styles.modal_content}>
            <div className={styles.modal_header}>
              <h3>Add Skill Tracker</h3>
              <button className={styles.close_modal} onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className={styles.form}>
              <div className={styles.form_group}>
                <label className={styles.form_label}>Skill Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Node.js & Express, DSA..."
                  className={styles.form_input}
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_group} style={{ flex: 1 }}>
                  <label className={styles.form_label}>Category</label>
                  <select
                    className={styles.form_select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DSA">DSA</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                <div className={styles.form_group} style={{ flex: 1 }}>
                  <label className={styles.form_label}>Initial Progress ({progress}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    className={styles.form_range}
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label className={styles.form_label}>Course/Resource URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/course"
                  className={styles.form_input}
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                />
              </div>

              <div className={styles.form_group}>
                <label className={styles.form_label}>Study Notes / Checklist</label>
                <textarea
                  placeholder="e.g. Mastered arrays, learning graphs..."
                  className={styles.form_textarea}
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className={styles.modal_actions}>
                <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} disabled={apiLoading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={apiLoading}>
                  {apiLoading ? (
                    'Saving to API...'
                  ) : (
                    <>
                      <Save size={14} style={{ marginRight: '4px' }} />
                      Save Skill
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
