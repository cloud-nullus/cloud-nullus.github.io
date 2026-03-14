(function() {
    var ws = document.getElementById('mainWorkspace'); if (!ws) return;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="usersPage">
                <div class="list-header">
                    <div class="list-controls">
                        <button class="btn btn-primary" onclick="document.getElementById('addUserModal').style.display='flex'">
                            <i class="fas fa-user-plus"></i> <span data-i18n="users.addUser">Add User</span>
                        </button>
                    </div>
                </div>

                <div style="padding:0 24px 24px;">
                    <!-- Role Definitions -->
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
                        <div class="pipeline-card" style="padding:20px;border-top:4px solid #6366f1;">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                                <div style="width:36px;height:36px;border-radius:8px;background:#ede9fe;display:flex;align-items:center;justify-content:center;"><i class="fas fa-crown" style="color:#6366f1;"></i></div>
                                <div><div style="font-weight:700;color:#e2e8f0;" data-i18n="userRole.admin">Admin</div><div style="font-size:12px;color:#94a3b8;" data-i18n="users.fullAccess">Full access</div></div>
                            </div>
                            <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:#94a3b8;line-height:1.8;">
                                <li data-i18n="users.adminPermOrg">Organization 관리</li>
                                <li data-i18n="users.adminPermCluster">클러스터 등록/삭제</li>
                                <li data-i18n="users.adminPermStack">스택 설치/삭제</li>
                                <li data-i18n="users.adminPermUser">사용자 권한 관리</li>
                            </ul>
                        </div>
                        <div class="pipeline-card" style="padding:20px;border-top:4px solid #10b981;">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                                <div style="width:36px;height:36px;border-radius:8px;background:rgba(16,185,129,0.15);display:flex;align-items:center;justify-content:center;"><i class="fas fa-tools" style="color:#10b981;"></i></div>
                                <div><div style="font-weight:700;color:#e2e8f0;" data-i18n="userRole.devops">DevOps</div><div style="font-size:12px;color:#94a3b8;" data-i18n="users.deployConfigure">Deploy &amp; Configure</div></div>
                            </div>
                            <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:#94a3b8;line-height:1.8;">
                                <li data-i18n="users.devopsPermStack">스택 설치/수정</li>
                                <li data-i18n="users.devopsPermPipeline">파이프라인 배포</li>
                                <li data-i18n="users.devopsPermCluster">클러스터 조회</li>
                                <li data-i18n="users.devopsPermHistory">이력 조회</li>
                            </ul>
                        </div>
                        <div class="pipeline-card" style="padding:20px;border-top:4px solid #f59e0b;">
                            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                                <div style="width:36px;height:36px;border-radius:8px;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;"><i class="fas fa-eye" style="color:#f59e0b;"></i></div>
                                <div><div style="font-weight:700;color:#e2e8f0;" data-i18n="userRole.developer">Developer</div><div style="font-size:12px;color:#94a3b8;" data-i18n="users.readOnly">Read only</div></div>
                            </div>
                            <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:#94a3b8;line-height:1.8;">
                                <li data-i18n="users.developerPermStackPipeline">스택/파이프라인 조회</li>
                                <li data-i18n="users.developerPermMonitoring">모니터링 조회</li>
                                <li data-i18n="users.developerPermHistory">이력 조회</li>
                            </ul>
                        </div>
                    </div>

                    <!-- User Table -->
                    <div class="pipeline-card" style="padding:24px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                            <h3 style="margin:0;font-size:15px;color:#e2e8f0;" data-i18n="users.usersCount">Users (3)</h3>
                            <div style="display:flex;gap:8px;">
                                <input type="text" data-i18n-placeholder="users.searchUsers" placeholder="Search users..." style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;">
                                <select style="padding:8px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;">
                                    <option data-i18n="users.allRoles">All Roles</option>
                                    <option data-i18n="userRole.admin">Admin</option>
                                    <option data-i18n="userRole.devops">DevOps</option>
                                    <option data-i18n="userRole.developer">Developer</option>
                                </select>
                            </div>
                        </div>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th data-i18n="users.user">User</th>
                                    <th data-i18n="org.email">Email</th>
                                    <th class="center" data-i18n="org.role">Role</th>
                                    <th class="center" data-i18n="org.status">Status</th>
                                    <th class="center" data-i18n="users.lastLogin">Last Login</th>
                                    <th class="right" data-i18n="org.actions">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar avatar-md" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);">A</div><div><div class="bold">Admin User</div><div style="font-size:12px;color:#9ca3af;">Keycloak ID: admin-001</div></div></div></td>
                                    <td class="muted">admin@nullus.io</td>
                                    <td class="center"><span class="badge badge-purple" data-i18n="userRole.admin">Admin</span></td>
                                    <td class="center"><span class="badge badge-success" data-i18n="common.active">Active</span></td>
                                    <td class="center muted" style="font-size:13px;">2026-03-03 09:00</td>
                                    <td class="right"><span style="color:#9ca3af;font-size:12px;" data-i18n="org.owner">Owner</span></td>
                                </tr>
                                <tr>
                                    <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar avatar-md" style="background:linear-gradient(135deg,#10b981,#059669);">K</div><div><div class="bold">Kim DevOps</div><div style="font-size:12px;color:#9ca3af;">Keycloak ID: kim-002</div></div></div></td>
                                    <td class="muted">kim@nullus.io</td>
                                    <td class="center">
                                        <select style="padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:12px;background:#0f1419;" onchange="updateUserRole(this,'kim-002')">
                                            <option data-i18n="userRole.admin">Admin</option>
                                            <option selected data-i18n="userRole.devops">DevOps</option>
                                            <option data-i18n="userRole.developer">Developer</option>
                                        </select>
                                    </td>
                                    <td class="center"><span class="badge badge-success" data-i18n="common.active">Active</span></td>
                                    <td class="center muted" style="font-size:13px;">2026-03-02 16:30</td>
                                    <td class="right"><div style="display:flex;gap:6px;justify-content:flex-end;"><button class="btn btn-secondary btn-sm"><i class="fas fa-key"></i></button><button class="btn btn-secondary btn-sm" style="color:#ef4444;border-color:#fca5a5;"><i class="fas fa-user-slash"></i></button></div></td>
                                </tr>
                                <tr>
                                    <td><div style="display:flex;align-items:center;gap:10px;"><div class="avatar avatar-md" style="background:linear-gradient(135deg,#f59e0b,#d97706);">P</div><div><div class="bold">Park Developer</div><div style="font-size:12px;color:#9ca3af;">Keycloak ID: park-003</div></div></div></td>
                                    <td class="muted">park@nullus.io</td>
                                    <td class="center">
                                        <select style="padding:4px 8px;border:1px solid #2d3748;border-radius:6px;font-size:12px;background:#0f1419;" onchange="updateUserRole(this,'park-003')">
                                            <option data-i18n="userRole.admin">Admin</option>
                                            <option data-i18n="userRole.devops">DevOps</option>
                                            <option selected data-i18n="userRole.developer">Developer</option>
                                        </select>
                                    </td>
                                    <td class="center"><span class="badge badge-warning" data-i18n="org.invited">Invited</span></td>
                                    <td class="center muted" style="font-size:13px;">—</td>
                                    <td class="right"><div style="display:flex;gap:6px;justify-content:flex-end;"><button class="btn btn-secondary btn-sm"><i class="fas fa-redo"></i> <span data-i18n="org.resend">Resend</span></button><button class="btn btn-secondary btn-sm" style="color:#ef4444;border-color:#fca5a5;"><i class="fas fa-trash"></i></button></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Add User Modal -->
                <div class="inline-modal" id="addUserModal">
                    <div class="inline-modal-box" style="width:480px;">
                        <h3 style="margin:0 0 20px;color:#e2e8f0;" data-i18n="users.addNewUser"><i class="fas fa-user-plus" style="color:#6366f1;"></i> Add New User</h3>
                        <div style="display:flex;flex-direction:column;gap:14px;">
                             <div><label style="font-size:13px;font-weight:600;color:#cbd5e1;display:block;margin-bottom:6px;" data-i18n="users.name">Name</label><input type="text" data-i18n-placeholder="users.fullName" placeholder="Full name" style="width:100%;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;box-sizing:border-box;"></div>
                             <div><label style="font-size:13px;font-weight:600;color:#cbd5e1;display:block;margin-bottom:6px;" data-i18n="users.emailRequired">Email *</label><input type="email" data-i18n-placeholder="users.emailPlaceholder" placeholder="user@company.com" style="width:100%;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;box-sizing:border-box;"></div>
                             <div><label style="font-size:13px;font-weight:600;color:#cbd5e1;display:block;margin-bottom:6px;" data-i18n="users.roleRequired">Role *</label><select style="width:100%;padding:10px 12px;border:1.5px solid #2d3748;border-radius:8px;font-size:14px;background:#0f1419;"><option data-i18n="userRole.admin">Admin</option><option selected data-i18n="userRole.devops">DevOps</option><option data-i18n="userRole.developer">Developer</option></select></div>
                        </div>
                        <div class="inline-modal-footer">
                             <button class="btn btn-secondary" onclick="document.getElementById('addUserModal').style.display='none'" data-i18n="common.cancel">Cancel</button>
                             <button class="btn btn-primary"><i class="fas fa-paper-plane"></i> <span data-i18n="users.sendInvitation">Send Invitation</span></button>
                        </div>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
