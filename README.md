# proto4 - proto3 대비 개선사항

이 문서는 `proto3` 대비 `proto4`에서 추가/변경된 사항을 정리합니다.  
**기반 문서**: Nullus_기능분해도.csv, Nullus_메뉴체계.md

## 1) 역할 선택 3종으로 확장

- **Admin** / **DevOps Engineer** / **Developer** 3가지 역할 선택 가능
- proto3에서는 DevOps Engineer, Developer 2종만 지원

### 역할별 메뉴 가시성

| 역할 | 표시 메뉴 |
|------|-----------|
| **Admin** | 관리(조직, 사용자 관리, 클러스터 관리), 사용자(로그아웃) |
| **DevOps Engineer** | 데브섹옵스 스택, CI/CD, 관측성, 관리, 사용자 (전체) |
| **Developer** | CI/CD, 관측성, 사용자 (Admin 섹션 숨김, DevSecOps 스택 숨김) |

### 초기 화면

- **Admin**: 조직(Organization) 페이지
- **DevOps Engineer**: 스택 설치(Install) 페이지
- **Developer**: CI/CD 템플릿 페이지

## 2) 메뉴 명칭 통일 (한글화)

Nullus_메뉴체계.md 기준으로 메뉴 라벨 통일

| 대메뉴 | 하위 메뉴 |
|--------|-----------|
| 데브섹옵스 스택 | 스택 템플릿, 스택 설치, 스택 목록, 스택 이력, 스택 버전 관리 |
| CI/CD | CI/CD 템플릿, CI/CD 목록, CI/CD 이력 |
| 관측성 | 모니터링 대시보드, 알림 규칙, 알림 이력 |
| 관리 | 조직, 사용자 관리, 클러스터 관리 |
| 사용자 | 로그아웃 |

## 3) 기능분해도 연계

- 메뉴 구조가 Nullus_기능분해도.csv의 대분류/중분류와 1:1 매핑
- nav-section 클래스: `devsecops-nav-section`, `cicd-nav-section`, `observability-nav-section`, `admin-nav-section`, `user-nav-section`

## 4) proto3 기능 유지

- DevSecOps Stack 5단계 설정 워크플로우
- Golden Path 템플릿, 스택 목록/이력/버전 관리
- CI/CD 템플릿/목록/이력
- Developer Self-Service 앱 배포 위자드
- 모니터링 대시보드, 알림 규칙/이력
- 조직/사용자/클러스터 관리
- 다크/라이트 테마, 사이드바 접기
