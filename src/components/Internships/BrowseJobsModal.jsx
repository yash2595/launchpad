import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Loader2, Briefcase, Plus, Check } from 'lucide-react';
import { insertInternship } from '../../services/internshipService';
import { addInternship } from '../../store/internshipsSlice';
import { showToast } from '../../store/uiSlice';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Skeleton from '../UI/Skeleton';

export default function BrowseJobsModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    if (!open) return;

    const fetchJobs = async () => {
      setLoading(true);
      setJobs([]);
      try {
        const response = await axios.get('https://dummyjson.com/products?limit=6');
        // Map products to dummy job titles
        const mappedJobs = (response.data.products || []).map((item) => ({
          id: item.id,
          company: item.title,
          title: 'Intern',
        }));
        setJobs(mappedJobs);
      } catch (error) {
        dispatch(
          showToast({
            message: 'Could not load jobs right now',
            type: 'danger',
          })
        );
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [open, onClose, dispatch]);

  const handleSaveJob = async (job) => {
    if (!user?.id) return;
    setSavingId(job.id);
    try {
      const payload = {
        company_name: job.company,
        job_title: job.title,
        status: 'Applied',
        priority: 'Medium',
        user_id: user.id,
      };
      const savedItem = await insertInternship(payload);
      dispatch(addInternship(savedItem));
      setSavedIds((prev) => {
        const updated = new Set(prev);
        updated.add(job.id);
        return updated;
      });
      dispatch(
        showToast({
          message: `Saved ${job.company} to applications!`,
          type: 'success',
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          message: error.message || 'Failed to save job application',
          type: 'danger',
        })
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Browse Careers & Jobs">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Explore featured roles from our network and add them directly to your tracker.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  style={{
                    border: 'var(--border-card)',
                    padding: '16px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Skeleton width="60%" height="16px" />
                  <Skeleton width="40%" height="12px" />
                  <Skeleton width="100%" height="32px" style={{ marginTop: '4px' }} />
                </div>
              ))
          ) : (
            jobs.map((job) => {
              const isSaved = savedIds.has(job.id);
              const isSaving = savingId === job.id;

              return (
                <div
                  key={job.id}
                  style={{
                    border: 'var(--border-card)',
                    padding: '16px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {job.company}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {job.title}
                    </span>
                  </div>
                  <Button
                    variant={isSaved ? 'secondary' : 'primary'}
                    size="sm"
                    style={{ width: '100%' }}
                    onClick={() => handleSaveJob(job)}
                    disabled={isSaving || isSaved}
                  >
                    {isSaving ? (
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : isSaved ? (
                      <>
                        <Check size={14} style={{ color: 'var(--color-success)' }} />
                        Saved
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
