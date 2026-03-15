// Workflow 목록 필터링
function filterActionList(query) {
    var q = (query || document.getElementById('actionSearch').value || '').toLowerCase();
    var status = (document.getElementById('actionStatusFilter') || {}).value || 'all';
    document.querySelectorAll('#actionListItems .stack-list-item').forEach(function (item) {
        var nameMatch = item.dataset.name.toLowerCase().includes(q);
        var statusMatch = status === 'all' || item.dataset.status === status;
        item.style.display = (nameMatch && statusMatch) ? '' : 'none';
    });
}

// Workflow 선택
function selectActionItem(el) {
    document.querySelectorAll('#actionListItems .stack-list-item').forEach(function (i) { i.classList.remove('active'); });
    el.classList.add('active');

    var id = el.dataset.actionId;
    var workflows = {
        'deploy-prod': {
            title: 'deploy-prod.yml',
            meta: 'Production 배포 · main 브랜치 · .github/workflows/deploy-prod.yml',
            icon: '<i class="fas fa-rocket"></i>',
            iconBg: 'linear-gradient(135deg,#10b981,#059669)',
            success: 47, failed: 3, avgTime: '2m 34s', last: '5분 전',
            steps: [
                ['Checkout repository', '3s', true],
                ['Set up Docker Buildx', '8s', true],
                ['Build & Push Docker Image', '1m 12s', true],
                ['Update Kubernetes manifests', '5s', true],
                ['ArgoCD Sync', '48s', true],
                ['Notify Slack', '3s', true]
            ]
        },
        'deploy-staging': {
            title: 'deploy-staging.yml',
            meta: 'Staging 배포 · develop 브랜치 · .github/workflows/deploy-staging.yml',
            icon: '<i class="fas fa-layer-group"></i>',
            iconBg: 'linear-gradient(135deg,#3b82f6,#2563eb)',
            success: 112, failed: 8, avgTime: '1m 58s', last: '실행 중',
            steps: [
                ['Checkout repository', '3s', true],
                ['Build Docker Image', '58s', true],
                ['Deploy to Staging', '42s', true],
                ['Run Smoke Tests', '—', false]
            ]
        },
        'rollback': {
            title: 'rollback.yml',
            meta: '롤백 자동화 · 수동 트리거 · .github/workflows/rollback.yml',
            icon: '<i class="fas fa-undo"></i>',
            iconBg: 'linear-gradient(135deg,#f59e0b,#d97706)',
            success: 5, failed: 0, avgTime: '45s', last: '3일 전',
            steps: [
                ['Checkout repository', '3s', true],
                ['ArgoCD Rollback', '38s', true],
                ['Verify Rollback', '4s', true]
            ]
        },
        'image-scan': {
            title: 'image-scan.yml',
            meta: '이미지 보안 스캔 · Trivy · .github/workflows/image-scan.yml',
            icon: '<i class="fas fa-shield-alt"></i>',
            iconBg: 'linear-gradient(135deg,#ef4444,#dc2626)',
            success: 31, failed: 9, avgTime: '1m 12s', last: '1시간 전',
            steps: [
                ['Checkout repository', '3s', true],
                ['Pull Docker Image', '22s', true],
                ['Run Trivy Scan', '31s', true],
                ['Upload SARIF Report', '—', false]
            ]
        },
        'infra-apply': {
            title: 'infra-apply.yml',
            meta: '인프라 프로비저닝 · Terraform · .github/workflows/infra-apply.yml',
            icon: '<i class="fas fa-cloud"></i>',
            iconBg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
            success: 18, failed: 2, avgTime: '4m 07s', last: '1주 전',
            steps: [
                ['Checkout repository', '3s', true],
                ['Setup Terraform', '12s', true],
                ['Terraform Init', '28s', true],
                ['Terraform Plan', '1m 04s', true],
                ['Terraform Apply', '2m 18s', true]
            ]
        },
        'notify-slack': {
            title: 'notify-slack.yml',
            meta: 'Slack 배포 알림 · 조건부 실행 · .github/workflows/notify-slack.yml',
            icon: '<i class="fab fa-slack"></i>',
            iconBg: 'linear-gradient(135deg,#64748b,#475569)',
            success: 44, failed: 0, avgTime: '8s', last: '5분 전',
            steps: [
                ['Send Slack Notification', '8s', true]
            ]
        }
    };

    var w = workflows[id];
    if (!w) return;

    document.getElementById('actionDetailTitle').textContent = w.title;
    document.getElementById('actionDetailMeta').textContent = w.meta;
    document.getElementById('actionDetailIcon').innerHTML = w.icon;
    document.getElementById('actionDetailIcon').style.background = w.iconBg;
    document.getElementById('actionStatSuccess').textContent = w.success;
    document.getElementById('actionStatFailed').textContent = w.failed;
    document.getElementById('actionStatAvgTime').textContent = w.avgTime;
    document.getElementById('actionStatLast').textContent = w.last;

    var stepsHtml = w.steps.map(function (s) {
        var icon = s[2]
            ? '<i class="fas fa-check-circle" style="color:#10b981;font-size:14px;width:16px;"></i>'
            : '<i class="fas fa-circle-notch fa-spin" style="color:#3b82f6;font-size:14px;width:16px;"></i>';
        return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #1e293b;">'
            + icon
            + '<span style="font-size:12px;color:#cbd5e1;flex:1;">' + s[0] + '</span>'
            + '<span style="font-size:11px;color:#64748b;">' + s[1] + '</span>'
            + '</div>';
    }).join('');
    document.getElementById('actionStepsList').innerHTML = stepsHtml;
}

function triggerWorkflow() {
    alert('워크플로우가 수동으로 트리거되었습니다.\n\n실행이 GitHub Actions 대기열에 추가되었습니다.');
}
