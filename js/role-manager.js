// ============================================================
// role-manager.js
// Role-based access control - single source of truth
// ============================================================

const ROLE_CONFIG = {
  admin: {
    pages:    ['organization', 'users', 'clusters', 'home'],
    default:  'organization',
    bodyClass: 'role-admin',
    stateKey: 'lastAdminPage'
  },
  developer: {
    pages:    ['developer', 'cicdtemplates', 'cicdlist', 'action', 'monitoring', 'alertlist', 'alerthistory'],
    default:  'cicdlist',
    bodyClass: 'role-developer',
    stateKey: 'lastDeveloperPage'
  },
  devops: {
    pages:    ['stackinstall', 'templates', 'stacklist', 'clusters', 'organization', 'users',
                'version', 'monitoring', 'alertlist', 'alerthistory',
                'cicdtemplates', 'cicdlist', 'action'],
    default:  'stacklist',
    bodyClass: 'role-devops',
    stateKey: 'lastDevopsPage'
  }
}

/**
 * 현재 role에서 pageName 접근 가능한지 여부 반환
 */
function canAccessPage(role, pageName) {
  const cfg = ROLE_CONFIG[role]
  return !!cfg && cfg.pages.includes(pageName)
}

/**
 * role의 기본(default) 페이지 반환
 */
function getDefaultPage(role) {
  return (ROLE_CONFIG[role] || ROLE_CONFIG.devops).default
}

/**
 * state 에서 role의 마지막 페이지 반환
 */
function getLastPage(role) {
  const cfg = ROLE_CONFIG[role]
  if (!cfg) return getDefaultPage(role)
  return state[cfg.stateKey] || cfg.default
}

/**
 * state 에서 role의 마지막 페이지 업데이트
 */
function setLastPage(role, pageName) {
  const cfg = ROLE_CONFIG[role]
  if (cfg) state[cfg.stateKey] = pageName
}

/**
 * role 전환: body class 교체 + 마지막 페이지 복원 + 페이지 이동
 */
function applyRole(role) {
  state.currentRole = role
  const allClasses = Object.values(ROLE_CONFIG).map(c => c.bodyClass)
  document.body.classList.remove(...allClasses)

  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.devops
  document.body.classList.add(cfg.bodyClass)

  if (canAccessPage(role, state.currentPage)) {
    setLastPage(role, state.currentPage)
  } else {
    state[cfg.stateKey] = cfg.default
  }

  switchPage(getLastPage(role))
}

/**
 * 사이드바 role-btn 초기화 — 클릭 시 applyRole 호출
 */
function initRoleSwitcher() {
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role
      if (role === state.currentRole) return
      state.currentRole = role
      document.querySelectorAll('.role-btn').forEach(b => { b.classList.remove('active') })
      btn.classList.add('active')
      applyRole(role)
    })
  })
}

window.ROLE_CONFIG      = ROLE_CONFIG
window.canAccessPage    = canAccessPage
window.getDefaultPage   = getDefaultPage
window.getLastPage      = getLastPage
window.setLastPage      = setLastPage
window.applyRole        = applyRole
window.initRoleSwitcher = initRoleSwitcher
