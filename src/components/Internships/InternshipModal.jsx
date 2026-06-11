import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { upsertInternship, deleteInternship as apiDeleteInternship } from '../../services/internshipService';
import { addInternship, updateInternship, deleteInternship } from '../../store/internshipsSlice';
import { hideModal, showToast } from '../../store/uiSlice';
import { STATUS_LIST, PRIORITY_LIST, STATUSES, PRIORITIES } from '../../utils/constants';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import styles from '../Auth/AuthStyles.module.css';

export default function InternshipModal() {
  const dispatch = useDispatch();
  const { open, type, data } = useSelector((state) => state.ui.modal);
  const { user } = useSelector((state) => state.auth);

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState(STATUSES.APPLIED);
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Sync state with edit data
  useEffect(() => {
    if (open && type === 'edit' && data) {
      setCompanyName(data.company_name || '');
      setJobTitle(data.job_title || '');
      setLocation(data.location || '');
      setAppliedDate(data.applied_date || '');
      setDeadline(data.deadline || '');
      setStatus(data.status || STATUSES.APPLIED);
      setPriority(data.priority || PRIORITIES.MEDIUM);
      setNotes(data.notes || '');
      setErrors({});
    } else if (open && type === 'add') {
      setCompanyName('');
      setJobTitle('');
      setLocation('');
      // Default applied date to today's date (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      setAppliedDate(today);
      setDeadline('');
      setStatus(STATUSES.APPLIED);
      setPriority(PRIORITIES.MEDIUM);
      setNotes('');
      setErrors({});
    }
  }, [open, type, data]);

  if (!open || !type) return null;

  const handleClose = () => {
    dispatch(hideModal());
  };

  const validate = () => {
    const newErrors = {};
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      company_name: companyName.trim(),
      job_title: jobTitle.trim(),
      location: location.trim() || null,
      applied_date: appliedDate || null,
      deadline: deadline || null,
      status,
      priority,
      notes: notes.trim() || null,
      user_id: user.id,
    };

    if (type === 'edit') {
      payload.id = data.id;
      payload.created_at = data.created_at;
    }

    try {
      const savedData = await upsertInternship(payload);
      if (type === 'edit') {
        dispatch(updateInternship(savedData));
        dispatch(showToast({ message: 'Application updated successfully!', type: 'success' }));
      } else {
        dispatch(addInternship(savedData));
        dispatch(showToast({ message: 'Application added successfully!', type: 'success' }));
      }
      dispatch(hideModal());
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to save application. Please try again.',
          type: 'danger',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!data?.id) return;
    setLoading(true);
    try {
      await apiDeleteInternship(data.id);
      dispatch(deleteInternship(data.id));
      dispatch(showToast({ message: `Removed ${data.company_name} application`, type: 'success' }));
      dispatch(hideModal());
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to delete application',
          type: 'danger',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  if (type === 'delete') {
    return (
      <Modal open={open} onClose={handleClose} title="Delete Application">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            Remove <strong>{data?.company_name}</strong>? This can't be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Edit / Add modal form
  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={type === 'edit' ? 'Edit Application' : 'Add Application'}
    >
      <form className={styles.auth__form} onSubmit={handleFormSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className={styles.form__group}>
            <label className={styles.form__label}>Company Name *</label>
            <input
              type="text"
              className={`${styles.form__input} ${errors.companyName ? styles['form__input--error'] : ''}`}
              placeholder="e.g. Google"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
            />
            {errors.companyName && <div className={styles.form__error}>{errors.companyName}</div>}
          </div>

          <div className={styles.form__group}>
            <label className={styles.form__label}>Job Title *</label>
            <input
              type="text"
              className={`${styles.form__input} ${errors.jobTitle ? styles['form__input--error'] : ''}`}
              placeholder="e.g. Software Engineer Intern"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={loading}
            />
            {errors.jobTitle && <div className={styles.form__error}>{errors.jobTitle}</div>}
          </div>
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label}>Location</label>
          <input
            type="text"
            className={styles.form__input}
            placeholder="e.g. Mountain View, CA / Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className={styles.form__group}>
            <label className={styles.form__label}>Applied Date</label>
            <input
              type="date"
              className={styles.form__input}
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.form__group}>
            <label className={styles.form__label}>Deadline</label>
            <input
              type="date"
              className={styles.form__input}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className={styles.form__group}>
            <label className={styles.form__label}>Status</label>
            <select
              className={styles.form__input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {STATUS_LIST.map((statusName) => (
                <option key={statusName} value={statusName}>
                  {statusName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.form__group}>
            <label className={styles.form__label}>Priority</label>
            <select
              className={styles.form__input}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              {PRIORITY_LIST.map((priorityName) => (
                <option key={priorityName} value={priorityName}>
                  {priorityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.form__group}>
          <label className={styles.form__label}>Notes</label>
          <textarea
            className={styles.form__input}
            style={{ minHeight: '80px', resize: 'vertical' }}
            placeholder="Add application logs, contact details or next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Saving...
              </>
            ) : (
              'Save Application'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
