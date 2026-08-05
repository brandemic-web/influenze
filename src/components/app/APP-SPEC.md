# App reproduction — source of truth

The hero mockup mirrors the **Flutter app** (`influenze/lib/src/screens`), not the
Figma file. Where the two disagree, the app wins. Figma frames 1–3 in particular
show an older design (purple gradient card, `#0f1112` page, `#201d2b` nav pill)
that the app no longer uses.

Authored on a **1440×900 canvas at 1:1 app pixels**, so `1rem = 16px` and every
value below is `px / 16`. The stage scales to whatever width the hero gives it.

## Where things live

The folders mirror `influenze/lib`, and components carry the app's own widget
names, so a name grepped here is findable there and vice versa.

```
components/app/                 everything that reproduces the product
  APP-SPEC.md                   this file
  WorkflowMockup.astro          the hero's nine story steps, stacked as layers

  common/                       ← lib/common/widgets — primitives, shared by both
    Icon.astro                    every glyph, read from the app's own SVGs
    CreatorAvatar · PlatformIcon · VerifiedBadge · ProfileCard · AppShell · …

  screens/                      ← lib/src/screens — whole screens at 1:1 app pixels
    analyze/                      ← lib/src/screens/analyze
      Analyze.astro                 steps 1 and 3 (`results`)
      AnalyzedCreator.astro         steps 4 and 5 (`tab`)
      AddToListDialog.astro         step 6
      widgets/  filters/  media-kit/
    list/                         ← lib/src/screens/list
      Lists.astro                   step 7
      ListDetails.astro             steps 8 and 9 (`compare`)
      widgets/
    share-management/             ← lib/src/screens/share_management
      ShareModal.astro              step 10

  elements/                     single app widgets, standalone, at marketing sizes
    named after the widget they reproduce — see the map below

  story/                        narration — no app equivalent
    StoryStep · WorkflowCard · WorkflowPointer · DemoCursor

styles/app-tokens.css           the app's palette — `wf-*` and `mkit-*`
data/workflowIcons.ts           icon slot → the app's SVG file
data/workflowMockup.ts          the creators, lists and figures both trees show
assets/icons/workflow/  mkit/   the app's own SVG assets

scripts/home-page/workflow/
  index.ts                      composes the beats into one master timeline
  beats/                        one file per beat, in story order
  utils/                        dom · pointer · spotlight
```

Two things do **not** follow the app. Directory names are kebab-case
(`share-management`, `media-kit`) because that is the site's convention for the
rest of `src/`; and the app screen a step renders is not one-to-one with the step,
because several steps are the same screen in a different state. The step numbers
live only in `WorkflowMockup.astro`, published as `data-wf-screen` — the handle the
beats and `data/workflowCards.ts` address layers by.


## The two reproductions

`screens/` and `elements/` draw the same app widgets for different jobs, and are
**not** interchangeable:

| | `screens/` | `elements/` |
|---|---|---|
| Purpose | the hero's nine-step story | standalone cards for the CreatorsAI collage |
| Sizing | 1:1 app pixels on a fixed 1440x900 canvas | each at its own size, several with a `scale` prop |
| Fidelity | pixel-exact; the app wins every disagreement | app colour, type and proportion, composed for marketing |

Both draw from `common/`, `styles/app-tokens.css` and `data/workflowIcons.ts`, so
a colour or glyph is only ever defined once. Where an element departs from the app
deliberately, its header says so.

An element is named after the app widget it reproduces, so where a widget appears
in both trees the two files share a name and only the folder differs.

| `elements/` | app source | `screens/` twin |
|---|---|---|
| `AnalyzeFilterSidebar` | `analyze/widgets/analyze_filter_sidebar.dart` | same name |
| `PlatformFilter` | `analyze/widgets/filters/platform_filter.dart` | same name |
| `FollowerMetricsFilter` | `analyze/widgets/filters/follower_metrics_filter.dart` | `AnalyzeFilterSidebar` (tier list) |
| `TopDemographics` | `analyze/widgets/creator_detail.dart` — `buildTopDemographics` | `CreatorDetail` (About tab) |
| `FollowerQuality` | `media_kit/detail/audience_card.dart` — `followerQuality` | — |
| `AffinitiesCard` | `media_kit/detail/affinities_card.dart` | — |
| `AddToListDialog` | `analyze/widgets/add_to_list_dialog.dart` | same name |
| `CompareCreatorColumn` | `list/widgets/compare_creator_column.dart` + `media_kit/detail/stats_card.dart` | `ListCompareSection` |
| `CreatorDetailPanel` | `analyze/widgets/creator_detail.dart` — `buildLeftPanel` | `CreatorDetail` |

## Shell — `common/widgets/app_shell.dart`, `app_nav_bar.dart`

| Thing | App value | rem |
| --- | --- | --- |
| page background | `bodyBg` `#080814` | — |
| nav padding | `h66 v20`, content 40 tall | height `5rem` |
| card | `containerBg` `#171721`, radius 32, inset `l16 r16 b16`, no top gap | top `5rem`, h `50.25rem` |
| footer | `© DotMe … v…`, 11px — **deliberately omitted** (marketing) | — |

Nav bar, left to right: logo (`influenze_logo.webp`, h40) · centred links
(`Analyze` / `My Lists` / `Roster`, gap 32; active = `white/10`, radius 20,
`px16 py8`, 14px w500; inactive = 14px w400 `white/50`) · notification bell · 16 ·
credits pill · 16 · profile pill.

- credits pill — `px12 py8`, radius 100, border `green1` `#256745`,
  gradient `#15613A → #1b3e2c`; icon 16, gap 10, `Credits` 14px `#33e889`,
  gap 4, value 14px `#1aae55`.
- profile pill — `pl12 pr4 py4`, bg `green2` `#1b3e2c`, radius 100;
  label 14px `#33e889`, gap 10, avatar 32 circle.
  App says `Hello!`; the mockup uses **`Hi, Harsh`** by choice.

## Analyze — `analyze.dart`

`Padding(all: 50)` → `Row[ sidebar , 16 , Expanded(results) ]`.

- sidebar width = **25% of viewport** = 360 (`22.5rem`) at x 66 (`4.125rem`)
- results panel — x 442 (`27.625rem`), w 932 (`58.25rem`), h 704 (`44rem`),
  `sectionBg` `#232339`, radius 12
- content top = 130 (`8.125rem`)

### Search bar — `analyze_search_bar.dart`

`padding l24 r16 t16 b16`, bg `lavender26` `#242433`, **border 2px** `lavender6`
`#413a56` (→ `#0CBF61` once filled), **radius 10**. `margin-bottom: 16`.
Row: search icon 16 · gap 6 · hint · FIND.

Hint is `searchLabelText` **14px w500** `#847aa4`, with `username` / `@handle` /
`URL` in `brandGreen` `#33e889`.

FIND is a Material button → **min 64×36**; `px10 py8`, radius 6,
enabled `lavender31` `#6443cc`, disabled `lavender65` `#464668`, text 10px w500
(white at 50% when disabled). Bar height = **72** (`4.5rem`).

### Filter rail — `analyze_filter_sidebar.dart`

Fills the remaining height: top 218 (`13.625rem`), h 616 (`38.5rem`), w `22.5rem`.
bg `grey5` `#121214`, radius 12, border 1px `lavender41` `#222232`.
**No zoom** — Figma's rail was a non-uniform rescale; the app is 1:1.

- header — `padding l24 t12 r16 b12`, height 60 (button min-height 36):
  `Filters` 14px w400 white · gap 8 · **`Clear All`** (`px8 py4`, 12px w500,
  `lavender15` `#865fff` active / `lavender38` `#463c60` idle) · Spacer ·
  `Apply & Search` (`px12 py4`, radius 6, bg `lavender31` `#6443cc`, 10px w500)
- rule under header — 1px `lavender8` `#564d71`
- section padding — `l16 r16 t16 b24`; between sections a 1px `grey6` `#252525` rule
- `FilterSectionHeader` — title 12px w500 `lavender7` `#d0c2ff`, `padding-left 8`;
  optional reset ✕ 14px `lavender46` `#847aa4` at top-right (`top 2`)

Section order: Platform · Parameters (discovery) · Sort By · Location ·
Follower Metrics · **Views** · Creator Attributes · Reach Out.

#### Platform — `filters/platform_filter.dart`
Header · 12 · `Wrap(spacing 8, runSpacing 8)`.
Chip: `px6 py5`, radius 4, border 1px; selected `#50349e` / `#7e57ea`,
idle `#282434` / `#302846`; tile 20×20 radius 4 `padding 5`, gap 8,
label **12px w400** white. Chip height = 32.

#### Parameters — `filters/discovery_filters_section.dart`
Trigger: **h36**, `px10`, border 1px `lavender3` `#574789`,
bg open `lavender63` `#6a55ac` / closed `#574789`;
radius top 4, **bottom 0 when a filter is active**; label 12px
(`Select Parameter` at `white/50` when none), info icon, chevron 12 `#d0c2ff`.

Menu: **`margin-top 4`** (detached), `padding 8`, bg `#574789`, border 1px `#574789`,
radius top 0 / bottom 4. Rows are **uniform h36, `px10`, no dividers, no gaps**;
selected `lavender62` `#6e6199`; label 12px + gap 6 + info icon.

Options, in app order — `None` (label at `white/50`, no info icon), `Lookalike`,
`Interest`, `Topic Relevance`, `Bio Phrase`, `Description Keyword`, `Mention`,
`Hashtag`, `Brand Affinity`.

#### Sort By — `filters/sort_by_filter.dart`
Header · 12 · trigger **h38**, `padding 0 10`, bg `#282434`, border 1px `#302846`,
radius 4 (open: `4 4 0 0`). Row: label `filterText` 12px/400 white · gap 6 ·
direction glyph 14 `#3aff98` (`arrow_down` when descending) · chevron 12
`#d0c2ff`, rotated 180° when open.
Menu: **`margin-top 6`**, bg `#282434`, border 1px `#302846`, radius `0 0 4 4`,
`padding 8`, max-height 220. Rows **h36, radius 2**, hover/selected bg `#4c4661`,
label `padding l8 r4`; each row carries two 32×32 arrow slots (icon 14) —
down = high-to-low, up = low-to-high — idle `#6e648a`, active `#32e889`.

#### Creator Location — `filters/location_filter.dart`
Title is `Creator Location` on Instagram, `Creator Country` elsewhere.
Header · 12 · field: bg `#282434`, border 1px `#302846`, **radius 4 always**
(does not square off when open). Inner: 8 inset · search icon 14 `#c0acff` ·
gap 6 · input `contentPadding l0 t14 r8 b14`, text 12px/400 white.
**Placeholder "Search" is also 12px/400 white — not dimmed.** Height ≈43.

Selected locations are **not shown in the field** — they render as removable
chips below it: `SizedBox(12)` then `Wrap(spacing 8, runSpacing 8)` of
`padding 6 10`, bg `#1c3125`, border 1px `#2f744a`, **radius 16**, label 10px/400
`#3aff98`, gap 6, `close` icon 12 `#3aff98`. Height ≈26.

#### Follower Metrics — `filters/follower_metrics_filter.dart`
One section holding **three** `FilterSectionHeader`s. Order: header · 12 · tier
list (separator 4) · 20 · OR row · 20 · header · 12 · min/max row · 20 · header ·
12 · min-rate field.

Tier labels are `🚀 Nano Influencer`, `🔥 Micro Influencer`,
`⭐ Mid-Tier Influencer`, `💎 Macro Influencer`, `👑 Mega Influencer` —
**"Influencer", not "Account"**.

Tier row: `padding 10`, radius 4, bg `#322b45` when selected or hovered else
transparent, no border. Indicator is a **radio**: 12×12, radius 4, border 1px —
idle border `#615381`; selected border+fill `#865fff` with a 4×4 white glyph.
Gap 8, label `filterText` 12px/400 white, `Spacer`, range 12px/400 —
**white when selected**, `#c0acff` otherwise.

Selected tier expands in place: `padding-y 8` around a 1px `#433a5d` rule, then 8,
then the slider, then 8, captions, 20, benchmark line.

Slider (`EngagementStepSlider`, hand-built — no Material `Slider`): 16px-tall box,
track `inset-x 0`, `top 6`, `h4`; **grey `#423c57` left of the thumb, green
`#32e889` right of it**; thumb 16×16 plain white circle, no border. Six snap
stops: an "all ranges" stop 5px in, then five evenly spaced across the rest.
Captions `min poor average good max` in a `space-between` row, 12px/400 —
active `#beb8d0`, inactive `#847aa4`; a label activates once the stop reaches it.
Benchmark line is `minimum benchmark: ` + **`>N%`** (green, w700) — *not*
"benchmark range".

OR row: `Expanded` 1px rule `rgba(97,83,129,0.5)` · `padding-x 12` `OR`
12px/**700** `#d0c2ff` · `Expanded` rule.

Range fields: `Expanded` min · `padding-x 12` `to` 12px/400 white · `Expanded` max.
Field: `padding h10 v8`, bg `#282434`, radius 4, border 1px `#302846`
(`#FF474E` when min > max); label `analyzeInputLabel` 10px/400 `#d0c2ff`, gap 6,
hint 12px/400 `#847aa4` — `eg. 5,000` / `eg. 100,000`. Height ≈49.
Min-rate field is the same box at a fixed `(W − 35) / 2` wide, label `min. rate`,
hint `eg. 2.3%`, no error state.

### Empty state — `analyze_empty_state.dart`
Centred both axes: icon 24 · 12 · `Start your search` (18px w400 white) · 12 ·
`Results will populate based on your\nsearch input` (12px w400 `lavender19`
`#9fa1ff`, centred, **explicit line break**). Note "Results", not "Filters".

## Media kit — `media_kit/detail.dart`, `media_kit/detail/stats_card.dart`

Note the media kit has its **own palette** (`MKitColors`), so these hexes do not
come from `InfluenzeColors`.

Tab body: `SingleChildScrollView`, `padding 16`. **No gap widgets between cards** —
each card carries its own `padding-bottom 12`. Order (non-LinkedIn):
**Account Stats** → Pricing → Audience → Top Posts → Affinities. On LinkedIn
Account Stats is not rendered at all.

`StatsCard` itself is **transparent** over `#181823`: `padding-bottom 12` then
`padding 12`.

Heading: icon tile `padding 8` → **36×36**, bg `#25292c`, radius 5, glyph 20×20
stroked `#32e889`; gap 12; `Account Stats` **14px/600** white.

### Engagement card — bg `#25292c`, radius 5, `padding 12`
`Engagement Rate` 10px/500 white · **24** · row: rate **40px/400** (colour by
level) · 10 · tier pill (`pl10 pr10 pt4 pb6`, bg `#202427`, radius **16**,
`💎 Macro Influencer` 10px/400 white) · **28** · benchmark bar · **32** · badge ·
12 · headline · 14 · paragraph.

Level colours — value / badge bg / badge text / paragraph accent:
`high` `#3fbd71` / `#284a35` / `#42f388` / `#32e889` ·
`above average` `#20c795` / `#479165` / `#32e889` / `#8bcc9d` ·
`average` `#e3c73a` / `#413c26` / `#ffda23` / `#ffda23` ·
`below average` `#cb5c07` / `#473121` / `#fb7208` / `#ffac6b` ·
`low` `#ff4b52` / `#5b2929` / `#ff4b52` / `#8f4242`.
Level comes from the creator's tier + platform benchmark table (see the agent
transcript if exact thresholds are ever needed; the mockup can hard-code).

Benchmark bar — scale is `min = 0.5 × min(value, median)`, `max = 1.5 × max(...)`:
axis-end captions **above** the bar (`min`/`max` to 1dp, 8px/400 `#6e777c`), gap 4;
track **h5 radius 10** flat `#2f3539`; over it a `to right` gradient —
`#2f3539` at the low benchmark, `#3fbd71` at the median, `#2f3539` at the high —
so a green band sits under the median.
Creator marker: **1×33px** vertical bar in the level colour at `top:-10`, capped by
an **8×4** downward triangle. Median marker: **dashed** 1px line (3 on / 1 off)
`#ffffff33`, its `<median>%` caption 12px/400 white above a **44×1** rule, and
`Category Median` 8px/400 `#6e777c` below. Both median captions sit on the side
**opposite** the creator marker.

Badge: `padding 8`, radius **2**, **full width**, text `<LEVEL> ENGAGEMENT`
10px/**600**. Headline `<tier> (<range>)` **15px/600** white. Paragraph
12px/400 `#c0c9cf`, **line-height 1.75**, with the tier noun and the median
percentage as **700** accent spans.

### Stat tiles — there are **five**, not four
`bg #25292c`, radius 5, `padding 12`; label 10px/500 white · **24** · row
`space-between` of value **20px/600** white and a **14×14** icon.
`Total Followers` is **full width** on its own row; then two rows of two
`Expanded` tiles with an **8px** gap, and 8px between rows:
`Total Posts` + `Average Reel Views`, then `Average Likes` + `Average Comments`.
Icon tints: followers `#3fbd71`, posts `#f2994a`, views `#ea5757`,
likes `#c23584`, comments `#935ad6`. Figma showed a 2×2 grid of four — wrong.

## List screens shell — `list/list_details.dart`

`ListDetailShell` is the frame for **both** list detail and compare: the app card
(`#171721`, radius 32) with `padding 50`, an inner surface `#232339` radius 12,
and inside that a **centred column of `0.642 × viewport`** (= 925 at 1440) with
`padding-top 42`. So these screens are narrower than the card, not full-bleed.

Header row: `Expanded` title with `padding l28 t12 b12` · gap 12 · `Back`
14px/500 `#32e889` · share button 28×28 bg `#653ee1` radius 8 (icon 14).
Then 12 · 1px rule `#383869` full width of the 925 column · 32 (list) / 24
(compare) · toolbar · 24 (list) / 12 (compare) · column header · list.

## My Lists — `list/lists.dart` + `widgets/lists_*.dart`, `list_card.dart`

Different frame from list detail: `padding 50` → panel `#232339` radius 12 →
`padding 40`. Content width = viewport − 212 = **1228** at 1440.

Heading is a **centred `My Lists` 24px/300** white — the app has no tab pair here.
(Figma showed ShortLists/Lists; kept as the upcoming-feature presentation.)
Then 20 · 1px `#383869` rule full width · 24 · toolbar · 32 · grid.

Toolbar `Row`: search field (**width = 30% of the window** = 432) · 8 ·
platform dropdown **72×56** · `Expanded` · Import · 12 · delete group.
- search — bg `#2c2c49`, radius **12**, `padding h24 v16`, **no leading icon**,
  height ≈65; hint is `Search␣␣` 14px/500 `#847aa4` + `Lists` 14px/500 `#33e889`
- dropdown — `padding 8`, bg `#2c2c49`, radius 12; platform tile **40×40**
  (`padding 8`, radius 8, black for Instagram) · 4 · chevron 12 `#d0c2ff`.
  **Icon only, no platform name.**
- Import is **not a pill** — no bg or padding: icon 12 `#a589ff` · 4 ·
  `Import` 12px/400 white
- delete group appears only with a selection: 1×18 rule `#847aa4` · 12 ·
  `Cancel` · 8 · `Delete List`; both radius **6**, `pl12 pr12 pt8 pb8`,
  bg `#3d2222`, min 64×36, icon 12 · 8 · label 10px/**500** `#ff4b52` · 8 ·
  bare count 10px/400 `#8f4242` (no parentheses)

Grid: `columns = clamp(floor(width / 240), 1, 4)` → **4** at this width, gaps 16,
`cardHeight = cardWidth + 94` (295 × 389 here).

Card: bg `#181823`, radius **24**, border 1px `#2a2634`, `padding 16` →
square avatar grid · 14 · name 16px/500 white (`px6 py12`) · 4 · `last updated 2m
ago` 10px/400 `#a89ccb` (`px6`) · checkbox bottom-right **16×16**, radius 2,
border **1.33** — off `#615381`, on `#865fff` with a 12px white check.

Avatar grid: wrapper `padding 8`, **2×2** with **10px** gaps, tiles square. Tiles
are **squircles**, not rounded rects — fill `#282434`, 1px stroke `#463c60`
(`border-radius: 32%` is the closest CSS). Tile 4 becomes **`+N`** (count − 3) in
**24px/500 `#6c5ba1`** when there are more than 4 creators.

## List detail — `list/list_details.dart` + `widgets/list_*.dart`

Uses the shell above. **The title is the list name alone — there is no muted
`List` suffix anywhere on this screen.** Figma showed one; drop it. It is an
inline-editable field: `padding-left 24` then `px6 py12`, 24px/400 white.
Then `Back` 14px/500 `#32e889`, share 28×28 `#653ee1` radius 8.

Toolbar left: `width 22vw` wrapper → `padding-left 28` → field bg `#2c2c49`,
radius 12, `px16 py10`, **no leading icon**; hint `Search␣` 14px/500 `#847aa4` +
`Creators` 14px/500 **`#a589ff`**.

Toolbar right, in order (each preceded by 12):
- **Compare** — only when **2+ selected**; transparent button, min 64×36, label
  12px/500 `#8e6aff`, count **parenthesised** `(2)` 12px/500 `#5d4e8e`, then a
  1×18 rule `#847aa4`. Over 6 selected it disables to `white/50` and shows a
  `Max limit is 6` badge (`px8 py3`, bg `#2c263d`, radius 6, 1px `#ff9e49`,
  9px/500 `#ff9e49`) at `top:-20 left:12`.
- **Import** / **Export** — no bg or padding: icon 12 `#a589ff` · 4 · label
  12px/400 white. Export reads `Export (N)` with a selection and is hidden on an
  empty list.
- **Remove from List** — only with a selection: 1×18 rule · 12 · button
  `pl12 pr12 pt8 pb8`, bg `#3d2222`, radius 6, icon 10×8 · 8 · label 10px/**500**
  `#ff4b52` · 8 · bare count 10px/400 `#8f4242`.

`ListHeaderRow` reuses the shared `HeaderRow`/`ProfileCard` constants exactly,
overriding only `padding l42 r14 b15` (42 = 16 drag gutter + 12 gap + 14 card
padding, so it lines up with card content). Select-all indicator 12×12, radius 2,
border **1.33** `#7474c7`, then 8, then `Select all` 12px/400 `#7474c7`.

Rows are `ProfileCard` with **`forList: true`**. Each item is
`padding-bottom 8` → `Row[ drag handle 16×16 `#51466F` + `padding-right 12`,
`Expanded` card ]`. Card `pl14 pr14 pt16 pb16`, bg `#181823`, radius 8, border 1px
`#2c2c3d`. Leading 84 = indicator 12 · 12 · avatar **60** circle.

The internal rule is `Divider(#383869, height: 28)` — a 1px line **centred in a
28px box**, and because it sits inside the `Expanded` column it starts **104px**
right of the card's content-left, not at the edge. The metadata row below it lives
in the **flex-4 column only**: `map_pin` 10 · 4 · text 10px/400 `#a89ccb`, gaps 16.

Actions slot 130, right-aligned: Enquire compact (`px12 py8`, radius 20,
bg `#202427`, 1px `#32e889`; icon 12 · 4 · `Enquire` 10px/400 white · 4 ·
chevron 10 `#3e9761`) · 8 · remove circle **30×30**, bg `#3d2222`, 1px `#5b2929`.
Tier pills here use the **short** labels (`💎 Macro`), unlike the profile screens.
Engagement quality colours: High `#32e889` · Above Average `#9edb57` ·
Average `#f2994a` · Below Average `#ff7350` · else `#ff4b52`.

Two values are viewport-relative and should stay percentages: the content column
**64.2vw** and the search wrapper **22vw**.

## Compare — `list/widgets/list_compare_section.dart`, `compare_creator_column.dart`

**Not a route or overlay** — a mode swap inside the same list-detail panel
(`AnimatedSwitcher`, 450ms shared-axis). In compare mode the title reads
`Compare` and is **centre-aligned** (left in list mode), the **share button is
hidden**, and the toolbar and column header **collapse away**.

Columns: `gap 10`, width = `max((available − 10×(n−1))/n, 360)` for n ≤ 2, so two
columns fill the 925 column at ~457 each. Scrolls in **both** axes.

Column header (`CompareProfileHeader`) — `padding 12`, **transparent**:
avatar **60** circle · gap 20 · `Expanded`(name 16px/**500** white + verified
badge 12 · 4 · tier pill `px5 py4` bg `#33294c` radius 10, 8px/400 `#d5caee` ·
rule `#322b46` centred in a **24px** box, **indented 80** so it starts under the
name · meta 10px/400 `#a89ccb`). The meta line is **plain text joined with
`" · "` — no map-pin icon**, unlike the analyze profile. Then 20 · a 1px
`#322b46` rule inset 12 each side.

Stat content **reuses `StatsCard` verbatim**, with two differences:
`cardColor` **`#18171f`** (not `#25292c`) so every tile and the engagement card
darken, and `showEngagementText: false` which drops the trailing
"…sits within the Good band…" paragraph. Cards carry their own
`padding-bottom 12`; no inter-card gaps. Compare also height-matches the Stats
and Pricing cards across columns (`HeightMatchedCard`).

## Animation handoff

### Beat 1 — Analyze / Lookalike (built)

`scripts/home-page/workflow/` holds the timeline: `index.ts` (finds each mockup,
gates on reduced motion and ScrollTrigger), `pointer.ts` (the hand cursor) and
`analyzeLookalike.ts` (the beat). `scripts/gsap/typeText.ts` is the generic
character-by-character reveal.

The beat plays **inside screen 1's layer**. Sequence: open the Parameters
dropdown → pick Lookalike (sheet folds away, trigger takes the label, Lookalike
body opens, Sort By follows the parameter) → type the handle → type the location
and drop the India chip → **scroll the rail down to `RAIL_TIER_SCROLL`** → **pick
the Macro tier** (row turns on, expands in place) → **drag its engagement handle
left to right** → press Apply & Search.

It *passes through* what screen 2 renders statically, so **screen 2 is a
reference frame, not a step of its own**. Screen 1 starts `parameter="none"` and
`tierPicked={false}` — the dropdown-open frame Figma shows is a keyframe partway
through, not a resting state.

Two things about the rail scroll:

- It is **cursor-motivated as a wheel scroll**: the cursor parks over the list
  and the rail moves under it. A wheel does not move the pointer, so the cursor
  deliberately stays still. This replaced an earlier unmotivated scroll in beat 2.
- It lands on **`RAIL_TIER_SCROLL`** (`data/workflowMockup.ts`), which is also
  what screens 3, 4 and 5 are authored at. That is the whole point: beat 2 can
  then swap layers without touching the rail, and beat 3 inherits it too. If that
  constant and the screens ever disagree, the rail will jump at a layer swap.

The engagement slider: **stop 0 is "all ranges" — thumb hard left, whole track
green — and dragging right raises the minimum benchmark.** So the story drags
**left to right**, from the resting stop to the authored one (3). `FollowerMetricsSlider`
publishes `data-wf-slider-stops` and `data-wf-slider-stop` and places both thumb
and fill from a single `--wf-slider-at` custom property, so the timeline animates
one number and the geometry stays in the component. Cursor and handle share a
duration and ease, which keeps them locked together without per-frame measuring.
The `minimum benchmark: >2.42%` read-out is only true at stop 3, so it fades in
as the handle lands rather than showing a wrong value through the drag.

Three things make it work, and are easy to undo by accident:

- **`AnalyzeFilterSidebar` renders every state at once.** `parameter` /
  `lookalikeFilled` only choose which one paints as the static frame; the
  animation-state block in `workflow.css` hides the rest, and GSAP's inline
  styles outrank it. Adding a new state means adding a branch there too.
- **Clip wrappers.** `[data-wf-param-sheet]` and `[data-wf-param-panel]` are
  bare wrappers around the styled body, so a height tween never has to animate
  padding and margins alongside it. Don't style the wrappers.
- **`.wf-untrimmed`.** Spans added purely as animation hooks around text that
  used to sit in an anonymous box opt out of the stage's cap-trim, which would
  otherwise shorten the box and shift the glyphs ~1px.

### Beat 2 — results (built)

`resultsList.ts`. Picks up with the cursor on Apply & Search: the empty state
clears, the panel arrives as **one piece**, the list scrolls ~1.3 rows, and the
cursor opens **Justin Joy** — the creator screens 4 and 5 profile
(`PROFILED_HANDLE` in `data/workflowMockup.ts` ties them together).

Unlike beat 1 this one **does** change layer, because screen 3's table is markup
screen 1 has not got. The swap is *hidden*, not cross-faded: by the time it
happens the panel is empty and the shell, search bar and rail are identical on
both layers, so nothing visibly moves. That is why the rail is pinned to `0`
first — a cross-fade of two different rail scrolls would ghost.

- **The rail is not touched here.** Beat 1 already scrolled it to
  `RAIL_TIER_SCROLL`, which is where screen 3 is authored, so it sits in the same
  place on both layers at the swap. Screens 4–5 use the same constant, so beat 3
  inherits it with nothing to do.
- **One reveal, no stagger.** All six direct children of the panel carry
  `data-wf-results-part` and come in together. An earlier version staggered the
  chrome and then the rows; it read as two separate animations.
- **`RESULT_CREATORS` = the four signed-off rows, then `RESULT_PADDING`.** So
  screen 3's opening frame is unchanged and the padding only shows once the list
  scrolls. `CREATORS` stays at four because screen 8 renders it at the taller
  list density and would clip. The padding rows are **invented placeholders**.
- Row pitch is measured (`rows[1].offsetTop - rows[0].offsetTop`), never assumed
  — the canvas is authored in rem and the root font-size is fluid.

### Beat 3 — creator profile (built)

`creatorProfile.ts`. Answers beat 2's press on Justin Joy: the results table
clears, the sidebar dims and blurs (the app's `FilterDisableOverlay`), the detail
rises into the panel, and the cursor reaches the **Media Kit tab** and presses it.
Beat 4 answers that press by switching the tab.

Same hidden layer swap as beat 2, with one addition: screen 4 dims its whole
sidebar through one wrapper, and screen 3 has no such wrapper, so screen 3's
search bar and rail are dimmed **individually** to match before the swap. That
looks the same because the two do not overlap. The swap waits for both the table
fade and the dim to finish, or one half gets caught mid-way.

- **The dim's values are read back off screen 4's own `[data-wf-dimmed]`**
  wrapper, so `DimmedFilterSidebar` stays the only place they are defined.
- **Only the opacity is tweened; the blur is set outright.** Tailwind builds
  `filter` from a chain of custom properties, and interpolating out of that (or out
  of `none`) is unreliable — the same trap killed a `brightness()` pulse in beat 2.
  At `0.1rem` the blur is far too slight to see arrive anyway. Where a blur *does*
  need to animate, give the tween two explicit matching endpoints instead:
  beat 5 sets `blur(0px)` inline first, then tweens to the computed `blur(6px)`.
- The rail does not move: beat 1 scrolled it to `RAIL_TIER_SCROLL` and screens 3
  and 4 are both authored there.

### Beat 4 — media kit (built)

`mediaKitTab.ts`. Answers beat 3's press on the tab: the underline moves across,
the card body changes, the cursor scrolls the media kit down a little, then
presses **add-to-list beside Enquire**. Beat 5 answers that press with the dialog.

The cheapest swap in the story — screens 4 and 5 are the *same* `CreatorDetail`
with a different `tab` prop and different slot content, so the sidebar, header and
identity column are already identical and only the two tabs and the card body have
to be brought into line first.

- **The tabs' live and dormant styling is read off screen 5's own tabs**
  (`borderBottomColor` + `color`), so `CreatorDetail` stays the only place those
  colours are written down. Same trick as beat 3's dim.
- **The scroll range is measured**: the media kit's own height less the height of
  the box clipping it. `SCROLL_FRACTION` (0.6) is the "a bit".
- Every scroll in the story now happens **under the cursor**, wheel-style — the
  rail in beat 1, the results list in beat 2, the media kit here.

### Beat 5 — add-to-list dialog (built)

`addToListDialog.ts`. Answers beat 4's press on add-to-list: the backdrop blurs,
the scrim dims, the card fades in. The cursor does not move — it pressed the
button in beat 4, and a dialog opening does not move the mouse.

**Structurally the odd one out, and worth understanding before touching it.**
Every other beat animates the *old* layer up to meet the new one and then swaps.
This one swaps *first*, because screen 6 renders `<AnalyzedCreator tab="mediaKit" />` as its own
blurred backdrop — so with the blur off, the scrim clear and the card hidden,
screen 6 is byte-for-byte what screen 5 renders (verified: 41,556 identical
characters). The dialog can then simply arrive on the new layer.

- **One value has to travel across the swap: the media kit's scroll.** The
  backdrop is a fresh render that has no idea beat 4 scrolled it, so it would snap
  to the top. It is read live in a `.call()`, not at build time, because beat 4
  must have run first.
- **The card fades without scaling.** Its centring is a percentage translate;
  GSAP would fold that into pixels to add a scale, which then goes stale on
  resize. Screen 10's modal is opacity-only in the app regardless. If a scale is
  ever wanted, it needs `{ x: 0, y: 0, xPercent: -50, yPercent: -50, scale }` —
  zeroing x/y matters, or the parsed class translate is applied twice.

### Beat 6 — confirm, close, cross to My Lists (built)

`myLists.ts`. Three clicks: **Add** on the story's list row (settles to "Added"),
the dialog's **close ✕**, then **My Lists** in the nav.

- **Closing the dialog needs no layer change.** Because screen 6 *is* screen 5
  once its blur, scrim and card are neutralised, unwinding those three leaves the
  story sitting on screen 6's layer looking exactly like screen 5. The nav the
  cursor then clicks is the one inside that backdrop copy.
- **The Add button's two labels share one grid cell** (`col-start-1 row-start-1`)
  so it never changes width, and both carry `wf-untrimmed`. Its settled fill is
  `--color-wf-action-muted` `#6d638f`.
- `STORY_LIST` in `data/workflowMockup.ts` names the row; screen 6 marks it with
  `data-wf-list-target`, the same shape as `data-wf-param-target`.

**6 → 7 is the story's first real navigation, and the first swap that cannot be
hidden.** The two screens share a nav bar and (once the card body is faded) an
empty card, but the nav pill is a *different shape* in each — the active item
carries `px16 py8` and the inactive ones carry nothing, so the whole row shifts.
Unifying the two would space the inactive items 64px apart instead of 32 and break
the signed-off nav, so the snap is left visible: it lands on the click that caused
it, which is what the app does when a section rebuilds. `AppShell` gained
`[data-wf-card-body]` — a box coincident with the frame — so a section change can
fade the card's contents without touching the nav or the card itself.

### Beat 7 — open the list, pick two (built)

`listDetail.ts`. Answers beat 6's press on My Lists: opens the story's list card,
which crosses to list detail with **nothing selected**, then ticks the two
creators the compare screen shows, and presses **Compare**.

- **Screen 8's static frame is the *selected* state** — two ticks, Compare, the
  counts — because that is what it was signed off as. The beat winds it back to an
  untouched list first, exactly as beat 1 winds back the filter rail. No prop is
  needed: the timeline owns the state and the harness keeps the authored frame.
- **Which two get ticked is derived, not hardcoded**: `CREATORS.filter(c =>
  c.checked)`, so the ticks can never drift from screen 9's two columns.
- **`ProfileCard`'s tick is now one box in both states** (checked border matches
  its fill so it still reads as borderless, mark always present but transparent).
  Total size stays 12px under `border-box` and the 10px mark still centres in the
  10px content box, so nothing moved. Same shape as the tier radio in beat 1.
- **Selection-dependent toolbar controls are grouped** so they can leave the flow
  whole: `[data-wf-selection="compare"]` holds the Compare pill *and* the rule
  after it; `="remove"` holds the rule *and* Remove-from-List. Export carries **no
  count** — it reads `Export` in every state, so it needs no hook at all.
- 7 → 8 is section-internal (both `AppShell active="lists"`), so unlike beat 6
  there is no nav pill to snap.

### Beat 8 — compare (built)

`compareMode.ts`. Answers beat 7's press on Compare. Not a route in the app but a
mode swap inside the same panel, so the panel surface, card and nav all stay put
and only `[data-wf-panel-body]` changes — toolbar and column header collapse, the
title becomes a centred "Compare", share hides, rows become stat columns.

Split to the app's **450ms** (0.22 out / 0.23 in) and **opacity-only**: that column
is centred with a percentage translate, which GSAP would fold into pixels to add a
slide, going stale on resize. So the duration is faithful even though the shared
axis is not. The cursor does not move.

### Beat 9 — leave compare (built)

`leaveCompare.ts`. The cursor scrolls both compare columns to the bottom, presses
**Back** to return to the list, then presses **share** beside it.

- **The two columns scroll together, by one shared distance** — they read as a
  single pane, and the app scrolls the compare section as a whole and
  height-matches its cards across it. The distance is the *smaller* of the two
  ranges, so neither column can run past its own content and leave a gap.
- 9 → 8 is beat 8's mode swap run the other way: same fade through an empty panel,
  same 450ms. Nothing needs restoring on the list — beat 7 left it with the two
  creators ticked and Compare showing, which is exactly the state to return to.

### Beat 10 — share modal (built)

`shareModal.ts`. Answers beat 9's press on share, and closes the story.

Uses beat 5's **swap-first** shape, because screen 10 embeds
`<ListDetails blurred />` exactly the way screen 6 embeds screen 5 —
verified: identical to screen 8's layer once the ` blur-[0.75rem]` class is
discounted. Neutralise the blur, hide the card, and the swap is invisible.

**It must not animate like beat 5.** That is a dialog route with a full-frame
scrim; this is a `CenteredModalOverlay` **clipped to the host panel**, **blur only,
no dim**, ramping `blur(0 → 12)` over **260ms linear** with opacity-only on the
card. There is no scrim element at all — the blur lives on `[data-wf-panel-body]`
via `ListDetailShell`'s `blurred` prop, which is why the beat reaches for the panel
rather than an overlay.

### Beat 11 — send, and round again (built)

`restart.ts`. Types the address, presses **Send** (which settles to "Sent"),
closes the modal, and presses **Analyze** to land back on screen 1 — where the
master timeline loops.

- **The address is authored in the markup** (`data-wf-email-value`) and read from
  it, so a loop cannot retype its own output. **It is therefore in the page
  source**, which matters: `ajay@brandemic.in` is a real mailbox on a public
  marketing page, so it is scrapeable. A neutral placeholder would avoid that.
- **It calls beat 1's `reset` before revealing screen 1.** Beat 1 hands its reset
  back alongside its timeline for exactly this — see the loop notes below.
- Closing the modal needs no layer change, same as beat 6's dialog: screen 10 *is*
  screen 8 once the blur and card are unwound. Blur out is **200ms** against 260ms
  in — the app's own asymmetry.
- This field's caret is `inline-block`, not `block` like beat 1's, because it sits
  in inline context inside the `flex-1` text box rather than in a flex row. It has
  to be inside that box, or `flex-1` would push it to the far end of the space.
- 10 → 1 is a section change like beat 6's: the nav pill snaps on the click.

### The loop

The master timeline runs `repeat: -1` with a 1.5s rest, and the whole thing hinges
on one property: **every beat winds its own screen back before it plays.** That is
why each of them opens by restoring `data-wf-active` and resetting whatever state it
is about to change — the list scroll in beat 2, the media kit in beat 4, the ticks in
beat 7, the compare columns in beat 9, the share form in beat 11. Add a beat that
mutates something without resetting it and the second pass will quietly differ from
the first.

Three things the loop needs that a one-shot pass does not:

- **Absolute scroll targets need an explicit reset.** `y: () => -range()` is a
  destination, not a delta, so on a second pass it is already satisfied and simply
  does not move. Beat 4 had exactly this bug.
- **A screen has to be reset before it is *revealed*, not before it next plays.**
  The rail is the exception to the rule above: beat 1 owns its reset, but beat 11 is
  what brings screen 1 back into view, and it does so one whole rest-period before
  beat 1 runs. Resetting at beat 1's start therefore left the story arriving home to
  a rail full of applied filters for ~1.5s. That is why `analyzeLookalike` returns
  `{ timeline, reset }` and beat 11 calls the reset inside its own layer swap.
  **Any future beat that reveals a screen someone else mutated needs the same.**
- **The cursor must start where the last beat left it.** Beat 1 parks it on the
  **Analyze nav item** — precisely where beat 11 presses — so the seam has no jump
  and needs no fade. `fadeIn` is still there but only does anything on the first
  pass, when CSS has the cursor hidden. The one residual movement is ~16px, because
  the nav pill is a different width on each side and so the item's centre shifts;
  it coincides with the pill snap, which is what caused it.

Two GSAP traps that bit here and will bit again:

- **`gsap.set()` applies the moment it is written.** In a timeline built up
  front that means before the story starts — use `timeline.set()` instead. This
  is why `pointer.parkVars()` returns vars rather than a finished tween.
- **`progress(1)` suppresses callbacks**, so `.call()` bodies and `onUpdate`
  never run and any DOM writes are silently skipped. Reduced motion activates the
  story's last screen statically instead of fast-forwarding the beats.
- **There is no dependable "unset" in GSAP.** `.set(el, { height: "" })` looks
  like it hands a property back to the stylesheet but the value goes through the
  numeric parser. Use `el.style.removeProperty("height")` in a `.call()` — that is
  what re-opens the parameter panel's height and restores beat 4's tab colours.

The cursor's fingertip is at **44% / 26%** of the 32×32 asset (measured off the
path data, not eyeballed); the offset lives in `.wf-pointer > img` so the
timeline can aim straight at a target's centre. Positions resolve lazily through
function-based tween values, because the stage's scale follows the viewport — a
tween built at load time would keep aiming at stale coordinates. A tween already
initialised does not re-measure on resize.

### Hook contract
**All ten beats are built, and every `data-wf-*` attribute in the mockup is now
load-bearing** — grep for one before removing it. The table below covers the
structural handles; the per-beat sections above name the rest.

Three conventions run through them:

- **`…-target`** marks the one instance the story acts on, sourced from a constant
  in `data/workflowMockup.ts` (`PARAMETER_OPTIONS.selected`, `PROFILED_HANDLE`,
  `STORY_LIST`) — never hardcoded in a script.
- **A hook wrapping text that used to sit in an anonymous box needs
  `wf-untrimmed`**, or the stage's cap-trim shortens it and shifts the glyphs.
- **Values the timeline animates *to* are read back off the markup** — computed
  styles, `data-*` attributes, or `textContent` — so components stay the single
  source. No beat restates a colour, a string or a distance.

| Attribute | On | Purpose |
| --- | --- | --- |
| `data-workflow` | `.wf-mockup` | root handle for the timeline |
| `data-wf-screen="1..10"` | each screen layer | the ten steps, all stacked and absolutely positioned |
| `data-wf-active` | one screen layer | the visible step. `workflow.css` hides every layer **without** it via `opacity: 0; visibility: hidden` — GSAP must either take over both properties or the CSS will fight the tween |
| `data-wf-rail` | filter rail wrapper | the rail as a whole |
| `data-wf-rail-scroll` | rail's inner column | scrolled with `transform: translateY(-{scroll}rem)`; steps 1–2 sit at `0`, step 3 at `36.4375` |
| `data-wf-rail-thumb` | rail scrollbar | offset is `scroll × 0.27` |
| `data-wf-avatar` | every portrait | swap target for real images |
| `data-wf-logo` | platform tiles | now real icons; kept as a handle |

### Constraints
- **Do not animate `transform` on `.wf-stage`.** It already carries the
  fit-to-container `scale`, and overwriting it breaks the canvas.
- **No `backdrop-filter`** anywhere inside the stage — see the gotcha below.
- Screens **5 and 8 render twice** in the DOM, because screens 6 and 10 include
  them as their blurred backdrop. Every `data-wf-*` hook inside them is therefore
  duplicated: scope queries to the active screen layer, never `document`-wide.

### Transition shapes
**The whole story is built and loops** — eleven beats over screens 1 → 10 and back.
The order it visits them is `1·2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 8 → 10 → 1`: screen
8 is passed through twice, because the share modal sits over the list and not over
compare, and screen 1 is both the start and the end.

Almost none of these are page changes, which is the thing to understand before
editing any of them. **They are one screen with a couple of regions changing.**
Beats 1–3 keep the filter rail put and only rebuild the right panel; 4–6 keep the
whole Analyze frame and only change the card body, swap a tab, or lay a modal over
it; 7–10 do the same inside the list panel. That is why nine of the ten swaps are
*hidden*: the beat animates one layer until it matches the next, then changes
`data-wf-active` behind an identical frame.

The exception is **6 → 7**, the only genuine section change, where the nav pill is a
different shape on each side and is deliberately allowed to snap.

Two swaps go the other way round — **swap first, then animate** — because the
destination layer *embeds* the one before it as a blurred backdrop: `5 → 6`
(beat 5) and `8 → 10` (beat 10). Both were verified byte-identical to the layer
they cover. If a future screen embeds another, use that shape.

### Project conventions
`gsap@^3.15.0` is already a dependency. Existing helpers live in
`src/scripts/gsap/` (`revealStagger.ts`, `horizontalLoop.ts`) and are imported
from a component's `<script>` block — follow that shape rather than inlining.

## Gotcha: `backdrop-filter` is broken inside the scaled stage

`.wf-stage` is `scale()`d, and Chrome samples the **un-transformed** backdrop for
`backdrop-filter`, so a `backdrop-blur-*` overlay lands offset — it smeared list
content ~100px past the panel edge on screen 10. Blur a copy of the backdrop with
plain `filter` (`blur-[…]`) instead, as `DimmedFilterSidebar`, `CenteredModalOverlay` and
`ListDetailShell`'s `blurred` prop all now do.

## Gotcha: the site theme overrides Tailwind's radius scale

`global.css` redefines `--radius-sm … --radius-3xl` for the marketing site
(`rounded-3xl` is **8.75rem**, `rounded-xl` is 2.625rem). Never use the semantic
radius classes in the mockup — they silently render as huge pills. Always write
the value: `rounded-[0.75rem]`, `rounded-[1.5rem]`, and so on.

## Gotcha: `truncate` clips descenders

`.wf-stage` trims text boxes to cap height to match Flutter's glyph-box sizing.
Tailwind's `truncate` adds `overflow: hidden`, which then clips descenders
(`y`, `g`, `J`) because the box is shorter than the glyphs. Use
`whitespace-nowrap` instead — the mockup's strings are fixed, so nothing needs
real ellipsis.

## Type — `common/styles.dart`

**Inter** throughout. `sectionHeader` 14/400 white · `buttonText` 10/500 ·
`filterLabel` 14/400 `#faf8ff` · `filterSublabel` 12/500 `#d0c2ff` ·
`filterText` 12/400 white · `filterSubText` 12/400 `#c0acff` ·
`emptyStateTitle` 18/400 white · `emptyStateSubtitle` 12/400 `#9fa1ff` ·
`searchLabelText` 14/500 `#847aa4` · `headerProfileName` 14/400 `#33e889` ·
`creditsText` 14/400 `#1aae55` · `resultsHeaderTitle` 24/400 white ·
`resultsCreatorName` 16/400 white.

## Creator detail — `analyze/widgets/creator_detail.dart`

**It lives inside the 932-wide results panel** and draws no background or radius
of its own. The whole sidebar (search bar *and* rail) stays on screen behind
`FilterDisableOverlay` — `opacity 0.55` plus a `1.6` sigma blur. Figma showed the
profile spanning the full card with no rail; that is wrong.

Content box: `padding h24 v20` inside the panel → 884 × 664.

- header `padding l18 t20 r0 b20`: title `Analyzed Creator` 24px/400 white ·
  `Spacer` · `Back` 14px/**500** `#32e889` · 18 · share button **28×28**,
  bg `#653ee1`, radius 8, `external_link` icon 14 (untinted)
- rule `#383869` 1px at **zero inset** (starts 18px left of the title), then 24
- `Row`: left column **`0.28 × viewport`** = 403 · gap **40** · right card
  `Expanded` = 441. The left column is a scroll view so it is **vertically
  centred**; the right card stretches full height.

### Identity column — `padding-x 40`, centred, inner width 323
Avatar **170** circle · 24 · name **28px**/400 white centred · 8 · tier pill
(`px8 py4`, bg **`#181823`**, radius 6, 12px/400 `#dbcaff`, text
`"💎 Macro Influencer"`) · rule `#383869` **centred in a 36px box** · meta row
centred (`map_pin` 10 `#a89ccb` · 4 · texts 10px/400 `#a89ccb`, gaps 12) ·
second 36px-box rule · 4 · actions.

Enquire (non-compact): `px14 py10`, radius 20, border 1px `#32e889`, bg `#202427`;
icon 14 `#32e889` · 6 · `Enquire` **10px**/400 white · 4 · chevron 12 `#3e9761`.
Then 10, then add-to-list **34×34 circle**, bg `#2f254a`, border 1px `#463575`,
icon 12 `#8e6aff`.

### Right card — bg `#181823`, radius **6**, no padding, full height
Tabs `padding l18 t24`, `About` · 18 · `Media Kit`; each tab `pb12 px6` with a
**3px bottom border** — `#9674ff` active, transparent otherwise. Active label
14px/400 white, inactive 14px/400 `white/20`. Rule under the bar `#3d3d5b` 1px,
**full card width**.

About tab: `padding 24` →
`Followers` 12px/400 `#c5bedb` · 6 · count 12px/400 `#32e889` · 10 · platform pill
(`padding 8`, bg `#25253f`, radius 8; tile 20×20 radius 4 on the platform's brand
bg — black for Instagram/TikTok, white for YouTube — with a 10×10 glyph · 10 ·
handle 12px/400 `#ac91ff` · 10 · count 10px/400 white) · **32** ·
`Top Demographics` 12px/**500** `#c5bedb` · 10 · a `Row` of **three `Expanded`
tiles, gap 4** (`height 85`, `padding 12`, bg `#25253f`, radius 8; label
10px/400 `white/80` at the top, `Spacer`, value **16px**/400 white, 4, sub-note
**8px/500** `#32e889`) · **42** · bio 13px/400 `#c5bedb`, **line-height 1.5**,
no width constraint.

## Status

- [x] Shell, Analyze layout, search bar, rail header, Platform, Parameters, empty state
- [x] Screen 3 — results panel `padding h24 v20`; header `fromLTRB(18,20,0,20)`
      with `resultsHeaderTitle` 24px + `green3` counts; rules `lavender11`
      `#383869`; applied-filter groups spaced 24, label 12px `#d0c2ff`, chip
      `#50349e` `l8 r8 t4 b5` radius 4 12px; column header `padding l14 r14 b8`
      with a **Select all** checkbox Figma omits, labels `selectAllText` 12px
      `#7474c7`; list `padding-top 8`, separator 8
- [x] Creator card — `ProfileCard`: `padding l14 r14 t16 b16`, bg `#181823`,
      border `#2c2c3d`, radius 8. Columns are flex, not fixed x: leading **84**
      (12px indicator · 12 · 60px avatar) · 20 · identity **flex 4** · 16 ·
      metrics **flex 6** · 12 · actions **130**; with three metrics the first two
      take `(metricsWidth - 12) / 3`. Name 16px, handle 10px w500 `#ac91ff`,
      tier pill `px6 py4` radius 10 bg `#33294c` text 8px `#d5caee`.
      **`buildAnalyzeLayout` has no location/gender/language row** — that only
      exists in `buildListLayout` (screen 8). Figma showed the list variant on
      the Analyze screen.
- [x] Rail sections — all eight now from the app. Notes beyond the values above:
      **Reach Out** hand-rolls its header to host a Material-2 **toggle** (track
      33x14 radius 7, thumb 20 circle; on: white on `#009a4a`), and the chips
      render only while it is on; all three are on by default. Its chips, the
      lookalike tabs and the gender chips all use `padding 8` (not `px6 py5` like
      Platform), with 14px icons that keep their own colours — the app does
      **not** recolour them on selection.
      **Views** is `Reel Views` on Instagram / `Average Views` on YouTube+TikTok
      and absent elsewhere; it is two `From`/`To` dropdowns, **not** a slider.
      **Creator Attributes** is ONE ruled section holding four sub-blocks —
      `Is Verified?` (note the capital V), `Creator Gender`, `Audience Gender`,
      `Audience Age Bracket` — spaced 28, with 32 between the two gender blocks.
      `Is Verified?` chips keep `#282434`/`#302846` in **both** states; only the
      icon changes (tinted `badge` vs untinted blue `verified_badge`).
      Age bracket puts its `25-54y` read-out in the header's trailing slot,
      12px/700 `#32e889`, 16px after the title.
      Sliders: gender % is single-thumb, square-ended, green left of the thumb;
      age is a two-thumb range whose active middle is **6px** tall with a 2px
      radius reaching 2px past each thumb, inactive ends rounded outward only.
- [x] Screens 4–5 — recomposed: the detail now renders inside the results panel
      with the sidebar dimmed behind it (`DimmedFilterSidebar.astro`), and `MediaKitDetail`
      rebuilt to the five-tile Account Stats layout
- [x] Screen 6 — `add_to_list_dialog.dart`. Two elements in the Figma frame exist
      nowhere in `lib`: the ShortLists/Lists switcher and the "Unlocks Media Kit,
      50 Credits per handle" notice. ShortLists is an **upcoming feature**, so the
      switcher is kept from the design (same treatment as screen 7); the credits
      notice is dropped pending a decision. The real
      dialog: scrim is `backdrop-filter blur(6px)` under `rgba(0,0,0,0.08)`;
      card centred, **max-width 480**, bg `#181823`, radius **24**, border 1px
      `#3b3b62`, content-driven height. Close ✕ 18px `#847aa4` at `t16 r16`.
      Title `Add to List` 22px/400 white + gap 8 + the count with **literal
      braces** `{12}` in `#4d4565`, then 28. List region `px24 pb8` capped at
      **max-height 220** (so a third row is only part-visible); rows `px12 py10`,
      bg `#2e2e4e`, radius 16, border 1px `#3b3b62`, gap 8; avatar cluster is a
      **2×2 grid, 60×60**, tiles 26×26 with `margin 2` and radius 7 — there is
      **no "+N" overflow tile**; name 14px/400 white, 2, `N Creators` 10px/400
      `#a89ccb`; Add button `px12 py6`, radius 20, **min 64×36**, `#6443cc`
      (muted `#6d638f` + label `Added` once all selected are in the list).
      Footer: 16 · 1px rule `#463c60` full width · 14 · `Create New List`
      (radius **24**, `px16 py12`, `#6443cc`, 10×8 icon + gap 4 + 10px/500) · 32.
- [x] Screen 7 — My Lists, per the frame above. Heading is the app's centred
      `My Lists`; the ShortLists/Lists pair below it is the upcoming feature kept
      from the design (same chip style as the add-to-list dialog).
- [x] Screens 8–9 — built on a shared `ListDetailShell.astro`. Screen 8 drops the
      Figma "List" suffix (the app has none) and adds the drag gutter; `ProfileCard`
      gained a proper `variant="list"` whose leading slot is drawn outside the
      shared column grid (`ProfileCardColumns withLeading={false}`) so the 104px isn't
      counted twice, and whose metadata row sits inside the flex-4 column. Screen 9
      reuses `MediaKitDetail` with a new `surface` prop for compare's `#18171f`.
      **Placeholder:** the drag handle uses the `listFilter` glyph in place of the
      app's `drag_dots.svg`.
- [x] Screen 10 — `share_management/widgets/share_modal.dart` +
      `share_modal_parts.dart`. Presented by **`CenteredModalOverlay`**, not the
      dialog route screen 6 uses, so it differs on every axis: **clipped to the
      host panel** (radius 12), **blur only with no dim scrim**, ramping
      `blur(0 → 12)` over 260ms in / 200ms out, linear, opacity-only on the card.
      Card **fixed 494** wide, radius **24**, bg `#181823`, border 1px `#3b3b62`,
      intrinsic height, centred **in the panel**. Close ✕ 14 `#847aa4` at
      `t18 r18`. Body `px34 pb32`: title **`Share to email`** 22px/400 white
      centred · 18 · field (bg `#37375a`, radius 6, `px16 py12`; mail icon 16
      `#986cff` · 10 · hint `Enter email address` 14px/500 `#847aa4` · 12 ·
      **`expires on`** 10px/400 `#a89ccb` · 8 · white pill `px10 py6` radius 8
      with `d MMM` 12px/500 black + chevron 12) · 32 · 1px rule `#3b3b62` full
      width · footer `px82 pt16 pb34`: Send **328** wide, `py16`, radius 10,
      `#653ee1`, `Send` 16px/**600** white + `external_link` 16 · 12 ·
      `Manage Shared Links` 14px/500 `#a589ff` **underlined**.
      Figma said "Share to Mail" with a `7 Days` **dropdown**; the app says
      "Share to email" and the expiry is a **15-day-range date picker**.
