function escapeHtml(text) {
    return String(text || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function initDeveloperExperience() {
    const templateCards = document.querySelectorAll('.developer-template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            state.developer.selectedTemplate = card.dataset.template;
            if (elements.devSelectedTemplate) {
                elements.devSelectedTemplate.value = card.querySelector('h3')?.textContent || '';
            }
            updateDeveloperReview();
        });
    });

    const formInputs = [
        elements.devAppName,
        elements.devRepoUrl,
        elements.devTargetCluster,
        elements.devNamespace,
        elements.devCpuRequest,
        elements.devMemoryRequest
    ];

    for (const input of formInputs) {
        if (!input) continue;
        input.addEventListener('input', () => {
            syncDeveloperFormState();
            updateDeveloperReview();
        });
        input.addEventListener('change', () => {
            syncDeveloperFormState();
            updateDeveloperReview();
        });
    }

    if (elements.addDevEnvVarBtn) {
        elements.addDevEnvVarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            addDeveloperEnvVar();
        });
    }

    if (elements.developerEnvRows) {
        elements.developerEnvRows.addEventListener('click', (e) => {
            if (!e.target.closest('.remove-dev-env')) return;
            const row = e.target.closest('.developer-env-row');
            const idx = Number(row?.dataset.index || -1);
            if (idx >= 0) {
                state.developer.envVars.splice(idx, 1);
                renderDeveloperEnvRows();
                updateDeveloperReview();
            }
        });

        elements.developerEnvRows.addEventListener('input', (e) => {
            const row = e.target.closest('.developer-env-row');
            const idx = Number(row?.dataset.index || -1);
            if (idx < 0 || !state.developer.envVars[idx]) return;
            if (e.target.classList.contains('dev-env-key')) state.developer.envVars[idx].key = e.target.value;
            if (e.target.classList.contains('dev-env-value')) state.developer.envVars[idx].value = e.target.value;
            if (e.target.classList.contains('dev-env-secret')) state.developer.envVars[idx].secret = e.target.checked;
            updateDeveloperReview();
        });

        elements.developerEnvRows.addEventListener('change', (e) => {
            if (!e.target.classList.contains('dev-env-secret')) return;
            const row = e.target.closest('.developer-env-row');
            const idx = Number(row?.dataset.index || -1);
            if (idx >= 0 && state.developer.envVars[idx]) {
                state.developer.envVars[idx].secret = e.target.checked;
                updateDeveloperReview();
            }
        });
    }

    if (elements.developerPreviewBtn) {
        elements.developerPreviewBtn.addEventListener('click', () => {
            syncDeveloperFormState();
            renderDeveloperManifestPreview();
        });
    }

    if (elements.developerDeployBtn) {
        elements.developerDeployBtn.addEventListener('click', () => {
            syncDeveloperFormState();
            if (!validateDeveloperDeploy()) return;
            showNotification(`Deploy started: ${state.developer.appName} -> ${state.developer.cluster}/${state.developer.namespace}`, 'success');
        });
    }

    if (!state.developer.envVars.length) {
        addDeveloperEnvVar('APP_ENV', 'staging', false);
    }

    syncDeveloperFormState();
    updateDeveloperReview();
}

function syncDeveloperFormState() {
    state.developer.appName = elements.devAppName?.value?.trim() || '';
    state.developer.repoUrl = elements.devRepoUrl?.value?.trim() || '';
    state.developer.cluster = elements.devTargetCluster?.value || '';
    state.developer.namespace = elements.devNamespace?.value?.trim() || '';
    state.developer.cpuRequest = Number(elements.devCpuRequest?.value || 500);
    state.developer.memoryRequest = Number(elements.devMemoryRequest?.value || 512);
    state.developer.enableDb = !!elements.devEnableDb?.checked;
    state.developer.enableRedis = !!elements.devEnableRedis?.checked;
    state.developer.enableQueue = !!elements.devEnableQueue?.checked;
}

function addDeveloperEnvVar(key = '', value = '', secret = false) {
    state.developer.envVars.push({ key, value, secret });
    renderDeveloperEnvRows();
    updateDeveloperReview();
}

function renderDeveloperEnvRows() {
    if (!elements.developerEnvRows) return;
    elements.developerEnvRows.innerHTML = '';
    state.developer.envVars.forEach((env, idx) => {
        const row = document.createElement('div');
        row.className = 'developer-env-row';
        row.dataset.index = String(idx);
        row.innerHTML = `
            <input class="dev-env-key" type="text" placeholder="KEY" value="${escapeHtml(env.key)}">
            <input class="dev-env-value" type="text" placeholder="value" value="${escapeHtml(env.value)}">
            <label><input class="dev-env-secret" type="checkbox" ${env.secret ? 'checked' : ''}> Secret</label>
            <button class="btn btn-secondary btn-sm remove-dev-env" type="button"><i class="fas fa-trash"></i></button>
        `;
        elements.developerEnvRows.appendChild(row);
    });
}

function updateDeveloperReview() {
    if (!elements.developerReviewBox) return;
    const infra = [
        state.developer.enableDb ? 'PostgreSQL' : null,
        state.developer.enableRedis ? 'Redis' : null,
        state.developer.enableQueue ? 'Queue' : null
    ].filter(Boolean);
    const safeEnv = state.developer.envVars
        .filter(e => e.key)
        .map(e => `${e.key}=${e.secret ? '***' : (e.value || '')}`)
        .join(', ');

    elements.developerReviewBox.innerHTML = `
        <strong>Review</strong><br>
        Template: ${escapeHtml(elements.devSelectedTemplate?.value || '')}<br>
        App: ${escapeHtml(state.developer.appName || '-')}<br>
        Target: ${escapeHtml(state.developer.cluster || '-')} / ${escapeHtml(state.developer.namespace || '-')}<br>
        Resources: CPU ${state.developer.cpuRequest}m, Memory ${state.developer.memoryRequest}Mi<br>
        Infra: ${infra.length ? infra.join(', ') : 'none'}<br>
        Env: ${safeEnv || 'none'}
    `;
}

function renderDeveloperManifestPreview() {
    const name = state.developer.appName || 'sample-app';
    const ns = state.developer.namespace || 'apps';
    const cpu = state.developer.cpuRequest;
    const memory = state.developer.memoryRequest;
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const env = state.developer.envVars
        .filter(v => v.key)
        .map(v => `            - name: ${v.key}\n              value: ${v.secret ? '"***"' : `"${(v.value || '').replace(/"/g, '\\"')}"`}`)
        .join('\n');

    const yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${slug}
  namespace: ${ns}
  labels:
    app.kubernetes.io/managed-by: nullus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${slug}
  template:
    metadata:
      labels:
        app: ${slug}
    spec:
      containers:
        - name: ${slug}
          image: ${slug}:latest
          resources:
            requests:
              cpu: "${cpu}m"
              memory: "${memory}Mi"
${env ? `          env:\n${env}\n` : ''}---
apiVersion: v1
kind: Service
metadata:
  name: ${slug}-svc
  namespace: ${ns}
spec:
  selector:
    app: ${slug}
  ports:
    - port: 80
      targetPort: 8080`;

    const modal = document.getElementById('k8sPreviewModal');
    const content = document.getElementById('k8sPreviewContent');
    if (!modal || !content) return;
    content.textContent = yaml;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    showNotification('Developer manifest preview generated', 'info');
}

function validateDeveloperDeploy() {
    if (!state.developer.selectedTemplate) {
        showNotification('Choose a template first', 'error');
        return false;
    }
    if (!state.developer.appName) {
        showNotification('App name is required', 'error');
        return false;
    }
    if (!state.developer.cluster || !state.developer.namespace) {
        showNotification('Target cluster and namespace are required', 'error');
        return false;
    }
    return true;
}

function filterDevTemplates(category, btn) {
    document.querySelectorAll('.template-category-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    document.querySelectorAll('#developerTemplateGrid .developer-template-card').forEach(card => {
        card.style.display = (category === 'all' || card.dataset.type === category) ? '' : 'none';
    });
}
