import { useDispatch } from 'react-redux';
import { MapPin, Calendar, FileText, Edit2, Trash2 } from 'lucide-react';
import { showModal } from '../../store/uiSlice';
import Badge from '../UI/Badge';
import Button from '../UI/Button';
import styles from './Internships.module.css';

export default function InternshipCard({ internship }) {
  const dispatch = useDispatch();

  const handleEditClick = () => {
    dispatch(showModal({ type: 'edit', data: internship }));
  };

  const handleDeleteClick = () => {
    dispatch(showModal({ type: 'delete', data: internship }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article className={styles.card}>
      <div className={styles.card__header}>
        <div className={styles.card__meta}>
          <h3 className={styles.card__company}>{internship.company_name}</h3>
          <span className={styles.card__title}>{internship.job_title}</span>
        </div>
        <div className={styles.card__badges}>
          <Badge type="status" value={internship.status} />
          {internship.priority && (
            <Badge type="priority" value={internship.priority} />
          )}
        </div>
      </div>

      <div className={styles.card__body}>
        {internship.location && (
          <div className={styles.card__detail}>
            <MapPin size={14} />
            <span>{internship.location}</span>
          </div>
        )}
        <div className={styles.card__detail}>
          <Calendar size={14} />
          <span>Applied: {formatDate(internship.applied_date)}</span>
        </div>
        {internship.deadline && (
          <div className={styles.card__detail}>
            <Calendar size={14} style={{ color: 'var(--color-danger)' }} />
            <span>Deadline: {formatDate(internship.deadline)}</span>
          </div>
        )}
        {internship.notes && (
          <div className={styles.card__notes} title={internship.notes}>
            <FileText size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
            {internship.notes}
          </div>
        )}
      </div>

      <div className={styles.card__actions}>
        <Button variant="secondary" size="sm" onClick={handleEditClick} title="Edit application">
          <Edit2 size={13} />
          Edit
        </Button>
        <Button variant="secondary" size="sm" className={styles.btn_delete} onClick={handleDeleteClick} title="Delete application">
          <Trash2 size={13} style={{ color: 'var(--color-danger)' }} />
          <span style={{ color: 'var(--color-danger)' }}>Delete</span>
        </Button>
      </div>
    </article>
  );
}
