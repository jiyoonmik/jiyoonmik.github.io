---
title: "SHACL로 그래프 데이터 검증하기"
description: "SHACL의 기본 개념과 사용 시점, RDF 검증 방식, 그리고 Neo4j neosemantics(n10s)에서 property graph를 직접 검증하는 흐름 정리."
pubDate: "2026-09-13"
category: "Tech"
---


지식 그래프와 온톨로지를 다루다 보면 "그래프 구조를 어떻게 설계할 것인가"만큼이나 중요한 질문이 하나 더 생긴다.

> 이 그래프가 우리가 기대한 형태를 지키고 있는지 어떻게 확인하고 유지할 것인가?

관계형 데이터베이스에서는 `NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK` 같은 제약 조건을 떠올릴 수 있다. 애플리케이션 코드에서는 Pydantic, Zod, JSON Schema 같은 검증 도구를 떠올릴 수도 있다. 그런데 RDF 기반 지식 그래프에서는 데이터가 triple로 열려 있고, 스키마도 비교적 유연하다. 그래서 "이 클래스에는 반드시 어떤 속성이 있어야 한다", "이 관계의 대상은 특정 클래스여야 한다", "값은 날짜 형식이어야 한다" 같은 규칙을 따로 표현할 방법이 필요하다.

그때 등장하는 것이 **SHACL(Shapes Constraint Language)**이다.

## SHACL은 무엇인가

SHACL은 RDF 그래프가 특정 조건을 만족하는지 검증하기 위한 W3C 표준 언어다. 이름 그대로 데이터의 "shape"를 정의한다. 여기서 shape는 화면에 보이는 도형이 아니라, 그래프 데이터가 가져야 하는 구조와 제약의 모음이라고 보면 된다.

예를 들어 교육 도메인에서 `AchievementStandard`라는 노드가 있다고 해보자. 실무적으로는 이런 규칙이 필요할 수 있다.

```text
AchievementStandard는 code를 반드시 하나 가져야 한다.
code는 문자열이어야 한다.
AchievementStandard는 하나 이상의 Concept과 연결되어야 한다.
difficulty가 있다면 easy, medium, hard 중 하나여야 한다.
```

RDF 데이터에서는 이런 사실이 triple로 흩어져 있다.

```text
standard:6수01-06 rdf:type edu:AchievementStandard
standard:6수01-06 edu:code "6수01-06"
standard:6수01-06 edu:relatedConcept concept:fraction-reduction
```

SHACL은 이 데이터가 "정해둔 모양"을 지키는지 검사한다. 그래서 SHACL을 **지식 그래프의 데이터 품질 테스트**에 가깝게 이해하면 편할 것 같다.

```text
온톨로지/RDFS/OWL: 이 도메인이 어떤 의미 구조를 가지는가
SHACL: 실제 데이터가 운영 규칙을 만족하는가
```

물론 둘이 완전히 분리되는 것은 아니다. SHACL도 클래스, 프로퍼티, 관계를 참조하고, 온톨로지와 함께 쓰이는 경우가 많다. 다만 목적은 조금 다르다. OWL이 의미와 추론에 더 가깝다면, SHACL은 검증과 리포팅에 더 가깝다.

## 왜 필요한가

지식 그래프는 유연하다는 장점이 있지만, 그 유연함 때문에 데이터 품질 문제가 조용히 들어오기 쉽다.

예를 들어 다음처럼 데이터가 들어왔다고 해보자.

```text
(성취기준A)-[:RELATED_CONCEPT]->(분수)
(성취기준B)
(성취기준C)-[:RELATED_CONCEPT]->("약분")
(성취기준D {date: "어제"})
```

눈으로 보면 문제가 보인다.

- `성취기준B`는 연결된 개념이 없다.
- `성취기준C`는 개념 노드가 아니라 문자열 값에 연결되어 있다.
- `성취기준D`의 `date`는 날짜 형식이 아니다.

작은 실습 데이터에서는 이런 문제를 직접 찾을 수 있다. 하지만 실제 파이프라인에서는 문서 파싱, LLM 추출, 배치 적재, 수동 보정 데이터가 섞인다. 이때 검증 규칙이 없으면 그래프는 계속 커지는데, 어느 시점부터는 "믿고 탐색할 수 있는 그래프"인지 확신하기 어려워진다.

SHACL은 이런 상황에서 데이터 계약서처럼 동작한다.

```text
이 타입의 노드는 어떤 속성을 가져야 하는가?
속성값은 어떤 datatype이어야 하는가?
관계는 최소 몇 개, 최대 몇 개까지 허용되는가?
관계의 도착 노드는 어떤 클래스여야 하는가?
값은 어떤 목록 안에 있어야 하는가?
문자열은 어떤 패턴을 만족해야 하는가?
```

그래서 SHACL은 특히 다음 상황에서 유용하다.

| 상황 | SHACL이 하는 일 |
| --- | --- |
| RDF/지식 그래프 적재 전후 검증 | 필수 속성, 타입, 관계 누락을 잡는다 |
| LLM으로 추출한 triple 검수 | 잘못된 타입, 엉뚱한 관계, 형식 오류를 잡는다 |
| 외부 기관 데이터 통합 | 공급자마다 다른 데이터 품질을 같은 규칙으로 확인한다 |
| GraphRAG 지식 베이스 운영 | 검색·추론 전에 그래프 신뢰도를 일정 수준으로 유지한다 |
| 온톨로지 변경 영향 확인 | 새 모델 기준으로 기존 데이터가 깨지는지 확인한다 |

## Shape의 기본 구조

SHACL에서 가장 기본이 되는 것은 `NodeShape`와 `PropertyShape`다.

`NodeShape`는 어떤 대상 노드에 규칙을 적용할지 정한다. `PropertyShape`는 그 노드의 특정 속성이나 관계가 어떤 조건을 만족해야 하는지 정의한다.

아래는 Turtle 형식으로 쓴 간단한 예시다.

```turtle
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix edu: <http://example.com/edu#> .

edu:AchievementStandardShape
  a sh:NodeShape ;
  sh:targetClass edu:AchievementStandard ;
  sh:property [
    sh:path edu:code ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:datatype xsd:string ;
    sh:pattern "^[0-9]+[가-힣][0-9]+-[0-9]+$" ;
  ] ;
  sh:property [
    sh:path edu:relatedConcept ;
    sh:minCount 1 ;
    sh:class edu:Concept ;
  ] .
```

이 shape는 이렇게 읽으면 된다.

```text
edu:AchievementStandard 타입의 노드에 대해:
  edu:code는 반드시 1개 있어야 한다.
  edu:code는 최대 1개만 있어야 한다.
  edu:code는 문자열이어야 한다.
  edu:code는 성취기준 코드 패턴을 만족해야 한다.
  edu:relatedConcept는 최소 1개 있어야 한다.
  edu:relatedConcept로 연결된 대상은 edu:Concept여야 한다.
```

자주 쓰는 제약은 다음 정도부터 익히면 충분하다.

| 제약 | 의미 |
| --- | --- |
| `sh:targetClass` | 어떤 클래스에 shape를 적용할지 지정 |
| `sh:path` | 검증할 속성 또는 관계 경로 |
| `sh:minCount` | 최소 개수 |
| `sh:maxCount` | 최대 개수 |
| `sh:datatype` | 리터럴 값의 datatype |
| `sh:class` | 연결된 노드가 가져야 할 클래스 |
| `sh:nodeKind` | IRI, blank node, literal 등 노드 종류 |
| `sh:in` | 허용 값 목록 |
| `sh:pattern` | 문자열 정규식 패턴 |
| `sh:minInclusive`, `sh:maxInclusive` | 숫자 또는 날짜 범위 |

처음부터 SHACL Core 전체를 외우려고 하면 부담스럽다. 실무에서는 대체로 필수값, cardinality, datatype, class range, enum, pattern 정도만 잘 써도 데이터 품질을 꽤 많이 끌어올릴 수 있다.

## RDFS/OWL과 SHACL은 어떻게 다른가

처음에는 `rdfs:domain`, `rdfs:range`, `owl:Restriction`, `sh:class`, `sh:datatype`이 비슷해 보여서 헷갈린다. 나도 이 부분이 제일 헷갈렸다.

간단히 말하면 RDFS/OWL은 **의미를 선언하고 추론하는 모델**에 가깝고, SHACL은 **데이터가 규칙을 위반했는지 검사하는 모델**에 가깝다.

예를 들어 이런 RDFS 선언이 있다고 해보자.

```turtle
edu:relatedConcept
  rdfs:domain edu:AchievementStandard ;
  rdfs:range edu:Concept .
```

이것은 "`relatedConcept`라는 관계를 쓰는 주어는 `AchievementStandard`로, 목적어는 `Concept`로 해석할 수 있다"는 의미 선언에 가깝다. 반면 SHACL의 `sh:class edu:Concept`는 검증 시점에 "이 관계의 대상이 `Concept`가 아니면 violation으로 보고하라"는 규칙에 가깝다.

그래서 데이터 품질 관점에서는 SHACL의 결과가 더 직접적이다.

```text
RDFS/OWL: 이 그래프에서 무엇을 추론할 수 있는가?
SHACL: 이 그래프에서 무엇이 규칙을 어겼는가?
```

둘은 경쟁 관계라기보다 역할이 다르다. 온톨로지로 도메인의 의미 구조를 잡고, SHACL로 운영 데이터의 품질 조건을 잡는 식으로 함께 쓰는 경우가 많다.

## SHACL을 언제 어떻게 쓰면 좋을까

SHACL을 "처음부터 완벽한 스키마를 만들기 위한 도구"라기보다, 그래프 파이프라인의 품질 게이트로 두는 편이 현실적이라고 본다.

예를 들어 GraphRAG 지식 베이스를 만든다면 다음 흐름이 가능하다.

```text
1. 원천 문서를 파싱한다.
2. 엔티티와 관계를 추출한다.
3. RDF triple 또는 graph record로 변환한다.
4. SHACL로 필수 구조와 값 형식을 검증한다.
5. violation을 리포트로 남기거나 적재를 중단한다.
6. 검증을 통과한 데이터만 검색/추천/QA 그래프에 반영한다.
```

규칙은 처음부터 너무 많이 만들지 않는 편이 좋다. 중요한 것부터 시작하면 된다.

```text
필수 식별자
핵심 라벨 또는 클래스
핵심 관계의 최소 개수
관계 대상 타입
날짜, 숫자, 코드 같은 값의 형식
운영에서 허용하는 상태값 목록
```

규칙이 너무 강하면 데이터가 계속 실패하고, 규칙이 너무 약하면 검증의 의미가 없어진다. 그래서 운영 초반에는 warning 성격의 shape부터 만들고, 실제 오류 패턴이 반복되는 부분을 점점 엄격하게 바꾸는 방식이 괜찮다.

## RDF 데이터 검증 예시

아래 데이터에는 일부러 오류를 넣어보았다.

```turtle
@prefix edu: <http://example.com/edu#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

edu:standardA
  a edu:AchievementStandard ;
  edu:code "6수01-06" ;
  edu:relatedConcept edu:fractionReduction .

edu:standardB
  a edu:AchievementStandard ;
  edu:title "분수의 약분과 통분" .

edu:standardC
  a edu:AchievementStandard ;
  edu:code "코드 없음" ;
  edu:relatedConcept "약분" .

edu:fractionReduction
  a edu:Concept ;
  edu:name "약분" .
```

앞에서 만든 shape로 검증하면 대략 이런 문제가 보고될 것이다.

| 노드 | 문제 |
| --- | --- |
| `edu:standardB` | `edu:code`가 없음 |
| `edu:standardB` | `edu:relatedConcept`가 없음 |
| `edu:standardC` | `edu:code`가 패턴을 만족하지 않음 |
| `edu:standardC` | `edu:relatedConcept` 대상이 `edu:Concept`가 아니라 literal임 |

중요한 점은 SHACL이 단순히 "실패"만 알려주는 것이 아니라, 어떤 focus node에서 어떤 property shape가 어떤 값을 문제로 봤는지 리포트할 수 있다는 것이다. 그래서 데이터 정제 파이프라인이나 운영 대시보드와 연결하기도 좋다.

## Neo4j property graph에는 바로 걸 수 있을까

여기서 한 번 헷갈리는 지점이 나온다.

**SHACL은 RDF 그래프를 검증하기 위한 언어다.** 즉 표준 SHACL 자체는 labeled property graph(LPG)인 Neo4j 그래프에 그대로 "바로" 적용되는 개념이 아니다. RDF의 IRI, class, predicate, literal 구조를 전제로 shape를 작성하기 때문이다.

Neo4j는 RDF triple store가 아니라 property graph database다. Neo4j의 노드는 label과 property를 가지고, 관계도 type과 property를 가진다.

```text
RDF:
  subject - predicate - object

Neo4j LPG:
  (:AchievementStandard {code: "6수01-06"})
    -[:RELATED_CONCEPT]->
  (:Concept {name: "약분"})
```

그래서 원칙만 말하면 다음처럼 구분하는 편이 정확하다.

```text
표준 SHACL:
  RDF 데이터를 검증하는 언어

Neo4j property graph:
  SHACL의 원래 데이터 모델과는 다름
```

그렇다면 Neo4j에서 SHACL을 쓰려면 반드시 Neo4j 그래프를 RDF로 export해야 할까?

꼭 그렇지는 않다. **Neo4j의 neosemantics(n10s) 플러그인은 SHACL shape를 읽어 Neo4j property graph를 직접 검증하는 기능을 제공한다. RDF로 내보낼 필요가 없다.**

다만 이 말은 "SHACL 표준이 LPG에 그대로 적용된다"는 뜻은 아니다. 더 정확히는 n10s가 SHACL로 작성된 제약 정의를 Neo4j 안으로 로드하고, Neo4j 그래프의 label, property, relationship에 맞게 해석해서 검증 절차를 실행해준다는 의미다.

## n10s에서 SHACL 검증하기

Neo4j neosemantics 문서에서는 SHACL 제약을 로드한 뒤 Neo4j 그래프를 검증하는 흐름을 제공한다. 절차는 크게 두 단계다.

```text
1. SHACL constraint definition을 Neo4j에 로드한다.
2. 로드된 shape를 기준으로 Neo4j graph를 검증한다.
```

n10s에서는 shape를 URL 또는 파일에서 가져올 수도 있고, 문자열로 inline 로드할 수도 있다.

```cypher
CALL n10s.validation.shacl.import.inline(
  '
  @prefix neo4j: <http://neo4j.com/myvoc#> .
  @prefix sh: <http://www.w3.org/ns/shacl#> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

  neo4j:AchievementStandardShape a sh:NodeShape ;
    sh:targetClass neo4j:AchievementStandard ;
    sh:property [
      sh:path neo4j:code ;
      sh:minCount 1 ;
      sh:maxCount 1 ;
      sh:datatype xsd:string ;
    ] ;
    sh:property [
      sh:path neo4j:RELATED_CONCEPT ;
      sh:minCount 1 ;
      sh:class neo4j:Concept ;
      sh:nodeKind sh:IRI ;
    ] .
  ',
  'Turtle'
);
```

검증은 전체 그래프에 대해 실행할 수 있다.

```cypher
CALL n10s.validation.shacl.validate()
YIELD focusNode, nodeType, propertyShape, offendingValue, resultPath, severity
RETURN focusNode, nodeType, propertyShape, offendingValue, resultPath, severity;
```

특정 노드 집합만 검증할 수도 있다.

```cypher
MATCH (s:AchievementStandard)
WITH collect(s) AS standards
CALL n10s.validation.shacl.validateSet(standards)
YIELD focusNode, nodeType, propertyShape, offendingValue, resultPath, severity
RETURN focusNode, nodeType, propertyShape, offendingValue, resultPath, severity;
```

트랜잭션 단위로 검증해서 위반이 있으면 rollback하는 방식도 가능하다. 운영 적재 파이프라인에서는 이 방식이 꽤 매력적이다. 다만 트랜잭션 검증은 APOC trigger, Neo4j 버전, n10s 버전, 운영 환경 제약을 함께 확인해야 한다.

## n10s를 쓸 때의 핵심 주의점

n10s의 SHACL 검증을 이해할 때 가장 중요한 것은 URI 매핑이다.

SHACL shape는 기본적으로 URI로 클래스와 프로퍼티를 가리킨다.

```turtle
neo4j:AchievementStandardShape
  sh:targetClass neo4j:AchievementStandard ;
  sh:property [
    sh:path neo4j:RELATED_CONCEPT ;
    sh:class neo4j:Concept ;
  ] .
```

그런데 순수 Neo4j property graph에는 보통 이런 긴 URI가 없다.

```cypher
(:AchievementStandard {code: "6수01-06"})
  -[:RELATED_CONCEPT]->
(:Concept {name: "약분"})
```

n10s 문서에서도 SHACL은 schema element를 URI로 참조하기 때문에, RDF를 n10s로 import한 그래프라면 그 URI가 자연스럽게 맞아떨어진다고 설명한다. 반대로 순수 LPG이거나 RDF import 시 `handleVocabUris: "IGNORE"`를 사용한 경우에는 URI의 namespace 부분은 무시되고 local name이 사용된다.

즉 순수 Neo4j 그래프를 검증하려면 shape의 local name이 실제 Neo4j label, property, relationship type과 맞아야 한다.

```text
sh:targetClass neo4j:AchievementStandard
  -> Neo4j label: AchievementStandard

sh:path neo4j:code
  -> Neo4j property: code

sh:path neo4j:RELATED_CONCEPT
  -> Neo4j relationship type: RELATED_CONCEPT
```

이 부분을 놓치면 shape는 멀쩡해 보이는데 검증 결과가 기대와 다르게 나온다. 그래서 n10s로 SHACL을 쓸 때는 먼저 실제 그래프의 label, property, relationship type을 확인해두는 것이 좋다.

```cypher
MATCH (n)
RETURN DISTINCT labels(n) AS labels
LIMIT 20;

MATCH ()-[r]->()
RETURN DISTINCT type(r) AS relationshipType
ORDER BY relationshipType;

MATCH (n)
UNWIND keys(n) AS propertyKey
RETURN DISTINCT propertyKey
ORDER BY propertyKey;
```

또 하나의 주의점은 n10s가 SHACL 전체를 100% 구현한 만능 검증기가 아니라는 점이다. 공식 문서에서도 SHACL 언어의 상당 부분을 지원하지만 전부는 아니라고 설명한다. 실제 운영에 쓰려면 사용하려는 제약이 현재 n10s 버전에서 지원되는지 레퍼런스를 먼저 확인해야 한다.

## SHACL과 Neo4j constraint는 무엇이 다를까

Neo4j에도 고유성, 존재성, 타입 제약 같은 constraint가 있다. 그렇다면 SHACL이 굳이 필요할까?

둘은 겹치는 부분도 있지만 쓰임이 다르다.

| 구분 | Neo4j constraint | SHACL |
| --- | --- | --- |
| 목적 | DB 레벨 무결성 보장 | 그래프 데이터 품질 검증 |
| 강점 | 빠르고 강제력이 있다 | 관계 구조와 도메인 규칙을 더 풍부하게 표현한다 |
| 실행 시점 | 쓰기 시점 중심 | 배치, 부분 검증, 트랜잭션 검증 등 |
| 결과 | 쿼리 실패 또는 제약 오류 | violation report |
| 예시 | `code`는 유일해야 함 | `AchievementStandard`는 최소 1개 `Concept`와 연결되어야 함 |

운영에서는 둘을 같이 쓰는 편이 좋다.

```text
Neo4j constraint:
  절대 깨지면 안 되는 DB 수준 규칙

SHACL:
  도메인 모델 관점의 데이터 품질 규칙
```

예를 들어 `AchievementStandard.code`가 유일해야 한다면 Neo4j constraint로 거는 것이 좋다. 반면 "성취기준은 최소 하나의 개념과 연결되어야 한다" 또는 "문항은 반드시 특정 학년군, 과목, 성취기준 중 하나와 연결되어야 한다" 같은 규칙은 SHACL 쪽이 더 자연스럽다.

## GraphRAG에서의 활용

GraphRAG에서는 검색 품질이 그래프 품질에 직접 영향을 받는다. 관계가 빠져 있거나 타입이 틀리면, 그래프 탐색으로 확장한 컨텍스트도 흔들린다.

예를 들어 질문이 "분수의 약분과 통분을 어려워하는 학생에게 필요한 선수 개념은?"이라면, 시스템은 다음 관계를 믿고 따라갈 수 있어야 한다.

```text
(성취기준)-[:RELATED_CONCEPT]->(개념)
(개념)-[:REQUIRES]->(선수개념)
(개념)-[:HAS_MATERIAL]->(학습자료)
```

여기서 `RELATED_CONCEPT`가 문자열로 들어가 있거나, `REQUIRES` 방향이 뒤집혀 있거나, `HAS_MATERIAL` 대상이 자료 노드가 아니라 성취기준 노드라면 답변 근거가 흐려진다.

SHACL은 이런 구조적 오류를 RAG 호출 시점보다 앞에서 잡는 데 도움이 된다.

```text
데이터 적재 전 검증
  -> 잘못된 triple 또는 record를 격리

배치 적재 후 검증
  -> 그래프 전체 품질 리포트 생성

핵심 서브그래프 검증
  -> 특정 도메인, 학년, 단원 단위로 품질 확인

트랜잭션 검증
  -> 운영자가 직접 수정한 그래프가 규칙을 깨면 반영하지 않음
```

결국 SHACL은 GraphRAG 답변을 직접 똑똑하게 만드는 도구라기보다, 답변이 기대는 지식 그래프를 덜 흔들리게 만드는 도구에 가깝다.

## 정리

SHACL은 RDF 그래프의 구조와 값이 정해둔 규칙을 만족하는지 검증하는 언어다. 온톨로지가 도메인의 의미 모델을 표현한다면, SHACL은 운영 데이터가 그 모델과 데이터 품질 조건을 지키는지 확인한다.

처음 공부할 때는 이렇게 정리해두면 좋을 것 같다.

- SHACL은 RDF 데이터를 검증하는 W3C 표준 언어다.
- `NodeShape`는 검증 대상 노드의 모양을 정의한다.
- `PropertyShape`는 특정 속성 또는 관계의 조건을 정의한다.
- `minCount`, `maxCount`, `datatype`, `class`, `pattern`, `in`부터 익히면 실무 적용이 쉽다.
- RDFS/OWL은 의미와 추론, SHACL은 검증과 리포팅에 더 가깝다.
- Neo4j property graph는 SHACL의 원래 대상인 RDF 그래프와 모델이 다르다.
- 하지만 Neo4j neosemantics(n10s)는 SHACL shape를 읽어 property graph를 직접 검증할 수 있다.
- 이때 RDF로 export할 필요는 없지만, shape의 URI/local name과 Neo4j의 label, property, relationship type 매핑을 신경 써야 한다.


## 참고

- W3C SHACL Recommendation: https://www.w3.org/TR/shacl/
- Neo4j neosemantics: https://neo4j.com/labs/neosemantics/
- Neo4j n10s SHACL validation guide: https://neo4j.com/labs/neosemantics/4.0/validation/
- Neo4j n10s reference: https://neo4j.com/labs/neosemantics/4.0/reference/
