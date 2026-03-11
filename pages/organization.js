(function() {
    var ws = document.getElementById('mainWorkspace'); if (!ws) return;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="organizationPage">
                <div class="list-header">
                    <div class="list-controls">
                        <button class="btn btn-primary" onclick="saveOrganization()">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:0 24px 24px;">
                    <!-- Basic Info -->
                    <div class="pipeline-card" style="padding:24px;">
                        <h3 style="margin:0 0 20px;font-size:16px;color:#e2e8f0;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-info-circle" style="color:#6366f1;"></i> <span data-i18n="org.basicInfo">Basic Information</span>
                        </h3>
                        <div style="display:flex;flex-direction:column;gap:16px;">
                            <div class="input-group">
                                <label><span data-i18n="org.orgName">Organization Name</span> <span style="color:#ef4444;">*</span></label>
                                <input type="text" id="orgName" placeholder="e.g. Acme Corp" value="Nullus DevOps Team" style="width:100%;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;">
                            </div>
                            <div class="input-group">
                                <label><span data-i18n="org.slug">Slug (URL identifier)</span> <span style="color:#ef4444;">*</span></label>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <span style="color:#9ca3af;font-size:14px;">nullus.io/</span>
                                    <input type="text" id="orgSlug" placeholder="acme-corp" value="nullus-devops" style="flex:1;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;">
                                </div>
                            </div>
                            <div class="input-group">
                                <label data-i18n="org.domain">Domain</label>
                                <input type="text" id="orgDomain" placeholder="e.g. acme.com" value="" style="width:100%;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;">
                            </div>
                            <div class="input-group">
                                <label data-i18n="org.status">Status</label>
                                <select id="orgStatus" style="width:100%;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                                    <option value="active" selected>Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label data-i18n="org.defaultAdmin">Default Admin Account</label>
                                <div style="display:flex;align-items:center;gap:8px;">
                                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;flex-shrink:0;">A</div>
                                    <input type="text" id="orgAdmin" value="admin@nullus.io" style="flex:1;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Cluster Access Scope -->
                    <div class="pipeline-card" style="padding:24px;">
                        <h3 style="margin:0 0 20px;font-size:16px;color:#e2e8f0;display:flex;align-items:center;gap:8px;">
                            <i class="fas fa-server" style="color:#6366f1;"></i> <span data-i18n="org.clusterAccess">Cluster Access Scope</span>
                        </h3>
                        <p style="font-size:13px;color:#94a3b8;margin:0 0 16px;" data-i18n="org.clusterAccessDesc">이 Organization이 접근 가능한 클러스터를 선택합니다.</p>
                        <div style="display:flex;flex-direction:column;gap:12px;" id="orgClusterList">
                            <label style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:1.5px solid #2d3748;border-radius:8px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='#e5e7eb'">
                                <input type="checkbox" checked style="width:16px;height:16px;accent-color:#6366f1;">
                                <div>
                                    <div style="font-weight:600;font-size:14px;color:#e2e8f0;">devops-cluster</div>
                                    <div style="font-size:12px;color:#94a3b8;">Pipeline Cluster · Configured</div>
                                </div>
                                <span style="margin-left:auto;padding:2px 8px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:11px;font-weight:600;">Connected</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:1.5px solid #2d3748;border-radius:8px;cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='#e5e7eb'">
                                <input type="checkbox" style="width:16px;height:16px;accent-color:#6366f1;">
                                <div>
                                    <div style="font-weight:600;font-size:14px;color:#e2e8f0;">app-cluster-prod</div>
                                    <div style="font-size:12px;color:#94a3b8;">Application Cluster · Not Configured</div>
                                </div>
                                <span style="margin-left:auto;padding:2px 8px;background:rgba(239,68,68,0.15);color:#fca5a5;border-radius:12px;font-size:11px;font-weight:600;">Disconnected</span>
                            </label>
                        </div>
                    </div>

                    <!-- Member Invite -->
                    <div class="pipeline-card" style="padding:24px;grid-column:1/-1;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
                            <h3 style="margin:0;font-size:16px;color:#e2e8f0;display:flex;align-items:center;gap:8px;">
                                <i class="fas fa-user-plus" style="color:#6366f1;"></i> <span data-i18n="org.memberMgmt">Member Management</span>
                            </h3>
                            <button class="btn btn-primary btn-sm" onclick="document.getElementById('inviteMemberRow').style.display='flex'">
                                <i class="fas fa-plus"></i> <span data-i18n="org.inviteMember">Invite Member</span>
                            </button>
                        </div>

                        <!-- Invite row (hidden by default) -->
                        <div id="inviteMemberRow" style="display:none;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:#f0f4ff;border:1.5px solid #c7d2fe;border-radius:8px;">
                            <input type="email" placeholder="Email address" style="flex:1;padding:10px 12px;border:1.5px solid #c7d2fe;border-radius:8px;font-size:14px;">
                            <select style="padding:10px 12px;border:1.5px solid #c7d2fe;border-radius:8px;font-size:14px;background:#0f1419;">
                                <option data-i18n="userRole.admin">Admin</option>
                                <option selected data-i18n="userRole.devops">DevOps</option>
                                <option data-i18n="userRole.developer">Developer</option>
                            </select>
                            <button class="btn btn-primary btn-sm"><i class="fas fa-paper-plane"></i> <span data-i18n="org.sendInvite">Send Invite</span></button>
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('inviteMemberRow').style.display='none'"><i class="fas fa-times"></i></button>
                        </div>

                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <thead>
                                <tr style="border-bottom:2px solid #f3f4f6;">
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="org.member">Member</th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="org.email">Email</th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="org.role">Role</th>
                                    <th style="text-align:left;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="org.status">Status</th>
                                    <th style="text-align:right;padding:10px 12px;color:#94a3b8;font-weight:600;" data-i18n="org.actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="memberTableBody">
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;">A</div><span style="font-weight:600;color:#e2e8f0;">Admin User</span></div></td>
                                    <td style="padding:12px;color:#94a3b8;">admin@nullus.io</td>
                                    <td style="padding:12px;"><span style="padding:3px 10px;background:#ede9fe;color:#5b21b6;border-radius:12px;font-size:12px;font-weight:600;">Admin</span></td>
                                    <td style="padding:12px;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;">Active</span></td>
                                    <td style="padding:12px;text-align:right;"><span style="color:#9ca3af;font-size:12px;" data-i18n="org.owner">Owner</span></td>
                                </tr>
                                <tr style="border-bottom:1px solid #2d3748;">
                                    <td style="padding:12px;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;">K</div><span style="font-weight:600;color:#e2e8f0;">Kim DevOps</span></div></td>
                                    <td style="padding:12px;color:#94a3b8;">kim@nullus.io</td>
                                    <td style="padding:12px;"><select style="padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:12px;background:#0f1419;"><option data-i18n="userRole.admin">Admin</option><option selected data-i18n="userRole.devops">DevOps</option><option data-i18n="userRole.developer">Developer</option></select></td>
                                    <td style="padding:12px;"><span style="padding:3px 10px;background:rgba(16,185,129,0.15);color:#6ee7b7;border-radius:12px;font-size:12px;font-weight:600;">Active</span></td>
                                    <td style="padding:12px;text-align:right;"><button class="btn btn-secondary btn-sm"><i class="fas fa-user-slash"></i> <span data-i18n="org.deactivate">Deactivate</span></button></td>
                                </tr>
                                <tr>
                                    <td style="padding:12px;"><div style="display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;">P</div><span style="font-weight:600;color:#e2e8f0;">Park Developer</span></div></td>
                                    <td style="padding:12px;color:#94a3b8;">park@nullus.io</td>
                                    <td style="padding:12px;"><select style="padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:12px;background:#0f1419;"><option data-i18n="userRole.admin">Admin</option><option data-i18n="userRole.devops">DevOps</option><option selected data-i18n="userRole.developer">Developer</option></select></td>
                                    <td style="padding:12px;"><span style="padding:3px 10px;background:rgba(245,158,11,0.15);color:#fcd34d;border-radius:12px;font-size:12px;font-weight:600;" data-i18n="org.invited">Invited</span></td>
                                    <td style="padding:12px;text-align:right;"><button class="btn btn-secondary btn-sm"><i class="fas fa-redo"></i> <span data-i18n="org.resend">Resend</span></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
