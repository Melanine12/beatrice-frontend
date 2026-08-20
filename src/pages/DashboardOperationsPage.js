import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import toast from 'react-hot-toast';
import {
  PresentationChartLineIcon,
  ArrowPathIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  ChevronRightIcon,
  NoSymbolIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { canAccessMonitoringPhaseTest } from '../utils/monitoringPhaseTestAccess';
import api from '../services/api';
import { fetchAllConnaissements } from '../services/connaissementsSync';
import Pagination from '../components/UI/Pagination';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { resolveTaskDateRange, toDateInputValue } from '../utils/taskDateFilters';

const UI_PAGE_SIZE = 25;
const ASSIGN_PAGE_LIMIT = 1000;

function personName(u) {
  if (!u) return '';
  if (typeof u === 'string') return u.trim();
  const n = `${u.prenom || ''} ${u.nom || ''}`.trim();
  return n || (u.id != null ? `#${u.id}` : '');
}

function getBlNumeroDossier(row) {
  return String(
    row?.numero_dossier ?? row?.numeroDossier ?? row?.dossier_number ?? row?.dossierNumber ?? ''
  ).trim();
}

function getDeclarationNumber(row) {
  return String(row?.declarationNumber ?? row?.declaration_number ?? '').trim();
}

function getFeriNumber(row) {
  return String(row?.numeroFeri ?? row?.numero_feri ?? row?.numeroFxi ?? row?.numero_fxi ?? '').trim();
}

function getBureauId(row) {
  const id = row?.bureauConnaissement ?? row?.bureau_connaissement ?? row?.BureauInternational?.id;
  return id == null || id === '' ? null : String(id);
}

function getBureauLabel(row) {
  return String(
    row?.bureauLabel ?? row?.BureauInternational?.nom ?? row?.bureau_nom ?? ''
  ).trim();
}

function getCreatedAt(row) {
  const raw = row?.createdAt ?? row?.created_at;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function circuitStage(row) {
  const controlled = Boolean(row?.isControlledByController ?? row?.is_controlled_by_controller);
  const validated = Boolean(row?.isValidated ?? row?.is_validated);
  const declared = Boolean(row?.isDeclared ?? row?.is_declared) || Boolean(getDeclarationNumber(row));
  const exported = Boolean(row?.isExported ?? row?.is_exported);
  const hasDossier = Boolean(getBlNumeroDossier(row));

  if (controlled) return 'controlled';
  if (validated || getFeriNumber(row)) return 'validated';
  if (declared) return 'declared';
  if (exported) return 'exported';
  if (hasDossier) return 'saisi';
  return 'extracteur';
}

/** Le contrôleur n’intervient qu’à partir de la déclaration / clôture. */
function isControleurPhase(row) {
  const stage = circuitStage(row);
  return stage === 'declared' || stage === 'validated' || stage === 'controlled';
}

function getSaisisseurName(row, saisiAssignMap) {
  const id = String(row?.id ?? '');
  const fromDoc = personName(row?.saisiAssignee);
  if (fromDoc) return fromDoc;
  const fromMap = saisiAssignMap[id]?.name;
  if (fromMap) return fromMap;
  return '';
}

/** Support client = id_support_client / nom_support_client (pas controle_par_*). */
function getSupportClientName(row) {
  const fromUser = personName(row?.supportClientAssignee);
  if (fromUser) return fromUser;
  return String(row?.nomSupportClient ?? row?.nom_support_client ?? '').trim();
}

/** Contrôleur = assignation Contrôle de dossiers uniquement (pas controle_par). */
function getControleurDisplay(row, controleAssignMap, t) {
  const id = String(row?.id ?? '');
  const name =
    controleAssignMap[id]?.name || personName(row?.controleAssignee) || '';
  if (!name) return { text: '—', preassigned: false };
  if (!isControleurPhase(row)) {
    return {
      text: t('dashboardOperations.table.controleurPreassigned', { name }),
      preassigned: true
    };
  }
  return { text: name, preassigned: false };
}

function extractAssignationBlId(item) {
  return (
    item?.connaissementId ??
    item?.connaissement_id ??
    item?.connaissement?.id ??
    item?.blDocumentId ??
    item?.bl_document_id ??
    item?.blDocument?.id ??
    null
  );
}

function mapAssignationEntry(item) {
  if (!item || item?.statut === 'Annulée') return null;
  const blId = extractAssignationBlId(item);
  if (blId == null || blId === '') return null;
  const assignee = item?.assignee || {};
  const assigneeId = item?.assigneeId ?? item?.assignee_id ?? assignee?.id ?? null;
  const name =
    personName(assignee) ||
    String(item?.assigneeName || item?.assignee_name || '').trim() ||
    (assigneeId != null ? `#${assigneeId}` : '');
  if (!assigneeId && !name) return null;
  return {
    key: String(blId),
    assigneeId,
    name: name || '—'
  };
}

async function fetchAllAssignations(endpoint) {
  const all = [];
  let page = 1;
  while (page <= 50) {
    const { data } = await api.get(endpoint, { params: { limit: ASSIGN_PAGE_LIMIT, page } });
    const rows = Array.isArray(data?.assignations) ? data.assignations : [];
    all.push(...rows);
    const total = Number(data?.pagination?.total);
    if (!rows.length) break;
    if (Number.isFinite(total) && all.length >= total) break;
    if (rows.length < ASSIGN_PAGE_LIMIT) break;
    page += 1;
  }
  return all;
}

function buildAssignMap(rows) {
  const nextMap = {};
  rows.forEach((item) => {
    const mapped = mapAssignationEntry(item);
    if (!mapped) return;
    if (nextMap[mapped.key]) return;
    nextMap[mapped.key] = {
      assigneeId: mapped.assigneeId,
      name: mapped.name
    };
  });
  return nextMap;
}

/**
 * Cockpit opérationnel — filtres bureau / dates, KPI circuit FERI, tableau dossiers + utilisateurs.
 */
const DashboardOperationsPage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [saisiAssignMap, setSaisiAssignMap] = useState({});
  const [controleAssignMap, setControleAssignMap] = useState({});
  const [bureaux, setBureaux] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bureauId, setBureauId] = useState('');
  const [kpiFilter, setKpiFilter] = useState(null);
  const [datePreset, setDatePreset] = useState('last_30_days');
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return toDateInputValue(d);
  });
  const [dateTo, setDateTo] = useState(() => toDateInputValue(new Date()));
  const [currentPage, setCurrentPage] = useState(1);

  const locale = i18n.language?.startsWith('zh')
    ? 'zh-CN'
    : i18n.language?.startsWith('en')
      ? 'en-US'
      : 'fr-FR';

  const datePresetOptions = useMemo(
    () => [
      { value: 'all', label: t('dashboardOperations.filters.dateAll') },
      { value: 'today', label: t('dashboardOperations.filters.dateToday') },
      { value: 'yesterday', label: t('dashboardOperations.filters.dateYesterday') },
      { value: 'last_7_days', label: t('dashboardOperations.filters.dateLast7') },
      { value: 'last_30_days', label: t('dashboardOperations.filters.dateLast30') },
      { value: 'this_month', label: t('dashboardOperations.filters.dateThisMonth') },
      { value: 'custom', label: t('dashboardOperations.filters.dateCustom') }
    ],
    [t]
  );

  const bureauOptions = useMemo(() => {
    const byId = new Map();
    bureaux.forEach((b) => {
      if (b?.id == null) return;
      byId.set(String(b.id), b.ville ? `${b.nom} — ${b.ville}` : b.nom);
    });
    documents.forEach((row) => {
      const id = getBureauId(row);
      const label = getBureauLabel(row);
      if (id && label && !byId.has(id)) byId.set(id, label);
      if (!id && label) {
        const key = `label:${label}`;
        if (!byId.has(key)) byId.set(key, label);
      }
    });
    return [
      { value: '', label: t('dashboardOperations.filters.bureauAll') },
      ...Array.from(byId.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
    ];
  }, [bureaux, documents, t]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [docsResult, saisiRows, controleRows, burRes] = await Promise.all([
        fetchAllConnaissements({ limit: 500 }),
        fetchAllAssignations('/assignations-bl').catch(() => []),
        fetchAllAssignations('/assignations-bl-controleur').catch(() => []),
        api.get('/bureaux-internationaux', { params: { statut: 'Actif', limit: 200 } }).catch(() => ({ data: {} }))
      ]);

      setDocuments(Array.isArray(docsResult.documents) ? docsResult.documents : []);
      setSaisiAssignMap(buildAssignMap(saisiRows));
      setControleAssignMap(buildAssignMap(controleRows));

      const burList = Array.isArray(burRes.data?.bureauxInternationaux)
        ? burRes.data.bureauxInternationaux
        : Array.isArray(burRes.data?.bureaux)
          ? burRes.data.bureaux
          : Array.isArray(burRes.data?.data)
            ? burRes.data.data
            : [];
      setBureaux(burList);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t('dashboardOperations.toast.loadError'));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const dateRange = useMemo(
    () => resolveTaskDateRange(datePreset, dateFrom, dateTo),
    [datePreset, dateFrom, dateTo]
  );

  const matchesBureau = useCallback(
    (row) => {
      if (!bureauId) return true;
      if (bureauId.startsWith('label:')) {
        return getBureauLabel(row) === bureauId.slice(6);
      }
      return getBureauId(row) === String(bureauId);
    },
    [bureauId]
  );

  const isAssigned = useCallback(
    (row) => {
      const id = String(row.id);
      return Boolean(
        row?.saisiAssignee?.id ||
          saisiAssignMap[id]?.assigneeId ||
          row?.controleAssignee?.id ||
          controleAssignMap[id]?.assigneeId
      );
    },
    [saisiAssignMap, controleAssignMap]
  );

  const matchesKpi = useCallback(
    (row) => {
      if (!kpiFilter) return true;
      switch (kpiFilter) {
        case 'assigned':
          return isAssigned(row);
        case 'unassigned':
          return !isAssigned(row);
        case 'exported':
          return Boolean(row?.isExported ?? row?.is_exported);
        case 'declared':
          return Boolean(row?.isDeclared ?? row?.is_declared) || Boolean(getDeclarationNumber(row));
        case 'validated':
          return Boolean(row?.isValidated ?? row?.is_validated) || Boolean(getFeriNumber(row));
        case 'controlled':
          return Boolean(row?.isControlledByController ?? row?.is_controlled_by_controller);
        default:
          return true;
      }
    },
    [kpiFilter, isAssigned]
  );

  const baseFilteredDocs = useMemo(() => {
    return documents.filter((row) => {
      if (!matchesBureau(row)) return false;
      if (dateRange) {
        const created = getCreatedAt(row);
        if (!created || created < dateRange.from || created > dateRange.to) return false;
      }
      return true;
    });
  }, [documents, matchesBureau, dateRange]);

  const filteredDocs = useMemo(
    () => baseFilteredDocs.filter((row) => matchesKpi(row)),
    [baseFilteredDocs, matchesKpi]
  );

  const kpis = useMemo(() => {
    let assigned = 0;
    let unassigned = 0;
    let exported = 0;
    let declared = 0;
    let validated = 0;
    let controlled = 0;

    baseFilteredDocs.forEach((row) => {
      if (isAssigned(row)) assigned += 1;
      else unassigned += 1;

      if (Boolean(row?.isExported ?? row?.is_exported)) exported += 1;
      if (Boolean(row?.isDeclared ?? row?.is_declared) || getDeclarationNumber(row)) declared += 1;
      if (Boolean(row?.isValidated ?? row?.is_validated) || getFeriNumber(row)) validated += 1;
      if (Boolean(row?.isControlledByController ?? row?.is_controlled_by_controller)) controlled += 1;
    });

    return {
      total: baseFilteredDocs.length,
      assigned,
      unassigned,
      exported,
      declared,
      validated,
      controlled
    };
  }, [baseFilteredDocs, isAssigned]);

  const tableRows = useMemo(() => {
    return [...filteredDocs]
      .sort((a, b) => {
        const da = getCreatedAt(a)?.getTime() || 0;
        const db = getCreatedAt(b)?.getTime() || 0;
        return db - da;
      })
      .map((row) => {
        const controleur = getControleurDisplay(row, controleAssignMap, t);
        return {
          id: row.id,
          reference: getBlNumeroDossier(row) || '—',
          blNumber: row.blNumber || row.bl_number || '—',
          bureau: getBureauLabel(row) || '—',
          stage: circuitStage(row),
          supportClient: getSupportClientName(row) || '—',
          saisisseur: getSaisisseurName(row, saisiAssignMap) || '—',
          controleur: controleur.text,
          controleurPreassigned: controleur.preassigned,
          declaration: getDeclarationNumber(row) || '—',
          feri: getFeriNumber(row) || '—',
          createdAt: getCreatedAt(row)
        };
      });
  }, [filteredDocs, saisiAssignMap, controleAssignMap, t]);

  const totalPages = Math.max(1, Math.ceil(tableRows.length / UI_PAGE_SIZE) || 1);
  const paginatedRows = useMemo(() => {
    const page = Math.min(currentPage, totalPages);
    const start = (page - 1) * UI_PAGE_SIZE;
    return tableRows.slice(start, start + UI_PAGE_SIZE);
  }, [currentPage, tableRows, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bureauId, datePreset, dateFrom, dateTo, kpiFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const formatDate = useCallback(
    (d) => {
      if (!d) return '—';
      try {
        return d.toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' });
      } catch {
        return '—';
      }
    },
    [locale]
  );

  const stageLabel = useCallback(
    (stage) => t(`dashboardOperations.stages.${stage}`, { defaultValue: stage }),
    [t]
  );

  const toggleKpiFilter = useCallback((key) => {
    setKpiFilter((cur) => (cur === key ? null : key));
  }, []);

  const kpiCards = [
    {
      key: 'assigned',
      label: t('dashboardOperations.kpi.assigned'),
      value: kpis.assigned,
      sub: t('dashboardOperations.kpi.unassignedSub', { count: kpis.unassigned }),
      Icon: UserPlusIcon,
      color: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/40',
      activeClass: 'ring-2 ring-emerald-500 border-emerald-400'
    },
    {
      key: 'unassigned',
      label: t('dashboardOperations.kpi.unassigned'),
      value: kpis.unassigned,
      sub: t('dashboardOperations.kpi.totalSub', { count: kpis.total }),
      Icon: UserMinusIcon,
      color: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40',
      activeClass: 'ring-2 ring-amber-500 border-amber-400'
    },
    {
      key: 'exported',
      label: t('dashboardOperations.kpi.exported'),
      value: kpis.exported,
      sub: t('dashboardOperations.kpi.sygrem'),
      Icon: ArrowUpTrayIcon,
      color: 'text-sky-700 bg-sky-100 dark:text-sky-300 dark:bg-sky-900/40',
      activeClass: 'ring-2 ring-sky-500 border-sky-400'
    },
    {
      key: 'declared',
      label: t('dashboardOperations.kpi.declared'),
      value: kpis.declared,
      sub: t('dashboardOperations.kpi.declarationNumber'),
      Icon: DocumentTextIcon,
      color: 'text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/40',
      activeClass: 'ring-2 ring-indigo-500 border-indigo-400'
    },
    {
      key: 'validated',
      label: t('dashboardOperations.kpi.validated'),
      value: kpis.validated,
      sub: t('dashboardOperations.kpi.feriNumber'),
      Icon: ShieldCheckIcon,
      color: 'text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-900/40',
      activeClass: 'ring-2 ring-violet-500 border-violet-400'
    },
    {
      key: 'controlled',
      label: t('dashboardOperations.kpi.controlled'),
      value: kpis.controlled,
      sub: t('dashboardOperations.kpi.conformity'),
      Icon: ClipboardDocumentCheckIcon,
      color: 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/40',
      activeClass: 'ring-2 ring-rose-500 border-rose-400'
    }
  ];

  const moduleLinks = useMemo(() => {
    const items = [
      {
        to: '/rh/sanctions',
        titleKey: 'dashboardOperations.cards.sanctions.title',
        descriptionKey: 'dashboardOperations.cards.sanctions.description',
        Icon: NoSymbolIcon
      },
      {
        to: '/rh/conges-absences',
        titleKey: 'dashboardOperations.cards.conges.title',
        descriptionKey: 'dashboardOperations.cards.conges.description',
        Icon: CalendarDaysIcon
      },
      {
        to: '/soumissions-besoins',
        titleKey: 'dashboardOperations.cards.soumissionsBesoins.title',
        descriptionKey: 'dashboardOperations.cards.soumissionsBesoins.description',
        Icon: ClipboardDocumentListIcon
      },
      {
        to: '/clients',
        titleKey: 'dashboardOperations.cards.clients.title',
        descriptionKey: 'dashboardOperations.cards.clients.description',
        Icon: UserGroupIcon
      },
      {
        to: '/gestion-plaintes',
        titleKey: 'dashboardOperations.cards.gestionPlaintes.title',
        descriptionKey: 'dashboardOperations.cards.gestionPlaintes.description',
        Icon: ExclamationTriangleIcon
      },
      {
        to: '/task-manager',
        titleKey: 'dashboardOperations.cards.taskManager.title',
        descriptionKey: 'dashboardOperations.cards.taskManager.description',
        Icon: ClipboardDocumentCheckIcon
      },
      {
        to: '/notifications',
        titleKey: 'dashboardOperations.cards.notifications.title',
        descriptionKey: 'dashboardOperations.cards.notifications.description',
        Icon: BellIcon
      }
    ];
    if (canAccessMonitoringPhaseTest(user)) {
      items.push({
        to: '/monitoring-phase-test',
        titleKey: 'dashboardOperations.cards.monitoringPhaseTest.title',
        descriptionKey: 'dashboardOperations.cards.monitoringPhaseTest.description',
        Icon: ChartBarIcon
      });
    }
    return items;
  }, [user]);

  const displayName =
    `${user?.prenom || ''} ${user?.nom || ''}`.trim() || user?.email || '';

  const onDatePresetChange = (option) => {
    const preset = option?.value || 'last_30_days';
    const range = resolveTaskDateRange(preset, dateFrom, dateTo);
    setDatePreset(preset);
    if (preset !== 'custom' && range) {
      setDateFrom(toDateInputValue(range.from));
      setDateTo(toDateInputValue(range.to));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <PresentationChartLineIcon className="h-8 w-8 text-primary-600 shrink-0" aria-hidden />
            {t('dashboardOperations.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-3xl">
            {displayName
              ? t('dashboardOperations.welcomeNamed', { name: displayName })
              : t('dashboardOperations.welcome')}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-3xl">
            {t('dashboardOperations.cockpitSubtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
          {t('dashboardOperations.refresh')}
        </button>
      </div>

      {/* Filtres */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <BuildingLibraryIcon className="h-5 w-5 text-primary-600" aria-hidden />
          {t('dashboardOperations.filters.title')}
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('dashboardOperations.filters.bureau')}
            </span>
            <Select
              value={bureauOptions.find((o) => o.value === String(bureauId)) || bureauOptions[0]}
              onChange={(opt) => setBureauId(opt?.value || '')}
              options={bureauOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('dashboardOperations.filters.datePreset')}
            </span>
            <Select
              value={datePresetOptions.find((o) => o.value === datePreset) || datePresetOptions[0]}
              onChange={onDatePresetChange}
              options={datePresetOptions}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('dashboardOperations.filters.dateFrom')}
            </span>
            <input
              type="date"
              value={dateFrom}
              disabled={datePreset !== 'custom'}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setDatePreset('custom');
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-900"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
              {t('dashboardOperations.filters.dateTo')}
            </span>
            <input
              type="date"
              value={dateTo}
              disabled={datePreset !== 'custom'}
              onChange={(e) => {
                setDateTo(e.target.value);
                setDatePreset('custom');
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:disabled:bg-gray-900"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {t('dashboardOperations.filters.hint', {
            count: kpiFilter ? filteredDocs.length : kpis.total
          })}
          {kpiFilter
            ? ` — ${t('dashboardOperations.filters.kpiActive', {
                label: t(`dashboardOperations.kpi.${kpiFilter}`)
              })}`
            : ''}
        </p>
      </div>

      {/* KPI */}
      {loading && documents.length === 0 ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map(({ key, label, value, sub, Icon, color, activeClass }) => {
            const active = kpiFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleKpiFilter(key)}
                aria-pressed={active}
                title={t('dashboardOperations.kpi.clickToFilter')}
                className={`rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md dark:bg-gray-800/50 ${
                  active
                    ? activeClass
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {label}
                    </p>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-gray-900 dark:text-white">
                      {value.toLocaleString(locale)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                    <p className="mt-2 text-[11px] font-medium text-primary-700 dark:text-primary-300">
                      {active
                        ? t('dashboardOperations.kpi.filterOn')
                        : t('dashboardOperations.kpi.clickToFilter')}
                    </p>
                  </div>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tableau dossiers + utilisateurs */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('dashboardOperations.table.title')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('dashboardOperations.table.subtitle')}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.reference')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.blNumber')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.bureau')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.stage')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.supportClient')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.saisisseur')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.controleur')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.declaration')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.feri')}
                </th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t('dashboardOperations.table.createdAt')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/80">
              {loading && documents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-10 text-center text-gray-500">
                    {t('dashboardOperations.table.loading')}
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-10 text-center text-gray-500">
                    {t('dashboardOperations.table.empty')}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30">
                    <td className="whitespace-nowrap px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                      {row.reference}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row.blNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row.bureau}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className="inline-flex rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/40 dark:text-primary-200">
                        {stageLabel(row.stage)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row.supportClient}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row.saisisseur}
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-2.5 ${
                        row.controleurPreassigned
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      title={
                        row.controleurPreassigned
                          ? t('dashboardOperations.table.controleurPreassignedHint')
                          : undefined
                      }
                    >
                      {row.controleur}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row.declaration}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-700 dark:text-gray-300">
                      {row.feri}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-gray-500 dark:text-gray-400">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {tableRows.length > 0 ? (
          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            totalItems={tableRows.length}
            itemsPerPage={UI_PAGE_SIZE}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        ) : null}
      </div>

      {/* Raccourcis modules */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          {t('dashboardOperations.modulesTitle')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {moduleLinks.map(({ to, titleKey, descriptionKey, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-primary-700 dark:hover:bg-primary-900/20"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-300">
                  {t(titleKey)}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t(descriptionKey)}
                </span>
              </span>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-primary-600" aria-hidden />
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOperationsPage;
