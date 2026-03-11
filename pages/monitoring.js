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
                            <div style="font-size:28px;font-weight:700;color:#6366f1;">68<span style="font-size:16px;color:#9ca3af;">%</span></div>
                            <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-microchip" style="color:#6366f1;"></i> <span data-i18n="monitoring.cpuUsage">CPU Usage</span></div>
                            <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:68%;background:#6366f1;border-radius:99px;"></div></div>
                        </div>
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div style="font-size:28px;font-weight:700;color:#10b981;">42<span style="font-size:16px;color:#9ca3af;">%</span></div>
                            <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-memory" style="color:#10b981;"></i> <span data-i18n="monitoring.memUsage">Memory Usage</span></div>
                            <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:42%;background:#10b981;border-radius:99px;"></div></div>
                        </div>
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div style="font-size:28px;font-weight:700;color:#f59e0b;">31<span style="font-size:16px;color:#9ca3af;">%</span></div>
                            <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-hdd" style="color:#f59e0b;"></i> <span data-i18n="monitoring.storageUsage">Storage Usage</span></div>
                            <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:31%;background:#f59e0b;border-radius:99px;"></div></div>
                        </div>
                        <div class="pipeline-card" style="padding:20px;text-align:center;">
                            <div style="font-size:28px;font-weight:700;color:#059669;">97.3<span style="font-size:14px;color:#9ca3af;">%</span></div>
                            <div style="font-size:13px;color:#94a3b8;margin-top:4px;"><i class="fas fa-check-circle" style="color:#059669;"></i> <span data-i18n="monitoring.pipelineSuccessRate">Pipeline Success Rate</span></div>
                            <div style="height:6px;background:#e5e7eb;border-radius:99px;margin-top:10px;"><div style="height:6px;width:97.3%;background:#059669;border-radius:99px;"></div></div>
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
                                <label style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1.5px solid #2d3748;border-radius:8px;cursor:pointer;">
                                    <div><div style="font-weight:600;font-size:13px;color:#e2e8f0;">Slack</div><div style="font-size:12px;color:#94a3b8;">#devops-alerts</div></div>
                                    <div style="position:relative;width:44px;height:24px;"><input type="checkbox" checked style="opacity:0;width:0;height:0;" id="slackToggle"><label for="slackToggle" style="position:absolute;inset:0;background:#6366f1;border-radius:12px;cursor:pointer;"></label><span style="position:absolute;top:4px;right:4px;width:16px;height:16px;background:#0f1419;border-radius:50%;"></span></div>
                                </label>
                                <label style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1.5px solid #2d3748;border-radius:8px;cursor:pointer;">
                                    <div><div style="font-weight:600;font-size:13px;color:#e2e8f0;">Email</div><div style="font-size:12px;color:#94a3b8;">admin@nullus.io</div></div>
                                    <div style="position:relative;width:44px;height:24px;"><input type="checkbox" style="opacity:0;width:0;height:0;" id="emailToggle"><label for="emailToggle" style="position:absolute;inset:0;background:#e5e7eb;border-radius:12px;cursor:pointer;"></label><span style="position:absolute;top:4px;left:4px;width:16px;height:16px;background:#0f1419;border-radius:50%;"></span></div>
                                </label>
                                <div style="padding:12px;border:1.5px solid #2d3748;border-radius:8px;">
                                    <div style="font-weight:600;font-size:13px;color:#e2e8f0;margin-bottom:8px;">Alert Thresholds</div>
                                    <div style="display:flex;flex-direction:column;gap:8px;">
                                        <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;"><span style="color:#94a3b8;">CPU &gt;</span><input type="number" value="80" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;"><span style="color:#94a3b8;">%</span></div>
                                        <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;"><span style="color:#94a3b8;">Memory &gt;</span><input type="number" value="85" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;"><span style="color:#94a3b8;">%</span></div>
                                        <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;"><span style="color:#94a3b8;">Pipeline Fail Rate &gt;</span><input type="number" value="10" style="width:60px;padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:13px;text-align:center;"><span style="color:#94a3b8;">%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Application Status Table -->
                    <div class="pipeline-card" style="margin-top:24px;padding:24px;">
                        <h3 style="margin:0 0 16px;font-size:15px;color:#e2e8f0;" data-i18n="monitoring.appStatus">Application Status</h3>
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <thead>
                                <tr style="border-bottom:2px solid #f3f4f6;">
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="monitoring.app">App</th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;">Namespace</th>
                                    <th style="text-align:center;padding:10px 12px;color:#94a3b8;font-weight:600;">CPU</th>
                                    <th style="text-align:center;padding:10px 12px;color:#94a3b8;font-weight:600;">Memory</th>
                                    <th style="text-align:center;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="monitoring.pods">Pods</th>
                                    <th style="text-align:center;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="org.status">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px;font-weight:600;color:#e2e8f0;"><i class="fab fa-react" style="color:#61dafb;"></i> frontend-app</td>
                                    <td style="padding:12px;color:#94a3b8;">production</td>
                                    <td style="padding:12px;text-align:center;color:#6366f1;font-weight:600;">0.3 cores</td>
                                    <td style="padding:12px;text-align:center;color:#10b981;font-weight:600;">256 Mi</td>
                                    <td style="padding:12px;text-align:center;">3/3</td>
                                    <td style="padding:12px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;" data-i18n="monitoring.healthy">Healthy</span></td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px;font-weight:600;color:#e2e8f0;"><i class="fas fa-server" style="color:#6366f1;"></i> api-service</td>
                                    <td style="padding:12px;color:#94a3b8;">production</td>
                                    <td style="padding:12px;text-align:center;color:#f59e0b;font-weight:600;">1.8 cores</td>
                                    <td style="padding:12px;text-align:center;color:#10b981;font-weight:600;">512 Mi</td>
                                    <td style="padding:12px;text-align:center;">5/5</td>
                                    <td style="padding:12px;text-align:center;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;" data-i18n="monitoring.healthy">Healthy</span></td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;font-weight:600;color:#e2e8f0;"><i class="fas fa-database" style="color:#f59e0b;"></i> batch-worker</td>
                                    <td style="padding:12px;color:#94a3b8;">staging</td>
                                    <td style="padding:12px;text-align:center;color:#ef4444;font-weight:600;">3.2 cores</td>
                                    <td style="padding:12px;text-align:center;color:#f59e0b;font-weight:600;">1.8 Gi</td>
                                    <td style="padding:12px;text-align:center;">2/3</td>
                                    <td style="padding:12px;text-align:center;"><span style="padding:3px 10px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:12px;font-size:12px;font-weight:600;" data-i18n="monitoring.degraded">Degraded</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
