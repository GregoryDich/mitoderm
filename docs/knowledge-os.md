# Knowledge OS — реестр владельческих документов (2026-07-31)

Owner-authored активы, принятые в систему (полные тексты — в сессии, здесь
реестр + маппинг на реализацию):

| Документ | Что это | Где живёт / как применён |
|---|---|---|
| UGC Genome v1.0 | hooks A1-A10, 15 форматов, триггеры, структуры D1-D8, shot/camera/light/emotion/CTA/антипаттерны + формула сборки | `src/data/ugc-genome.json` — Director выбирает комбо при написании сценариев |
| Viral Playbook v1.0 | 100 сценарных форматов (10 блоков) + алгоритм выбора | источник тем; форматы мапятся на genome.formats |
| Cinema Bible v1.0 | визуальный язык: локации L1-L5, hero/macro/lifestyle shots, свет, палитра, люди-не-AI, монтаж, переходы, product rules, финальный вопрос качества | негативы уже в `ugc-scripts.json meta.style.negative`; Character DNA → `keyframe:'character'` (мастер-портрет); финальный вопрос = Creative Critic гейт |
| Prompt Compiler Bible v1.0 | промпт = слои Brand/Cinema/Scene/Character/Env/Camera/Light/Emotion/Action/Negative DNA; промпты не хранятся | реализовано: `generate-clips/frames` собирают промпт из scene.visual + meta.style + camera; negative DNA в style.negative |
| Creative Decision Graph v1.0 | 14 узлов решений + 5 глобальных правил | узлы 2/3/6/7/8/10 = наши Gate 0/0.5/1/2 + Evidence Card + scene-level regen (`--only`); остальные узлы — по мере роста |
