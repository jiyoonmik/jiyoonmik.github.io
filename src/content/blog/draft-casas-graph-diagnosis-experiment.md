---
title: "GNN으로 성능을 올리려다, 문제의 단위를 다시 보게 됐다"
description: "GNN 성능 향상을 위한 문제 단위 재정의에 관한 실험 노트"
pubDate: "2026-07-30"
category: "Tech"
tags: [smart-home, graph-neural-network, experiment, research]
draft: true
---

최근 CASAS smart home assessment 데이터를 가지고 인지 저하 진단 실험을 다시 정리했다. 처음의 질문은 비교적 단순했다. 기존의 Bag-of-Sensors 방식은 센서가 몇 번 켜졌는지만 보니까, 센서의 공간 배치나 활동 수행 흐름을 그래프로 넣으면 성능이 좋아지지 않을까?

그래서 처음에는 activity segment 하나를 sensor graph로 만들고, 그 graph마다 participant diagnosis label을 붙여 ST-GNN 계열 모델을 학습했다. 센서를 node로 두고, 센서 사이의 관계는 spatial edge, temporal transition edge, activity prior edge로 구성했다. 여기에 focal loss, class weight, 5-fold cross validation, seed 반복까지 붙여 정식 실험 형태로 확장했다.

그런데 결과가 기대처럼 나오지 않았다.

전체 accuracy나 weighted F1만 보면 GNN이 나아 보이는 fold도 있었지만, Dementia/MCI recall을 보면 모델이 Healthy majority에 많이 끌려갔다. 어떤 fold에서는 accuracy가 높은데 minority recall이 0에 가까웠다. 이건 진단 모델로서는 좋다고 말하기 어려웠다. 전부 Healthy로 예측해도 accuracy가 꽤 높게 나오는 데이터였기 때문이다.

이 지점에서 문제를 다시 봐야 했다. segment graph는 여러 개지만 diagnosis label은 segment label이 아니라 participant-level label이다. 한 participant의 여러 activity segment에 같은 diagnosis를 복사해서 붙이면, 모델 입장에서는 샘플이 많아 보이지만 실제 독립적인 진단 label은 participant 수만큼만 있다. 결국 문제는 "segment graph classification"이 아니라 "participant-level representation aggregation"에 가까웠다.

그래서 구조를 바꿨다.

각 activity segment는 graph encoder로 embedding을 만들고, participant 안의 여러 segment embedding을 mean pooling이나 attention pooling으로 모은 뒤, 최종 diagnosis는 participant 단위에서 예측하도록 했다. 즉 graph는 최종 분류 샘플이 아니라 활동 수행을 표현하는 중간 표현이 된다.

실험도 이 구조에 맞춰 다시 설계했다.

- Primary task는 Dementia+MCI vs Healthy binary classification으로 두었다.
- 3-class Dementia/MCI/Healthy는 hierarchical exploratory task로 낮췄다.
- split은 participant-disjoint 5-fold, 3 seeds로 고정했다.
- accuracy 대신 macro F1, balanced accuracy, sensitivity, specificity, ROC-AUC, PR-AUC를 함께 봤다.
- threshold는 default 0.5만 보지 않고 validation set 기준으로 조정하는 조건도 비교했다.

가장 먼저 확인한 것은 majority baseline이었다. Healthy가 많은 데이터라 전부 Healthy로 찍어도 accuracy는 약 0.75가 나온다. 하지만 impaired sensitivity는 0이다. 그래서 이 데이터에서 accuracy만 보는 것은 거의 함정에 가깝다.

기존 석사논문 방향에 가까운 BOS compact MLP도 다시 baseline으로 봤다. default threshold에서는 accuracy가 majority baseline과 비슷하게 높았지만, sensitivity가 매우 낮았다. 모델이 impaired를 적극적으로 잡는다기보다 Healthy 쪽 prior에 기대는 경향이 있었다.

그 다음에는 BOS feature에 graph-derived participant feature를 붙였다. segment 수, activity 종류 수, duration 통계, event count 통계, active sensor 수, revisit, temporal transition, activity prior edge, segment status 같은 요약 feature를 participant 단위로 만든 것이다. 이 모델은 꽤 강한 practical baseline이 됐다. 깊은 GNN보다 오히려 안정적인 면이 있었다.

제안 모델 쪽에서는 activity-pretrained graph attention이 가장 의미 있었다. activity ID를 먼저 예측하도록 graph encoder를 pretraining한 뒤, participant-level attention aggregation으로 diagnosis를 예측했다. 이 모델이 accuracy에서 압도적으로 이기지는 못했지만, ROC-AUC와 PR-AUC가 가장 좋았다. 즉 단순히 Healthy만 찍어서 accuracy를 올리는 모델은 아니고, impaired risk를 ranking하는 능력은 상대적으로 더 있었다.

현재까지 가장 중요한 결과를 요약하면 이렇다.

| Model / policy | Accuracy | Macro F1 | Balanced Acc. | Sensitivity | Specificity | ROC-AUC | PR-AUC |
|---|---:|---:|---:|---:|---:|---:|---:|
| Majority healthy | 0.752 | 0.429 | 0.500 | 0.000 | 1.000 | 0.500 | 0.248 |
| BOS compact MLP | 0.745 | 0.479 | 0.519 | 0.071 | 0.968 | 0.582 | 0.358 |
| BOS+graph MLP balanced | 0.700 | 0.624 | 0.638 | 0.516 | 0.760 | 0.668 | 0.465 |
| Activity-pretrained graph attention | 0.685 | 0.619 | 0.637 | 0.542 | 0.731 | 0.688 | 0.485 |

이 표만 보면 "GNN이 압도적으로 성능을 올렸다"고 말할 수는 없다. 오히려 BOS+graph feature MLP가 매우 강한 comparator다. 하지만 제안 모델은 ranking metric에서 가장 좋고, graph attention과 segment-level explanation을 통해 어떤 activity와 sensor transition이 판단에 기여했는지 설명할 수 있다는 장점이 있다.

sensor metadata도 따로 ablation했다. 처음에는 room/function semantic metadata까지 넣으면 진단 성능이 좋아질 것이라고 기대했다. 그런데 결과는 조금 달랐다.

| Metadata mode | Macro F1 | Balanced Acc. | ROC-AUC | PR-AUC |
|---|---:|---:|---:|---:|
| No metadata | 0.577 | 0.601 | 0.652 | 0.446 |
| Coordinate only | 0.615 | 0.644 | 0.691 | 0.500 |
| Semantic nodes | 0.566 | 0.590 | 0.663 | 0.421 |
| Semantic nodes + edges | 0.605 | 0.629 | 0.672 | 0.452 |

좌표 기반 layout 정보는 확실히 도움이 됐다. 반면 room/function semantic metadata는 activity pretraining accuracy는 올렸지만, participant-level diagnosis 성능으로 안정적으로 전이되지는 않았다. 그래서 지금은 semantic metadata를 성능 향상 요소라기보다 XAI와 해석 단위를 보강하는 정보로 보는 게 맞다고 판단했다.

3-class도 바로 multiclass로 밀기보다 hierarchical하게 봤다. 먼저 impaired vs Healthy를 구분하고, impaired로 예측된 경우 Dementia vs MCI를 나누는 방식이다. 여기서 graph attention은 MCI recall을 올렸지만, overall accuracy는 낮았다. 그래서 3-class는 main claim이 아니라 exploratory subtype analysis로 두는 편이 안전하다.

이번 실험을 통해 논지가 꽤 바뀌었다.

처음에는 "ST-GNN으로 기존 BOS보다 높은 진단 성능을 만들자"에 가까웠다. 지금은 "participant-level label 구조를 존중하면서, activity-aware graph representation을 만들고, 이를 attention으로 집계해 minority-sensitive diagnosis와 설명 가능성을 확보하자"에 가깝다.

성능 수치만 보면 아직 부족하다. 다른 논문들의 높은 accuracy와 바로 비교하면 설득력이 약하다. 하지만 그 논문들이 어떤 task를 풀었는지, split 단위가 무엇인지, MCI를 포함했는지, missing/completion 정보를 어떻게 썼는지를 같이 봐야 한다. CASAS cognitive assessment에서 MCI와 Healthy의 경계는 원래 어렵고, participant 수에 비해 class imbalance도 크다.

다음 단계는 성능 주장을 더 단단하게 만드는 것이다.

- Dementia vs Healthy task를 별도로 돌려 기존 문헌과 비교 가능한 축을 만든다.
- 기존 CASAS 논문들이 쓴 activity-quality feature를 재현한다.
  - completion
  - omission
  - sequencing error
  - duration
  - interruption
  - missing task marker
- Logistic Regression, SVM, Random Forest, Gradient Boosting 같은 classical baseline을 같은 participant split에서 비교한다.
- graph attention이 잡은 activity/sensor evidence가 실제로 해석 가능한지 case study를 만든다.

이번 실험의 가장 큰 수확은 모델 성능표 자체보다도, 문제 설정을 다시 잡은 것이다. diagnosis label은 participant에 있고, graph는 activity를 표현한다. 이 둘을 구분하지 않으면 graph model은 복잡해지기만 하고, 실제 진단 성능은 Healthy majority에 쉽게 끌려간다.

그래서 지금의 결론은 조금 보수적이다.

GNN이 모든 것을 해결하지는 않았다. 하지만 sensor layout과 activity structure를 participant-level로 집계하는 방식은 기존 BOS 접근이 놓치던 설명 가능성과 ranking signal을 제공한다. 이제 남은 일은 기존 논문식 activity-quality feature와 더 공정한 baseline을 붙여, 이 신호가 어느 정도까지 진단 성능으로 이어질 수 있는지 확인하는 것이다.
