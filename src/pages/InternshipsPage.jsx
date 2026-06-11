import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Kanban, PlusCircle, Search, Sparkles, FilterX, Briefcase } from 'lucide-react';
import { getAllInternships } from '../services/internshipService';
import {
  setInternships,
  setInternshipsLoading,
  setInternshipsError,
  setFilters,
  setSearchQuery,
  setViewMode,
} from '../store/internshipsSlice';
import { showModal, showToast } from '../store/uiSlice';
import useDebounce from '../hooks/useDebounce';
import InternshipCard from '../components/Internships/InternshipCard';
import KanbanBoard from '../components/Internships/KanbanBoard';
import BrowseJobsModal from '../components/Internships/BrowseJobsModal';
import Button from '../components/UI/Button';
import Skeleton from '../components/UI/Skeleton';
import { STATUS_LIST, PRIORITY_LIST } from '../utils/constants';
import styles from '../components/Internships/Internships.module.css';

export default function InternshipsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: internships, filters, searchQuery, viewMode, loading } = useSelector(
    (state) => state.internships
  );

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [browseOpen, setBrowseOpen] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 250);

  // Sync search value to Redux
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Load internships from Supabase
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      dispatch(setInternshipsLoading(true));
      try {
        const data = await getAllInternships(user.id);
        dispatch(setInternships(data));
      } catch (err) {
        dispatch(setInternshipsError(err.message || 'Failed to load internships'));
        dispatch(showToast({ message: 'Failed to fetch internships from server', type: 'danger' }));
      }
    };

    loadData();
  }, [user, dispatch]);

  const handleClearFilters = () => {
    setSearchInput('');
    dispatch(setSearchQuery(''));
    dispatch(setFilters({ status: 'All', priority: 'All', dateRange: 'All' }));
  };

  const handleOpenAddModal = () => {
    dispatch(showModal({ type: 'add', data: null }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  // Filter application list client-side
  const filteredInternships = internships.filter((item) => {
    // 1. Search Query
    const searchString = `${item.company_name} ${item.job_title}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());

    // 2. Status
    const matchesStatus = filters.status === 'All' || item.status === filters.status;

    // 3. Priority
    const matchesPriority = filters.priority === 'All' || item.priority === filters.priority;

    // 4. Date Range
    let matchesDate = true;
    if (filters.dateRange !== 'All' && filters.dateRange !== 'All time') {
      const itemDate = new Date(item.applied_date || item.created_at);
      const limitDate = new Date();
      limitDate.setHours(0, 0, 0, 0);

      if (filters.dateRange === 'This week') {
        limitDate.setDate(limitDate.getDate() - 7);
      } else if (filters.dateRange === 'This month') {
        limitDate.setDate(limitDate.getDate() - 30);
      }
      matchesDate = itemDate >= limitDate;
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  const isTrackerEmpty = internships.length === 0;
  const isFilterEmpty = filteredInternships.length === 0;

  if (loading && internships.length === 0) {
    return (
      <div className={styles.tracker}>
        <Skeleton height="80px" />
        <div className={styles.card_grid} style={{ marginTop: '16px' }}>
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} height="220px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tracker}>
      {/* Controls Bar */}
      <div className={styles.controls_bar}>
        <div className={styles.controls_bar__row}>
          <div className={styles.search_input__wrapper}>
            <Search size={16} className={styles.search_icon} />
            <input
              type="text"
              className={styles.search_input}
              placeholder="Search by company or job title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className={styles.filters__group}>
            <select
              className={styles.filter_select}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="All">All Statuses</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className={styles.filter_select}
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="All">All Priorities</option>
              {PRIORITY_LIST.map((p) => (
                <option key={p} value={p}>{p} Priority</option>
              ))}
            </select>

            <select
              className={styles.filter_select}
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <option value="All">All Time</option>
              <option value="This week">Added This Week</option>
              <option value="This month">Added This Month</option>
            </select>
          </div>

          <div className={styles.view_toggle__group}>
            <button
              className={`${styles.view_toggle__btn} ${viewMode === 'list' ? styles['view_toggle__btn--active'] : ''}`}
              onClick={() => dispatch(setViewMode('list'))}
              title="Switch to list view"
            >
              <List size={16} />
              <span>List</span>
            </button>
            <button
              className={`${styles.view_toggle__btn} ${viewMode === 'kanban' ? styles['view_toggle__btn--active'] : ''}`}
              onClick={() => dispatch(setViewMode('kanban'))}
              title="Switch to Board View"
            >
              <Kanban size={16} />
              <span>Board</span>
            </button>
          </div>
        </div>

        <div className={styles.controls_bar__row} style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
          <div className={styles.results_count}>
            {filteredInternships.length} {filteredInternships.length === 1 ? 'result' : 'results'} found
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" size="sm" onClick={() => setBrowseOpen(true)}>
              <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
              Browse Jobs
            </Button>
            <Button variant="primary" size="sm" onClick={handleOpenAddModal}>
              <PlusCircle size={14} />
              Add Application
            </Button>
          </div>
        </div>
      </div>

      {/* Main Board content */}
      {isTrackerEmpty ? (
        <div className={styles.empty_state}>
          <Briefcase className={styles.empty_state__icon} size={48} />
          <p className={styles.empty_state__text}>You haven't added anything yet.</p>
          <Button onClick={handleOpenAddModal}>Add your first application</Button>
        </div>
      ) : isFilterEmpty ? (
        <div className={styles.empty_state}>
          <FilterX className={styles.empty_state__icon} size={48} />
          <p className={styles.empty_state__text}>Nothing matches your filters.</p>
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear filters
          </Button>
        </div>
      ) : viewMode === 'list' ? (
        <div className={styles.card_grid}>
          {filteredInternships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
        </div>
      ) : (
        <KanbanBoard internships={filteredInternships} />
      )}

      {/* Browse Jobs dialog modal */}
      <BrowseJobsModal open={browseOpen} onClose={() => setBrowseOpen(false)} />
    </div>
  );
}
