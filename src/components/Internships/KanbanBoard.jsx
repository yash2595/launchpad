import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInternshipStatus as apiUpdateStatus } from '../../services/internshipService';
import { updateInternshipStatus } from '../../store/internshipsSlice';
import { showToast } from '../../store/uiSlice';
import { STATUS_LIST } from '../../utils/constants';
import InternshipCard from './InternshipCard';
import styles from './Internships.module.css';

export default function KanbanBoard({ internships = [] }) {
  const dispatch = useDispatch();
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', id);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = (event, status) => {
    event.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    // We can clear column highlighting when moving out of columns
  };

  const handleDrop = async (event, newStatus) => {
    event.preventDefault();
    setDragOverColumn(null);

    const id = event.dataTransfer.getData('text/plain');
    if (!id) return;

    const internship = internships.find((item) => item.id === id);
    if (!internship) return;

    // If dropped in the same column, do nothing
    if (internship.status === newStatus) return;

    // 1. Update Redux immediately for optimistic UI updates
    dispatch(updateInternshipStatus({ id, status: newStatus }));

    // 2. Call Supabase API in background
    try {
      await apiUpdateStatus(id, newStatus);
    } catch (error) {
      // Revert in case of API failure
      dispatch(updateInternshipStatus({ id, status: internship.status }));
      dispatch(
        showToast({
          message: `Failed to update status for ${internship.company_name}`,
          type: 'danger',
        })
      );
    }
  };

  return (
    <div className={styles.kanban}>
      {STATUS_LIST.map((status) => {
        const columnCards = internships.filter((item) => item.status === status);
        const isColumnOver = dragOverColumn === status;

        const columnClass = [
          styles.kanban__column,
          isColumnOver ? styles['kanban__column--drag_over'] : '',
        ].join(' ').trim();

        return (
          <div
            key={status}
            className={columnClass}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className={styles.kanban__column_header}>
              <span>{status}</span>
              <span className={styles.kanban__column_badge}>
                {columnCards.length}
              </span>
            </div>

            <div className={styles.kanban__cards_list}>
              {columnCards.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={[
                    styles.kanban__card,
                    draggingId === item.id ? styles['kanban__card--dragging'] : '',
                  ].join(' ').trim()}
                >
                  <InternshipCard internship={item} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
