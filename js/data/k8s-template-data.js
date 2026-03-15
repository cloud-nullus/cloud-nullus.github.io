window.K8S_TEMPLATE_DATA = {
  namespace: `apiVersion: v1
kind: Namespace
metadata:
  name: {{namespace}}
  labels:
    app.kubernetes.io/managed-by: nullus
    app.kubernetes.io/part-of: devsecops-stack`,

  deployment: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{slug}}
  namespace: {{namespace}}
  labels:
    app.kubernetes.io/name: {{slug}}
    app.kubernetes.io/version: "{{version}}"
    app.kubernetes.io/component: {{category}}
    app.kubernetes.io/managed-by: nullus
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: {{slug}}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {{slug}}
        app.kubernetes.io/version: "{{version}}"
    spec:
      containers:
        - name: {{slug}}
          image: {{slug}}:{{version}}
          ports:
            - containerPort: 8080
              protocol: TCP
          resources:
            requests:
              cpu: "{{cpuReq}}m"
              memory: "{{memReq}}Mi"
            limits:
              cpu: "{{cpuLimit}}m"
              memory: "{{memLimit}}Mi"
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10`,

  service: `apiVersion: v1
kind: Service
metadata:
  name: {{slug}}-svc
  namespace: {{namespace}}
  labels:
    app.kubernetes.io/name: {{slug}}
    app.kubernetes.io/managed-by: nullus
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: {{slug}}
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http`,

  ingressRule: `        - host: {{slug}}.{{namespace}}.local
          http:
            paths:
              - path: /
                pathType: Prefix
                backend:
                  service:
                    name: {{slug}}-svc
                    port:
                      number: 80`,

  ingress: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nullus-ingress
  namespace: {{namespace}}
  labels:
    app.kubernetes.io/managed-by: nullus
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
{{rules}}`
}
