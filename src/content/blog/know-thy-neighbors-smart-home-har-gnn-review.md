---
title: "Know Thy Neighbors 리뷰: 스마트홈 HAR을 센서 관계 그래프로 보기"
description: "스마트홈 활동 인식 논문 Know Thy Neighbors의 문제 설정, GNN 구조, 실험 결과, 그리고 co-firing 관계와 시간 선후관계에 대한 의문 정리"
pubDate: "2026-06-21"
category: "Paper Review"
heroImage: "../../assets/kyn-approach-overview.png"
---

스마트홈 Human Activity Recognition, 줄여서 HAR은 웨어러블 센서 기반 HAR과 성격이 다른 편이다. 스마트워치나 IMU 데이터는 일정한 주기로 촘촘하게 들어오는 경우가 많지만, 집 안 센서 이벤트는 희소하고 불규칙하다. 문 센서는 아주 짧게 켜졌다 꺼지고, 침대 센서나 모션 센서는 특정 공간과 생활 패턴에 강하게 묶여 있으며, 어떤 활동은 몇 초 만에 끝나지만 어떤 활동은 몇 시간 동안 이어진다.

[Know Thy Neighbors: A Graph Based Approach for Effective Sensor-Based Human Activity Recognition in Smart Homes](https://arxiv.org/abs/2311.09514)는 이 문제를 “시계열을 잘 분류하는 문제”로만 보지 않고, 집 안 센서들이 서로 어떤 관계를 가지는지 학습하는 문제로 다시 잡는다. 논문의 핵심은 단순하다. 센서를 독립적인 feature로 취급하지 말고, 센서들을 노드로 두고 co-firing 관계를 엣지로 학습하자는 것이다.


과거 HAR 관련해서 학위논문을 썼던 ~~흑역사~~ 이력과 최근 그래프 관련 공부/업무를 하게 되면서 둘을 엮어볼 수 없을까 생각하고 찾아보니 ~~역시나~~ 관련 최근 논문들을 찾아볼 수 있었다. 

이 논문은 GNN 모델을 썼다는 점보다는 문제 설정 면에서 유사하다고 생각해 참고하게 되었다. 스마트홈 HAR에서 중요한 것은 특정 시점의 센서 값 하나가 아니라, “이 센서가 켜졌을 때 어떤 주변 센서들의 상태를 함께 봐야 활동을 더 잘 판단할 수 있는가”에 가깝다고 생각하게 되었는데, 본 논문은 이 관점을 제목 `Know Thy Neighbors`로 표현해서 내심 재밌었다.

![Know Thy Neighbors 모델 전체 구조](../../assets/kyn-approach-overview.png)

_그림: 논문 Figure 1. 입력 센서 이벤트를 인코딩하고, 센서별 임베딩으로 그래프 구조를 학습한 뒤, attention과 hierarchical pooling으로 활동을 분류한다._

## 문제의식

논문은 스마트홈 HAR의 현실적인 어려움을 네 가지로 정리한다.

첫째, 센서 값이 불규칙하고 결측이 많다. 집 안의 센서들은 같은 sampling rate로 움직이지 않는다. 어떤 센서는 오래 조용히 있다가 한 번만 fire되고, 어떤 센서는 특정 공간에서 반복적으로 fire된다.

둘째, 활동 데이터가 희소하다. `Leave Home`처럼 짧은 이벤트도 있고, `Sleep`처럼 긴 이벤트도 있다. 센서가 거의 켜지지 않는 구간도 많다.

셋째, 노이즈와 중복이 있다. 같은 센서 조합이 서로 다른 활동에서 나타날 수 있고, 한 활동을 수행하는 동안 관련 없는 공간의 센서가 같이 켜질 수도 있다.

넷째, 라벨링된 데이터가 제한적이다. 집 안 생활 데이터는 프라이버시 이슈가 있고, 장기간 정교하게 라벨링하기 어렵다.

여기서 논문이 특히 강하게 비판하는 지점은 `oracle-guided segmentation`이다. 많은 기존 방법은 연속적인 센서 스트림에서 활동에 해당하는 구간이 이미 잘 잘려 있다고 가정한다. 하지만 실제 배포 환경에서 사용자가 활동 구간을 미리 잘라줄 수는 없다. 논문은 이 가정이 스마트홈 HAR을 실제 서비스로 옮길 때 큰 약점이라고 본다. 이전에 논문을 작성할 때가 생각나 공감이 갔다.

## 핵심 아이디어: 센서를 노드로, 관계를 엣지로

이 모델의 구조는 크게 다섯 단계로 볼 수 있다.

```text
raw sensor events
  -> forward imputation
  -> RNN/BiLSTM encoder
  -> sensor-specific embedding
  -> attention-based graph structure learning
  -> hierarchical pooling + activity classification
```

전처리에서는 센서 이벤트를 시간 순서에 맞게 정리하고, 관측이 없는 timestep에는 마지막으로 관측된 값을 가져오는 forward imputation을 사용한다. 논문은 더 복잡한 interpolation보다 이 단순한 방식이 오히려 안정적이었다고 보고한다.

그다음 encoder가 각 센서의 입력 `x_i`를 feature vector `h_i`로 바꾼다. 최종 모델에서는 BiLSTM encoder가 가장 좋은 성능을 냈다. 이 지점이 뒤에서 다룰 “시간 순서 정보가 어디에 들어가는가?”라는 질문과 연결된다.

센서별 embedding 단계에서는 각 센서마다 별도의 trainable weight를 둔다. 논문은 이를 `sensor behavior`를 잡기 위한 장치로 설명한다. 예를 들어 복도 센서와 침대 센서는 fire 빈도, 주기성, 값의 분포가 다르다. 모델은 이런 센서별 성격을 embedding으로 학습한 뒤, 그 embedding을 graph structure learning과 attention 계산에 사용한다.

## Edge pruning: 모든 센서를 다 연결하지 않는다

처음에는 fully connected graph에서 출발할 수 있다. 하지만 모든 센서가 모든 센서와 의미 있게 연결된다고 보는 것은 과하다. 그래서 논문은 sensor embedding 사이의 normalized dot product로 유사도를 계산하고, 각 센서마다 top-k 관계만 남긴다. 실험에서 사용한 `k`는 5다.

![Edge pruning 과정](../../assets/kyn-edge-pruning.png)

_그림: 논문 Figure 3. 후보 그래프에서 센서 embedding 유사도를 계산하고, top-k edge만 유지한다._

이 pruning은 두 가지 의미가 있다.

첫째, sparse한 스마트홈 센서 데이터에서 불필요한 message passing을 줄인다. 관련 없는 센서에서 정보가 들어오면 특정 센서의 표현이 오히려 흐려질 수 있다.

둘째, GNN의 over-smoothing을 완화한다. message passing을 반복하면 노드 표현이 서로 비슷해지는 문제가 생길 수 있는데, top-k neighbor만 남기면 한 센서가 너무 많은 주변 센서의 영향을 받는 것을 줄일 수 있다.

## Attention 학습

논문은 directed graph를 사용한다. 엣지 `u -> v`는 센서 `u`가 센서 `v`의 표현 업데이트에 영향을 줄 수 있음을 뜻한다. 방향 그래프를 쓰는 이유는 센서 간 dependency가 반드시 대칭일 필요는 없기 때문이다.

attention mechanism은 이웃 센서들의 feature를 같은 비중으로 합치지 않고, 센서별 중요도를 다르게 둔다. 각 노드의 업데이트는 자기 자신과 이웃 노드들의 transformed feature를 attention weight로 가중합하는 방식이다. 중요한 점은 attention 계산에 단순 feature뿐 아니라 sensor embedding도 함께 들어간다는 것이다. 즉, 현재 관측값과 센서의 고유한 행동 패턴을 같이 보고 관계 강도를 계산한다.

## 실험 조건

실험은 CASAS의 다섯 데이터셋에서 진행된다.

| Dataset | Residents | Sensors | Activities | Days |
| ------- | --------: | ------: | ---------: | ---: |
| Aruba   |         1 |      39 |         12 |  219 |
| Cairo   |   2 + pet |      27 |         13 |   56 |
| Kyoto7  |         2 |      58 |         13 |   46 |
| Kyoto8  |         2 |      61 |         12 |   58 |
| Milan   |   1 + pet |      33 |         16 |   82 |

평가 방식은 일반적인 random split이 아니라 forward chaining이다. 시계열 데이터에서는 인접한 window들이 서로 독립적이지 않기 때문에, random K-fold를 쓰면 현실보다 쉬운 평가가 될 수 있다. 논문은 데이터를 시간 순서대로 나누고, 이전 구간으로 학습한 뒤 이후의 unseen subsequence를 테스트하는 식으로 3-fold 평가를 수행한다.

![Forward chaining 평가 방식](../../assets/kyn-evaluation-methodology.png)

_그림: 논문 Figure 5. 시간 순서를 보존하는 forward chaining 평가 방식._

주요 학습 조건은 다음과 같다.

| 항목                    | 설정                    |
| ----------------------- | ----------------------- |
| 평가                    | 3-fold forward chaining |
| validation              | train subsequence의 10% |
| batch size              | 128                     |
| optimizer               | Adam                    |
| learning rate           | 0.001                   |
| weight decay            | 0.5%                    |
| early stopping patience | 15 epochs               |
| max epoch               | 300                     |
| 실제 종료               | 대체로 50-80 epochs     |
| window size             | 20 timesteps            |
| overlap                 | 50%                     |
| edge pruning            | top-5 edges             |

여기서 한 가지 짚고 넘어갈 부분이 있다. 논문은 oracle segmentation을 요구하지 않는다는 점을 강조하지만, 실험에서는 window size 20과 50% overlap을 사용한다. 따라서 이 방법을 완전히 window-free라고 부르기는 어렵다. 더 정확히는 “사람이 활동 구간을 미리 잘라주는 oracle segmentation에는 의존하지 않지만, 모델 입력을 만들기 위한 fixed timestep window는 사용한다”고 보는 편이 맞다.

## 결과: GNN이 전반적으로 가장 높은 F1 score 보임

주요 classification 결과는 다음과 같다. F1 score 기준으로 제안 모델이 다섯 데이터셋 모두에서 가장 높다.

| Method       |   Kyoto8 |    Milan |   Kyoto7 |    Aruba |    Cairo |
| ------------ | -------: | -------: | -------: | -------: | -------: |
| CNN1D        |     26.6 |     36.6 |     74.9 |     65.6 |     80.5 |
| LSTM         |     22.7 |     30.6 |     76.4 |     83.7 |     81.1 |
| BiLSTM       |     27.5 |     45.5 |     77.5 |     90.1 |     84.2 |
| TLGAT        |     72.8 |     74.5 |     83.4 |     91.8 |     85.1 |
| Proposed GNN | **78.3** | **80.4** | **88.7** | **92.4** | **88.7** |

특히 Kyoto8과 Milan에서 차이가 크다. 논문은 이 데이터셋들이 더 어렵기 때문에, 센서 관계를 명시적으로 학습하는 이점이 더 크게 나타난다고 해석한다. Milan은 센서 activity가 더 넓게 퍼져 있고, Aruba보다 sensor activation 수가 적어 학습이 더 어렵다는 설명도 붙는다.

센서 dropout 실험도 설득력 있다. 실제 스마트홈에서는 센서가 고장나거나 배터리가 떨어지거나 네트워크 문제로 일부 관측이 빠질 수 있다. 논문은 중요한 센서를 고정적으로 제거하는 setting과, 매 window마다 random sensor를 제거하는 setting을 모두 본다.

예를 들어 Milan에서 중요한 센서 40%가 빠졌을 때 BiLSTM은 F1 8.0까지 떨어진다. 반면 제안 GNN은 53.8을 유지한다. Kyoto7에서도 같은 조건에서 BiLSTM은 35.1, 제안 GNN은 79.9다. 이 결과는 “센서 하나의 값”보다 “관련 센서들의 관계 구조”를 학습해두는 것이 결측에 더 강할 수 있음을 보여준다.

## Ablation: graph structure가 효과적이다!

논문의 ablation은 구성 요소별 기여를 보여준다.

| Method                        |   Kyoto8 |    Milan |   Kyoto7 |    Aruba |    Cairo |
| ----------------------------- | -------: | -------: | -------: | -------: | -------: |
| Baseline                      |     20.2 |     41.3 |     54.9 |     66.7 |     72.6 |
| Graph                         |     71.5 |     70.9 |     76.8 |     83.7 |     78.4 |
| Graph + Embedding             |     73.5 |     72.2 |     80.6 |     87.3 |     82.2 |
| Graph + Embedding + Attention | **78.3** | **80.4** | **88.7** | **92.4** | **88.7** |

가장 큰 점프는 baseline에서 graph로 넘어갈 때 나온다. embedding과 attention도 성능을 올리지만, 이 논문의 중심 주장은 결국 graph inductive bias가 스마트홈 HAR에 잘 맞는다는 것이다.

encoder ablation도 흥미롭다. BiLSTM이 최종적으로 가장 좋지만, linear encoder도 상당히 강하다.

| Encoder     |   Kyoto8 |    Milan |   Kyoto7 |    Aruba |    Cairo |
| ----------- | -------: | -------: | -------: | -------: | -------: |
| GRU         |     75.5 |     80.3 | **88.7** |     91.2 |     88.3 |
| LSTM        |     74.6 |     79.2 |     84.7 |     90.1 |     88.3 |
| Transformer |     75.5 |     79.8 |     84.6 |     90.4 |     88.4 |
| Linear      |     75.5 |     80.1 |     85.6 |     91.1 |     88.2 |
| BiLSTM      | **78.3** | **80.4** | **88.7** | **92.4** | **88.7** |

이 결과는 논문이 스스로 언급하듯이, 스마트홈 HAR에서는 긴 시간 문맥을 복잡하게 잡는 것보다 “어떤 센서들이 서로 관련되어 있고, 관련 센서에서 어떤 값이 관측됐는가”가 더 중요할 수 있음을 시사한다.

## Q1: fire의 선후관계가 edge에 들어갔다고 볼 수 있을까?

처음 읽으면서 가장 궁금했던 부분은 이거였다.

> 이 논문에서 co-firing 관계 말고, 센서 fire의 선후관계가 엣지나 모델에 반영됐다고 볼 수 있을까?

이 논문의 graph edge는 주로 센서 간 co-firing, dependency, correlation 관계를 나타낸다. edge pruning도 sensor embedding 사이의 normalized dot product와 top-k similarity를 기준으로 한다. 즉 `A 센서가 먼저 켜진 뒤 B 센서가 켜진다` 같은 temporal transition probability나 lagged relation을 직접 edge type으로 넣지는 않는다.

물론 directed edge를 쓰기 때문에 얼핏 시간 방향처럼 보일 수 있다. 하지만 논문에서 directed edge의 의미는 시간상 먼저 발생했다는 뜻이라기보다, 한 센서의 표현이 다른 센서의 표현 업데이트에 비대칭적으로 영향을 줄 수 있다는 뜻에 가깝다.

따라서 이 모델은 `sensor transition graph`라기보다 `sensor co-firing/dependency graph`로 봐야하고, 엣지에 명시적으로 반영됐다고 보기에는 어렵다.


```text
명시적으로 모델링하는 것:
  센서 간 관련성, co-firing, dependency, attention weight

명시적으로 모델링하지 않는 것:
  A fired before B, lagged transition, event-order edge type
```

## Q2: 그렇다면 시간 순서 정보는 어떻게 반영하고 있는지?

시간 순서 정보가 아예 없는 것은 아니다. 논문 안에서 시간 정보가 들어갈 수 있는 경로는 분명하다.

먼저 raw sensor events는 chronological order로 정리된다. 전처리 단계에서 중복을 제거하고, 잘못된 순서의 sensor activation을 시간 순서에 맞게 재정렬한다. 그다음 각 dataset은 consecutive sensor events 사이의 가장 작은 시간 간격을 기준으로 step을 만들고, 관측이 없는 step에는 forward imputation을 적용한다.

그리고 encoder가 있다. 논문은 discrete sensor events를 encoder에 넣어 시간 문맥을 담은 feature vector를 만든다고 설명한다. 최종 모델은 BiLSTM encoder를 사용한다. 따라서 시간 순서 정보는 edge의 의미로 직접 들어간다기보다, `h_i`라는 node feature 또는 그 이후의 sensor embedding 경로로 간접적으로 들어간다고 보는 것이 맞다.

정리하면 다음과 같다.

```text
chronological sensor events
  -> timestep window
  -> BiLSTM encoder
  -> temporal context가 담긴 node feature h_i
  -> sensor-specific embedding s_i
  -> edge pruning / attention / message passing에 간접 영향
```

다만 encoder ablation에서 linear encoder가 꽤 강했다는 점은 중요하다. 이 결과는 모델의 핵심 이득이 fire 선후관계를 정교하게 잡는 데 있다기보다, 센서 관계 구조를 잘 학습하는 데 있다는 해석을 강화한다.

## 설명 가능성: attention map은 직관적인 이해에는 도움이 되지만 조심해야 힘

논문은 attention map을 통해 모델 판단을 설명할 수 있다고 본다. Milan 데이터셋에서 `sleeping`을 맞춘 사례를 보면 attention map에서 M028이 가장 강하게 나타나고, Milan layout을 보면 M028은 master bedroom의 침대 관련 센서다. 직관적으로 납득이 되는 설명이다.

![Sleeping activity attention map](../../assets/kyn-attention-map-sleeping.png)

_그림: 논문 Figure 7 일부. Milan 데이터셋의 sleeping 예시에서 sensor 28이 강한 attention을 받는다._

![Milan smart home layout](../../assets/kyn-milan-layout.png)

_그림: 논문 Figure 7 일부. Milan layout에서 M028은 master bedroom 쪽 센서다._

하지만 attention이 곧 인과적 설명이라는 뜻은 아니다. attention map은 모델이 어떤 센서 관계에 높은 가중치를 두었는지 보여주는 좋은 단서지만, 그것만으로 “모델이 실제로 그 이유 때문에 sleep이라고 판단했다”고 확정하기는 어렵다. 특히 스마트홈 데이터처럼 센서 간 상관관계가 강한 환경에서는 attention 기반 설명을 해석할 때 조심해야 한다.

그래도 이 논문이 설명 가능성의 출발점을 만든 것은 의미가 있다. 기존 RNN이나 CNN 기반 HAR보다 “어떤 센서 관계가 판단에 중요했는가”를 시각화하기 쉽기 때문이다.

## 아쉬운 점

첫째, `oracle segmentation`을 비판하는 문제의식은 좋지만, 실험 자체는 window size 20과 50% overlap을 사용한다. 그래서 이 방법을 “window 문제를 완전히 해결했다”고 말하기보다는 “활동 라벨 기반 oracle segmentation 의존을 줄였다”고 표현하는 것이 더 정확하다.

둘째, transfer learning은 아직 다루지 않는다. 실제 스마트홈 배포에서는 집마다 센서 위치, 개수, 거주자 패턴이 다르다. 논문도 learned graph structure를 새로운 home layout에 옮기는 실험은 future work로 남긴다. 이 부분이 해결되어야 제품 수준의 일반화 가능성을 더 강하게 주장할 수 있다.

셋째, co-firing graph와 temporal transition graph의 구분이 더 명확했으면 좋겠다. 논문은 “relationships evolve over time” 같은 표현을 쓰지만, edge 자체가 event order나 time lag를 나타내지는 않는다. 이 모델의 시간성은 주로 전처리된 timestep window와 sequential encoder를 통해 들어간다.

넷째, attention 설명은 유용하지만 충분조건은 아니다. attention map은 debugging과 trust-building에 도움이 되지만, 설명 가능성을 엄밀하게 주장하려면 counterfactual test나 sensor masking 기반 attribution 같은 추가 검증이 있으면 더 좋았을 것 같다.

## 정리

이 논문은 스마트홈 HAR에서 GNN을 써야 하는 이유를 꽤 설득력 있게 보여준다. 핵심은 “센서들은 독립적인 feature가 아니라 서로 의미 있는 관계를 가진다”는 inductive bias를 모델 안에 넣은 것이다.

실험도 단순 accuracy 비교에 그치지 않는다. forward chaining으로 시간 순서를 보존하고, sensor dropout 실험으로 실제 배포에서 발생할 수 있는 결측 상황을 다룬다. ablation에서는 graph structure 자체가 가장 큰 성능 향상을 만든다는 점도 확인한다.

이 논문에서 가장 가져갈 만한 포인트는 두 가지다.

첫째, 스마트홈 HAR은 sequence modeling만으로 보기보다 relation modeling으로 보는 것이 자연스럽다.

둘째, 이 모델의 edge는 “A 다음 B”라는 이벤트 순서보다는 “A와 B가 활동 인식에 함께 유용한 관계인가”를 나타낸다. 시간 정보는 BiLSTM encoder와 timestep window를 통해 node representation에 간접적으로 들어가지만, fire 선후관계가 graph edge로 명시적으로 모델링되는 구조는 아니다.

그래서 이 논문은 sensor event-order graph를 제안한 논문이라기보다, smart home sensor co-firing graph를 학습해 활동 인식의 robustness를 높인 논문으로 읽는 편이 가장 정확하다.

## References

- Srivatsa P, Thomas Plötz, [Know Thy Neighbors: A Graph Based Approach for Effective Sensor-Based Human Activity Recognition in Smart Homes](https://arxiv.org/abs/2311.09514), arXiv:2311.09514, 2023.
