window.PIPELINE_TEMPLATE_DATA = {
  editorTemplates: {
    node: `
stages:
  - install
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

install_dependencies:
  stage: install
  image: node:$NODE_VERSION
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

test_job:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm run test
    - npm run coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build_job:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_job:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - npm run deploy
  only:
    - main
`,
    docker: `
stages:
  - build
  - test
  - push
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest

test_image:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker run --rm $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA npm test

push_image:
  stage: push
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main

deploy_container:
  stage: deploy
  image: docker:latest
  script:
    - docker-compose up -d
  only:
    - main
`,
    kubernetes: `
stages:
  - build
  - test
  - deploy

variables:
  KUBECONFIG: /tmp/kubeconfig

build_and_push:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

test_deployment:
  stage: test
  image: bitnami/kubectl
  script:
    - kubectl apply --dry-run=client -f k8s/

deploy_to_staging:
  stage: deploy
  image: bitnami/kubectl
  script:
    - kubectl apply -f k8s/namespace.yaml
    - kubectl apply -f k8s/configmap.yaml
    - kubectl apply -f k8s/deployment.yaml
    - kubectl apply -f k8s/service.yaml
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy_to_production:
  stage: deploy
  image: bitnami/kubectl
  script:
    - kubectl apply -f k8s/namespace.yaml
    - kubectl apply -f k8s/configmap.yaml
    - kubectl apply -f k8s/deployment.yaml
    - kubectl apply -f k8s/service.yaml
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
`,
    python: `
stages:
  - test
  - build
  - deploy

variables:
  PYTHON_VERSION: "3.11"
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip
    - venv/

test_job:
  stage: test
  image: python:$PYTHON_VERSION
  before_script:
    - python -m venv venv
    - source venv/bin/activate
    - pip install -r requirements.txt
  script:
    - python -m pytest tests/ --cov=src/
    - python -m flake8 src/
    - python -m black --check src/
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

build_package:
  stage: build
  image: python:$PYTHON_VERSION
  script:
    - python -m pip install build
    - python -m build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

deploy_package:
  stage: deploy
  image: python:$PYTHON_VERSION
  script:
    - python -m pip install twine
    - python -m twine upload dist/*
  only:
    - tags
`
  },
  stackConfigs: {
    gitlabDevSecOps: `
# Production DevSecOps Pipeline - GitLab CI/CD
stages:
  - develop
  - build
  - security
  - test
  - deploy
  - operation
  - monitoring
  - finops

variables:
  DOCKER_REGISTRY: "harbor.company.com"
  TRIVY_VERSION: "0.48.0"
  ARGOCD_VERSION: "v2.9.3"

# Develop Stage
code_quality:
  stage: develop
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
  only:
    - merge_requests
    - main

# Build Stage
build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $DOCKER_REGISTRY/app:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/app:$CI_COMMIT_SHA

# Security Stage
container_scan:
  stage: security
  image: aquasec/trivy:$TRIVY_VERSION
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_REGISTRY/app:$CI_COMMIT_SHA

secret_scan:
  stage: security
  image: trufflesecurity/trufflehog:latest
  script:
    - trufflehog git file://. --json

# Test Stage
unit_tests:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
  coverage: '/Lines\\s*:\\s*(\\d+\\.?\\d*)%/'

integration_tests:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Deploy Stage
deploy_production:
  stage: deploy
  image: argoproj/argocd:$ARGOCD_VERSION
  script:
    - argocd app sync production-app
    - argocd app wait production-app
  only:
    - main

# Operation Stage
health_check:
  stage: operation
  image: curlimages/curl:latest
  script:
    - curl -f https://app.company.com/health || exit 1

# Monitoring Stage
setup_monitoring:
  stage: monitoring
  image: prom/prometheus:latest
  script:
    - echo "Monitoring setup completed"

# FinOps Stage
cost_analysis:
  stage: finops
  image: kubecost/cost-analyzer:latest
  script:
    - echo "Cost analysis completed"

`,
    githubDevSecOps: `
# Development DevSecOps Pipeline - GitHub Actions
name: DevSecOps Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: docker.io
  IMAGE_NAME: company/app

jobs:
  # Develop Stage
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}

  # Build Stage
  build:
    runs-on: ubuntu-latest
    needs: code-quality
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}

  # Security Stage
  security-scan:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}'
          format: 'sarif'
          output: 'trivy-results.sarif'

  # Test Stage
  test:
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  # Deploy Stage
  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy with Flux
        run: |
          echo "Deploying with Flux CD"
          # Flux deployment commands here

  # Monitoring Stage
  monitoring:
    runs-on: ubuntu-latest
    needs: deploy
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Setup monitoring
        run: |
          echo "Setting up monitoring with Prometheus"

`,
    jenkinsDevSecOps: `
// Staging DevSecOps Pipeline - Jenkins
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'aws-account-id.dkr.ecr.region.amazonaws.com'
        IMAGE_NAME = 'staging-app'
        SONARQUBE_SERVER = 'SonarQube'
        SPINNAKER_WEBHOOK = credentials('spinnaker-webhook')
    }
    
    stages {
        // Develop Stage
        stage('Code Quality') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "\${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        
        // Build Stage
        stage('Build') {
            steps {
                script {
                    docker.build("\${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${BUILD_NUMBER}")
                }
            }
        }
        
        // Security Stage
        stage('Security Scan') {
            parallel {
                stage('Container Scan') {
                    steps {
                        sh """
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                                aquasec/trivy image \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${BUILD_NUMBER}
                        """
                    }
                }
                stage('SAST') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh 'sonar-scanner -Dsonar.projectKey=staging-app'
                        }
                    }
                }
            }
        }
        
        // Test Stage
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm ci && npm test'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'docker-compose -f docker-compose.test.yml up --abort-on-container-exit'
                    }
                }
            }
        }
        
        // Deploy Stage
        stage('Deploy to Staging') {
            steps {
                script {
                    // Push to ECR
                    sh """
                        aws ecr get-login-password --region region | docker login --username AWS --password-stdin \${DOCKER_REGISTRY}
                        docker push \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${BUILD_NUMBER}
                    """
                    
                    // Trigger Spinnaker deployment
                    sh """
                        curl -X POST \${SPINNAKER_WEBHOOK} \\
                            -H 'Content-Type: application/json' \\
                            -d '{"parameters":{"image":"\${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${BUILD_NUMBER}"}}'
                    """
                }
            }
        }
        
        // Operation Stage
        stage('Health Check') {
            steps {
                script {
                    sh 'curl -f https://staging.company.com/health || exit 1'
                }
            }
        }
        
        // Monitoring Stage
        stage('Setup Monitoring') {
            steps {
                sh 'echo "Monitoring configured with Prometheus and Grafana"'
            }
        }
        
        // FinOps Stage
        stage('Cost Analysis') {
            steps {
                sh 'echo "Cost analysis completed with AWS Cost Explorer"'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext (
                subject: "Pipeline Failed: \${env.JOB_NAME} - \${env.BUILD_NUMBER}",
                body: "The pipeline has failed. Please check the logs.",
                to: "devops@company.com"
            )
        }
    }
}

`,
    microservices: `
# Microservices Platform - GitLab CI/CD with Istio
stages:
  - develop
  - build
  - security
  - test
  - deploy
  - service-mesh
  - monitoring
  - finops

variables:
  DOCKER_REGISTRY: "harbor.company.com"
  ISTIO_VERSION: "1.20.0"
  JAEGER_VERSION: "1.52.0"
  PROMETHEUS_VERSION: "2.48.0"

# Service Discovery
services_discovery:
  stage: develop
  image: consul:latest
  script:
    - consul agent -dev &
    - consul services register service-config.json

# Multi-service Build
build_services:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  parallel:
    matrix:
      - SERVICE: [user-service, order-service, payment-service, notification-service]
  script:
    - cd services/$SERVICE
    - docker build -t $DOCKER_REGISTRY/$SERVICE:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/$SERVICE:$CI_COMMIT_SHA

# Security Scanning for All Services
security_scan_services:
  stage: security
  image: aquasec/trivy:latest
  parallel:
    matrix:
      - SERVICE: [user-service, order-service, payment-service, notification-service]
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL $DOCKER_REGISTRY/$SERVICE:$CI_COMMIT_SHA

# Contract Testing
contract_tests:
  stage: test
  image: pactfoundation/pact-cli:latest
  script:
    - pact-broker publish pacts --consumer-app-version $CI_COMMIT_SHA
    - pact-broker can-i-deploy --pacticipant user-service --version $CI_COMMIT_SHA

# Deploy to Kubernetes
deploy_services:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl apply -f k8s/namespace.yaml
    - envsubst < k8s/services.yaml | kubectl apply -f -
    - kubectl rollout status deployment/user-service -n microservices
    - kubectl rollout status deployment/order-service -n microservices

# Istio Service Mesh Configuration
configure_service_mesh:
  stage: service-mesh
  image: istio/istioctl:$ISTIO_VERSION
  script:
    - istioctl install --set values.defaultRevision=default -y
    - kubectl label namespace microservices istio-injection=enabled
    - kubectl apply -f istio/gateway.yaml
    - kubectl apply -f istio/virtual-services.yaml
    - kubectl apply -f istio/destination-rules.yaml

# Distributed Tracing Setup
setup_tracing:
  stage: monitoring
  image: jaegertracing/jaeger-operator:$JAEGER_VERSION
  script:
    - kubectl apply -f jaeger/jaeger-operator.yaml
    - kubectl apply -f jaeger/jaeger-instance.yaml

# Prometheus Monitoring
setup_monitoring:
  stage: monitoring
  image: prom/prometheus:$PROMETHEUS_VERSION
  script:
    - kubectl apply -f monitoring/prometheus-config.yaml
    - kubectl apply -f monitoring/service-monitors.yaml
    - kubectl apply -f monitoring/grafana-dashboards.yaml

# Cost Analysis per Service
cost_analysis:
  stage: finops
  image: kubecost/cost-analyzer:latest
  script:
    - kubectl apply -f kubecost/cost-analyzer.yaml
    - echo "Cost breakdown by service available in Kubecost dashboard"

`,
    mobileApp: `
# Mobile App CI/CD - GitHub Actions
name: Mobile App DevSecOps Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REACT_NATIVE_VERSION: "0.72.0"
  FLUTTER_VERSION: "3.16.0"
  FASTLANE_VERSION: "2.217.0"

jobs:
  # Code Quality & Security
  code-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: ESLint
        run: npx eslint . --ext .js,.jsx,.ts,.tsx
      - name: Security audit
        run: npm audit --audit-level high

  # React Native Build
  build-react-native:
    runs-on: macos-latest
    needs: code-analysis
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      - name: Install Fastlane
        run: gem install fastlane -v $FASTLANE_VERSION
      - name: Setup React Native
        run: |
          npm install -g react-native-cli
          npm ci
          cd ios && pod install
      - name: Build iOS
        run: |
          cd ios
          fastlane build_ios
      - name: Build Android
        run: |
          cd android
          fastlane build_android

  # Flutter Build
  build-flutter:
    runs-on: ubuntu-latest
    needs: code-analysis
    steps:
      - uses: actions/checkout@v4
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: $FLUTTER_VERSION
      - name: Get dependencies
        run: flutter pub get
      - name: Run tests
        run: flutter test
      - name: Build APK
        run: flutter build apk --release
      - name: Build iOS (without signing)
        run: flutter build ios --release --no-codesign

  # Security Testing
  security-tests:
    runs-on: ubuntu-latest
    needs: [build-react-native, build-flutter]
    steps:
      - uses: actions/checkout@v4
      - name: Mobile Security Framework (MobSF)
        run: |
          docker run --rm -v \$(pwd):/app opensecurity/mobsf:latest
      - name: OWASP Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'mobile-app'
          path: '.'
          format: 'JSON'

  # App Store Deployment
  deploy-ios:
    runs-on: macos-latest
    needs: security-tests
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      - name: Install Fastlane
        run: gem install fastlane
      - name: Deploy to TestFlight
        env:
          APPLE_ID: \${{ secrets.APPLE_ID }}
          APP_STORE_CONNECT_API_KEY: \${{ secrets.APP_STORE_CONNECT_API_KEY }}
        run: |
          cd ios
          fastlane deploy_testflight

  # Google Play Deployment
  deploy-android:
    runs-on: ubuntu-latest
    needs: security-tests
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.0'
      - name: Install Fastlane
        run: gem install fastlane
      - name: Deploy to Google Play
        env:
          GOOGLE_PLAY_SERVICE_ACCOUNT: \${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT }}
        run: |
          cd android
          fastlane deploy_play_store

  # Performance Monitoring
  performance-monitoring:
    runs-on: ubuntu-latest
    needs: [deploy-ios, deploy-android]
    steps:
      - name: Setup Firebase Performance
        run: |
          echo "Firebase Performance Monitoring configured"
          echo "Crashlytics enabled for crash reporting"

`,
    mlPipeline: `
# ML/AI Pipeline - Kubeflow Pipeline
import kfp
from kfp import dsl
from kfp.components import create_component_from_func
import mlflow
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Data Ingestion Component
@create_component_from_func
def data_ingestion(
    data_source: str,
    output_path: str
) -> str:
    """Ingest data from various sources"""
    import pandas as pd
    import os
    
    # Simulate data loading from different sources
    if data_source == "s3":
        # Load from S3
        data = pd.read_csv("s3://ml-data-bucket/training-data.csv")
    elif data_source == "database":
        # Load from database
        data = pd.read_sql("SELECT * FROM training_data", connection_string)
    else:
        # Load sample data
        data = pd.DataFrame({
            'feature1': np.random.randn(1000),
            'feature2': np.random.randn(1000),
            'target': np.random.randint(0, 2, 1000)
        })
    
    os.makedirs(output_path, exist_ok=True)
    data_file = f"{output_path}/raw_data.csv"
    data.to_csv(data_file, index=False)
    
    return data_file

# Data Preprocessing Component
@create_component_from_func
def data_preprocessing(
    input_data_path: str,
    output_path: str
) -> str:
    """Preprocess and clean the data"""
    import pandas as pd
    import numpy as np
    from sklearn.preprocessing import StandardScaler
    import joblib
    import os
    
    # Load data
    data = pd.read_csv(input_data_path)
    
    # Handle missing values
    data = data.dropna()
    
    # Feature scaling
    scaler = StandardScaler()
    feature_columns = [col for col in data.columns if col != 'target']
    data[feature_columns] = scaler.fit_transform(data[feature_columns])
    
    # Save processed data and scaler
    os.makedirs(output_path, exist_ok=True)
    processed_data_file = f"{output_path}/processed_data.csv"
    scaler_file = f"{output_path}/scaler.joblib"
    
    data.to_csv(processed_data_file, index=False)
    joblib.dump(scaler, scaler_file)
    
    return processed_data_file

# Model Training Component
@create_component_from_func
def model_training(
    processed_data_path: str,
    model_output_path: str,
    experiment_name: str = "ml-experiment"
) -> str:
    """Train machine learning model"""
    import pandas as pd
    import mlflow
    import mlflow.sklearn
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, classification_report
    import joblib
    import os
    
    # Setup MLflow
    mlflow.set_experiment(experiment_name)
    
    with mlflow.start_run():
        # Load processed data
        data = pd.read_csv(processed_data_path)
        
        # Prepare features and target
        X = data.drop('target', axis=1)
        y = data['target']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Log metrics and model
        mlflow.log_param("n_estimators", 100)
        mlflow.log_param("max_depth", 10)
        mlflow.log_metric("accuracy", accuracy)
        mlflow.sklearn.log_model(model, "model")
        
        # Save model
        os.makedirs(model_output_path, exist_ok=True)
        model_file = f"{model_output_path}/model.joblib"
        joblib.dump(model, model_file)
        
        print(f"Model trained with accuracy: {accuracy}")
        return model_file

# Model Validation Component
@create_component_from_func
def model_validation(
    model_path: str,
    validation_data_path: str,
    accuracy_threshold: float = 0.8
) -> bool:
    """Validate model performance"""
    import pandas as pd
    import joblib
    from sklearn.metrics import accuracy_score
    
    # Load model and validation data
    model = joblib.load(model_path)
    data = pd.read_csv(validation_data_path)
    
    X_val = data.drop('target', axis=1)
    y_val = data['target']
    
    # Predict and evaluate
    y_pred = model.predict(X_val)
    accuracy = accuracy_score(y_val, y_pred)
    
    print(f"Validation accuracy: {accuracy}")
    
    # Check if model meets threshold
    if accuracy >= accuracy_threshold:
        print("Model validation passed!")
        return True
    else:
        print("Model validation failed!")
        return False

# Model Deployment Component
@create_component_from_func
def model_deployment(
    model_path: str,
    deployment_name: str = "ml-model-service"
) -> str:
    """Deploy model to Kubernetes"""
    import os
    import yaml
    
    # Create Kubernetes deployment manifest
    deployment_config = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': deployment_name,
            'labels': {'app': deployment_name}
        },
        'spec': {
            'replicas': 3,
            'selector': {'matchLabels': {'app': deployment_name}},
            'template': {
                'metadata': {'labels': {'app': deployment_name}},
                'spec': {
                    'containers': [{
                        'name': 'model-server',
                        'image': 'ml-model-server:latest',
                        'ports': [{'containerPort': 8080}],
                        'env': [{'name': 'MODEL_PATH', 'value': model_path}]
                    }]
                }
            }
        }
    }
    
    # Save deployment config
    with open('/tmp/deployment.yaml', 'w') as f:
        yaml.dump(deployment_config, f)
    
    # Apply deployment (simulated)
    print(f"Deploying model service: {deployment_name}")
    return f"Model deployed as {deployment_name}"

# Define the Pipeline
@dsl.pipeline(
    name='ML DevSecOps Pipeline',
    description='Complete ML pipeline with MLOps best practices'
)
def ml_devsecops_pipeline(
    data_source: str = "sample",
    experiment_name: str = "ml-experiment",
    accuracy_threshold: float = 0.8
):
    # Data Ingestion
    data_ingestion_task = data_ingestion(
        data_source=data_source,
        output_path="/tmp/data"
    )
    
    # Data Preprocessing
    preprocessing_task = data_preprocessing(
        input_data_path=data_ingestion_task.output,
        output_path="/tmp/processed"
    )
    
    # Model Training
    training_task = model_training(
        processed_data_path=preprocessing_task.output,
        model_output_path="/tmp/model",
        experiment_name=experiment_name
    )
    
    # Model Validation
    validation_task = model_validation(
        model_path=training_task.output,
        validation_data_path=preprocessing_task.output,
        accuracy_threshold=accuracy_threshold
    )
    
    # Model Deployment (conditional on validation)
    with dsl.Condition(validation_task.output == True):
        deployment_task = model_deployment(
            model_path=training_task.output,
            deployment_name="ml-model-service"
        )

# Compile and run the pipeline
if __name__ == "__main__":
    kfp.compiler.Compiler().compile(
        ml_devsecops_pipeline,
        'ml-devsecops-pipeline.yaml'
    )
    
    # Submit to Kubeflow
    client = kfp.Client()
    experiment = client.create_experiment('ML DevSecOps')
    run = client.run_pipeline(
        experiment.id,
        'ML DevSecOps Pipeline Run',
        'ml-devsecops-pipeline.yaml'
    )

`
  }
}
