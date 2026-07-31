# Creative Decision OS — вердикт по манифесту и Production Core v1

> Владелец принёс большой манифест «Content OS / Creative Decision OS»
> (Director AI, Knowledge Graph, Temporal, LangGraph, Neo4j, Qdrant, 50
> агентов, ночной анализ 18k рилсов). Этот документ — инженерный фильтр:
> что из него внедрено СЕЙЧАС, что отложено, что отвергнуто и почему.
> Масштаб: один человек, ~$300/мес, ниша med-aesthetic.

## Главный тезис манифеста, который мы принимаем целиком

**Ценность не в генераторе, а в качестве решений до генерации.** Модели
(Kling → Veo → следующая) взаимозаменяемы; накопленные паттерны, решения и
гейты — нет. Поэтому ядро Core v1 — не «ещё один вызов API», а **Decision
Gates**: деньги тратятся только на сцены, прошедшие бесплатные проверки.

## ✅ Внедрено (в этом репо, работает без ключей)

| Идея манифеста | Реализация | Файл |
|---|---|---|
| Director-first / Decision Gates | Gate 0: статический линтер рубрики перед любой генерацией | `scripts/rubric-lint.mjs` |
| Draft → Preview → HQ | Оркестратор: stills/LTX-2 драфт → превью-кадры → ручной гейт → Kling 2.5 HQ | `scripts/produce.mjs` |
| «Done = пакет, не mp4» | Экспорт-пак: reel.mp4 + thumbnail + caption + hashtags + SRT + storyboard.md | `scripts/produce.mjs` (Stage 4) |
| Pattern Genome (механизмы, не ролики) | Хуки/контейнеры/камера-словарь/анти-паттерны с confidence и источниками | `src/data/patterns.json` |
| Decision Journal | JSONL: решение + причина + доказательства + альтернативы + исход | `src/data/decision-journal.jsonl` |
| Telegram как вход | Бот: `clip <img> \| <prompt> \| <caption>` → fal → ответ в чат | `automation/n8n-telegram.json` |
| QA Engine (программная часть) | ffprobe: 1080×1920/h264/длительность = расчётной кадр-в-кадр | `scripts/produce.mjs` (Gate 2) |
| Виральная методология | 12-пунктовая рубрика с порогами | `docs/virality-rubric.md` |

Gate 0 окупился на первом же запуске: поймал `«crash zoom in, then
settle»` — сцепку двух движений камеры, нарушающую собственную грамматику.

## ⏸ Отложено (правильно, но преждевременно)

Audience Simulator · Discovery Engine · Taste Engine · Meta-Learning ·
Capability Benchmark Lab · Experiment Registry. **Триггер возврата:** 50–100
опубликованных роликов с реальной аналитикой — без собственных данных эти
модули тюнингуют шум.

## ❌ Отвергнуто на этом масштабе (с причинами)

| Из манифеста | Почему нет | Что вместо |
|---|---|---|
| Temporal / LangGraph | Оркестрация одного конвейера — это 200 строк produce.mjs + n8n | `scripts/produce.mjs`, owner's n8n |
| Neo4j / Qdrant | Сотни объектов знаний — не миллионы; семантический поиск не нужен | Версионируемый JSON в git |
| 50 агентов-экспертов | Токены на координацию > пользы при одном операторе | Claude-сессия = Director/Critic |
| Ночной скан 18k рилсов | ~$50+/день Apify + шум | Еженедельный скан 10 кураторских креаторов (~$3–5) |
| AI Debate / Idea Stock Market | Красиво, недоказуемо, дорого | Рубрика + журнал решений |
| Obsidian-vault в этом репо | Это marketing-репо сайта, не PKM | `docs/` + JSON data |

Сам манифест в финале приходит к тому же: «я бы построил 35%».

## Ответ на вопрос «какая среда описывает автоматизацию»

```
n8n (у владельца)      = вход и расписания: Telegram, вебхуки, cron
репо-скрипты           = production engine: lint → generate → render → QA → pack
Claude-сессия          = Director: ревью идей/раскадровок по рубрике
fal.ai / upload-post   = сменные capability-адаптеры за env-ключами
```

LangGraph/Temporal — только при команде >1 и >50 роликов/мес.

## Команды Core v1

```bash
npm run ugc:lint                                  # Gate 0 по всем сценариям
node scripts/produce.mjs <id> <locale>            # драфт + превью, стоп на Gate 1
node scripts/produce.mjs <id> <locale> --yes      # бесплатный полный пак (stills)
FAL_KEY=... node scripts/produce.mjs <id> <locale> --hq   # Kling 2.5 HQ пак
node scripts/publish.mjs <id> <locale> --tiktok-draft     # публикация пака
```

## Acceptance (Done = пакет)

Ролик считается готовым, когда существует `out/pack-<id>-<locale>/` с
reel.mp4 (QA-passed), thumbnail.png, caption.txt (≤5 хэштегов), captions.srt
(тайминги = движку кадр-в-кадр), storyboard.md — и раскадровка прошла
Gate 0. Всё остальное — не «готово».
