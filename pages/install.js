(function() {
    var ws = document.getElementById('mainWorkspace');
    if (!ws) return;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content active" id="installPage">
                <!-- Left Panel: Configuration -->
                <div class="config-section">
                <!-- Resource Allocation Compare (moved to top) -->
                <div class="install-resource-compare" id="installResourceCompare">
                    <div class="install-resource-compare-head">
                        <h3><i class="fas fa-balance-scale"></i> Resource Allocation Compare</h3>
                        <p>현재 보유 자원과 선택한 구성의 필요 자원을 즉시 비교합니다.</p>
                    </div>
                    <div class="install-resource-compare-grid">
                        <div class="compare-card available">
                            <h4>Available</h4>
                            <div class="compare-row"><span>CPU</span><strong id="availableCpu">32</strong></div>
                            <div class="compare-row"><span>Memory (Gi)</span><strong id="availableMemory">128</strong></div>
                            <div class="compare-row"><span>Storage (Gi)</span><strong id="availableStorage">1200</strong></div>
                        </div>
                        <div class="compare-card required">
                            <h4>Required</h4>
                            <div class="compare-row"><span>CPU</span><strong id="requiredCpu">8</strong></div>
                            <div class="compare-row"><span>Memory (Gi)</span><strong id="requiredMemory">32</strong></div>
                            <div class="compare-row"><span>Storage (Gi)</span><strong id="requiredStorage">500</strong></div>
                        </div>
                        <div class="compare-card remaining" id="remainingCompareCard">
                            <h4>Remaining</h4>
                            <div class="compare-row"><span>CPU</span><strong id="remainingCpu">24</strong></div>
                            <div class="compare-row"><span>Memory (Gi)</span><strong id="remainingMemory">96</strong></div>
                            <div class="compare-row"><span>Storage (Gi)</span><strong id="remainingStorage">700</strong></div>
                        </div>
                    </div>
                </div>

                <!-- Configuration Tabs -->

                <div class="config-tabs">
                    <div class="tab active" data-tab="artifacts">
                        <i class="fas fa-box"></i>
                        <span>Artifacts</span>
                    </div>
                    <div class="tab" data-tab="pipeline">
                        <i class="fas fa-project-diagram"></i>
                        <span>Pipeline Tools</span>
                    </div>
                    <div class="tab" data-tab="monitoring">
                        <i class="fas fa-chart-line"></i>
                        <span>Monitoring Tools</span>
                    </div>
                    <div class="tab" data-tab="logging">
                        <i class="fas fa-file-alt"></i>
                        <span>Logging Tools</span>
                    </div>
                    <div class="tab" data-tab="resources">
                        <i class="fas fa-server"></i>
                        <span>Resources</span>
                    </div>
                    <div class="tab" data-tab="clusters">
                        <i class="fas fa-network-wired"></i>
                        <span>Cluster Configurations</span>
                    </div>
                </div>

        <!-- Configuration Panels -->
        <div class="config-panels">
            <!-- Artifacts Panel -->
            <div class="panel artifacts-panel" id="artifactsPanel">
                <div class="panel-header">
                    <h3>Artifact Configuration</h3>
                    <p>Configure your artifact repositories and storage backends</p>
                </div>
                
                <div class="config-grid">
                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-archive"></i>
                            <h4>Package Registry</h4>
                        </div>
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="packageRegistry" value="gitlab" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">GitLab Package Registry</span>
                                            <span class="tool-desc">Default integrated solution</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="gitlab-registry">
                                                <option value="16.7">v16.7 (Latest)</option>
                                                <option value="16.6">v16.6</option>
                                                <option value="16.5">v16.5</option>
                                                <option value="15.11">v15.11 (LTS)</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="gitlab-registry">-</button>
                                                <input type="number" class="instance-count" data-tool="gitlab-registry" value="1" min="1" max="3">
                                                <button type="button" class="instance-btn increase" data-tool="gitlab-registry">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different environments or package types"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="packageRegistry" value="nexus">
                                        <div class="tool-info">
                                            <span class="tool-title">Nexus Repository</span>
                                            <span class="tool-desc">Enterprise artifact management</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="nexus" disabled>
                                                <option value="3.45.0">v3.45.0 (Latest)</option>
                                                <option value="3.44.0">v3.44.0</option>
                                                <option value="3.43.0">v3.43.0</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="nexus">-</button>
                                                <input type="number" class="instance-count" data-tool="nexus" value="1" min="1" max="5">
                                                <button type="button" class="instance-btn increase" data-tool="nexus">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different artifact types or environments (Maven, NPM, Docker repositories)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="packageRegistry" value="jfrog">
                                        <div class="tool-info">
                                            <span class="tool-title">JFrog Artifactory</span>
                                            <span class="tool-desc">Universal artifact repository</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="jfrog" disabled>
                                                <option value="7.77.8">v7.77.8 (Latest)</option>
                                                <option value="7.76.11">v7.76.11</option>
                                                <option value="7.75.11">v7.75.11</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="jfrog">-</button>
                                                <input type="number" class="instance-count" data-tool="jfrog" value="1" min="1" max="3">
                                                <button type="button" class="instance-btn increase" data-tool="jfrog">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different teams or geographic regions"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="packageRegistry" value="harbor">
                                        <div class="tool-info">
                                            <span class="tool-title">Harbor</span>
                                            <span class="tool-desc">Cloud native registry</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="harbor" disabled>
                                                <option value="2.10.0">v2.10.0 (Latest)</option>
                                                <option value="2.9.1">v2.9.1</option>
                                                <option value="2.8.6">v2.8.6</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="harbor">-</button>
                                                <input type="number" class="instance-count" data-tool="harbor" value="1" min="1" max="5">
                                                <button type="button" class="instance-btn increase" data-tool="harbor">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for HA setup or different security policies"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-code-branch"></i>
                            <h4>Source Code Repository</h4>
                        </div>
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="sourceRepo" value="gitlab" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">GitLab</span>
                                            <span class="tool-desc">Integrated DevOps platform</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="gitlab">
                                            <option value="16.7">v16.7 (Latest)</option>
                                            <option value="16.6">v16.6</option>
                                            <option value="15.11">v15.11 (LTS)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="sourceRepo" value="github">
                                        <div class="tool-info">
                                            <span class="tool-title">GitHub</span>
                                            <span class="tool-desc">World's largest code host</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="github" disabled>
                                            <option value="enterprise-3.11">Enterprise 3.11</option>
                                            <option value="enterprise-3.10">Enterprise 3.10</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="sourceRepo" value="gitea">
                                        <div class="tool-info">
                                            <span class="tool-title">Gitea</span>
                                            <span class="tool-desc">Lightweight self-hosted Git</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="gitea" disabled>
                                                <option value="1.21.4">v1.21.4 (Latest)</option>
                                                <option value="1.21.3">v1.21.3</option>
                                                <option value="1.20.6">v1.20.6</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="gitea">-</button>
                                                <input type="number" class="instance-count" data-tool="gitea" value="1" min="1" max="3">
                                                <button type="button" class="instance-btn increase" data-tool="gitea">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different organizations or environments"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="sourceRepo" value="bitbucket">
                                        <div class="tool-info">
                                            <span class="tool-title">Bitbucket</span>
                                            <span class="tool-desc">Atlassian Git solution</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="bitbucket" disabled>
                                            <option value="8.17">v8.17 (Latest)</option>
                                            <option value="8.16">v8.16</option>
                                            <option value="8.15">v8.15</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="config-card">
                        <div class="card-header">
                            <i class="fab fa-docker"></i>
                            <h4>Container Registry</h4>
                        </div>
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="imageRegistry" value="gitlab" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">GitLab Container Registry</span>
                                            <span class="tool-desc">Built-in container registry</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="gitlab-registry">
                                            <option value="16.7">v16.7 (Latest)</option>
                                            <option value="16.6">v16.6</option>
                                            <option value="15.11">v15.11 (LTS)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="imageRegistry" value="harbor">
                                        <div class="tool-info">
                                            <span class="tool-title">Harbor</span>
                                            <span class="tool-desc">Open source registry</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="harbor-registry" disabled>
                                                <option value="2.10.0">v2.10.0 (Latest)</option>
                                                <option value="2.9.1">v2.9.1</option>
                                                <option value="2.8.6">v2.8.6</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="harbor-registry">-</button>
                                                <input type="number" class="instance-count" data-tool="harbor-registry" value="1" min="1" max="5">
                                                <button type="button" class="instance-btn increase" data-tool="harbor-registry">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different environments or security zones"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="imageRegistry" value="dockerhub">
                                        <div class="tool-info">
                                            <span class="tool-title">Docker Hub</span>
                                            <span class="tool-desc">Public container registry</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="dockerhub" disabled>
                                            <option value="latest">Latest</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="imageRegistry" value="ecr">
                                        <div class="tool-info">
                                            <span class="tool-title">Amazon ECR</span>
                                            <span class="tool-desc">AWS managed registry</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="ecr" disabled>
                                            <option value="latest">Latest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-hdd"></i>
                            <h4>Storage Backend</h4>
                        </div>
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="storage" value="s3" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">AWS S3</span>
                                            <span class="tool-desc">Scalable object storage</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="s3">
                                            <option value="latest">Latest API</option>
                                            <option value="2006-03-01">API 2006-03-01</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="storage" value="minio">
                                        <div class="tool-info">
                                            <span class="tool-title">MinIO</span>
                                            <span class="tool-desc">High performance object storage</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="minio" disabled>
                                                <option value="2024.1.16">2024.1.16 (Latest)</option>
                                                <option value="2023.12.23">2023.12.23</option>
                                                <option value="2023.11.20">2023.11.20</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="minio">-</button>
                                                <input type="number" class="instance-count" data-tool="minio" value="1" min="1" max="8">
                                                <button type="button" class="instance-btn increase" data-tool="minio">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for distributed setup or different storage tiers"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="storage" value="gcs">
                                        <div class="tool-info">
                                            <span class="tool-title">Google Cloud Storage</span>
                                            <span class="tool-desc">Google's object storage</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="gcs" disabled>
                                            <option value="v1">API v1 (Latest)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="storage" value="azure">
                                        <div class="tool-info">
                                            <span class="tool-title">Azure Blob Storage</span>
                                            <span class="tool-desc">Microsoft's object storage</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="azure" disabled>
                                            <option value="2023-11-03">2023-11-03 (Latest)</option>
                                            <option value="2023-08-03">2023-08-03</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pipeline Tools Panel -->
            <div class="panel pipeline-panel" id="pipelinePanel">
                <div class="panel-header">
                    <h3>Pipeline Tools Configuration</h3>
                    <p>Configure your CI/CD pipeline and deployment tools</p>
                </div>
                
                <div class="config-grid">
                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-project-diagram"></i>
                            <h4>CI/CD Platform</h4>
                        </div>
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="mainPipeline" value="gitlab" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">GitLab CI/CD</span>
                                            <span class="tool-desc">Integrated DevOps platform with built-in CI/CD</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="gitlab-ci">
                                                <option value="16.7">v16.7 (Latest)</option>
                                                <option value="16.6">v16.6</option>
                                                <option value="15.11">v15.11 (LTS)</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="gitlab-ci">-</button>
                                                <input type="number" class="instance-count" data-tool="gitlab-ci" value="1" min="1" max="4">
                                                <button type="button" class="instance-btn increase" data-tool="gitlab-ci">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different organizations or high-availability setup"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="mainPipeline" value="github">
                                        <div class="tool-info">
                                            <span class="tool-title">GitHub Actions</span>
                                            <span class="tool-desc">Native CI/CD for GitHub repositories</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="github-actions" disabled>
                                                <option value="v4">Actions v4 (Latest)</option>
                                                <option value="v3">Actions v3</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Runners:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="github-actions">-</button>
                                                <input type="number" class="instance-count" data-tool="github-actions" value="1" min="1" max="10">
                                                <button type="button" class="instance-btn increase" data-tool="github-actions">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Number of self-hosted runners for parallel job execution"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="mainPipeline" value="jenkins">
                                        <div class="tool-info">
                                            <span class="tool-title">Jenkins</span>
                                            <span class="tool-desc">Open source automation server</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="jenkins" disabled>
                                                <option value="2.440.1">v2.440.1 (LTS)</option>
                                                <option value="2.439">v2.439</option>
                                                <option value="2.426.3">v2.426.3</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="jenkins">-</button>
                                                <input type="number" class="instance-count" data-tool="jenkins" value="1" min="1" max="5">
                                                <button type="button" class="instance-btn increase" data-tool="jenkins">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different teams or high-availability setup"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="mainPipeline" value="circleci">
                                        <div class="tool-info">
                                            <span class="tool-title">CircleCI</span>
                                            <span class="tool-desc">Cloud-native CI/CD platform</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="circleci" disabled>
                                            <option value="2.1">Config 2.1 (Latest)</option>
                                            <option value="2.0">Config 2.0</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-rocket"></i>
                            <h4>Continuous Deployment</h4>
                        </div>
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="cdTool" value="argocd" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">Argo CD</span>
                                            <span class="tool-desc">Declarative GitOps CD for Kubernetes</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="argocd">
                                                <option value="2.9.3">v2.9.3 (Latest)</option>
                                                <option value="2.8.7">v2.8.7</option>
                                                <option value="2.7.17">v2.7.17</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="argocd">-</button>
                                                <input type="number" class="instance-count" data-tool="argocd" value="1" min="1" max="3">
                                                <button type="button" class="instance-btn increase" data-tool="argocd">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different environments or HA setup"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="cdTool" value="flux">
                                        <div class="tool-info">
                                            <span class="tool-title">Flux</span>
                                            <span class="tool-desc">GitOps toolkit for Kubernetes</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="flux" disabled>
                                                <option value="2.2.2">v2.2.2 (Latest)</option>
                                                <option value="2.1.2">v2.1.2</option>
                                                <option value="2.0.1">v2.0.1</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="flux">-</button>
                                                <input type="number" class="instance-count" data-tool="flux" value="1" min="1" max="3">
                                                <button type="button" class="instance-btn increase" data-tool="flux">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different clusters or namespaces"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="cdTool" value="spinnaker">
                                        <div class="tool-info">
                                            <span class="tool-title">Spinnaker</span>
                                            <span class="tool-desc">Multi-cloud deployment platform</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="spinnaker" disabled>
                                                <option value="1.32.3">v1.32.3 (Latest)</option>
                                                <option value="1.31.4">v1.31.4</option>
                                                <option value="1.30.4">v1.30.4</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="spinnaker">-</button>
                                                <input type="number" class="instance-count" data-tool="spinnaker" value="1" min="1" max="2">
                                                <button type="button" class="instance-btn increase" data-tool="spinnaker">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different cloud providers or regions"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="cdTool" value="tekton">
                                        <div class="tool-info">
                                            <span class="tool-title">Tekton</span>
                                            <span class="tool-desc">Cloud-native CI/CD building blocks</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="tekton" disabled>
                                                <option value="0.56.0">v0.56.0 (Latest)</option>
                                                <option value="0.55.0">v0.55.0</option>
                                                <option value="0.54.0">v0.54.0</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="tekton">-</button>
                                                <input type="number" class="instance-count" data-tool="tekton" value="1" min="1" max="4">
                                                <button type="button" class="instance-btn increase" data-tool="tekton">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different pipeline controllers or namespaces"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Monitoring Tools Panel (Collection | Query & Visualization) -->
            <div class="panel monitoring-panel" id="monitoringPanel">
                <div class="panel-header">
                    <h3>Monitoring Tools Configuration</h3>
                    <p>Configure monitoring and observability tools for your pipeline</p>
                </div>
                <div class="collection-query-grid">
                    <div class="config-card collection-panel">
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="monitoringCollection" value="prometheus" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">Prometheus</span>
                                            <span class="tool-desc">Metrics collection and alerting</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="prometheus">
                                                <option value="2.47">v2.47 (Latest)</option>
                                                <option value="2.46">v2.46</option>
                                                <option value="2.45">v2.45</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="prometheus">-</button>
                                                <input type="number" class="instance-count" data-tool="prometheus" value="1" min="1" max="10">
                                                <button type="button" class="instance-btn increase" data-tool="prometheus">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for HA setup or different purposes (e.g., application metrics vs infrastructure metrics)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="monitoringCollection" value="thanos">
                                        <div class="tool-info">
                                            <span class="tool-title">Thanos</span>
                                            <span class="tool-desc">Long-term metrics storage</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="thanos" disabled>
                                                <option value="0.32">v0.32 (Latest)</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="thanos">-</button>
                                                <input type="number" class="instance-count" data-tool="thanos" value="1" min="1" max="6">
                                                <button type="button" class="instance-btn increase" data-tool="thanos">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different components (sidecar, store, query, compactor)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="config-card query-panel">
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="monitoringQuery" value="grafana" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">Grafana</span>
                                            <span class="tool-desc">Visualization and dashboards</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="grafana">
                                                <option value="10.2">v10.2 (Latest)</option>
                                                <option value="10.1">v10.1</option>
                                                <option value="10.0">v10.0 (LTS)</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="grafana">-</button>
                                                <input type="number" class="instance-count" data-tool="grafana" value="1" min="1" max="5">
                                                <button type="button" class="instance-btn increase" data-tool="grafana">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different teams or environments (dev/staging/prod dashboards)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="monitoringQuery" value="datadog">
                                        <div class="tool-info">
                                            <span class="tool-title">Datadog</span>
                                            <span class="tool-desc">Full-stack monitoring</span>
                                        </div>
                                    </label>
                                    <div class="version-selector">
                                        <select class="version-dropdown" data-tool="datadog" disabled>
                                            <option value="latest">Latest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Logging Tools Panel (Collection | Query & Search) -->
            <div class="panel logging-panel" id="loggingPanel">
                <div class="panel-header">
                    <h3>Logging Tools Configuration</h3>
                    <p>Configure logging and log aggregation for your pipeline</p>
                </div>
                <div class="collection-query-grid">
                    <div class="config-card collection-panel">
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="loggingCollection" value="opentelemetry" checked>
                                        <div class="tool-info">
                                            <span class="tool-title">OpenTelemetry</span>
                                            <span class="tool-desc">Observability data collection (traces, logs, metrics)</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="opentelemetry">
                                                <option value="1.0">v1.0 (Latest)</option>
                                                <option value="0.91">v0.91</option>
                                                <option value="0.90">v0.90</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Collectors:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="opentelemetry">-</button>
                                                <input type="number" class="instance-count" data-tool="opentelemetry" value="1" min="1" max="6">
                                                <button type="button" class="instance-btn increase" data-tool="opentelemetry">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple collectors for different data types or environments (traces, metrics, logs)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="loggingCollection" value="loki">
                                        <div class="tool-info">
                                            <span class="tool-title">Loki</span>
                                            <span class="tool-desc">Log aggregation by Grafana Labs</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="loki" disabled>
                                                <option value="2.9">v2.9 (Latest)</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="loki">-</button>
                                                <input type="number" class="instance-count" data-tool="loki" value="1" min="1" max="5">
                                                <button type="button" class="instance-btn increase" data-tool="loki">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for different log sources or environments"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="config-card query-panel">
                        <div class="card-content">
                            <div class="tool-selection-group">
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="logging" value="opensearch">
                                        <div class="tool-info">
                                            <span class="tool-title">OpenSearch</span>
                                            <span class="tool-desc">Search and analytics for log data</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="opensearch">
                                                <option value="2.11">v2.11 (Latest)</option>
                                                <option value="2.10">v2.10</option>
                                                <option value="2.9">v2.9</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="opensearch">-</button>
                                                <input type="number" class="instance-count" data-tool="opensearch" value="1" min="1" max="7">
                                                <button type="button" class="instance-btn increase" data-tool="opensearch">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for cluster setup (master, data, ingest nodes)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tool-option">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" name="loggingQuery" value="elasticsearch">
                                        <div class="tool-info">
                                            <span class="tool-title">Elasticsearch</span>
                                            <span class="tool-desc">Search and analytics engine</span>
                                        </div>
                                    </label>
                                    <div class="tool-config-row">
                                        <div class="version-selector">
                                            <select class="version-dropdown" data-tool="elasticsearch" disabled>
                                                <option value="8.11">v8.11 (Latest)</option>
                                            </select>
                                        </div>
                                        <div class="instance-config">
                                            <label class="instance-label">Instances:</label>
                                            <div class="instance-controls">
                                                <button type="button" class="instance-btn decrease" data-tool="elasticsearch">-</button>
                                                <input type="number" class="instance-count" data-tool="elasticsearch" value="1" min="1" max="7">
                                                <button type="button" class="instance-btn increase" data-tool="elasticsearch">+</button>
                                            </div>
                                            <div class="instance-info">
                                                <i class="fas fa-info-circle" data-tooltip="Use multiple instances for cluster setup (master, data, coordinating nodes)"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resources Panel -->
            <div class="panel resources-panel active" id="resourcesPanel" style="background: #1a1d23 !important;">
                <div class="panel-header">
                    <h3>Resource Planning</h3>
                    <p>Configure resource requirements and capacity planning</p>
                </div>
                
                <div class="resource-config-flow">
                    <!-- Step 1: Team & Workload Configuration -->
                    <div class="resource-flow-section">
                        <div class="flow-section-header">
                            <div class="step-number">1</div>
                            <div class="step-info">
                                <h3><i class="fas fa-users"></i> Team & Workload Configuration</h3>
                                <p>Configure your development team size and workload characteristics</p>
                            </div>
                        </div>
                        <div class="flow-section-content">
                            <div class="input-grid">
                                <div class="input-group">
                                    <label>Development Team Size</label>
                                    <input type="number" id="developerCount" value="10" min="1" max="100">
                                    <span class="input-suffix">developers</span>
                                </div>
                                <div class="input-group">
                                    <label>Concurrent Runners</label>
                                    <input type="number" id="runnerCount" value="4" min="1" max="20">
                                    <span class="input-suffix">runners</span>
                                </div>
                                <div class="input-group">
                                    <label>Daily Commits</label>
                                    <input type="number" id="commitCount" value="50" min="1" max="500">
                                    <span class="input-suffix">commits/day</span>
                                </div>
                                <div class="input-group">
                                    <label>Build Frequency</label>
                                    <select id="buildFrequency">
                                        <option value="low">Low (1-5 builds/day)</option>
                                        <option value="medium" selected>Medium (5-20 builds/day)</option>
                                        <option value="high">High (20+ builds/day)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Resource Configuration Mode -->
                    <div class="resource-flow-section">
                        <div class="flow-section-header">
                            <div class="step-number">2</div>
                            <div class="step-info">
                                <h3><i class="fas fa-cogs"></i> Resource Configuration</h3>
                                <p>Choose how to configure your infrastructure resources</p>
                            </div>
                            <div class="resource-mode-toggle">
                                <div class="toggle-buttons">
                                    <button class="toggle-btn active" id="autoResourceBtn" data-mode="auto">
                                        <i class="fas fa-magic"></i>
                                        Auto Calculate
                                    </button>
                                    <button class="toggle-btn" id="manualResourceBtn" data-mode="manual">
                                        <i class="fas fa-cog"></i>
                                        Manual Config
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="flow-section-content">
                            <!-- Auto Resource Calculation Mode -->
                            <div class="resource-section" id="autoResourceSection">
                                <div class="auto-calc-info">
                                    <p><i class="fas fa-info-circle"></i> Resources are automatically calculated based on your team size, workload, and selected tools.</p>
                                    <button class="btn btn-secondary" id="recalculateBtn">
                                        <i class="fas fa-calculator"></i>
                                        Recalculate
                                    </button>
                                </div>
                            </div>

                            <!-- Manual Resource Configuration Mode -->
                            <div class="resource-section hidden" id="manualResourceSection">
                                <div class="manual-config-warning">
                                    <div class="warning-box" id="resourceWarning" style="display: none;">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        <span id="warningMessage">Resource configuration is below recommended minimum!</span>
                                    </div>
                                </div>
                                <p class="manual-config-description">
                                    <i class="fas fa-info-circle"></i>
                                    Configure resources for each selected tool individually. Only enabled tools are shown below.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Recommended Resources -->
                    <div class="resource-flow-section">
                        <div class="flow-section-header">
                            <div class="step-number">3</div>
                            <div class="step-info">
                                <h3><i class="fas fa-lightbulb"></i> Recommended Resources</h3>
                                <p>System-calculated optimal resource allocation</p>
                            </div>
                        </div>
                        <div class="flow-section-content">
                            <div class="resource-metrics">
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <i class="fas fa-microchip"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="recommendedCpuTotal">8</div>
                                        <div class="metric-label">CPU Cores</div>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <i class="fas fa-memory"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="recommendedMemoryTotal">32</div>
                                        <div class="metric-label">Memory (Gi)</div>
                                    </div>
                                </div>
                                <div class="metric-card">
                                    <div class="metric-icon">
                                        <i class="fas fa-hdd"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="recommendedStorageTotal">500</div>
                                        <div class="metric-label">Storage (Gi)</div>
                                    </div>
                                </div>
                                <div class="metric-card cost-card">
                                    <div class="metric-icon">
                                        <i class="fas fa-dollar-sign"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="recommendedCostTotal">$240</div>
                                        <div class="metric-label">Monthly Cost</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Individual Tool Resources (Manual Mode Only) -->
                    <div class="resource-flow-section hidden" id="individualToolResourcesSection">
                        <div class="flow-section-header">
                            <div class="step-number">4</div>
                            <div class="step-info">
                                <h3><i class="fas fa-tools"></i> Individual Tool Resources</h3>
                                <p>Configure resources for each selected tool</p>
                            </div>
                        </div>
                        <div class="flow-section-content">
                            <div id="individualToolResources">
                                <!-- This will be dynamically populated with selected tools -->
                            </div>
                        </div>
                    </div>

                    <!-- Step 5: Total Resources Summary -->
                    <div class="resource-flow-section">
                        <div class="flow-section-header">
                            <div class="step-number">5</div>
                            <div class="step-info">
                                <h3><i class="fas fa-calculator"></i> Total Resources</h3>
                                <p>Final resource allocation summary</p>
                            </div>
                        </div>
                        <div class="flow-section-content">
                            <div class="resource-metrics">
                                <div class="metric-card total-metric">
                                    <div class="metric-icon">
                                        <i class="fas fa-microchip"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="calculatedCpu">8</div>
                                        <div class="metric-label">CPU Cores</div>
                                    </div>
                                </div>
                                <div class="metric-card total-metric">
                                    <div class="metric-icon">
                                        <i class="fas fa-memory"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="calculatedMemory">32</div>
                                        <div class="metric-label">Memory (Gi)</div>
                                    </div>
                                </div>
                                <div class="metric-card total-metric">
                                    <div class="metric-icon">
                                        <i class="fas fa-hdd"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="calculatedStorage">500</div>
                                        <div class="metric-label">Storage (Gi)</div>
                                    </div>
                                </div>
                                <div class="metric-card cost-card total-metric">
                                    <div class="metric-icon">
                                        <i class="fas fa-dollar-sign"></i>
                                    </div>
                                    <div class="metric-content">
                                        <div class="metric-value" id="calculatedCost">$240</div>
                                        <div class="metric-label">Monthly Cost</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 4: Cluster Configuration Panel -->
            <div class="panel cluster-panel" id="step4Panel">
                <h3><i class="fas fa-server"></i> 클러스터 설정</h3>
                
                <div class="config-section">
                    <h4><i class="fas fa-cogs"></i> 파이프라인 클러스터</h4>
                    <div class="input-group">
                        <label>클러스터 이름:</label>
                        <input type="text" id="pipelineClusterName" placeholder="pipeline-cluster">
                    </div>
                    <div class="input-group">
                        <label>네임스페이스:</label>
                        <input type="text" id="pipelineNamespace" placeholder="devops">
                    </div>
                    <div class="input-group">
                        <label>Kubeconfig:</label>
                        <input type="file" id="pipelineKubeconfig" accept=".yaml,.yml">
                    </div>
                </div>

                <div class="config-section">
                    <h4><i class="fas fa-bullseye"></i> 타겟 클러스터</h4>
                    <div class="input-group">
                        <label>클러스터 이름:</label>
                        <input type="text" id="targetClusterName" placeholder="production-cluster">
                    </div>
                    <div class="input-group">
                        <label>네임스페이스:</label>
                        <input type="text" id="targetNamespace" placeholder="default">
                    </div>
                    <div class="input-group">
                        <label>Kubeconfig:</label>
                        <input type="file" id="targetKubeconfig" accept=".yaml,.yml">
                    </div>
                </div>
            </div>

            <!-- Step 5: Installation Panel -->
            <div class="panel install-panel" id="step5Panel">
                <h3><i class="fas fa-download"></i> 파이프라인 설치</h3>
                
                <div class="install-summary">
                    <h4><i class="fas fa-list-check"></i> 설정 요약</h4>
                    <div class="summary-item">
                        <strong>Package Registry:</strong> <span id="installSummaryPackageRegistry">GitLab</span>
                    </div>
                    <div class="summary-item">
                        <strong>Source Repository:</strong> <span id="installSummarySourceRepo">GitLab</span>
                    </div>
                    <div class="summary-item">
                        <strong>Image Registry:</strong> <span id="installSummaryImageRegistry">GitLab Container Registry</span>
                    </div>
                    <div class="summary-item">
                        <strong>메인 파이프라인:</strong> <span id="installSummaryMainPipeline">GitLab CI/CD</span>
                    </div>
                    <div class="summary-item">
                        <strong>CD 도구:</strong> <span id="installSummaryCdTool">ArgoCD</span>
                    </div>
                    <div class="summary-item">
                        <strong>예상 비용:</strong> <span id="summaryCost">$240/month</span>
                    </div>
                </div>

                <div class="install-actions">
                    <button class="install-btn" id="installBtn">
                        <i class="fas fa-rocket"></i> 파이프라인 설치
                    </button>
                </div>

                <div class="install-progress" id="installProgress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <div class="progress-text" id="progressText">설치 준비 중...</div>
                </div>
                </div>
            </div>

            <!-- Cluster Configurations Panel -->
            <div class="panel clusters-panel" id="clustersPanel">
                <div class="panel-header">
                    <h3>Cluster Configurations</h3>
                    <p>Configure Kubernetes clusters for pipeline and application deployment</p>
                </div>
                
                <div class="cluster-config">
                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-cogs"></i>
                            <h4>Pipeline Cluster</h4>
                        </div>
                        <div class="card-content">
                            <div class="cluster-form">
                                <div class="input-group">
                                    <label>Cluster Name</label>
                                    <input type="text" id="pipelineClusterName" placeholder="pipeline-cluster" value="devops-cluster">
                                </div>
                                <div class="input-group">
                                    <label>Namespace</label>
                                    <input type="text" id="pipelineNamespace" placeholder="devops" value="nullus-system">
                                </div>
                                <div class="input-group">
                                    <label>Kubeconfig</label>
                                    <div class="file-upload">
                                        <input type="file" id="pipelineKubeconfig" accept=".yaml,.yml,.config">
                                        <button class="btn btn-secondary">
                                            <i class="fas fa-upload"></i>
                                            Upload Config
                                        </button>
                                    </div>
                                </div>
                                <div class="cluster-status">
                                    <div class="status-indicator connected">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Connected</span>
                                    </div>
                                    <div class="cluster-info">
                                        <span>Kubernetes v1.28.2</span>
                                        <span>3 nodes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="config-card">
                        <div class="card-header">
                            <i class="fas fa-bullseye"></i>
                            <h4>Target Cluster</h4>
                        </div>
                        <div class="card-content">
                            <div class="cluster-form">
                                <div class="input-group">
                                    <label>Cluster Name</label>
                                    <input type="text" id="targetClusterName" placeholder="production-cluster" value="prod-cluster">
                                </div>
                                <div class="input-group">
                                    <label>Namespace</label>
                                    <input type="text" id="targetNamespace" placeholder="default" value="production">
                                </div>
                                <div class="input-group">
                                    <label>Kubeconfig</label>
                                    <div class="file-upload">
                                        <input type="file" id="targetKubeconfig" accept=".yaml,.yml,.config">
                                        <button class="btn btn-secondary">
                                            <i class="fas fa-upload"></i>
                                            Upload Config
                                        </button>
                                    </div>
                                </div>
                                <div class="cluster-status">
                                    <div class="status-indicator pending">
                                        <i class="fas fa-clock"></i>
                                        <span>Pending</span>
                                    </div>
                                    <div class="cluster-info">
                                        <span>Configuration required</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cluster-validation">
                    <h4>Cluster Validation</h4>
                    <div class="validation-checks">
                        <div class="check-item">
                            <i class="fas fa-check text-success"></i>
                            <span>Pipeline cluster connectivity</span>
                        </div>
                        <div class="check-item">
                            <i class="fas fa-check text-success"></i>
                            <span>Required permissions</span>
                        </div>
                        <div class="check-item">
                            <i class="fas fa-times text-error"></i>
                            <span>Target cluster connectivity</span>
                        </div>
                        <div class="check-item">
                            <i class="fas fa-clock text-warning"></i>
                            <span>Network policies</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <!-- /config-panels -->
            </div>
            <!-- /config-section -->

            <!-- Right Panel: Summary, Cluster & Deployment -->
            <div class="deployment-section">
                <div class="deployment-summary">
                    <div class="summary-section">
                        <h4>Configuration Summary</h4>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <span class="label">Package Registry:</span>
                                <span class="value" id="summaryPackageRegistry">GitLab v16.7</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Source Repository:</span>
                                <span class="value" id="summarySourceRepo">GitLab v16.7</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Container Registry:</span>
                                <span class="value" id="summaryImageRegistry">GitLab Container Registry v16.7</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">CI/CD Platform:</span>
                                <span class="value" id="summaryMainPipeline">GitLab CI/CD v16.7</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">CD Tool:</span>
                                <span class="value" id="summaryCdTool">Argo CD v2.9.3</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Storage Backend:</span>
                                <span class="value" id="summaryStorage">AWS S3 latest</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Monitoring Stack:</span>
                                <span class="value" id="summaryMonitoringStack">Prometheus v2.47, Grafana v10.2</span>
                            </div>
                            <div class="summary-item">
                                <span class="label">Logging Stack:</span>
                                <span class="value" id="summaryLoggingStack">OpenTelemetry v1.0, OpenSearch v2.11</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="deployment-actions">
                    <div class="action-buttons">
                        <button class="btn btn-secondary" id="exportConfigBtn">
                            <i class="fas fa-download"></i>
                            Export JSON
                        </button>
                        <button class="btn btn-secondary" id="exportYamlBtn">
                            <i class="fas fa-file-code"></i>
                            Export YAML
                        </button>
                        <button class="btn btn-secondary" id="previewDeployScriptBtn">
                            <i class="fas fa-eye"></i>
                            Preview Deploy Script
                        </button>
                        <button class="btn btn-primary" id="deployBtn">
                            <i class="fas fa-rocket"></i>
                            Deploy Pipeline
                        </button>
                    </div>
                </div>

                <div class="deployment-progress" id="deploymentProgress" style="display: none;">
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" id="deployProgressFill"></div>
                        </div>
                        <div class="progress-text" id="deployProgressText">Initializing deployment...</div>
                    </div>
                    <div class="deployment-logs">
                        <div class="logs-header">
                            <h5>Deployment Logs</h5>
                            <button class="btn btn-secondary btn-sm">
                                <i class="fas fa-download"></i>
                                Download
                            </button>
                        </div>
                        <div class="logs-content" id="deploymentLogs">
                            <div class="log-entry">
                                <span class="timestamp">[2026-02-02 19:30:01]</span>
                                <span class="level info">INFO</span>
                                <span class="message">Starting pipeline deployment...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cluster Configuration Card -->
                <div class="deployment-card">
                    <div class="card-header">
                        <i class="fas fa-network-wired"></i>
                        <h4>Cluster Configuration</h4>
                    </div>
                    <div class="card-content">
                        <div class="cluster-quick-config">
                            <div class="cluster-item">
                                <div class="cluster-label">
                                    <i class="fas fa-cogs"></i>
                                    <span>Pipeline Cluster</span>
                                </div>
                                <div class="cluster-status connected">
                                    <i class="fas fa-check-circle"></i>
                                    <span>devops-cluster</span>
                                </div>
                            </div>
                            <div class="cluster-item">
                                <div class="cluster-label">
                                    <i class="fas fa-server"></i>
                                    <span>Application Cluster</span>
                                </div>
                                <div class="cluster-status pending">
                                    <i class="fas fa-clock"></i>
                                    <span>Not configured</span>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-full" id="configureClusterBtn">
                            <i class="fas fa-cog"></i>
                            Configure Clusters
                        </button>
                    </div>
                </div>

                <!-- Deployment Actions Card -->
                <div class="deployment-card">
                    <div class="card-header">
                        <i class="fas fa-rocket"></i>
                        <h4>Deploy Pipeline</h4>
                    </div>
                    <div class="card-content">
                        <div class="deployment-status">
                            <div class="status-item">
                                <i class="fas fa-check text-success"></i>
                                <span>Artifacts configured</span>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-check text-success"></i>
                                <span>Pipeline tools selected</span>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-check text-success"></i>
                                <span>Resources calculated</span>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-times text-error"></i>
                                <span>Application cluster not ready</span>
                            </div>
                        </div>
                        
                        <div class="deployment-actions-compact">
                            <button class="btn btn-secondary btn-full" id="previewK8sObjectsBtn">
                                <i class="fas fa-dharmachakra"></i>
                                Preview K8s Objects
                            </button>
                            <button class="btn btn-secondary btn-full" id="previewDeployScriptBtnCompact">
                                <i class="fas fa-eye"></i>
                                Preview Deploy Script
                            </button>
                            <button class="btn btn-primary btn-full" id="quickDeployBtn" disabled>
                                <i class="fas fa-rocket"></i>
                                Deploy Pipeline
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Deployment Progress (Hidden by default) -->
                <div class="deployment-card" id="deploymentProgressCard" style="display: none;">
                    <div class="card-header">
                        <i class="fas fa-spinner fa-spin"></i>
                        <h4>Deployment Progress</h4>
                    </div>
                    <div class="card-content">
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="sidebarProgressFill"></div>
                            </div>
                            <div class="progress-text" id="sidebarProgressText">Initializing...</div>
                        </div>
                        <div class="deployment-logs-compact">
                            <div class="logs-content" id="sidebarDeploymentLogs">
                                <div class="log-entry">
                                    <span class="level info">INFO</span>
                                    <span class="message">Starting deployment...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
