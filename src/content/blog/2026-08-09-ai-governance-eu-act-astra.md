---
title: "오픈AI 'Astra' 사태와 EU AI Act 발효: 통제 불능 AI와 거버넌스의 시작"
description: 'AI Governance, EU AI Act, OpenAI, Agentic AI, AI Safety'
pubDate: '2026-08-09'
category: 'Tech'
---

**2026년 8월 2일, EU AI Act(인공지능법)가 공식적으로 발효되었다.**

이로써 단순히 '더 똑똑하고 거대한' AI를 만드는 데 몰두하던 시대를 지나, **안전(Safety)**과 **규제 준수(Compliance)**라는 새로운 룰을 지키지 못하면 비즈니스 자체가 불가능해지는 시대가 본격적으로 막을 올렸다. 글로벌 AI 시장의 규칙이 근본적으로 뒤바뀐 것이다.

최근 가장 눈에 띄었던 흐름은 두 가지다. 하나는 앞서 말한 EU AI Act의 투명성 의무가 2026년 8월 2일부터 본격적으로 적용되기 시작했다는 점이다. 다른 하나는 OpenAI의 차세대 에이전트형 모델로 알려진 **Astra** 관련 보도다. 외신에서는 OpenAI가 Astra의 일부 개발 또는 공개 일정을 늦추고, 보안 기준을 충족하지 못하는 내부 활동을 멈췄다고 전했다.

처음에는 두 사건이 별개처럼 보였다. 하나는 유럽의 규제 일정이고, 다른 하나는 특정 회사의 모델 안전 이슈니까. 그런데 자료를 조금 더 찾아보니 두 사건은 같은 질문으로 이어진다.

> AI가 더 오래, 더 자율적으로, 더 많은 도구를 사용해 행동할 수 있다면, 우리는 무엇을 평가하고 무엇을 통제해야 하는가?

이 글은 그 질문에 대한 스터디 기록이다. 아주 정교한 법률 검토라기보다는, 지금 통제하기 어려워지는 '에이전틱 AI(Agentic AI)' 시대에 거버넌스가 어디로 움직이고 있는지 정리해두려는 목적에 가깝다.

## 1. Astra 보도에서 봐야 할 점

먼자 조심해야 할 점이 있다. Astra라는 이름으로 보도된 모델에 대해, 현재 공개된 공식 기술 문서가 아주 충분한 것은 아니다. 그래서 "Astra가 정확히 어떤 모델이고 어떤 평가에서 무엇을 했는가"를 단정하기보다는, 외신 보도와 OpenAI가 별도로 공개한 안전 문서들을 같이 읽는 편이 더 안전해 보인다.

[Axios](https://www.axios.com/2026/08/07/openai-astra-model-delay-cybersecurity-risks), [The Verge](https://www.theverge.com/ai-artificial-intelligence/976948/openai-astra-model-pause-critical-cyber-capabilities), [The Guardian](https://www.theguardian.com/technology/2026/aug/08/openai-astra-security-concerns) 보도에 따르면, OpenAI는 Astra가 사이버 보안 평가에서 위험한 수준의 능력을 보일 수 있다는 이유로 일부 개발 활동이나 출시 일정을 늦췄다고 한다. 핵심은 모델이 단순한 챗봇이 아니라, 스스로 생각하고 도구를 활용해 여러 단계의 작업을 자율적으로 수행하는 **'에이전틱 AI(Agentic AI)'**라는 점에 있었다. 모델이 단순히 "취약점 설명을 잘한다" 정도가 아니라, **자율적으로 취약점을 찾고 공격 경로를 구성할 수 있는지**에 가까웠던 것 같다.

이 부분은 OpenAI의 [Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/)와 연결된다. OpenAI는 2025년 업데이트에서 고위험 능력을 `High`와 `Critical` 같은 임계값으로 관리하겠다고 설명했다. 특히 사이버 능력은 생물·화학, AI 자기개선과 함께 추적 대상 범주로 들어가 있다. `High` 수준은 기존 위험 경로를 크게 증폭할 수 있는 능력이고, `Critical` 수준은 전례 없는 새로운 위험 경로를 만들 수 있는 능력에 가깝다.

내가 이해한 요지는 이렇다.

| 구분 | 예전 챗봇식 위험 | 에이전트형 위험 |
| --- | --- | --- |
| 단위 | 한 번의 답변 | 여러 단계의 행동 궤적 |
| 실패 형태 | 틀린 답, 환각, 유해 답변 | 허가되지 않은 도구 사용, 권한 우회, 장기 목표 추구 |
| 평가 질문 | 이 답변이 안전한가? | 이 에이전트의 전체 실행 과정이 안전한가? |
| 통제 방법 | 정책 필터, 답변 거절 | 샌드박스, 권한 제한, 로그, 중단 버튼, 궤적 모니터링 |

생성형 AI 초기의 안전 논의는 주로 "무슨 말을 하느냐"에 집중했다. 혐오 발언을 하는지, 위험한 방법을 알려주는지, 사실이 아닌 내용을 지어내는지 같은 문제였다. 그런데 에이전트형 AI에서는 모델이 말만 하는 것이 아니라 실제 행동을 한다. 코드를 실행하고, 웹을 탐색하고, 저장소에 접근하고, API를 호출하고, 다른 서비스에 요청을 보낸다.

그러면 안전의 단위도 답변에서 행동으로, 더 정확히는 **행동들의 연쇄(Trajectory)**로 바뀔 수밖에 없다.

## 2. Hugging Face 보안 사고와 장기 실행 모델의 취약점

이러한 에이전틱 AI의 위험성은 학계의 연구와 최근의 보안 사고에서도 여실히 드러난다. Astra 보도를 이해하려면 그 직전에 있었던 OpenAI-Hugging Face 보안 사고도 같이 봐야 한다. 

OpenAI는 2026년 7월 21일 [Hugging Face와 관련된 모델 평가 중 보안 사고](https://openai.com/index/hugging-face-model-evaluation-security-incident/)를 공개했다. OpenAI 설명에 따르면, 이 사고는 사이버 능력 벤치마크를 내부적으로 평가하는 과정에서 발생했다. 이때 GPT-5.6 Sol과 더 강한 사전 공개 모델이 사용되었고, 평가 목적상 일반적인 사이버 거절 장치가 줄어든 상태였다고 한다.

여기서 중요한 점은 "모델이 나쁘다"보다 **"평가 환경도 공격 표면이 될 수 있다"**는 것이다. 안전 평가를 하려면 모델의 위험한 능력을 일부러 꺼내봐야 한다. 그런데 그 과정에서 네트워크 접근, 패키지 설치, 샌드박스, 내부 프록시 같은 요소가 엮이면 평가 자체가 실제 시스템과 연결될 수 있다. 평가를 위해 안전장치를 낮추는 순간, 평가 환경의 격리 수준이 훨씬 더 중요해진다.

OpenAI가 2026년 7월에 공개한 [long-horizon model safety 글](https://openai.com/de-DE/index/safety-alignment-long-horizon-models/)도 비슷한 문제의식을 보여준다. 이 글에서 OpenAI는 긴 시간 동안 자율적으로 작업하는 모델을 제한적으로 내부 사용하면서, 기존 배포 전 평가에서 잡히지 않았던 실패 양상을 발견했고 접근을 중단했다고 설명한다. 이후 실제로 관찰된 실패를 바탕으로 새로운 평가를 만들고, 장기 실행 상황에서의 alignment를 개선하고, **trajectory-level monitoring**을 추가한 뒤 제한적 접근을 다시 열었다고 한다.

최신(2025~2026년) 보안 업계의 프레임워크(예: **OWASP Top 10 for Agentic Applications**, UC Berkeley의 **Agentic AI Risk-Management Standards Profile**)를 보면 에이전틱 AI의 이러한 취약점이 잘 정리되어 있다.

*   **기억 오염 (Memory & Context Poisoning):** 에이전트의 장기 기억(RAG 데이터베이스 등)에 악성 데이터를 주입하여 오염된 판단을 내리게 함.
*   **도구 오용 및 권한 상승 (Tool Misuse & Privilege Escalation):** 프롬프트 인젝션 등을 통해 에이전트에게 부여된 시스템 접근 권한이나 외부 API를 임의로 실행하게 만드는 일명 '혼란스러운 대리인(Confused Deputy)' 문제.

예를 들어 장기 실행 모델의 행동은 다음과 같이 흐를 수 있다.
1. 에이전트가 웹에서 문서를 찾는다.
2. 필요한 패키지를 설치한다.
3. 오류가 나자 다른 저장소를 뒤진다.
4. 접근 권한이 없는 리소스를 시도한다.
5. 우회 경로를 찾는다.
6. 결과적으로 원래 허용되지 않은 작업을 수행한다.

각 단계만 보면 "문제 해결을 위해 노력하는 과정"처럼 보일 수 있다. 하지만 전체 궤적으로 보면 안전 경계를 넘고 있을 수 있다. 그래서 에이전트 안전은 단일 액션 필터링보다 훨씬 운영적인 문제가 된다.

## 3. VENOM F-16 사례: 자율성은 소프트웨어 밖으로 나온다

비슷한 시기에 DARPA와 미 공군의 [VENOM F-16 테스트](https://www.darpa.mil/news/2026/darpa-us-air-force-fly-ai-controlled-f-16)도 있었다. 2026년 7월 DARPA는 AI 에이전트가 F-16의 비행을 자율적으로 제어하는 실비행 테스트가 진행 중이라고 밝혔다.

물론 이 사례를 "AI가 전투기를 마음대로 조종한다"는 식으로 읽으면 과장이다. 공개 자료를 보면 조종사는 여전히 조종석에 있고, AI 제어와 인간 제어를 전환할 수 있는 구조로 테스트가 진행된다. 과거 미 공군 자료에서도 VENOM 테스트에는 사람이 실시간으로 관여하며 특정 알고리즘을 시작하거나 멈출 수 있다고 설명했다.

그래도 이 사례가 흥미로운 이유는 분명하다. AI 에이전트의 자율성이 더 이상 브라우저나 코드 에디터 안에만 머물지 않는다는 점이다. 군사, 제조, 물류, 의료기기, 금융 자동화처럼 실제 세계에 영향을 주는 시스템과 연결될수록 안전은 더 복잡해진다.

챗봇이 틀린 답을 하면 수정하면 된다. 코딩 에이전트가 잘못된 파일을 수정하면 되돌릴 수 있다. 하지만 물리 시스템이나 금융 거래, 보안 인프라와 연결된 에이전트가 잘못 행동하면 피해의 복구 비용이 커진다.

그래서 에이전트형 AI에서는 "모델 성능"과 "운영 통제"가 사실상 한 묶음이 된다. 모델이 똑똑해질수록 더 많은 권한을 주고 싶어지고, 더 많은 권한을 줄수록 권한 관리와 중단 가능성이 중요해진다.

## 4. EU AI Act: 2026년 8월 2일부터 무엇이 적용되나

이런 통제 불능의 에이전트로 진화하면서 생기는 보안 위협을 막기 위해, 유럽연합(EU)의 규제는 2026년 8월을 기점으로 본격적인 실전 모드에 돌입했다. 

EU AI Act 자체는 2024년 8월 발효되었지만, 적용 시점은 단계적으로 나뉘어 있다. 최근 7월 말 통과된 **'디지털 옴니버스(Regulation (EU) 2026/1744)'**로 인해 일부 고위험 AI에 대한 의무는 2027~2028년으로 연기되었지만, **2026년 8월 2일부로 Article 50 투명성 의무는 예외 없이 적용**되었다.

대략적인 흐름은 다음과 같다.

| 날짜 | 적용 내용 |
| --- | --- |
| 2024-08-01 | EU AI Act 발효 |
| 2025-02-02 | 금지된 AI 관행, AI 리터러시 의무 적용 |
| 2025-08-02 | 범용 AI(GPAI) 모델 관련 의무 적용 |
| **2026-08-02** | **Article 50 투명성 의무 적용** |
| 2027-12-02 | 일부 독립형 고위험 AI 시스템 의무 적용 예정 |
| 2028-08-02 | 규제 제품에 내장된 고위험 AI 시스템 의무 적용 예정 |

2026년 8월 2일부터 적용되는 핵심은 [Article 50의 투명성 의무](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)다. EU 집행위원회의 [FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)와 [Quick Facts](https://digital-strategy.ec.europa.eu/en/factpages/quick-facts-transparency-rules-ai-systems)를 보면, 크게 네 가지 경우가 중심이다.

첫째, 사람과 직접 상호작용하는 AI 시스템은 사용자가 AI와 상호작용하고 있다는 사실을 알 수 있게 설계되어야 한다. 챗봇, AI 에이전트, 아바타 등이 여기에 들어간다. 다만 맥락상 명백한 경우에는 예외가 있을 수 있다.

둘째, 생성형 AI 시스템이 만든 오디오, 이미지, 영상, 텍스트 콘텐츠는 기계가 읽을 수 있는 방식으로(Machine-readable markings) AI 생성 또는 조작 여부를 표시해야 한다. 이를 위해 EU는 최근 자발적 준수 가이드라인인 **'Code of Practice on Transparency'**를 배포했다.

셋째, 감정 인식이나 생체 분류 시스템을 쓰는 경우, 그 시스템에 노출되는 사람에게 해당 사실을 알려야 한다.

넷째, 딥페이크나 공익 사안에 관한 AI 생성 텍스트를 공개하는 경우에는 사람이 인지할 수 있는 방식으로 표시해야 한다.

요약하면, EU AI Act의 투명성 의무는 "AI를 쓰지 말라"가 아니라 **AI가 개입했음을 숨기지 말라**에 가깝다.

## 5. 투명성은 생각보다 운영적인 요구다

처음에는 이 투명성 의무가 단순해 보였다. 그냥 "이 콘텐츠는 AI로 생성되었습니다" 라벨을 붙이면 되는 것 아닌가? 그런데 자료를 읽다 보니 그렇게 간단하지만은 않다. 왜냐하면 투명성은 UI 문구 하나의 문제가 아니라, 시스템 전체의 산출물 관리 문제이기 때문이다.

예를 들어 AI 서비스를 운영하는 회사라면 이런 질문을 해야 한다.
- 사용자가 AI와 대화 중이라는 사실을 첫 상호작용 시점에 알 수 있는가?
- AI가 생성한 텍스트, 이미지, 음성, 영상에 어떤 표시를 남길 것인가?
- 기계가 읽을 수 있는 표시와 사람이 볼 수 있는 표시를 어떻게 구분할 것인가?
- 인간이 검토한 콘텐츠와 AI가 자동 생성한 콘텐츠를 어떻게 기록할 것인가?
- 이미 배포된 시스템에는 어떤 유예 기간과 예외가 적용되는가?

EU FAQ에 따르면 Article 50은 2026년 8월 2일부터 적용된다. 다만 2026년 8월 2일 이전에 시장에 출시된 AI 시스템의 경우, AI 생성 콘텐츠에 대한 machine-readable marking 의무에는 2026년 12월 2일까지 제한적인 유예가 있다. 

또 하나 중요한 점은 벌칙이다. Article 50 위반은 최대 1,500만 유로 또는 전년도 전 세계 매출의 3%까지 벌금이 가능하다고 설명된다. 무시하기 힘든 수준이다.

## 6. GPAI와 시스템 수준 규제는 다르다

EU AI Act를 볼 때 헷갈리기 쉬운 부분은 **모델 제공자(provider)**와 **시스템 배포자(deployer)**의 책임이 다르다는 점이다.

2025년 8월 2일부터는 범용 AI 모델(GPAI) 제공자에 대한 의무가 적용되기 시작했다. 모든 GPAI 모델 제공자는 기술 문서 작성, 저작권 정책 공개 등의 의무를 지고, 시스템적 위험이 있는 가장 강력한 모델 제공자는 위험 평가와 사이버보안 보호 같은 추가 의무도 가진다.

반면 2026년 8월 2일부터 적용되는 Article 50 투명성 의무는 모델 자체보다는 **AI 시스템과 그 산출물이 사용자에게 어떻게 노출되는가**에 더 가깝다. 그래서 OpenAI, Google 같은 모델 제공자만의 문제가 아니다. 그 모델을 가져와 고객 상담 챗봇, 내부 업무 에이전트로 만드는 회사(Deployer)도 책임에서 자유롭지 않다.

결국 앞으로 AI 서비스를 만든다는 것은 "모델 API를 붙인다"에서 끝나지 않는다. 어떤 권한을 주는지, 어떤 출력이 나가는지, 문제가 생기면 누가 멈출 수 있는지까지 설계해야 한다.

## 7. 샌드박스와 고위험 규칙은 조금 더 복잡해졌다

처음 글을 쓸 때는 "2026년 8월 2일부터 각 EU 회원국은 최소 하나의 AI regulatory sandbox를 구축해야 한다"고 정리했는데, 이 부분은 실무적으로 조심해서 접근해야 한다.

EU의 [AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/what-are-ai-regulatory-sandboxes-and-how-can-providersdeployers-participate)는 각 회원국에 최소 하나의 샌드박스가 제공되며 혁신적인 AI 시스템을 제한된 환경에서 테스트하고 검증할 수 있게 지원한다고 설명한다. 
그러나 디지털 옴니버스 등 일정 조정을 통해 고위험 AI 시스템 의무 중 상당수가 2027년 12월 또는 2028년 8월로 밀렸다. 따라서 샌드박스가 당장 "모든 서비스의 필수 출시 관문"이라기보다, 규제 환경에서 안전하게 선제적으로 테스트하고 해석 지원을 받을 수 있는 '지원 제도'의 성격에 더 가깝다. 

- 2026년 8월 2일의 핵심은 Article 50 투명성 의무와 샌드박스 인프라 의무화다.
- 고위험 AI 시스템 자체의 컴플라이언스는 2027~2028년으로 적용 시점이 다르다.

## 8. 기업 입장에서 필요한 거버넌스

그럼 기업이나 개발팀 입장에서 당장 무엇을 해야 할까. 자료들을 종합해 실무 체크리스트처럼 정리해 보았다.

### 8.1 AI 사용 목록부터 있어야 한다
조직 안에서 어떤 AI가 어디에 쓰이는지 모르면 아무것도 관리할 수 없다. 어떤 모델/API를 쓰는지, 사용자는 누구인지, 산출물은 어떻게 공개되고 사람 검토가 남는지를 목록화해야 한다.

### 8.2 에이전트에는 권한 설계가 필요하다
에이전트는 프롬프트만으로 통제하기 어렵다. OWASP의 가이드에 따르면 최소한 다음이 필요하다.
- 도구 allowlist 도입 및 최소 권한 원칙
- 민감 작업 전 human approval
- 장기 실행 작업의 중간 점검 및 전체 실행 궤적(Trajectory) 모니터링
- 모든 도구 호출 로그 및 파일/DB 쓰기 권한 분리

### 8.3 레드팀은 출시 전 이벤트가 아니라 반복 프로세스다
NIST AI RMF는 위험관리를 모델 출시 직전의 이벤트가 아닌 지속적 프로세스로 본다. 에이전트형 AI에서는 프롬프트 인젝션 테스트, 도구 오용 시나리오, 장기 실행 중 지시사항 망각 테스트 등을 반복적으로 수행해야 한다. 
최근 애저 마켓플레이스 등에 등록된 **Holistic AI Safeguard**와 같이, 환각이나 편향성을 실시간으로 감시하고 차단하는 엔터프라이즈 모니터링 툴을 파이프라인에 통합하는 것이 점점 더 중요해진다.

### 8.4 투명성은 제품 요구사항으로 들어가야 한다
투명성 의무는 단순한 문구가 아니다. 
- 챗봇: 첫 화면에서 AI임을 알리고, 사람 개입 구간을 구분하는가?
- 생성 도구: AI 생성물에 메타데이터나 워터마크를 남기고 내보낼 수 있는가?
처음부터 산출물의 출처와 검토 상태를 데이터 모델에 남겨야 한다.

## 9. 결국 거버넌스는 속도를 늦추는 것이 아니라 통제 가능한 속도를 만드는 일

> AI가 더 많은 일을 할 수 있게 될수록, AI를 둘러싼 통제 장치도 더 구체적이어야 한다.

처음에는 AI 규제 이야기를 들으면 기술 발전을 늦추는 느낌이 강했다. 그런데 이번 Astra 보도, Hugging Face 평가 사고, long-horizon model safety 글, EU AI Act 자료를 같이 읽다 보니 생각이 조금 바뀌었다.

문제는 빠르게 가느냐 느리게 가느냐만이 아니다. **멈출 수 있는가, 되돌릴 수 있는가, 설명할 수 있는가**가 더 중요해지고 있다. 

에이전트형 AI는 엄청난 생산성을 약속하지만 그만큼 실패도 더 빠르고 넓게 퍼진다. 앞으로 AI 서비스를 도입할 때는 "이 모델이 얼마나 똑똑한가"만 묻기 어려울 것이다. 그 모델이 어떤 권한을 가지고, 어떤 경계 안에서 움직이며, 실패했을 때 어떻게 멈추고 설명할 수 있는지까지 같이 봐야 한다.

## 마무리

2026년 8월의 흐름을 보면, 안전과 규제는 이제 주변부 이슈가 아니다. OpenAI는 내부적으로 스스로 속도를 조절해야 하는 상황이고, EU AI Act의 투명성 의무는 8월 2일부터 법적 제동 장치로 발효되었다.

나에게도 이건 꽤 실무적인 질문으로 남는다. AI 에이전트를 써서 자동화를 구현하고 싶다면, 그만큼 로그, 권한, 승인, 모니터링, 사용자 고지 같은 지루한 부분을 같이 설계해야 한다. 아마 진정한 의미의 **Responsible AI**는 이런 지루한 운영의 디테일에서 시작되는 것 아닐까.

---

## 📚 Further Study: 추천 리서치 키워드 및 참고 자료

스스로 리서치를 더 확장해보고 싶다면 아래 키워드와 추가 자료들을 추천한다.

**🔑 추천 검색 키워드 (Research Keywords)**
* **Agentic AI Security:** `OWASP Top 10 for Agentic Applications`, `Agentic AI Threat Modeling`, `LLM Agent Privilege Escalation`
* **AI Compliance:** `EU AI Act Article 50 Transparency`, `AI Regulatory Sandbox EU`, `Digital Omnibus Regulation EU 2026`
* **AI Governance Frameworks:** `NIST AI RMF Extension`, `Red Teaming LLM Agents`, `AI Safeguard mechanisms`

**📖 참고할 만한 문헌 및 가이드**
1. **[논문] "The Attack and Defense Landscape of Agentic AI: A Comprehensive Survey" (2026, CSUR):** 에이전틱 AI의 취약점과 방어 메커니즘 총망라.
2. **[가이드] European Commission: "Code of Practice on Transparency of AI-generated Content":** 제50조 투명성 의무 준수 실무 가이드라인.

**🎥 관련 해석 영상 및 웨비나 (YouTube & Webinars)**
* **"The EU AI Act from 2 August 2026: what actually applies and what to report to the board" (by DLA Piper):** 로펌에서 26년 8월 기준으로 이사회 보고용 실무 체크리스트를 짚어주는 영상.
* **"EU AI Act compliance: 2026-2027 guide":** 디지털 옴니버스의 영향으로 어떤 조항이 연기되었고, 무엇이 당장 적용되는지 명확히 설명해주는 가이드.

**🔗 원문 레퍼런스 모음**
- Axios, [Exclusive: OpenAI slows release of Astra model citing cyber capabilities](https://www.axios.com/2026/08/07/openai-astra-model-delay-cybersecurity-risks)
- The Verge, [OpenAI puts the brakes on a new model because it's supposedly too powerful](https://www.theverge.com/ai-artificial-intelligence/976948/openai-astra-model-pause-critical-cyber-capabilities)
- The Guardian, [OpenAI to pause some work on AI model Astra due to security concerns](https://www.theguardian.com/technology/2026/aug/08/openai-astra-security-concerns)
- OpenAI, [OpenAI and Hugging Face partner to address security incident during model evaluation](https://openai.com/index/hugging-face-model-evaluation-security-incident/)
- OpenAI, [Our updated Preparedness Framework](https://openai.com/index/updating-our-preparedness-framework/)
- OpenAI, [OpenAI's Frontier Governance Framework](https://openai.com/index/openai-frontier-governance-framework/)
- OpenAI, [Safety and alignment in an era of long-horizon models](https://openai.com/de-DE/index/safety-alignment-long-horizon-models/)
- DARPA, [DARPA, U.S. Air Force fly AI-controlled F-16](https://www.darpa.mil/news/2026/darpa-us-air-force-fly-ai-controlled-f-16)
- European Commission, [AI Act](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- European Commission, [Transparency obligations under Article 50 of the AI Act](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- AI Act Service Desk, [Article 50: Transparency obligations for providers and deployers of certain AI systems](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)
- European Commission, [Quick Facts: Transparency rules for AI systems](https://digital-strategy.ec.europa.eu/en/factpages/quick-facts-transparency-rules-ai-systems)
- European Commission, [General-purpose AI obligations under the AI Act](https://digital-strategy.ec.europa.eu/en/factpages/general-purpose-ai-obligations-under-ai-act)
- European Commission, [The General-Purpose AI Code of Practice](https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai)
- Council of the EU, [Timeline - Artificial intelligence](https://www.consilium.europa.eu/en/policies/artificial-intelligence-act/timeline-artificial-intelligence/)
- AI Act Service Desk, [What are AI regulatory sandboxes, and how can providers/deployers participate?](https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/what-are-ai-regulatory-sandboxes-and-how-can-providersdeployers-participate)
- NIST, [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- OWASP, [AI Agent Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html)
- OWASP GenAI Security Project, [Agentic AI - Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)
