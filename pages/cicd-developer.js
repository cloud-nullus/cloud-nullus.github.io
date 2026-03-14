(function() {
    var ws = document.getElementById('mainWorkspace'); if (!ws) return;
    var el = document.createElement('div');
    el.innerHTML = `            <div class="page-content" id="developerPage">
                <div class="developer-page-container">
                    <div class="developer-layout">
                        <div class="developer-left">
                            <div class="developer-section-head">
                                <p data-i18n="developer.workflowDesc">Backstage-style developer workflow: choose a template and deploy to target cluster/namespace.</p>
                            </div>

                            <!-- Category Filter (기능 5) -->
                            <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
                                <button class="template-category-btn active" data-category="all" onclick="filterDevTemplates('all',this)" data-i18n="common.all">All</button>
                                <button class="template-category-btn" data-category="web" onclick="filterDevTemplates('web',this)"><i class="fas fa-globe"></i> <span data-i18n="developer.categoryWeb">Web</span></button>
                                <button class="template-category-btn" data-category="backend" onclick="filterDevTemplates('backend',this)"><i class="fas fa-server"></i> <span data-i18n="developer.categoryBackend">Backend</span></button>
                                <button class="template-category-btn" data-category="batch" onclick="filterDevTemplates('batch',this)"><i class="fas fa-layer-group"></i> <span data-i18n="developer.categoryBatch">Batch</span></button>
                            </div>

                            <div class="developer-template-grid" id="developerTemplateGrid">
                                <!-- WEB -->
                                <article class="developer-template-card selected" data-template="react-spa" data-language="React" data-type="web">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#e0f2fe;color:#0369a1;" data-i18n="developer.categoryWeb">Web</span>
                                        <i class="fab fa-react"></i>
                                    </div>
                                    <h3 data-i18n="developer.templateReactSpa">React SPA</h3>
                                    <p data-i18n="developer.templateReactSpaDesc">TypeScript + Vite + Nginx deployment template for frontend teams.</p>
                                    <div class="template-tags"><span>react</span><span>typescript</span><span>k8s</span></div>
                                </article>

                                <article class="developer-template-card" data-template="nextjs" data-language="Node.js" data-type="web">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#e0f2fe;color:#0369a1;" data-i18n="developer.categoryWeb">Web</span>
                                        <i class="fab fa-node-js"></i>
                                    </div>
                                    <h3 data-i18n="developer.templateNextSsr">Next.js SSR</h3>
                                    <p data-i18n="developer.templateNextSsrDesc">Server-side rendering with Next.js, optimized for production K8s.</p>
                                    <div class="template-tags"><span>nextjs</span><span>ssr</span><span>node</span></div>
                                </article>

                                <!-- BACKEND -->
                                <article class="developer-template-card" data-template="spring-api" data-language="Java" data-type="backend">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#f0fdf4;color:#15803d;" data-i18n="developer.categoryBackend">Backend</span>
                                        <i class="fab fa-java"></i>
                                    </div>
                                    <h3 data-i18n="developer.templateJavaSpringApi">Java Spring Boot API</h3>
                                    <p data-i18n="developer.templateJavaSpringApiDesc">REST API starter with Actuator health checks and container best practices.</p>
                                    <div class="template-tags"><span>java</span><span>spring</span><span>api</span></div>
                                </article>

                                <article class="developer-template-card" data-template="python-fastapi" data-language="Python" data-type="backend">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#f0fdf4;color:#15803d;" data-i18n="developer.categoryBackend">Backend</span>
                                        <i class="fab fa-python"></i>
                                    </div>
                                    <h3 data-i18n="developer.templatePythonFastapi">Python FastAPI</h3>
                                    <p data-i18n="developer.templatePythonFastapiDesc">FastAPI starter with uvicorn, OpenAPI docs, and production Docker setup.</p>
                                    <div class="template-tags"><span>python</span><span>fastapi</span><span>docker</span></div>
                                </article>

                                <article class="developer-template-card" data-template="go-microservice" data-language="Go" data-type="backend">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#f0fdf4;color:#15803d;" data-i18n="developer.categoryBackend">Backend</span>
                                        <i class="fas fa-terminal"></i>
                                    </div>
                                    <h3 data-i18n="developer.templateGoMicroservice">Go Microservice</h3>
                                    <p data-i18n="developer.templateGoMicroserviceDesc">Go HTTP service with health probes, metrics endpoint, and small image footprint.</p>
                                    <div class="template-tags"><span>go</span><span>microservice</span><span>observability</span></div>
                                </article>

                                <!-- BATCH -->
                                <article class="developer-template-card" data-template="python-batch" data-language="Python" data-type="batch">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#fef3c7;color:#b45309;" data-i18n="developer.categoryBatch">Batch</span>
                                        <i class="fab fa-python"></i>
                                    </div>
                                    <h3 data-i18n="developer.templatePythonBatch">Python Batch Job</h3>
                                    <p data-i18n="developer.templatePythonBatchDesc">Kubernetes CronJob template for scheduled Python batch processing.</p>
                                    <div class="template-tags"><span>python</span><span>cronjob</span><span>batch</span></div>
                                </article>

                                <article class="developer-template-card" data-template="java-batch" data-language="Java" data-type="batch">
                                    <div class="template-card-top">
                                        <span class="template-badge" style="background:#fef3c7;color:#b45309;" data-i18n="developer.categoryBatch">Batch</span>
                                        <i class="fab fa-java"></i>
                                    </div>
                                    <h3 data-i18n="developer.templateSpringBatch">Spring Batch Job</h3>
                                    <p data-i18n="developer.templateSpringBatchDesc">Spring Batch on Kubernetes with Job/CronJob scheduling and retry logic.</p>
                                    <div class="template-tags"><span>java</span><span>spring-batch</span><span>k8s</span></div>
                                </article>
                            </div>
                        </div>

                        <div class="developer-right">
                            <div class="status-card developer-wizard-card">
                                <div class="status-card-header">
                                    <i class="fas fa-list-check"></i>
                                    <h4 data-i18n="developer.deployWizard">Deploy Wizard</h4>
                                </div>
                                <div class="status-card-content">
                                    <div class="developer-stepper">
                                        <span class="active" data-i18n="developer.step1">1. App Config</span>
                                        <span data-i18n="developer.step2">2. Cluster & Namespace</span>
                                        <span data-i18n="developer.step3">3. Resources</span>
                                        <span data-i18n="developer.step4">4. Env & Secrets</span>
                                        <span data-i18n="developer.step5">5. Review & Deploy</span>
                                    </div>

                                    <div class="developer-form-grid">
                                        <div class="input-group">
                                            <label data-i18n="developer.selectedTemplate">Selected Template</label>
                                            <input type="text" id="devSelectedTemplate" value="React SPA" readonly>
                                        </div>
                                        <div class="input-group">
                                            <label data-i18n="developer.appName">App Name</label>
                                            <input type="text" id="devAppName" placeholder="team-portal-frontend">
                                        </div>
                                        <div class="input-group">
                                            <label data-i18n="developer.repositoryUrl">Repository URL</label>
                                            <input type="text" id="devRepoUrl" placeholder="https://github.com/org/team-portal-frontend">
                                        </div>
                                        <div class="input-group">
                                            <label data-i18n="developer.targetCluster">Target Cluster</label>
                                            <select id="devTargetCluster">
                                                <option value="">Select cluster</option>
                                                <option value="dev-cluster">dev-cluster</option>
                                                <option value="staging-cluster">staging-cluster</option>
                                                <option value="prod-cluster">prod-cluster</option>
                                            </select>
                                        </div>
                                        <div class="input-group">
                                            <label data-i18n="cluster.namespace">Namespace</label>
                                            <input type="text" id="devNamespace" placeholder="apps-platform">
                                        </div>
                                    </div>

                                    <div class="developer-resource-toggle-row">
                                        <label><input type="checkbox" class="dev-resource-toggle" id="devEnableDb"> <span data-i18n="developer.enablePostgresDb">PostgreSQL DB</span></label>
                                        <label><input type="checkbox" class="dev-resource-toggle" id="devEnableRedis"> <span data-i18n="developer.enableRedisCache">Redis Cache</span></label>
                                        <label><input type="checkbox" class="dev-resource-toggle" id="devEnableQueue"> <span data-i18n="developer.enableMessageQueue">Message Queue</span></label>
                                    </div>

                                    <div class="developer-form-grid compact">
                                        <div class="input-group">
                                            <label data-i18n="developer.cpuRequest">CPU Request (m)</label>
                                            <input type="number" id="devCpuRequest" value="500" min="100" step="100">
                                        </div>
                                        <div class="input-group">
                                            <label data-i18n="developer.memoryRequest">Memory Request (Mi)</label>
                                            <input type="number" id="devMemoryRequest" value="512" min="128" step="128">
                                        </div>
                                    </div>

                                    <div class="developer-env-section">
                                        <div class="developer-env-head">
                                            <strong data-i18n="developer.environmentSecrets">Environment & Secrets</strong>
                                             <button class="btn btn-secondary btn-sm" id="addDevEnvVarBtn"><i class="fas fa-plus"></i> <span data-i18n="common.add">Add</span></button>
                                        </div>
                                        <div class="developer-env-rows" id="developerEnvRows"></div>
                                    </div>

                                    <div class="developer-review" id="developerReviewBox"></div>

                                    <div class="modal-actions">
                                         <button class="btn btn-secondary" id="developerPreviewBtn"><i class="fas fa-eye"></i> <span data-i18n="developer.previewManifest">Preview Manifest</span></button>
                                         <button class="btn btn-primary" id="developerDeployBtn"><i class="fas fa-rocket"></i> <span data-i18n="developer.deployToCluster">Deploy to Cluster</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;
    while (el.firstChild) ws.appendChild(el.firstChild);
})();
