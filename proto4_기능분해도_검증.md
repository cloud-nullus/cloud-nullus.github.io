# Proto4 기능분해도 ID 순서 검증

**작성일**: 2026-03-08  
**기준**: `Nullus_기능분해도.csv` ID 순서  
**대상**: proto4 (Admin / DevOps Engineer / Developer 역할)

---

## 1. 검증 요약

| 구분 | 내용 |
|------|------|
| 총 기능 ID | 약 100개 (CSV 전체) |
| Proto4 메뉴·화면 | 메뉴체계 기준 사이드바 + 역할별 화면 |
| 검증 결과 | **구성 적합** (UI 기능 대부분 반영) |
| 미반영/제한 | 백엔드 전용, 로그인/초대 수락 페이지 없음 |

---

## 2. CSV ID 순서별 Proto4 매핑

### 2.1 조직 (ORG)

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 1 | NULLUS_ORG_000_010 | Default Organization 생성 | △ 백엔드 | 프로토타입 불필요 |
| 2 | NULLUS_ORG_000_020 | Default Admin 생성 | △ 백엔드 | 프로토타입 불필요 |
| 3 | NULLUS_ORG_010_010 | Organization 등록 | ✅ 관리 > 조직 | Basic Info 폼 |
| 4 | NULLUS_ORG_010_020 | Organization 조회 | ✅ 관리 > 조직 | 상세 정보 표시 |
| 5 | NULLUS_ORG_010_030 | Organization 수정 | ✅ 관리 > 조직 | Save Changes |
| 6 | NULLUS_ORG_010_040 | Organization 삭제 | △ | UI 버튼 없음 (의도적) |
| 7 | NULLUS_ORG_010_050 | 상태 전환 | ✅ 관리 > 조직 | Status select |
| 8 | NULLUS_ORG_010_060 | 관리자 지정 | ✅ 관리 > 조직 | Default Admin Account |
| 9 | NULLUS_ORG_010_070 | 관리자 변경 | ✅ 관리 > 조직 | Default Admin Account |
| 10 | NULLUS_ORG_020_010 | 접근 범위 조회 | ✅ 관리 > 조직 | Cluster Access Scope |
| 11 | NULLUS_ORG_020_020 | 접근 범위 설정 | ✅ 관리 > 조직 | 체크박스 선택 |
| 12 | NULLUS_ORG_020_030 | 접근 범위 수정 | ✅ 관리 > 조직 | 체크박스 |
| 13 | NULLUS_ORG_020_040 | 접근 범위 해제 | ✅ 관리 > 조직 | 체크박스 해제 |
| 14 | NULLUS_ORG_030_010 | 멤버 초대 | ✅ 관리 > 조직 | Invite Member |
| 15 | NULLUS_ORG_030_030 | 멤버 목록 조회 | ✅ 관리 > 조직 | Member Management 테이블 |
| 16 | NULLUS_ORG_030_040 | 멤버 역할 수정 | ✅ 관리 > 조직 | Role select |
| 17 | NULLUS_ORG_030_050 | 멤버 비활성화 | ✅ 관리 > 조직 | Deactivate 버튼 |
| 18 | NULLUS_ORG_030_060 | 멤버 제거 | △ | UI 버튼 없음 |

### 2.2 클러스터 (CLU) – Organization 접근

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 19 | NULLUS_CLU_040_020 | 접근 Organization 설정 | ✅ 클러스터 상세 | Organization Access 태그 |
| 20 | NULLUS_CLU_040_030 | 접근 Organization 수정 | △ | 수정 모달 내 (추후) |

### 2.3 DevSecOps 스택 (DSS) – Golden Path

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 21 | NULLUS_DSS_010_010 | 템플릿 등록 | △ | Admin/DevOps 전용 (추후) |
| 22 | NULLUS_DSS_010_040 | 템플릿 수정 | △ | (추후) |
| 23 | NULLUS_DSS_010_050 | 템플릿 삭제 | △ | (추후) |
| 24 | NULLUS_DSS_060_010 | 호환성 매트릭스 조회 | ✅ 스택 버전 관리 | compatibility 페이지 |
| 25 | NULLUS_DSS_060_020 | 호환성 매트릭스 등록 | △ | (추후) |
| 26 | NULLUS_DSS_060_030 | Chart/App 버전 분리 | △ | (추후) |

### 2.4 관리 (ADM)

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 27 | NULLUS_ADM_010_010 | 조직 정보 등록 | ✅ 관리 > 조직 | 폼 |
| 28 | NULLUS_ADM_010_020 | 조직 정보 수정 | ✅ 관리 > 조직 | Save Changes |
| 29 | NULLUS_ADM_010_030 | 클러스터 접근 범위 설정 | ✅ 관리 > 조직 | Cluster Access Scope |
| 30 | NULLUS_ADM_020_010 | 역할 기반 접근제어 | ✅ 역할 토글 | Admin/DevOps/Developer |
| 31 | NULLUS_ADM_020_020 | 대메뉴 권한 설정 | ✅ 역할별 메뉴 | applyRole() |
| 32 | NULLUS_ADM_020_030 | 사용자 목록 조회 | ✅ 사용자 관리 | Users 테이블 |
| 33 | NULLUS_ADM_020_040 | 역할 부여 | ✅ 사용자 관리 | Role select |
| 34 | NULLUS_ADM_020_050 | 역할 변경 | ✅ 사용자 관리 | Role select |
| 35 | NULLUS_ADM_020_060 | 사용자 비활성화 | ✅ 사용자 관리 | Deactivate 버튼 |
| 36 | NULLUS_ADM_020_070 | Keycloak OIDC 연동 | △ | 백엔드 |
| 37 | NULLUS_ADM_030_010 | 클러스터 등록 화면 | ✅ 클러스터 관리 | Register Cluster + Modal |
| 38 | NULLUS_ADM_030_020 | 클러스터 수정 화면 | ✅ 클러스터 상세 | 수정 버튼 |
| 39 | NULLUS_ADM_030_040 | Organization 접근 설정 | ✅ 클러스터 상세 | org access 표시 |

### 2.5 사용자 (USR) – 공통

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 40 | NULLUS_ORG_030_020 | 초대 링크 수락 | △ | 별도 /invite 페이지 없음 |
| 41 | NULLUS_ADM_030_030 | 연결 상태 카드 표시 | ✅ 클러스터 상세 | Connection Status |
| 42 | NULLUS_USR_010_010 | 역할별 요약 조회 | △ | 홈/대시보드 미구현 |
| 43 | NULLUS_USR_020_010 | 로그인 | △ | 로그인 페이지 없음 |
| 44 | NULLUS_USR_020_020 | 로그아웃 | ✅ 사이드바 | 로그아웃 메뉴 |
| 45 | NULLUS_USR_030_010 | UI 언어 전환 | ✅ 헤더 | 언어 드롭다운 (en/ko) |

### 2.6 클러스터 (CLU) – 클러스터 관리

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 46 | NULLUS_CLU_010_010 | 클러스터 등록 | ✅ 클러스터 등록 버튼+모달 | |
| 47 | NULLUS_CLU_010_020 | 클러스터 목록 조회 | ✅ 클러스터 목록 패널 | 리스트+상세 구조 |
| 48 | NULLUS_CLU_010_030 | 클러스터 상세 조회 | ✅ 클러스터 상세 패널 | 선택 시 표시 |
| 49 | NULLUS_CLU_010_040 | 클러스터 수정 | ✅ 수정 버튼 | Modal 연결 |
| 50 | NULLUS_CLU_010_050 | 클러스터 삭제 | ✅ 삭제 버튼 | (확인 다이얼로그 추후) |

### 2.7 DevSecOps 스택 (DSS) – 템플릿/설치/목록/이력

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 51 | NULLUS_DSS_010_020 | 템플릿 목록 조회 | ✅ 스택 템플릿 | |
| 52 | NULLUS_DSS_010_030 | 템플릿 상세 조회 | ✅ 스택 템플릿 | 카드/모달 |
| 53 | NULLUS_DSS_010_060 | 템플릿 적용 | ✅ Use This Template | |
| 54 | NULLUS_DSS_020_010~130 | 노코드 설정 UI | ✅ 스택 설치 | Artifacts/Pipeline/Monitoring/Logging/Resources/YAML |
| 55 | NULLUS_DSS_030_010~080 | 스택 생성/배포 | ✅ 스택 설치 | Save, Deploy, Preview 등 |
| 56 | NULLUS_DSS_040_010~050 | 스택 목록 관리 | ✅ 스택 목록 | |
| 57 | NULLUS_DSS_050_010~050 | 스택 이력 관리 | ✅ 스택 이력 | diff, rollback |
| 58 | NULLUS_DSS_070_010~030 | 리소스 예상량 계산 | ✅ Resources 탭 | dev_count, estimate |

### 2.8 CI/CD (CIC)

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 59 | NULLUS_CIC_010_010~050 | 파이프라인 템플릿 | ✅ CI/CD 템플릿 | |
| 60 | NULLUS_CIC_020_010~060 | 파이프라인 관리 | ✅ CI/CD 목록 | |
| 61 | NULLUS_CIC_030_010~080 | 파이프라인 배포 | ✅ CI/CD 이력 | |
| 62 | NULLUS_CIC_040_010~060 | Developer Self-Service | ✅ 앱 배포 | Developer 역할 시 |

### 2.9 관측성 (OBS)

| 순번 | 기능 ID | 단위 프로세스명 | Proto4 반영 | 비고 |
|------|---------|-----------------|-------------|------|
| 63 | NULLUS_OBS_010_010~050 | 모니터링 | ✅ 모니터링 대시보드 | |
| 64 | NULLUS_OBS_020_010~050 | 알림 관리 | ✅ 알림 규칙, 알림 이력 | |

---

## 3. 메뉴 순서 vs CSV ID 순서

- **CSV ID 순서**: 조직 → 클러스터(접근) → DSS(템플릿/호환성) → ADM → USR → CLU(관리) → DSS(전체) → CIC → OBS
- **Proto4 메뉴 순서**: 데브섹옵스 스택 → CI/CD → 관측성 → 관리(조직/사용자/클러스터) → 사용자

Proto4는 **사용자 업무 흐름(스택 → CI/CD → 관측 → 관리)** 기준으로 메뉴를 구성했으며, CSV의 기술적 분류 순서와는 다름. 이는 **의도된 설계**로 판단.

---

## 4. 클러스터 관리 리스트+상세 구조 검증

| 기능 ID | 요구사항 | Proto4 반영 |
|---------|----------|-------------|
| CLU_010_020 | 클러스터 목록 조회 | ✅ 좌측 패널 리스트 |
| CLU_010_030 | 클러스터 상세 조회 | ✅ 우측 패널 상세 (선택 시) |
| ADM_030_030 | 연결 상태 카드 표시 | ✅ 상세 패널 Connection Status |
| CLU_010_040 | 클러스터 수정 | ✅ 수정 버튼 (모달 연결) |
| CLU_010_050 | 클러스터 삭제 | ✅ 삭제 버튼 |

**결론**: 멤버 관리(조직 페이지)와 동일한 **리스트 + 상세** 패턴으로 구성됨.

---

## 5. 다국어(en/ko) 검증

| 기능 ID | 요구사항 | Proto4 반영 |
|---------|----------|-------------|
| NULLUS_USR_030_010 | UI 언어 en/ko 전환, localStorage 영속화 | ✅ i18n.js, 언어 드롭다운, localStorage 'nullus_locale' |

**적용 범위**: 사이드바 메뉴, 클러스터 관리, 공통 버튼(저장/취소/추가/수정/삭제 등)

---

## 6. 개선 권장 사항

1. **홈/대시보드**: USR_010_010 역할별 요약 – 추후 추가 시 검증
2. **로그인 페이지**: USR_020_010 – 프로토타입 범위 외
3. **초대 수락 페이지**: ORG_030_020 – /invite 전용 페이지 추후 고려
