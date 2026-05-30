import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  PaperClipIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  CalendarIcon,
  FlagIcon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import Select from 'react-select';
import { isRoleExploitationControleDossiers } from '../utils/userRoles';
import {
  resolveTaskDateRange,
  taskMatchesDateRange,
  toDateInputValue
} from '../utils/taskDateFilters';

const KANBAN_COLUMN_I18N = {
  'À faire': 'todo',
  'En cours': 'inProgress',
  'En révision': 'inReview',
  'Terminé': 'done',
  'Bloqué': 'blocked',
  'Annulé': 'cancelled'
};

const TASK_TYPE_I18N = {
  'Tâche': 'task',
  'Bug': 'bug',
  'Amélioration': 'improvement',
  'Fonctionnalité': 'feature',
  'Documentation': 'documentation',
  'Maintenance': 'maintenance',
  'Autre': 'other'
};

function taskManagerLocaleTag(lang) {
  if (!lang) return 'fr-FR';
  const base = String(lang).split('-')[0];
  if (base === 'zh') return 'zh-CN';
  if (base === 'en') return 'en-US';
  return 'fr-FR';
}

const TaskManager = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = taskManagerLocaleTag(i18n.language);
  const { user } = useAuth();

  const columnLabel = useCallback(
    (name) => {
      const key = KANBAN_COLUMN_I18N[name];
      return key ? t(`taskManager.columns.${key}`) : name;
    },
    [t]
  );

  const priorityLabel = useCallback(
    (p) => (p ? t(`taskManager.priority.${p}`, { defaultValue: p }) : ''),
    [t]
  );

  const typeLabel = useCallback(
    (ty) => {
      if (!ty) return '';
      const key = TASK_TYPE_I18N[ty];
      return key ? t(`taskManager.types.${key}`) : ty;
    },
    [t]
  );

  const priorityFilterOptions = useMemo(
    () => [
      { value: '', label: t('taskManager.filters.allPriorities') },
      { value: 'Basse', label: t('taskManager.priority.Basse') },
      { value: 'Normale', label: t('taskManager.priority.Normale') },
      { value: 'Haute', label: t('taskManager.priority.Haute') },
      { value: 'Urgente', label: t('taskManager.priority.Urgente') }
    ],
    [t, i18n.language]
  );

  const statusFilterOptions = useMemo(
    () => [
      { value: '', label: t('taskManager.filters.allStatuses', { defaultValue: 'Tous' }) },
      { value: 'in_progress', label: t('taskManager.columns.inProgress') },
      { value: 'completed', label: t('taskManager.stats.completed') },
      { value: 'overdue', label: t('taskManager.stats.overdue') }
    ],
    [t, i18n.language]
  );

  const dateFilterOptions = useMemo(
    () => [
      { value: 'today', label: t('taskManager.filters.date.today') },
      { value: 'yesterday', label: t('taskManager.filters.date.yesterday') },
      { value: 'days_ago_3', label: t('taskManager.filters.date.daysAgo3') },
      { value: 'days_ago_7', label: t('taskManager.filters.date.daysAgo7') },
      { value: 'custom', label: t('taskManager.filters.date.custom') }
    ],
    [t, i18n.language]
  );

  const typeFormOptions = useMemo(
    () => [
      { value: 'Tâche', label: t('taskManager.types.task') },
      { value: 'Bug', label: t('taskManager.types.bug') },
      { value: 'Amélioration', label: t('taskManager.types.improvement') },
      { value: 'Fonctionnalité', label: t('taskManager.types.feature') },
      { value: 'Documentation', label: t('taskManager.types.documentation') },
      { value: 'Maintenance', label: t('taskManager.types.maintenance') },
      { value: 'Autre', label: t('taskManager.types.other') }
    ],
    [t, i18n.language]
  );

  const priorityFormOptions = useMemo(
    () => [
      { value: 'Basse', label: t('taskManager.priority.Basse') },
      { value: 'Normale', label: t('taskManager.priority.Normale') },
      { value: 'Haute', label: t('taskManager.priority.Haute') },
      { value: 'Urgente', label: t('taskManager.priority.Urgente') }
    ],
    [t, i18n.language]
  );

  const statusFormOptions = useMemo(
    () => [
      { value: 'À faire', label: t('taskManager.columns.todo') },
      { value: 'En cours', label: t('taskManager.columns.inProgress') },
      { value: 'En révision', label: t('taskManager.columns.inReview') },
      { value: 'Terminé', label: t('taskManager.columns.done') },
      { value: 'Bloqué', label: t('taskManager.columns.blocked') },
      { value: 'Annulé', label: t('taskManager.columns.cancelled') }
    ],
    [t, i18n.language]
  );
  const normalizedUserRole = String(user?.role || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
  const isSaisisseur = normalizedUserRole.includes('saisisseur');
  const isControleExploitation = isRoleExploitationControleDossiers(user?.role);
  /** Saisisseur ou vérificateur / contrôleur Sygram : uniquement les tâches assignées à l’utilisateur courant. */
  const restrictToSelfAssignee = isSaisisseur || isControleExploitation;
  const [view, setView] = useState('kanban'); // kanban, list, calendar
  const [columns, setColumns] = useState({
    'À faire': [],
    'En cours': [],
    'En révision': [],
    'Terminé': [],
    'Bloqué': [],
    'Annulé': []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dropInsertIndex, setDropInsertIndex] = useState(null);
  const [isDraggingKanban, setIsDraggingKanban] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [filters, setFilters] = useState(() => {
    const today = toDateInputValue(new Date());
    return {
      search: '',
      priorite: '',
      statut_vue: '',
      assignee_id: '',
      departement_id: '',
      type_tache: '',
      archive: false,
      date_preset: 'today',
      date_from: today,
      date_to: today
    };
  });

  // Form data
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type_tache: 'Tâche',
    priorite: 'Normale',
    statut: 'À faire',
    colonne_kanban: 'À faire',
    assignee_id: '',
    assignees: [],
    projet_id: '',
    projet_nom: '',
    departement_id: '',
    sous_departement_id: '',
    date_debut: '',
    date_echeance: '',
    estimation_heures: '',
    labels: [],
    couleur: '',
    checklist: [],
    visibilite: 'Public',
    confidentialite: 'Normale'
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newLabel, setNewLabel] = useState({ nom: '', couleur: '#3b82f6' });
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const fileInputRef = useRef(null);
  
  // Mentions system
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [mentionSearchTerm, setMentionSearchTerm] = useState('');
  const [mentionStartPos, setMentionStartPos] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const commentTextareaRef = useRef(null);
  const mentionSuggestionRef = useRef(null);
  
  // Mention tooltip
  const [mentionTooltip, setMentionTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const mentionTooltipRef = useRef(null);
  const kanbanBoardRef = useRef(null);
  const kanbanDragGhostRef = useRef(null);
  const kanbanDragSessionRef = useRef(null);
  const columnsRef = useRef(columns);
  const filteredColumnsRef = useRef(columns);
  columnsRef.current = columns;

  // Load data
  useEffect(() => {
    loadTasks();
    loadUsers();
    loadDepartements();
    loadStats();
  }, [filters, restrictToSelfAssignee, user?.id, view]);

  // Close mention tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mentionTooltipRef.current && !mentionTooltipRef.current.contains(event.target)) {
        // Check if click is not on a mention
        const target = event.target;
        if (!target.closest('[data-mention]')) {
          setMentionTooltip(null);
        }
      }
    };

    if (mentionTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mentionTooltip]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.priorite) params.append('priorite', filters.priorite);
      if (restrictToSelfAssignee && user?.id) {
        params.append('assignee_id', String(user.id));
      } else if (filters.assignee_id) {
        params.append('assignee_id', filters.assignee_id);
      }
      if (filters.departement_id) params.append('departement_id', filters.departement_id);
      if (filters.type_tache) params.append('type_tache', filters.type_tache);
      params.append('archive', filters.archive);
      params.append('view', view);

      const dateRange = resolveTaskDateRange(
        filters.date_preset,
        filters.date_from,
        filters.date_to
      );
      if (dateRange) {
        params.append('date_from', toDateInputValue(dateRange.from));
        params.append('date_to', toDateInputValue(dateRange.to));
        params.append('date_field', 'date_creation');
      }

      const response = await api.get(`/task-pro/kanban?${params.toString()}`);
      const apiColumns = response.data.columns || {
        'À faire': [],
        'En cours': [],
        'En révision': [],
        'Terminé': [],
        'Bloqué': [],
        'Annulé': []
      };

      if (restrictToSelfAssignee && user?.id) {
        const currentUserId = String(user.id);
        const filteredColumns = Object.fromEntries(
          Object.entries(apiColumns).map(([columnName, tasks]) => [
            columnName,
            (tasks || []).filter((task) => {
              const assigneeId = task?.assignee_id ?? task?.assignee?.id;
              return String(assigneeId || '') === currentUserId;
            })
          ])
        );
        setColumns(filteredColumns);
      } else {
        setColumns(apiColumns);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error(t('taskManager.toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadDepartements = async () => {
    try {
      const response = await api.get('/departements');
      setDepartements(response.data.departements || []);
    } catch (error) {
      console.error('Error loading departements:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/task-pro/stats');
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Don't show error toast for stats, just log it
    }
  };

  const [dragGhostWidth, setDragGhostWidth] = useState(320);

  const clearKanbanDragState = useCallback(() => {
    kanbanDragSessionRef.current = null;
    setDraggedTask(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
    setDropInsertIndex(null);
    setIsDraggingKanban(false);
    document.body.style.removeProperty('cursor');
    document.body.classList.remove('kanban-free-drag-active');
  }, []);

  const findKanbanColumnAtPoint = useCallback((clientX, clientY) => {
    const elements = document.elementsFromPoint?.(clientX, clientY) ?? [];
    for (const el of elements) {
      const columnEl = el?.closest?.('[data-kanban-column]');
      if (columnEl) return columnEl.getAttribute('data-kanban-column');
    }
    const fallback = document.elementFromPoint(clientX, clientY);
    return fallback?.closest?.('[data-kanban-column]')?.getAttribute('data-kanban-column') || null;
  }, []);

  const computeDropInsertIndex = useCallback((clientY, columnName, tasksInColumn, draggingTaskId) => {
    const dragId = draggingTaskId ?? kanbanDragSessionRef.current?.task?.id;
    const list = (tasksInColumn || []).filter((t) => t.id !== dragId);
    const cardEls = document.querySelectorAll(`[data-kanban-column="${columnName}"] [data-kanban-card]`);
    if (!cardEls.length) return list.length;

    let index = list.length;
    for (let i = 0; i < cardEls.length; i++) {
      const el = cardEls[i];
      if (el.getAttribute('data-dragging') === 'true') continue;
      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (clientY < midY) {
        const cardId = el.getAttribute('data-task-id');
        const taskIndex = list.findIndex((t) => String(t.id) === String(cardId));
        index = taskIndex >= 0 ? taskIndex : i;
        break;
      }
    }
    return Math.max(0, Math.min(index, list.length));
  }, []);

  const autoScrollKanbanBoard = useCallback((clientX) => {
    const board = kanbanBoardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const edge = 56;
    const speed = 14;
    if (clientX < rect.left + edge) {
      board.scrollLeft -= speed;
    } else if (clientX > rect.right - edge) {
      board.scrollLeft += speed;
    }
  }, []);

  const updateKanbanDragAtPoint = useCallback(
    (clientX, clientY) => {
      const session = kanbanDragSessionRef.current;
      if (!session) return;

      const left = clientX - session.offsetX;
      const top = clientY - session.offsetY;
      const ghost = kanbanDragGhostRef.current;
      if (ghost) {
        ghost.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0) rotate(1.5deg)`;
      }

      autoScrollKanbanBoard(clientX);

      const columnName = findKanbanColumnAtPoint(clientX, clientY);
      if (!columnName) {
        setDragOverColumn(null);
        setDropInsertIndex(null);
        return;
      }

      const tasksInColumn = filteredColumnsRef.current[columnName] || [];
      setDragOverColumn(columnName);
      setDropInsertIndex(
        computeDropInsertIndex(clientY, columnName, tasksInColumn, session.task.id)
      );
    },
    [autoScrollKanbanBoard, computeDropInsertIndex, findKanbanColumnAtPoint]
  );

  const commitKanbanMove = useCallback(
    async (task, fromColumn, targetColumn, insertAt, tasksInColumn) => {
      if (!task || !fromColumn || !targetColumn) return;

      const resolvedInsertRaw =
        insertAt ?? computeDropInsertIndex(0, targetColumn, tasksInColumn, task.id);

      const sameColumn = fromColumn === targetColumn;
      const sourceList = [...(columnsRef.current[fromColumn] || [])];
      const fromIndex = sourceList.findIndex((t) => t.id === task.id);
      if (sameColumn && fromIndex === resolvedInsertRaw) return;

      const targetListWithout = (columnsRef.current[targetColumn] || []).filter((t) => t.id !== task.id);
      let resolvedInsert = resolvedInsertRaw;
      if (sameColumn && fromIndex !== -1 && resolvedInsert > fromIndex) {
        resolvedInsert -= 1;
      }
      resolvedInsert = Math.max(0, Math.min(resolvedInsert, targetListWithout.length));

      const movedTask = {
        ...task,
        colonne_kanban: targetColumn,
        statut: targetColumn
      };

      const optimisticColumns = { ...columnsRef.current };
      optimisticColumns[fromColumn] = sourceList.filter((t) => t.id !== task.id);
      const newTarget = [...targetListWithout];
      newTarget.splice(resolvedInsert, 0, movedTask);
      optimisticColumns[targetColumn] = newTarget;
      setColumns(optimisticColumns);

      try {
        await api.patch(`/task-pro/${task.id}/move`, {
          colonne_kanban: targetColumn,
          position: resolvedInsert
        });
        toast.success(t('taskManager.toast.moveSuccess'));
        setTimeout(() => {
          loadStats();
        }, 300);
      } catch (error) {
        console.error('Error moving task:', error);
        toast.error(t('taskManager.toast.moveError'));
        await loadTasks();
      }
    },
    [computeDropInsertIndex, loadStats, loadTasks, t]
  );

  const handleKanbanPointerDown = useCallback((e, task, columnName) => {
    if (e.button !== 0) return;
    if (!e.target.closest('[data-drag-handle]')) return;

    const cardEl = e.currentTarget.closest('[data-kanban-card]');
    if (!cardEl) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = cardEl.getBoundingClientRect();
    kanbanDragSessionRef.current = {
      task,
      fromColumn: columnName,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width
    };

    setDragGhostWidth(rect.width);
    setDraggedTask(task);
    setDraggedFromColumn(columnName);
    setIsDraggingKanban(true);
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('kanban-free-drag-active');

    requestAnimationFrame(() => {
      updateKanbanDragAtPoint(e.clientX, e.clientY);
    });
  }, [updateKanbanDragAtPoint]);

  const finishKanbanPointerDrag = useCallback(
    async (clientX, clientY) => {
      const session = kanbanDragSessionRef.current;
      if (!session) {
        clearKanbanDragState();
        return;
      }

      const { task, fromColumn } = session;
      const targetColumn = findKanbanColumnAtPoint(clientX, clientY);
      const tasksInColumn = targetColumn ? filteredColumnsRef.current[targetColumn] || [] : [];
      const insertAt = targetColumn
        ? computeDropInsertIndex(clientY, targetColumn, tasksInColumn, task.id)
        : null;

      clearKanbanDragState();

      if (!targetColumn) return;

      await commitKanbanMove(task, fromColumn, targetColumn, insertAt, tasksInColumn);
    },
    [
      clearKanbanDragState,
      commitKanbanMove,
      computeDropInsertIndex,
      findKanbanColumnAtPoint
    ]
  );

  useEffect(() => {
    if (!isDraggingKanban) return undefined;

    const onPointerMove = (e) => {
      if (!kanbanDragSessionRef.current) return;
      e.preventDefault();
      updateKanbanDragAtPoint(e.clientX, e.clientY);
    };

    const onPointerUp = (e) => {
      if (!kanbanDragSessionRef.current) return;
      finishKanbanPointerDrag(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [isDraggingKanban, finishKanbanPointerDrag, updateKanbanDragAtPoint]);

  // Task CRUD operations
  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      type_tache: 'Tâche',
      priorite: 'Normale',
      statut: 'À faire',
      colonne_kanban: 'À faire',
      assignee_id: '',
      assignees: [],
      projet_id: '',
      projet_nom: '',
      departement_id: '',
      sous_departement_id: '',
      date_debut: '',
      date_echeance: '',
      estimation_heures: '',
      labels: [],
      couleur: '',
      checklist: [],
      visibilite: 'Public',
      confidentialite: 'Normale'
    });
    setEditingTask(null);
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setViewingTask(null);
    resetForm();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      titre: task.titre || '',
      description: task.description || '',
      type_tache: task.type_tache || 'Tâche',
      priorite: task.priorite || 'Normale',
      statut: task.statut || 'À faire',
      colonne_kanban: task.colonne_kanban || task.statut || 'À faire',
      assignee_id: task.assignee_id || '',
      assignees: task.assignees || [],
      projet_id: task.projet_id || '',
      projet_nom: task.projet_nom || '',
      departement_id: task.departement_id || '',
      sous_departement_id: task.sous_departement_id || '',
      date_debut: task.date_debut ? task.date_debut.split('T')[0] : '',
      date_echeance: task.date_echeance ? task.date_echeance.split('T')[0] : '',
      estimation_heures: task.estimation_heures || '',
      labels: task.labels || [],
      couleur: task.couleur || '',
      checklist: task.checklist || [],
      visibilite: task.visibilite || 'Public',
      confidentialite: task.confidentialite || 'Normale'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let taskData = null;
    
    try {
      // Prepare task data, cleaning empty strings and converting to proper types
      taskData = {
        titre: formData.titre.trim(),
        description: formData.description?.trim() || null,
        type_tache: formData.type_tache || 'Tâche',
        priorite: formData.priorite || 'Normale',
        statut: formData.statut || 'À faire',
        colonne_kanban: formData.colonne_kanban || formData.statut || 'À faire',
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null,
        assignees: formData.assignees && formData.assignees.length > 0 ? formData.assignees : null,
        projet_id: formData.projet_id ? parseInt(formData.projet_id) : null,
        projet_nom: formData.projet_nom?.trim() || null,
        departement_id: formData.departement_id ? parseInt(formData.departement_id) : null,
        sous_departement_id: formData.sous_departement_id ? parseInt(formData.sous_departement_id) : null,
        date_debut: formData.date_debut || null,
        date_echeance: formData.date_echeance || null,
        estimation_heures: formData.estimation_heures ? parseFloat(formData.estimation_heures) : null,
        labels: formData.labels && formData.labels.length > 0 ? formData.labels : null,
        couleur: formData.couleur?.trim() || null,
        checklist: formData.checklist && formData.checklist.length > 0 ? formData.checklist : null,
        visibilite: formData.visibilite || 'Public',
        confidentialite: formData.confidentialite || 'Normale'
      };

      // Remove null/empty values and clean up data
      Object.keys(taskData).forEach(key => {
        const value = taskData[key];
        if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
          delete taskData[key];
        } else if (value === null && (key === 'assignee_id' || key === 'projet_id' || key === 'departement_id' || key === 'sous_departement_id')) {
          // Keep null for optional IDs
        } else if (value === null && key !== 'description') {
          // Remove other null values except description
          delete taskData[key];
        }
      });

      if (editingTask) {
        await api.put(`/task-pro/${editingTask.id}`, taskData);
        toast.success(t('taskManager.toast.updateSuccess'));
      } else {
        await api.post('/task-pro', taskData);
        toast.success(t('taskManager.toast.createSuccess'));
      }

      closeModal();
      // Reload tasks and stats
      await loadTasks();
      // Small delay to ensure backend has processed the update
      setTimeout(() => {
        loadStats();
      }, 300);
    } catch (error) {
      console.error('Error saving task:', error);
      console.error('Error response:', error.response);
      if (taskData) {
        console.error('Task data sent:', taskData);
      }
      
      let errorMessage = t('taskManager.toast.saveError');
      
      if (error.response?.data) {
        if (error.response.data.details) {
          errorMessage = `${error.response.data.message || error.response.data.error || t('taskManager.errors.generic')}: ${error.response.data.details}`;
        } else {
          errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: t('taskManager.swal.confirmTitle'),
      text: t('taskManager.swal.confirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('taskManager.swal.confirmDelete'),
      cancelButtonText: t('taskManager.swal.cancel')
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/task-pro/${taskId}`);
        toast.success(t('taskManager.toast.deleteSuccess'));
        await loadTasks();
        // Small delay to ensure backend has processed the deletion
        setTimeout(() => {
          loadStats();
        }, 300);
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error(t('taskManager.toast.deleteError'));
      }
    }
  };

  const handleView = async (taskId) => {
    try {
      const response = await api.get(`/task-pro/${taskId}`);
      setViewingTask(response.data.task);
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error(t('taskManager.toast.loadTaskError'));
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !viewingTask) return;

    try {
      setPostingComment(true);
      await api.post('/commentaires-tasks', {
        task_id: viewingTask.id,
        commentaire: newComment.trim()
      });

      // Reload task to get updated comments
      const response = await api.get(`/task-pro/${viewingTask.id}`);
      setViewingTask(response.data.task);
      setNewComment('');
      toast.success(t('taskManager.toast.commentAdded'));
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error.response?.data?.message || t('taskManager.toast.commentAddError'));
    } finally {
      setPostingComment(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleSaveEdit = async (commentId) => {
    if (!editingCommentText.trim()) return;

    try {
      await api.put(`/commentaires-tasks/${commentId}`, {
        commentaire: editingCommentText.trim()
      });

      // Reload task to get updated comments
      const response = await api.get(`/task-pro/${viewingTask.id}`);
      setViewingTask(response.data.task);
      setEditingCommentId(null);
      setEditingCommentText('');
      toast.success(t('taskManager.toast.commentUpdated'));
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error(error.response?.data?.message || t('taskManager.toast.commentUpdateError'));
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: t('taskManager.swal.confirmTitle'),
      text: t('taskManager.swal.confirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('taskManager.swal.confirmDelete'),
      cancelButtonText: t('taskManager.swal.cancel')
    });

    if (result.isConfirmed) {
      try {
        setDeletingCommentId(commentId);
        await api.delete(`/commentaires-tasks/${commentId}`);

        // Reload task to get updated comments
        const response = await api.get(`/task-pro/${viewingTask.id}`);
        setViewingTask(response.data.task);
        toast.success(t('taskManager.toast.commentDeleted'));
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(error.response?.data?.message || t('taskManager.toast.commentDeleteError'));
      } finally {
        setDeletingCommentId(null);
      }
    }
  };

  const handleToggleLike = async (commentId) => {
    try {
      await api.patch(`/commentaires-tasks/${commentId}/like`);

      // Reload task to get updated comments
      const response = await api.get(`/task-pro/${viewingTask.id}`);
      setViewingTask(response.data.task);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error(t('taskManager.toast.likeError'));
    }
  };

  const formatDate = useCallback(
    (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return t('taskManager.time.justNow');
      if (diffMins < 60) return t('taskManager.time.minutesAgo', { count: diffMins });
      if (diffHours < 24) return t('taskManager.time.hoursAgo', { count: diffHours });
      if (diffDays < 7) return t('taskManager.time.daysAgo', { count: diffDays });
      return date.toLocaleDateString(dateLocale, {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    },
    [t, dateLocale]
  );

  const formatFullDateTime = useCallback(
    (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString(dateLocale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    [dateLocale]
  );

  const getUserInitials = (user) => {
    if (!user) return '?';
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || '?';
  };

  const getUserName = useCallback(
    (u) => {
      if (!u) return t('taskManager.unknownUser');
      return `${u.prenom || ''} ${u.nom || ''}`.trim() || t('taskManager.unknownUser');
    },
    [t]
  );

  // Format comment text with mentions highlighted
  const formatCommentWithMentions = (text) => {
    if (!text) return '';
    
    // Use split with regex to properly separate mentions from text
    // This regex matches @ followed by word characters and optional spaces between words
    // It captures the full mention including spaces within the name
    const parts = [];
    const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionStart = match.index;
      const mentionEnd = match.index + match[0].length;
      
      // Add text before mention (preserve all text including spaces)
      if (mentionStart > lastIndex) {
        const textBefore = text.substring(lastIndex, mentionStart);
        if (textBefore) {
          parts.push({ type: 'text', content: textBefore });
        }
      }
      
      // Extract mention
      const mentionText = match[0]; // Full match: @Patrick Banabatata
      const username = match[1]; // Captured group: Patrick Banabatata
      
      // Check what comes immediately after the mention
      const charAfterMention = text[mentionEnd] || '';
      const hasSpaceAfter = charAfterMention === ' ' || charAfterMention === '\n' || charAfterMention === '\t';
      
      // Find the mentioned user
      const mentionedUser = users.find(u => {
        const fullName = `${u.prenom || ''} ${u.nom || ''}`.trim().toLowerCase();
        const prenom = (u.prenom || '').toLowerCase();
        const nom = (u.nom || '').toLowerCase();
        const searchTerm = username.toLowerCase();
        return fullName.includes(searchTerm) || prenom.includes(searchTerm) || nom.includes(searchTerm);
      });

      parts.push({
        type: 'mention',
        content: mentionText,
        username: username,
        user: mentionedUser,
        hasSpaceAfter: hasSpaceAfter,
        charAfter: charAfterMention
      });
      
      // Move past the mention
      // If there's a space after, we'll preserve it in the next text part
      // If not, we'll add a visual space
      lastIndex = mentionEnd;
    }
    
    // Add remaining text after all mentions
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        parts.push({ type: 'text', content: remainingText });
      }
    }
    
    // If no mentions found, return original text
    if (parts.length === 0 || parts.every(p => p.type === 'text')) {
      return <span>{text}</span>;
    }
    
    // Render parts with mentions highlighted
    return (
      <>
        {parts.map((part, idx) => {
          if (part.type === 'mention') {
            // Check if there's text following the mention
            const nextPart = parts[idx + 1];
            const hasTextAfter = nextPart && 
                                nextPart.type === 'text' && 
                                nextPart.content && 
                                nextPart.content.trim().length > 0;
            
            const handleMentionClick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              if (part.user) {
                const rect = e.currentTarget.getBoundingClientRect();
                const scrollY = window.scrollY || window.pageYOffset;
                const scrollX = window.scrollX || window.pageXOffset;
                
                setTooltipPosition({
                  x: rect.left + rect.width / 2 + scrollX,
                  y: rect.top + scrollY
                });
                setMentionTooltip(part.user);
              }
            };
            
            return (
              <React.Fragment key={idx}>
                <span
                  data-mention="true"
                  onClick={handleMentionClick}
                  className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  style={{ marginRight: hasTextAfter ? '0.375rem' : '0', display: 'inline-flex' }}
                  title={
                    part.user
                      ? t('taskManager.mention.clickDetails', {
                          name: `@${part.user.prenom} ${part.user.nom}`
                        })
                      : `@${part.username}`
                  }
                >
                  {part.content}
                </span>
                {/* Always add an explicit space after mention if there's text following */}
                {hasTextAfter && !part.hasSpaceAfter && <span> </span>}
              </React.Fragment>
            );
          }
          // Regular text part - render as is (preserving any spaces)
          return <span key={idx}>{part.content}</span>;
        })}
      </>
    );
  };

  // Handle mention input
  const handleCommentInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setNewComment(value);
    
    // Check if user is typing a mention (@)
    const textBeforeCursor = value.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const searchTerm = mentionMatch[1].toLowerCase();
      setMentionSearchTerm(searchTerm);
      setMentionStartPos(mentionMatch.index);
      
      // Filter users based on search term
      const filtered = users.filter(u => {
        const fullName = `${u.prenom || ''} ${u.nom || ''}`.trim().toLowerCase();
        const prenom = (u.prenom || '').toLowerCase();
        const nom = (u.nom || '').toLowerCase();
        return fullName.includes(searchTerm) || prenom.includes(searchTerm) || nom.includes(searchTerm) || searchTerm === '';
      }).slice(0, 5); // Limit to 5 suggestions
      
      setMentionSuggestions(filtered);
      setShowMentionSuggestions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowMentionSuggestions(false);
      setMentionSuggestions([]);
    }
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Handle mention selection
  const selectMention = (selectedUser) => {
    if (!selectedUser) return;
    
    const textBeforeMention = newComment.substring(0, mentionStartPos);
    const textAfterMention = newComment.substring(mentionStartPos + 1 + mentionSearchTerm.length);
    const mentionText = `@${selectedUser.prenom} ${selectedUser.nom}`;
    const newText = textBeforeMention + mentionText + ' ' + textAfterMention;
    
    setNewComment(newText);
    setShowMentionSuggestions(false);
    setMentionSuggestions([]);
    setMentionSearchTerm('');
    
    // Focus back on textarea and set cursor position
    setTimeout(() => {
      if (commentTextareaRef.current) {
        const newCursorPos = textBeforeMention.length + mentionText.length + 1;
        commentTextareaRef.current.focus();
        commentTextareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard navigation in mention suggestions
  const handleMentionKeyDown = (e) => {
    if (!showMentionSuggestions || mentionSuggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedMentionIndex(prev => 
        prev < mentionSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (mentionSuggestions[selectedMentionIndex]) {
        selectMention(mentionSuggestions[selectedMentionIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowMentionSuggestions(false);
    }
  };

  const handleArchive = async (taskId, archive) => {
    try {
      await api.patch(`/task-pro/${taskId}/archive`, { archive });
      toast.success(archive ? t('taskManager.toast.archived') : t('taskManager.toast.unarchived'));
      await loadTasks();
      // Small delay to ensure backend has processed the archive
      setTimeout(() => {
        loadStats();
      }, 300);
    } catch (error) {
      console.error('Error archiving task:', error);
      toast.error(t('taskManager.toast.archiveError'));
    }
  };

  // Checklist handlers
  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, {
        id: Date.now(),
        text: newChecklistItem,
        completed: false
      }]
    }));
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (itemId) => {
    setFormData(prev => {
      const newChecklist = prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      const atLeastOneCompleted = newChecklist.some(item => item.completed);
      const isCurrentlyAFaire = prev.statut === 'À faire' || prev.colonne_kanban === 'À faire';
      const shouldSetEnCours = atLeastOneCompleted && isCurrentlyAFaire;
      return {
        ...prev,
        checklist: newChecklist,
        ...(shouldSetEnCours ? { statut: 'En cours', colonne_kanban: 'En cours' } : {})
      };
    });
  };

  const removeChecklistItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== itemId)
    }));
  };

  // Label handlers
  const addLabel = () => {
    if (!newLabel.nom.trim()) return;
    setFormData(prev => ({
      ...prev,
      labels: [...prev.labels, { ...newLabel, id: Date.now() }]
    }));
    setNewLabel({ nom: '', couleur: '#3b82f6' });
  };

  const removeLabel = (labelId) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label.id !== labelId)
    }));
  };

  // Helper functions
  const getPriorityColor = (priorite) => {
    const colors = {
      'Basse': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Normale': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Haute': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Urgente': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[priorite] || colors['Normale'];
  };

  const getStatusColor = (statut) => {
    const colors = {
      'À faire': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'En révision': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Terminé': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Bloqué': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Annulé': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    return colors[statut] || colors['À faire'];
  };

  const isOverdue = (dateEcheance) => {
    if (!dateEcheance) return false;
    return new Date(dateEcheance) < new Date();
  };

  const columnColors = {
    'À faire': 'bg-gray-50 dark:bg-gray-800/50',
    'En cours': 'bg-blue-50 dark:bg-blue-900/20',
    'En révision': 'bg-yellow-50 dark:bg-yellow-900/20',
    'Terminé': 'bg-green-50 dark:bg-green-900/20',
    'Bloqué': 'bg-red-50 dark:bg-red-900/20',
    'Annulé': 'bg-gray-50 dark:bg-gray-800/50'
  };

  const columnDropRing = {
    'À faire': 'ring-gray-400 dark:ring-gray-500',
    'En cours': 'ring-blue-500 dark:ring-blue-400',
    'En révision': 'ring-amber-500 dark:ring-amber-400',
    'Terminé': 'ring-green-500 dark:ring-green-400',
    'Bloqué': 'ring-red-500 dark:ring-red-400',
    'Annulé': 'ring-gray-400 dark:ring-gray-500'
  };

  const KanbanDropIndicator = () => (
    <div className="my-1 flex items-center gap-2 rounded-md px-1 py-0.5 animate-pulse" aria-hidden>
      <span className="h-0.5 flex-1 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
      <span className="text-[10px] font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
        {t('taskManager.kanban.dropHere', { defaultValue: 'Déposer ici' })}
      </span>
      <span className="h-0.5 flex-1 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
    </div>
  );

  const dateFilteredColumns = useMemo(() => {
    const range = resolveTaskDateRange(
      filters.date_preset,
      filters.date_from,
      filters.date_to
    );
    if (!range) return columns;

    return Object.fromEntries(
      Object.entries(columns).map(([columnName, tasks]) => [
        columnName,
        (tasks || []).filter((task) => taskMatchesDateRange(task, range.from, range.to))
      ])
    );
  }, [columns, filters.date_preset, filters.date_from, filters.date_to]);

  const displayStats = useMemo(() => {
    const flat = Object.values(dateFilteredColumns).flat();
    const isTaskDone = (t) =>
      t.colonne_kanban === 'Terminé' || t.statut === 'Terminé' || t.colonne_kanban === 'Annulé';
    const en_retard = flat.filter(
      (t) => t.date_echeance && new Date(t.date_echeance) < new Date() && !isTaskDone(t)
    ).length;
    return {
      ...(stats || {}),
      total: flat.length,
      par_statut: {
        ...(stats?.par_statut || {}),
        en_cours: dateFilteredColumns['En cours']?.length ?? 0,
        termine: dateFilteredColumns['Terminé']?.length ?? 0
      },
      en_retard
    };
  }, [stats, dateFilteredColumns]);

  const filteredColumns = useMemo(() => {
    if (!filters.statut_vue) return dateFilteredColumns;

    const isDoneTask = (task) => {
      const status = task?.colonne_kanban || task?.statut || '';
      return status === 'Terminé' || status === 'Annulé';
    };

    return Object.fromEntries(
      Object.entries(dateFilteredColumns).map(([columnName, tasks]) => [
        columnName,
        (tasks || []).filter((task) => {
          const status = task?.colonne_kanban || task?.statut || '';

          if (filters.statut_vue === 'in_progress') {
            return status === 'En cours';
          }
          if (filters.statut_vue === 'completed') {
            return status === 'Terminé';
          }
          if (filters.statut_vue === 'overdue') {
            return Boolean(task?.date_echeance) && new Date(task.date_echeance) < new Date() && !isDoneTask(task);
          }
          return true;
        })
      ])
    );
  }, [dateFilteredColumns, filters.statut_vue]);

  filteredColumnsRef.current = filteredColumns;

  const renderKanbanCardBody = (task) => (
    <>
      {task.couleur && (
        <div className="h-1 w-full rounded-t-lg mb-2" style={{ backgroundColor: task.couleur }} />
      )}
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-gray-900 dark:text-white flex-1 leading-snug">{task.titre}</h4>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priorite)}`}>
          {priorityLabel(task.priorite)}
        </span>
        {task.labels?.length > 0 && (
          <div className="flex gap-1">
            {task.labels.slice(0, 3).map((label, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs rounded text-white"
                style={{ backgroundColor: label.couleur || '#3b82f6' }}
              >
                {label.nom}
              </span>
            ))}
          </div>
        )}
      </div>
      {task.checklist?.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {task.checklist.filter((item) => item.completed).length} / {task.checklist.length}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              className="bg-green-600 h-1.5 rounded-full"
              style={{
                width: `${(task.checklist.filter((item) => item.completed).length / task.checklist.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              <span>
                {task.assignee.prenom} {task.assignee.nom}
              </span>
            </div>
          )}
        </div>
        {task.date_echeance && (
          <div className={`flex items-center gap-1 ${isOverdue(task.date_echeance) ? 'text-red-600' : ''}`}>
            <CalendarIcon className="h-3 w-3" />
            <span>{new Date(task.date_echeance).toLocaleDateString(dateLocale)}</span>
          </div>
        )}
      </div>
    </>
  );

  if (loading && !stats && !Object.values(columns).some((col) => (col?.length ?? 0) > 0)) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('taskManager.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('taskManager.subtitle')}</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          {t('taskManager.newTask')}
        </button>
      </div>

      {/* Stats Cards */}
      {displayStats != null && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('taskManager.stats.total')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <ListBulletIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('taskManager.stats.inProgress')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.par_statut.en_cours}</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <ClockIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('taskManager.stats.completed')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.par_statut.termine}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('taskManager.stats.overdue')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayStats.en_retard}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
            restrictToSelfAssignee ? 'lg:grid-cols-3 xl:grid-cols-5' : 'lg:grid-cols-3 xl:grid-cols-6'
          }`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('taskManager.filters.search')}
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder={t('taskManager.filters.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('taskManager.filters.priority')}
            </label>
            <Select
              options={priorityFilterOptions}
              value={
                priorityFilterOptions.find((o) => o.value === filters.priorite) ?? priorityFilterOptions[0]
              }
              onChange={(option) => setFilters(prev => ({ ...prev, priorite: option?.value ?? '' }))}
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('taskManager.filters.status', { defaultValue: 'Statut' })}
            </label>
            <Select
              options={statusFilterOptions}
              value={
                statusFilterOptions.find((o) => o.value === filters.statut_vue) ?? statusFilterOptions[0]
              }
              onChange={(option) => setFilters(prev => ({ ...prev, statut_vue: option?.value ?? '' }))}
              isClearable
            />
          </div>
          {!restrictToSelfAssignee && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('taskManager.filters.assignee')}
              </label>
              <Select
                options={[
                  { value: '', label: t('taskManager.filters.allAssignees') },
                  ...users.map(u => ({ value: u.id, label: `${u.prenom} ${u.nom}` }))
                ]}
                value={{
                  value: filters.assignee_id,
                  label: filters.assignee_id
                    ? (() => {
                        const u = users.find((x) => x.id === parseInt(filters.assignee_id, 10));
                        return u ? `${u.prenom} ${u.nom}` : t('taskManager.filters.allAssignees');
                      })()
                    : t('taskManager.filters.allAssignees')
                }}
                onChange={(option) =>
                  setFilters((prev) => ({ ...prev, assignee_id: option?.value != null ? String(option.value) : '' }))
                }
                isClearable
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('taskManager.filters.date.label')}
            </label>
            <Select
              options={dateFilterOptions}
              value={
                dateFilterOptions.find((o) => o.value === filters.date_preset) ?? dateFilterOptions[0]
              }
              onChange={(option) => {
                const preset = option?.value ?? 'today';
                const range = resolveTaskDateRange(
                  preset,
                  filters.date_from,
                  filters.date_to
                );
                setFilters((prev) => ({
                  ...prev,
                  date_preset: preset,
                  date_from:
                    preset === 'custom' ? prev.date_from : toDateInputValue(range?.from ?? new Date()),
                  date_to: preset === 'custom' ? prev.date_to : toDateInputValue(range?.to ?? new Date())
                }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('taskManager.filters.view')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setView('kanban')}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  view === 'kanban'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5 mx-auto" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                  view === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ListBulletIcon className="h-5 w-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {filters.date_preset === 'custom' ? (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('taskManager.filters.date.from')}
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date_from: e.target.value, date_preset: 'custom' }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('taskManager.filters.date.to')}
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date_to: e.target.value, date_preset: 'custom' }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        ) : null}

        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {t('taskManager.filters.date.hint')}
        </p>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <>
        <div
          ref={kanbanBoardRef}
          className={`flex gap-4 overflow-x-auto pb-4 ${isDraggingKanban ? 'select-none cursor-grabbing' : ''}`}
        >
          {Object.entries(filteredColumns).map(([columnName, tasks]) => {
            const isDropTarget = isDraggingKanban && dragOverColumn === columnName;
            const showColumnDropHint = isDropTarget && tasks.length === 0;

            return (
            <div
              key={columnName}
              data-kanban-column={columnName}
              className={`flex-shrink-0 w-80 rounded-xl p-4 transition-all duration-200 ${columnColors[columnName]} ${
                isDropTarget
                  ? `ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${columnDropRing[columnName] || 'ring-green-500'} shadow-md`
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4 gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {columnLabel(columnName)} ({tasks.length})
                </h3>
                {isDropTarget ? (
                  <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/40 dark:text-green-300">
                    {t('taskManager.kanban.dropZone', { defaultValue: 'Zone de dépôt' })}
                  </span>
                ) : null}
              </div>
              <div
                className={`space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto rounded-lg min-h-[4.5rem] transition-colors ${
                  showColumnDropHint
                    ? 'border-2 border-dashed border-green-400/70 bg-green-50/50 dark:border-green-500/50 dark:bg-green-950/20'
                    : ''
                }`}
              >
                {showColumnDropHint ? (
                  <div className="flex flex-col items-center justify-center py-10 px-3 text-center">
                    <KanbanDropIndicator />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {t('taskManager.kanban.emptyDropHint', { defaultValue: 'Relâchez pour déposer la tâche' })}
                    </p>
                  </div>
                ) : null}
                {tasks.map((task, taskIndex) => {
                  const isDraggingThis = draggedTask?.id === task.id;
                  const showIndicatorBefore =
                    isDropTarget && dropInsertIndex === taskIndex && !isDraggingThis;

                  return (
                  <React.Fragment key={task.id}>
                    {showIndicatorBefore ? <KanbanDropIndicator /> : null}
                  <div
                    data-kanban-card
                    data-task-id={task.id}
                    data-dragging={isDraggingThis ? 'true' : 'false'}
                    onPointerDown={(e) => handleKanbanPointerDown(e, task, columnName)}
                    className={`group bg-white dark:bg-gray-800 rounded-lg border border-gray-200/80 dark:border-gray-700/80 shadow-sm p-3 transition-all duration-200 ${
                      isDraggingThis
                        ? 'opacity-30 scale-[0.98] border-dashed border-green-400 shadow-none'
                        : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-drag-handle
                        aria-label={t('taskManager.kanban.dragHandle', { defaultValue: 'Glisser la tâche' })}
                        className="mt-0.5 flex shrink-0 cursor-grab touch-none rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 active:cursor-grabbing dark:hover:bg-gray-700 dark:hover:text-gray-300"
                      >
                        <Bars3Icon className="h-4 w-4" aria-hidden />
                      </button>
                      <div className="min-w-0 flex-1">
                    {task.couleur && (
                      <div
                        className="h-1 w-full rounded-t-lg mb-2"
                        style={{ backgroundColor: task.couleur }}
                      />
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white flex-1">
                        {task.titre}
                      </h4>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          draggable={false}
                          onClick={() => handleView(task.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <EyeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          type="button"
                          draggable={false}
                          onClick={() => handleEdit(task)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priorite)}`}>
                        {priorityLabel(task.priorite)}
                      </span>
                      {task.labels && task.labels.length > 0 && (
                        <div className="flex gap-1">
                          {task.labels.slice(0, 3).map((label, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs rounded text-white"
                              style={{ backgroundColor: label.couleur || '#3b82f6' }}
                            >
                              {label.nom}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {task.checklist && task.checklist.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {task.checklist.filter(item => item.completed).length} / {task.checklist.length}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-600 h-1.5 rounded-full"
                            style={{
                              width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{task.assignee.prenom} {task.assignee.nom}</span>
                          </div>
                        )}
                      </div>
                      {task.date_echeance && (
                        <div className={`flex items-center gap-1 ${isOverdue(task.date_echeance) ? 'text-red-600' : ''}`}>
                          <CalendarIcon className="h-3 w-3" />
                          <span>{new Date(task.date_echeance).toLocaleDateString(dateLocale)}</span>
                        </div>
                      )}
                    </div>
                      </div>
                    </div>
                  </div>
                  </React.Fragment>
                  );
                })}
                {isDropTarget && dropInsertIndex === tasks.length && tasks.length > 0 ? (
                  <KanbanDropIndicator />
                ) : null}
                {tasks.length === 0 && !showColumnDropHint && (
                  <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                    {t('taskManager.emptyColumn')}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {isDraggingKanban && draggedTask && typeof document !== 'undefined'
          ? createPortal(
              <div
                ref={kanbanDragGhostRef}
                className="pointer-events-none fixed left-0 top-0 z-[200] will-change-transform"
                style={{ width: dragGhostWidth }}
              >
                <div className="rounded-lg border border-green-400/80 bg-white p-3 shadow-2xl ring-2 ring-green-500/30 dark:border-green-500/50 dark:bg-gray-800 dark:ring-green-400/20">
                  {renderKanbanCardBody(draggedTask)}
                </div>
              </div>,
              document.body
            )
          : null}
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingTask ? t('taskManager.modal.editTask') : t('taskManager.modal.newTask')}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('taskManager.modal.titleLabel')}
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('taskManager.modal.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Type, Priorité, Statut */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.type')}
                  </label>
                  <Select
                    options={typeFormOptions}
                    value={
                      typeFormOptions.find((o) => o.value === formData.type_tache) ?? typeFormOptions[0]
                    }
                    onChange={(option) => setFormData(prev => ({ ...prev, type_tache: option.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.priority')}
                  </label>
                  <Select
                    options={priorityFormOptions}
                    value={
                      priorityFormOptions.find((o) => o.value === formData.priorite) ??
                      priorityFormOptions[1]
                    }
                    onChange={(option) => setFormData(prev => ({ ...prev, priorite: option.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.status')}
                  </label>
                  <Select
                    options={statusFormOptions}
                    value={
                      statusFormOptions.find((o) => o.value === formData.statut) ?? statusFormOptions[0]
                    }
                    onChange={(option) => setFormData(prev => ({ ...prev, statut: option.value, colonne_kanban: option.value }))}
                  />
                </div>
              </div>

              {/* Assigné à, Département */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.assignee')}
                  </label>
                  <Select
                    options={users.map(u => ({ value: u.id, label: `${u.prenom} ${u.nom}` }))}
                    value={formData.assignee_id ? { value: formData.assignee_id, label: users.find(u => u.id === parseInt(formData.assignee_id))?.nom || '' } : null}
                    onChange={(option) => setFormData(prev => ({ ...prev, assignee_id: option ? option.value : '' }))}
                    isClearable
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.department')}
                  </label>
                  <Select
                    options={departements.map(d => ({ value: d.id, label: d.nom }))}
                    value={formData.departement_id ? { value: formData.departement_id, label: departements.find(d => d.id === parseInt(formData.departement_id))?.nom || '' } : null}
                    onChange={(option) => setFormData(prev => ({ ...prev, departement_id: option ? option.value : '' }))}
                    isClearable
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.startDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.date_debut}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_debut: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('taskManager.modal.dueDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.date_echeance}
                    onChange={(e) => setFormData(prev => ({ ...prev, date_echeance: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('taskManager.modal.checklist')}
                </label>
                <div className="space-y-2">
                  {formData.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            checklist: prev.checklist.map(i =>
                              i.id === item.id ? { ...i, text: e.target.value } : i
                            )
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                      placeholder={t('taskManager.modal.checklistPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addChecklistItem}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {t('taskManager.modal.add')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('taskManager.modal.labels')}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.labels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm"
                      style={{ backgroundColor: label.couleur }}
                    >
                      <span>{label.nom}</span>
                      <button
                        type="button"
                        onClick={() => removeLabel(label.id)}
                        className="hover:bg-black/20 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLabel.nom}
                    onChange={(e) => setNewLabel(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder={t('taskManager.modal.labelNamePlaceholder')}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="color"
                    value={newLabel.couleur}
                    onChange={(e) => setNewLabel(prev => ({ ...prev, couleur: e.target.value }))}
                    className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addLabel}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t('taskManager.modal.add')}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {t('taskManager.modal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingTask ? t('taskManager.modal.update') : t('taskManager.modal.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Task Modal - Facebook Style */}
      {viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {viewingTask.titre}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(viewingTask)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={t('taskManager.viewTask.editTitle')}
                >
                  <PencilIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setViewingTask(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title={t('taskManager.viewTask.closeTitle')}
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Task Details Section */}
              <div className="p-6 space-y-6 border-b border-gray-200 dark:border-gray-700">
                {/* Task Header with Creator Info */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {viewingTask.createur ? getUserInitials(viewingTask.createur) : '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {viewingTask.createur ? getUserName(viewingTask.createur) : t('taskManager.unknownUser')}
                      </span>
                      {viewingTask.date_creation && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          · {formatDate(viewingTask.date_creation)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(viewingTask.priorite)}`}>
                        {priorityLabel(viewingTask.priorite)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(viewingTask.statut)}`}>
                        {columnLabel(viewingTask.statut)}
                      </span>
                      {viewingTask.type_tache && (
                        <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {typeLabel(viewingTask.type_tache)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {viewingTask.description && (
                  <div>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {viewingTask.description}
                    </p>
                  </div>
                )}

                {/* Task Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {viewingTask.assignee && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('taskManager.detail.assignee')}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                          {getUserInitials(viewingTask.assignee)}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getUserName(viewingTask.assignee)}
                        </span>
                      </div>
                    </div>
                  )}
                  {viewingTask.date_echeance && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('taskManager.detail.dueDate')}</span>
                      <div className={`mt-1 text-sm ${isOverdue(viewingTask.date_echeance) ? 'text-red-600 font-semibold' : 'text-gray-900 dark:text-white'}`}>
                        {new Date(viewingTask.date_echeance).toLocaleDateString(dateLocale, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                        {isOverdue(viewingTask.date_echeance) && ` ${t('taskManager.detail.overdue')}`}
                      </div>
                    </div>
                  )}
                  {viewingTask.departement && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('taskManager.detail.department')}</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {viewingTask.departement.nom}
                      </p>
                    </div>
                  )}
                  {viewingTask.estimation_heures && (
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t('taskManager.detail.estimation')}</span>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {t('taskManager.detail.hours', { count: viewingTask.estimation_heures })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Labels */}
                {viewingTask.labels && viewingTask.labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {viewingTask.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: label.couleur || '#3b82f6' }}
                      >
                        {label.nom}
                      </span>
                    ))}
                  </div>
                )}

                {/* Checklist */}
                {viewingTask.checklist && viewingTask.checklist.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {t('taskManager.checklistHeading', {
                        done: viewingTask.checklist.filter((item) => item.completed).length,
                        total: viewingTask.checklist.length
                      })}
                    </h3>
                    <div className="space-y-2">
                      {viewingTask.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            disabled
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(viewingTask.checklist.filter(item => item.completed).length / viewingTask.checklist.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Comments Section - Facebook Style */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t('taskManager.commentsHeading', { count: viewingTask.commentaires?.length || 0 })}
                  </h3>
                </div>

                {/* Comments List */}
                <div className="space-y-4 mb-6">
                  {viewingTask.commentaires && viewingTask.commentaires.length > 0 ? (
                    viewingTask.commentaires.map((comment, idx) => {
                      const commentUser = comment.user || users.find(u => u.id === comment.user_id);
                      const isOwner = comment.user_id === user?.id;
                      const isEditing = editingCommentId === comment.id;
                      const isDeleting = deletingCommentId === comment.id;

                      return (
                        <div key={comment.id || idx} className="flex gap-3">
                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {commentUser ? getUserInitials(commentUser) : '?'}
                          </div>
                          {/* Comment Content */}
                          <div className="flex-1">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {commentUser ? getUserName(commentUser) : t('taskManager.unknownUser')}
                                  </span>
                                  {comment.edite && comment.date_edition && (
                                    <span
                                      className="text-xs text-gray-500 dark:text-gray-400 italic"
                                      title={t('taskManager.comments.editedTooltip', {
                                        date: formatFullDateTime(comment.date_edition)
                                      })}
                                    >
                                      {t('taskManager.comments.edited')}
                                    </span>
                                  )}
                                </div>
                                {isOwner && !isEditing && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
                                      title={t('taskManager.comments.editTitle')}
                                    >
                                      <PencilIcon className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment.id)}
                                      disabled={isDeleting}
                                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-600 dark:text-red-400 disabled:opacity-50"
                                      title={t('taskManager.comments.deleteTitle')}
                                    >
                                      {isDeleting ? (
                                        <LoadingSpinner size="sm" />
                                      ) : (
                                        <TrashIcon className="h-3.5 w-3.5" />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editingCommentText}
                                    onChange={(e) => {
                                      setEditingCommentText(e.target.value);
                                      e.target.style.height = 'auto';
                                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                    }}
                                    rows={1}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white text-sm resize-none"
                                    style={{ minHeight: '60px', maxHeight: '120px', overflowY: 'auto' }}
                                    autoFocus
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                                    >
                                      {t('taskManager.modal.cancel')}
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(comment.id)}
                                      disabled={!editingCommentText.trim()}
                                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {t('taskManager.comments.save')}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                    {formatCommentWithMentions(comment.comment)}
                                  </p>
                                  {/* Like Button and Date */}
                                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <button
                                      onClick={() => handleToggleLike(comment.id)}
                                      className={`flex items-center gap-1 text-xs transition-colors ${
                                        comment.is_liked
                                          ? 'text-blue-600 dark:text-blue-400 font-semibold'
                                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                                      }`}
                                    >
                                      <svg className="w-4 h-4" fill={comment.is_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                      </svg>
                                      <span>{comment.nombre_likes || 0}</span>
                                    </button>
                                    {(() => {
                                      // Try multiple possible date field names
                                      const date = comment.timestamp || comment.created_at || comment.createdAt || comment.date_creation;
                                      
                                      if (!date) {
                                        console.log('Comment data:', comment);
                                        console.log('Available fields:', Object.keys(comment));
                                        return (
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {t('taskManager.comments.dateUnavailable')}
                                          </span>
                                        );
                                      }
                                      
                                      try {
                                        const dateObj = new Date(date);
                                        if (isNaN(dateObj.getTime())) {
                                          console.log('Invalid date value:', date, typeof date);
                                          return (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                              {t('taskManager.comments.dateInvalid')}
                                            </span>
                                          );
                                        }
                                        return (
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {dateObj.toLocaleString(dateLocale, {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </span>
                                        );
                                      } catch (error) {
                                        console.error('Error formatting date:', error, date);
                                        return (
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {t('taskManager.comments.dateError')}
                                          </span>
                                        );
                                      }
                                    })()}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {t('taskManager.comments.empty')}
                    </div>
                  )}
                </div>

                {/* Comment Input - Facebook Style */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex gap-3">
                    {/* Current User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {user ? getUserInitials(user) : '?'}
                    </div>
                    {/* Input */}
                    <div className="flex-1 relative">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-end gap-2">
                        <textarea
                          ref={commentTextareaRef}
                          value={newComment}
                          onChange={handleCommentInputChange}
                          onKeyDown={(e) => {
                            // Handle mention navigation first
                            if (showMentionSuggestions) {
                              handleMentionKeyDown(e);
                              return;
                            }
                            
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handlePostComment();
                            }
                          }}
                          placeholder={t('taskManager.comments.placeholder')}
                          rows={1}
                          className="flex-1 bg-transparent border-0 resize-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          style={{ minHeight: '40px', maxHeight: '120px', overflowY: 'auto' }}
                        />
                        <button
                          onClick={handlePostComment}
                          disabled={!newComment.trim() || postingComment}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newComment.trim() && !postingComment
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {postingComment ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" />
                              <span>{t('taskManager.comments.publishing')}</span>
                            </div>
                          ) : (
                            t('taskManager.comments.publish')
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-4">
                        {t('taskManager.comments.hint')}
                      </p>
                      
                      {/* Mention Suggestions Dropdown */}
                      {showMentionSuggestions && mentionSuggestions.length > 0 && (
                        <div
                          ref={mentionSuggestionRef}
                          className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                        >
                          {mentionSuggestions.map((user, idx) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => selectMention(user)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                                idx === selectedMentionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
                              }`}
                            >
                              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {getUserInitials(user)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                  {getUserName(user)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  @{user.prenom} {user.nom}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mention Tooltip */}
      {mentionTooltip && (
        <>
          {/* Backdrop to close tooltip */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMentionTooltip(null)}
          />
          {/* Tooltip */}
          <div
            ref={mentionTooltipRef}
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] max-w-[320px]"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 10}px`,
              transform: 'translate(-50%, -100%)',
              marginTop: '-8px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow pointing down */}
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-200 dark:border-t-gray-700"
            />
            <div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white dark:border-t-gray-800"
              style={{ marginBottom: '-1px' }}
            />
            
            {/* User Info */}
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {getUserInitials(mentionTooltip)}
              </div>
              
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">
                  {getUserName(mentionTooltip)}
                </h3>
                {mentionTooltip.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                    {mentionTooltip.email}
                  </p>
                )}
                {mentionTooltip.role && (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {mentionTooltip.role}
                  </span>
                )}
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setMentionTooltip(null)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Additional Info */}
            {(mentionTooltip.departement || mentionTooltip.telephone) && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                {mentionTooltip.departement && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UserIcon className="h-4 w-4" />
                    <span>{mentionTooltip.departement}</span>
                  </div>
                )}
                {mentionTooltip.telephone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{mentionTooltip.telephone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskManager;

