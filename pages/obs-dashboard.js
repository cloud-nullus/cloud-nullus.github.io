(function() {
    var ws = document.body;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="monitoringPage">
                <div class="list-header">
                    <div class="list-controls">
                        <select style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                            <option data-i18n="monitoring.last1h">Last 1 hour</option>
                            <option selected data-i18n="monitoring.last24h">Last 24 hours</option>
                            <option data-i18n="monitoring.last7d">Last 7 days</option>
                        </select>
                        <button class="btn btn-secondary" style="margin-left:8px;"><i class="fas fa-bell"></i> Alert Config</button>
                    </div>
                </div>

                <div style="padding:0 24px 24px;">
                    <!-- Cluster Overview -->
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div class="stat-card-value" style="color:#6366f1;">68<span class="stat-card-unit">%</span></div>
                            <div class="stat-card-label"><i class="fas fa-microchip" style="color:#6366f1;"></i> <span data-i18n="monitoring.cpuUsage">CPU Usage</span></div>
                            <div class="stat-card-bar-track"><div class="stat-card-bar" style="width:68%;background:#6366f1;"></div></div>
                        </div>
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div class="stat-card-value" style="color:#10b981;">42<span class="stat-card-unit">%</span></div>
                            <div class="stat-card-label"><i class="fas fa-memory" style="color:#10b981;"></i> <span data-i18n="monitoring.memUsage">Memory Usage</span></div>
                            <div class="stat-card-bar-track"><div class="stat-card-bar" style="width:42%;background:#10b981;"></div></div>
                        </div>
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div class="stat-card-value" style="color:#f59e0b;">31<span class="stat-card-unit">%</span></div>
                            <div class="stat-card-label"><i class="fas fa-hdd" style="color:#f59e0b;"></i> <span data-i18n="monitoring.storageUsage">Storage Usage</span></div>
                            <div class="stat-card-bar-track"><div class="stat-card-bar" style="width:31%;background:#f59e0b;"></div></div>
                        </div>
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div class="stat-card-value" style="color:#059669;">97.3<span class="stat-card-unit">%</span></div>
                            <div class="stat-card-label"><i class="fas fa-check-circle" style="color:#059669;"></i> <span data-i18n="monitoring.pipelineSuccessRate">Pipeline Success Rate</span></div>
                            <div class="stat-card-bar-track"><div class="stat-card-bar" style="width:97.3%;background:#059669;"></div></div>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;">
                        <!-- Pipeline Runs Chart (simulated with bars) -->
                        <div class="pipeline-card" style="padding:24px;">
                            <h3 style="margin:0 0 20px;font-size:15px;color:#e2e8f0;" data-i18n="monitoring.pipelineRuns">Pipeline Runs (Last 24h)</h3>
                            <div style="display:flex;align-items:flex-end;gap:8px;height:120px;">
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="80%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">00</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="45%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">02</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="30%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">04</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="60%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">06</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="95%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">08</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="100%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">10</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#ef4444;border-radius:4px 4px 0 0;" data-bar="70%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">12</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="88%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">14</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="75%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">16</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="92%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">18</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="55%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">20</span>
                                </div>
                                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">
                                    <div style="width:100%;background:#6366f1;border-radius:4px 4px 0 0;" data-bar="40%"></div>
                                    <span style="font-size:10px;color:#9ca3af;">22</span>
                                </div>
                            </div>
                            <div style="display:flex;gap:16px;margin-top:12px;font-size:12px;">
                                <span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:2px;background:#6366f1;display:inline-block;"></span><span data-i18n="monitoring.success">Success</span></span>
                                <span style="display:flex;align-items:center;gap:4px;"><span style="width:12px;height:12px;border-radius:2px;background:#ef4444;display:inline-block;"></span><span data-i18n="monitoring.failed">Failed</span></span>
                            </div>
                        </div>

                        <!-- Alert Config -->
                        <div class="pipeline-card" style="padding:24px;">
                            <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;">Alert Configuration</h3>
                            <div style="display:flex;flex-direction:column;gap:12px;">
                                <label class="alert-channel-item">
                                    <div><div class="channel-title">Slack</div><div class="channel-desc">#devops-alerts</div></div>
                                    <div style="position:relative;width:44px;height:24px;"><input type="checkbox" checked style="opacity:0;width:0;height:0;" id="slackToggle"><label for="slackToggle" style="position:absolute;inset:0;background:#6366f1;border-radius:12px;cursor:pointer;"></label><span style="position:absolute;top:4px;right:4px;width:16px;height:16px;background:#0f1419;border-radius:50%;"></span></div>
                                </label>
                                <label class="alert-channel-item">
                                    <div><div class="channel-title">Email</div><div class="channel-desc">admin@nullus.io</div></div>
                                    <div style="position:relative;width:44px;height:24px;"><input type="checkbox" style="opacity:0;width:0;height:0;" id="emailToggle"><label for="emailToggle" style="position:absolute;inset:0;background:#e5e7eb;border-radius:12px;cursor:pointer;"></label><span style="position:absolute;top:4px;left:4px;width:16px;height:16px;background:#0f1419;border-radius:50%;"></span></div>
                                </label>
                                <div class="alert-threshold-box">
                                    <div class="alert-threshold-title">Alert Thresholds</div>
                                    <div style="display:flex;flex-direction:column;gap:8px;">
                                        <div class="alert-threshold-row"><span style="color:#94a3b8;">CPU &gt;</span><input type="number" value="80" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;"><span style="color:#94a3b8;">%</span></div>
                                        <div class="alert-threshold-row"><span style="color:#94a3b8;">Memory &gt;</span><input type="number" value="85" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;"><span style="color:#94a3b8;">%</span></div>
                                        <div class="alert-threshold-row"><span style="color:#94a3b8;">Pipeline Fail Rate &gt;</span><input type="number" value="10" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;"><span style="color:#94a3b8;">%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Application Status Table -->
                    <div class="pipeline-card" style="margin-top:24px;padding:24px;">
                        <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;" data-i18n="monitoring.appStatus">Application Status</h3>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th data-i18n="monitoring.app">App</th>
                                    <th>Namespace</th>
                                    <th class="center">CPU</th>
                                    <th class="center">Memory</th>
                                    <th class="center" data-i18n="monitoring.pods">Pods</th>
                                    <th class="center" data-i18n="org.status">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="bold"><i class="fab fa-react" style="color:#61dafb;"></i> frontend-app</td>
                                    <td class="muted">production</td>
                                    <td class="center" style="color:#6366f1;font-weight:600;">0.3 cores</td>
                                    <td class="center" style="color:#10b981;font-weight:600;">256 Mi</td>
                                    <td class="center">3/3</td>
                                    <td class="center"><span class="badge badge-success" data-i18n="monitoring.healthy">Healthy</span></td>
                                </tr>
                                <tr>
                                    <td class="bold"><i class="fas fa-server" style="color:#6366f1;"></i> api-service</td>
                                    <td class="muted">production</td>
                                    <td class="center" style="color:#f59e0b;font-weight:600;">1.8 cores</td>
                                    <td class="center" style="color:#10b981;font-weight:600;">512 Mi</td>
                                    <td class="center">5/5</td>
                                    <td class="center"><span class="badge badge-success" data-i18n="monitoring.healthy">Healthy</span></td>
                                </tr>
                                <tr>
                                    <td class="bold"><i class="fas fa-database" style="color:#f59e0b;"></i> batch-worker</td>
                                    <td class="muted">staging</td>
                                    <td class="center" style="color:#ef4444;font-weight:600;">3.2 cores</td>
                                    <td class="center" style="color:#f59e0b;font-weight:600;">1.8 Gi</td>
                                    <td class="center">2/3</td>
                                    <td class="center"><span class="badge badge-warning" data-i18n="monitoring.degraded">Degraded</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
