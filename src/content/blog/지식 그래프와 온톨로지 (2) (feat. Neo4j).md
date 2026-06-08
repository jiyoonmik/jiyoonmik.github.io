---
title: '지식 그래프와 온톨로지 (2) (feat. Neo4j)'
description: 'GraphRAG 프로젝트를 계기로 정리한 지식 그래프, 온톨로지, Protege, Neo4j 기초 개념'
pubDate: '2026-06-09'
category: 'Tech'
heroImage: '../../assets/ontology_class.png'
homeFeatured: true
---
`지식그래프`, `온톨로지`, `protege`, `neo4j`

GraphRAG 기반 AI 시스템 프로젝트에서 그래프 구축 업무도 담당하게 되면서 막연하게 주먹구구 식으로 지식 그래프에 대해서 기초가 부족함을 느껴서 정리가 필요하다고 느껴져 온톨로지부터 그래프 데이터베이스까지 일단 간략하게 짚어보면서 기록해두려고 한다.


## Neo4j와 연결하기

Neo4j는 RDF triple store가 아니라 property graph database다. 그래서 OWL/RDF 세계와 Neo4j 세계의 모델이 완전히 같지는 않다.

RDF는 기본적으로 triple 중심이다.

```text
subject - predicate - object
```

Neo4j는 노드, 관계, 속성 중심이다.

```cypher
(:Area {name: "아시아"})-[:HAS_COUNTRY]->(:Country {name: "대한민국"})
(:Country {name: "대한민국"})-[:HAS_CITY]->(:City {name: "서울"})
(:Event {name: "외교행사A"})-[:RELATED_COUNTRY]->(:Country {name: "대한민국"})
```

둘 다 그래프를 다루지만, 질의 언어와 데이터 모델이 다르고, 그에 따라 용어도 좀 달라진다.

| 구분 | RDF/OWL | Neo4j |
| --- | --- | --- |
| 기본 단위 | Triple | Node, Relationship, Property |
| 질의 언어 | SPARQL | Cypher |
| 강점 | 표준화된 의미 표현, 추론 | 빠른 그래프 탐색, 애플리케이션 연동 |
| 대표 도구 | Protege, RDF store | Neo4j Browser, Neo4j Bloom |

Neo4j에서 RDF/OWL 데이터를 다루려면 보통 neosemantics(n10s) 플러그인을 사용한다. n10s는 RDF, RDFS, OWL, SKOS 같은 semantic web 데이터를 Neo4j로 가져오거나 내보내는 기능을 제공한다.

이전 글부터 이어온 흐름은 다음과 같다.

```text
Protege에서 온톨로지 작성
        ↓
OWL 또는 Turtle 파일로 저장
        ↓
Neo4j에 neosemantics 플러그인 설정
        ↓
Graph config 초기화
        ↓
온톨로지 또는 RDF 데이터 import
        ↓
Cypher로 탐색
```

Neo4j에서 먼저 URI 유니크 제약 조건을 만든다.

```cypher
CREATE CONSTRAINT n10s_unique_uri IF NOT EXISTS
FOR (r:Resource)
REQUIRE r.uri IS UNIQUE;
```

그 다음 graph config를 초기화한다.

```cypher
CALL n10s.graphconfig.init();
```

Protege에서 Turtle 형식으로 저장한 온톨로지를 가져올 때는 다음과 같은 형태로 호출할 수 있다.

```cypher
CALL n10s.onto.import.fetch(
  "file:///mofa-sample-ontology.ttl",
  "Turtle"
);
```

실제 RDF 인스턴스 데이터까지 가져올 때는 `n10s.rdf.import.fetch`를 사용한다.

```cypher
CALL n10s.rdf.import.fetch(
  "file:///mofa-sample-data.ttl",
  "Turtle"
);
```

대략적으로는 이렇게 구분할 수 있다.

```text
n10s.onto.import.fetch:
Class, Property, subClassOf 같은 온톨로지 구조를 가져올 때

n10s.rdf.import.fetch:
실제 개체와 관계 데이터까지 RDF로 가져올 때
```

가져온 뒤에는 Cypher로 탐색한다.

```cypher
MATCH (p:Resource)-[r]->(o:Resource)
RETURN p.uri, type(r), o.uri
LIMIT 25;
```

또는 특정 국가와 연결된 도시나 사건을 찾는 식의 질의도 가능하다.

```cypher
MATCH (country)-[:hasCity]->(city)
WHERE country.uri CONTAINS "Korea"
RETURN country, city;
```

```cypher
MATCH (event)-[:relatedCountry]->(country)
WHERE country.uri CONTAINS "Korea"
RETURN event, country;
```

실제 프로젝트에서는 OWL의 모든 의미를 Neo4j가 그대로 추론해준다고 기대하기보다는, Protege와 reasoner로 모델을 설계하고 검증한 뒤 Neo4j에서는 탐색과 서비스 연동에 적합한 그래프 형태로 활용한다고 보는 편이 현실적일 것 같다.

## GraphRAG 관점에서의 정리

GraphRAG에서 중요한 것은 단순히 그래프 DB를 쓰는 것이 아니라, 어떤 노드를 만들고 어떤 관계를 연결할지 결정하는 것이다. 이때 온톨로지가 기준점 역할을 한다.

예를 들어 외교 데이터 도메인이라면 다음과 같은 질문이 먼저 필요하다.

```text
특정 사건은 어떤 국가, 도시, 인물과 연결되는가?
특정 국가는 어떤 지역에 속하고 어떤 도시를 포함하는가?
특정 인물은 어떤 기관, 직위, 사건과 연결되는가?
보도자료나 외교일지는 어떤 사건과 국가를 언급하는가?
질문에 답할 때 문서의 유사도뿐 아니라 어떤 명시적 관계를 따라갈 것인가?
```

이 질문에 대한 답을 온톨로지로 정리하면 그래프 구축 기준이 생긴다. 그리고 Neo4j는 그 기준에 따라 만들어진 실제 지식 그래프를 탐색하고, RAG 파이프라인에서 문서와 개체의 맥락을 함께 사용할 수 있게 해준다.

정리하면 이번 글에서 잡은 개념은 다음과 같다.

```text
온톨로지:
도메인 지식의 개념, 관계, 제약을 명시적으로 정의하는 의미 모델

Protege:
온톨로지를 시각적으로 설계하고 reasoner로 검증하는 도구

Neo4j:
그래프 형태의 데이터를 저장하고 Cypher로 탐색할 수 있는 그래프 DBMS

neosemantics:
RDF/OWL 세계와 Neo4j property graph 세계를 연결해주는 플러그인
```

결국 온톨로지와 Neo4j는 서로 대체 관계라기보다는 역할이 다르다. 온톨로지는 그래프가 담아야 할 의미의 기준을 세우고, Neo4j는 그 그래프를 실제 시스템에서 탐색하고 활용하는 실행 환경이 된다.
