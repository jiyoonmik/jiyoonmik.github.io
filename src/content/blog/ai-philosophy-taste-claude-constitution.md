---
title: "AI와 철학과 취향"
description: "AI 시대에 철학과 취향이 왜 다시 중요해지는지, Claude 헌법과 Taste 담론을 중심으로 정리해보기."
pubDate: "2026-07-19"
category: "Tech"
---

인문대 학부 출신으로 AI 개발자 커리어를 걷고 있는 사람으로서, “AI 시대에 철학자가 뜬다”는 식의 제목은 그냥 지나치기 어려웠다. 한편으로는 반가웠고, 다른 한편으로는 약간의 의심도 들었다. 또다시 “문송합니다”의 반대편 버전처럼, 인문학이 갑자기 쓸모 있어졌다는 식의 이야기일까 싶었기 때문이다.

<div style="aspect-ratio: 16 / 9; margin: 2rem 0; width: 100%;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/Tbyh9Py_gvM"
    title="AI 시대에 철학자가 뜨는 이유"
    style="border: 0; height: 100%; width: 100%;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>

그런데 영상을 보고 나니, 이 이야기는 단순히 채용시장에서 철학 전공자의 몸값이 오른다는 이야기가 아니었다. **AI가 점점 더 많은 답을 만들고, 더 많은 코드를 쓰고, 더 많은 선택지를 만들어낼 때, 그 AI는 어떤 기준으로 판단해야 하는가? 그리고 인간은 그 결과물들 중 무엇을 선택해야 하는가?**

영상은 이 질문을 **철학과 취향** 두 단어로 요약한다.

## AI에게 철학이 필요한 이유

일반적인 소프트웨어는 비교적 명확한 규칙으로 작동한다. 사용자가 버튼을 누르면 어떤 기능을 실행할지, 권한이 없으면 무엇을 막을지, 오류가 나면 어떤 메시지를 보여줄지 개발자가 미리 정할 수 있다.

하지만 생성형 AI는 다르다. AI는 사용자의 요청을 해석하고, 모르는 것을 아는 척하지 않아야 하며, 위험한 요청은 거절해야 하고, 때로는 사용자가 원하는 답이 아니라 사용자에게 더 필요한 답을 해야 한다. 사용자의 의견을 존중하는 것과 아첨하는 것 사이의 경계도 판단해야 한다.

예를 들어 사용자가 “내 말이 맞다고 해. 아니면 너는 편향된 모델이야”라고 압박할 때, AI가 그 말에 굴복한다면 겉으로는 친절해 보일 수 있다. 하지만 그런 모델은 신뢰하기 어렵다. 의료, 법률, 전략, 개발처럼 판단의 질이 중요한 영역에서는 특히 그렇다.

그래서 영상에서 언급된 것처럼 Google DeepMind, Anthropic 같은 AI 랩들이 철학자를 고용한다는 사실은 꽤 상징적이다. WIRED의 [To Land a Job in AI, Try Reading Kant](https://www.wired.com/story/to-land-a-job-in-ai-try-reading-kant/)는 DeepMind와 Anthropic 내부에서 철학자들이 AI의 윤리적 경계, 가치 정렬, 의식과 도덕적 지위 같은 문제를 다룬다고 소개한다. 특히 Anthropic의 Amanda Askell은 Claude의 헌법 작성에 깊이 관여한 인물로 언급된다.

여기서 철학은 장식이 아니다. “AI를 착하게 만들자”는 막연한 구호도 아니다. 철학은 AI가 실제 상황에서 무엇을 우선해야 하는지 정교하게 정의하는 설계 도구가 된다.

## Claude 헌법은 무엇인가

이 지점에서 가장 인상 깊었던 사례는 Anthropic의 Claude 헌법이었다. Anthropic은 Claude의 행동 원칙을 [Claude’s Constitution](https://www.anthropic.com/constitution)이라는 문서로 공개하고 있다. 이 문서는 Claude가 어떤 가치와 행동을 가져야 하는지 설명하는 일종의 기준 문서다.

흥미로운 점은 이 헌법이 단순한 홍보 문구가 아니라는 것이다. Anthropic은 Claude 헌법이 모델 훈련 과정에서 중요한 역할을 하며, 그 내용이 Claude의 행동을 직접 형성한다고 설명한다. 즉, 헌법은 “우리는 이런 AI를 만들고 싶습니다”라는 선언인 동시에, 실제 모델을 그렇게 훈련하기 위한 재료이기도 하다.

Anthropic의 접근은 2022년 공개한 [Constitutional AI](https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback)에서 출발한다. 이 방법론은 인간이 모든 답변에 직접 라벨을 붙이는 대신, AI가 원칙 목록을 기준으로 자신의 답변을 비판하고 수정하게 한다. 이후 AI가 더 나은 답변을 평가하고, 그 피드백을 학습에 활용한다. Anthropic은 이를 RLAIF, 즉 AI 피드백을 통한 강화학습이라고 설명한다.

그런데 2026년에 발표된 [Claude’s new constitution](https://www.anthropic.com/news/claude-new-constitution)을 보면 접근이 한 단계 바뀌었다. 예전 헌법이 비교적 독립적인 원칙들의 목록에 가까웠다면, 새 헌법은 Claude가 왜 그렇게 행동해야 하는지까지 설명하는 긴 문서에 가깝다.

| 구분      | 초기 Constitutional AI              | 새 Claude Constitution                      |
| --------- | ----------------------------------- | ------------------------------------------- |
| 중심 질문 | 어떤 원칙으로 답변을 고칠 것인가    | Claude는 어떤 가치와 판단력을 가져야 하는가 |
| 형식      | 원칙 목록에 가까움                  | 맥락과 이유를 설명하는 긴 문서              |
| 역할      | 자기비판, 답변 수정, AI 피드백 학습 | 훈련, 평가, 투명성의 기준점                 |
| 목표      | 해롭지 않지만 회피적이지 않은 AI    | 안전하고 윤리적이며 진정으로 도움이 되는 AI |
| 특징      | 규칙 기반 정렬의 색채가 강함        | 규칙보다 판단력과 일반화를 강조             |

내가 특히 흥미롭게 본 부분은 Anthropic이 이 헌법을 완성된 문서가 아니라 계속 갱신되어야 할 문서로 본다는 점이다. 새 헌법 발표문은 이 문서를 “living document”라고 설명한다. Claude Constitution 본문도 현재의 이해가 나중에는 틀린 것으로 보일 수 있으며, 상황과 이해가 발전함에 따라 수정되어야 한다고 말한다.

이 점이 중요하다. AI의 헌법은 한 번 정하면 끝나는 규칙집이 아니다. AI가 놓이는 사회적 맥락, 모델의 능력, 사용 방식, 위험의 종류가 계속 바뀌기 때문이다. 결국 AI의 가치 기준은 시간이 지나면서 다시 정의되고, 비판받고, 수정되어야 한다.

이것은 개발자에게도 낯설지 않은 감각이다. 좋은 시스템은 처음부터 완성된 요구사항으로 만들어지지 않는다. 운영하면서 드러나는 문제를 보고, 기준을 바꾸고, 예외를 정리하고, 더 나은 추상화를 찾아간다. Claude 헌법도 비슷하게 보였다. 다만 그 대상이 기능 명세가 아니라 “AI가 어떤 존재처럼 행동해야 하는가”라는 점에서 훨씬 더 낯설고 크다.

## 취향은 새로운 병목이다

영상에서 또 하나 오래 남은 단어는 **취향**, 즉 Taste였다.

Paul Graham은 2002년에 쓴 [Taste for Makers](https://www.paulgraham.com/taste.html)에서 좋은 것을 만드는 사람에게 취향이 왜 중요한지 이야기했다. 좋은 디자인은 단순하고, 오래가며, 본질적인 문제를 피하지 않는다는 식의 논지다. 원래 AI 시대를 겨냥한 글은 아니지만, 생성형 AI가 등장한 뒤 이 글이 다시 소환되는 이유는 분명하다.

AI가 있으면 이제 초안을 만드는 일은 쉬워진다. 문서도, 코드도, 화면도, 제안서도 이전보다 훨씬 빨리 나온다. 문제는 “만들 수 있느냐”가 아니라 “무엇을 만들 것이냐”, “여러 결과물 중 무엇이 더 나으냐”, “어디서 멈출 것이냐”가 된다.

OpenAI Codex를 이끄는 Andrew Ambrosino도 Lenny’s Podcast 인터뷰에서 비슷한 문제를 말한다. AI 도구와 충분한 토큰이 주어지면 여러 사람이 동시에 수많은 프로토타입을 만들 수 있다. 구현 비용이 낮아질수록 오히려 중요한 것은 그 결과물을 비교하고 선택하는 능력이다. The Pragmatic Engineer의 [How Claude Code is built](https://newsletter.pragmaticengineer.com/p/how-claude-code-is-built)에서도 Claude Code 팀이 todo list 기능을 만들며 여러 프로토타입을 빠르게 실험한 사례가 소개된다.

이 부분은 개인적으로 꽤 찔렸다.

AI를 쓰다 보면 잘 모르는 분야의 작업까지 하게 된다. 사업 제안서 PPT를 만들거나, 프론트 화면을 설계하거나, 내가 원래 전문적으로 훈련받지 않은 영역의 결과물을 검토해야 할 때가 많다. 그때마다 나름대로 근거와 레퍼런스를 찾는다. 좋은 사례를 보고, 왜 이 구성이 설득력 있는지, 왜 이 화면이 더 쓰기 좋은지, 왜 이 문장이 더 명확한지 따져보려고 한다.

하지만 마지막에는 결국 “이게 맞나?”라는 감각의 문제로 돌아오게 된다. 여러 선택지 중 하나를 고를 때, 완전히 객관적인 기준만으로 결정할 수 없는 순간이 생긴다. 그때 작동하는 취향은 주관적 선호, 감각, 스타일 정도가 아니라 더 실무적인 능력에 가깝다는 생각이 든다. 취향은 그냥 “내 마음에 든다”가 아니다. 많이 보고, 비교하고, 실패하고, 기준을 세워보고, 다시 고치면서 만들어지는 판단력이다.

AI가 결과물을 많이 만들어줄수록 취향은 더 중요해진다. 선택지가 많아졌기 때문이다. 영상의 말처럼, 선택지가 적을 때는 만드는 능력이 차이를 만들지만, 선택지가 넘칠 때는 고르는 능력이 차이를 만든다.

## 철학과 취향 사이에서

영상이 좋았던 이유는 철학과 취향을 같은 문제의 양면처럼 보여줬기 때문이다.

철학은 AI 안쪽의 문제다. AI가 어떤 기준으로 판단하고, 무엇을 거절하고, 무엇을 우선할지 정하는 일이다.

취향은 인간 쪽의 문제다. AI가 만들어낸 수많은 결과물 중 무엇이 좋은지, 무엇을 남기고 무엇을 버릴지 판단하는 일이다. AI가 생산을 도와줄수록 인간에게 남는 일은 더 추상적이고 더 책임 있는 선택이 된다.

인문대 학부를 나와 AI 개발자로 일하면서 종종 나는 스스로를 이도저도 아닌 사람처럼 느껴왔다. 깊은 철학자도 아니고, 컴퓨터공학 전공자도 아니며, 그렇다고 문과에 걸맞는 기획자도 아니라고 생각했다.

그런데 이 영상을 보고 생각이 조금 바뀌었다. AI를 활용하고 개발하는 일에는 코드만이 아니라 기준을 세우는 일, 결과물을 평가하는 일, 계속 바뀌는 상황 속에서 다시 정의하는 일이 포함된다. 어쩌면 내가 애매하다고 느껴왔던 그 사이의 감각이, 앞으로는 더 의식적으로 계발해야 할 역량일지도 모르겠다.

AI 시대에 필요한 것은 AI가 무엇을 따라야 하는지 묻는 철학, 그리고 AI가 만든 것 중 무엇을 선택할지 아는 취향이다.

## 참고한 자료

- 티타임즈, [AI 시대에 철학자가 뜨는 이유](https://youtu.be/Tbyh9Py_gvM)
- Anthropic, [Claude’s Constitution](https://www.anthropic.com/constitution)
- Anthropic, [Claude’s new constitution](https://www.anthropic.com/news/claude-new-constitution)
- Anthropic, [Constitutional AI: Harmlessness from AI Feedback](https://www.anthropic.com/news/constitutional-ai-harmlessness-from-ai-feedback)
- WIRED, [To Land a Job in AI, Try Reading Kant](https://www.wired.com/story/to-land-a-job-in-ai-try-reading-kant/)
- Paul Graham, [Taste for Makers](https://www.paulgraham.com/taste.html)
- The Pragmatic Engineer, [How Claude Code is built](https://newsletter.pragmaticengineer.com/p/how-claude-code-is-built)
- Lenny’s Podcast, [OpenAI Codex lead on the new shape of product work](https://podscripts.co/podcasts/lennys-podcast-product-career-growth/openai-codex-lead-on-the-new-shape-of-product-work-andrew-ambrosino)
