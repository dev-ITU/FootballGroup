# Football Site Benchmark

Date: 2026-03-15

Goal: benchmark 50 football websites and extract patterns worth reusing for a premium, sales-oriented Gazprom football site.

Method:
- 50 sites were checked on 2026-03-15.
- For each site, the first screen and homepage structure were inspected.
- Programmatic flags were tracked for `video`, `3D/model`, `tickets`, `shop`, `membership`, `match center`, `news`.
- The benchmark focused on official club sites first, then leagues/media products.

## Snapshot

- 50/50 sites successfully fetched
- 17/50 use video-first or embedded video on the homepage
- 5/50 expose some 3D or pseudo-3D hook
- 40/50 push ticketing directly from homepage/header
- 46/50 push shop/merch directly from homepage/header
- 34/50 push membership/season-ticket style conversion
- 46/50 expose fixtures/results/match-center directly
- 48/50 run homepage as a news/media machine

## Strongest Commercial References

These are the sites with the strongest combined signal across media, commerce, match-day, and member funnel:

1. Juventus: https://www.juventus.com/en/
2. Atletico Madrid: https://en.atleticodemadrid.com/
3. Chelsea: https://www.chelseafc.com/en
4. Rangers: https://www.rangers.co.uk/
5. Inter Miami: https://www.intermiamicf.com/
6. LAFC: https://www.lafc.com/
7. Columbus Crew: https://www.columbuscrew.com/
8. Napoli: https://sscnapoli.it/en/
9. Manchester United: https://www.manutd.com/
10. Aston Villa: https://www.avfc.co.uk/
11. Sporting CP: https://www.sporting.pt/en
12. Fenerbahce: https://www.fenerbahce.org/

## Best Use Of Video

- Juventus: video-led luxury presentation, fashion-energy, campaign feel
- Atletico Madrid: homepage banners + inline video blocks + aggressive conversion CTAs
- Inter Miami: countdown promo blocks + heavy campaign video stack
- LAFC: event and community energy, cinematic matchday sell
- Columbus Crew: campaign/video/news blend with strong promo rhythm
- Napoli: emotional video-led club storytelling
- Real Madrid: high-polish prestige media

## Best Use Of 3D Or Pseudo-3D

- Chelsea: 3D seat-view logic inside hospitality/ticket flow
- Juventus: immersive visual layer around campaigns and premium commerce
- Rangers: event/ticket promo stack with stadium-seating-style conversion logic
- Fenerbahce: richer layered motion and dimensional promo treatment
- Leicester City: detected 3D hook in homepage assets

Important conclusion:
- In football, 3D almost never wins as a random decorative object.
- It works when tied to product: seat view, stadium reveal, kit reveal, trophy/object showcase.

## What To Steal

### 1. Hero must sell one clear action

The best sites do not open with a vague club statement.
They open with one of these:

- next match
- tickets on sale
- membership / season package
- new kit / merch drop
- major campaign film

For us:
- hero should lead with `Next Match / Buy Access / Match Center`, not just atmosphere

### 2. Header must be conversion-first

Repeated winning pattern:

- `Matches`
- `Tickets`
- `Shop`
- `Membership`
- `Media`

This is much stronger than a purely informational corporate nav.

### 3. First screen should be split, not monolithic

Best pattern found across multiple sites:

- left: campaign / matchday message
- right: actionable promo column

Good right-column content:

- next fixture
- countdown
- ticket CTA
- season package CTA
- merch drop CTA

### 4. Match center must feel like product, not a page

Winning traits:

- next game visible above fold
- last result visible above fold
- match hub link everywhere
- opponent identity, competition, venue, time
- one-click path to ticketing or live coverage

### 5. Promo slabs outperform small cards

Rangers, Atletico, MLS clubs, and several EPL sites use large horizontal promo blocks better than dense small-card grids.

For us:
- fewer cards
- more big editorial/promo bands
- stronger art direction per band

### 6. Membership is a visual product

The best sites make membership feel like a premium object, not a form:

- dedicated colors
- dedicated badge
- dedicated benefits strip
- deadline / urgency
- direct CTA

### 7. Merch works when treated like campaign media

Strong kit launches use:

- dramatic photography
- clean product slate
- dark/light contrast
- one focused CTA

Bad merch treatment:

- generic ecommerce tiles dumped into homepage

### 8. Video should be campaign-grade

Video works when:

- it is short
- it has one message
- it is tied to matchday, membership, kit, stadium, or community

Video fails when:

- it becomes a noisy background wallpaper
- it competes with too many widgets

## What Not To Steal

- Random decorative 3D ball with no product meaning
- Generic glassmorphism blocks everywhere
- Too many equal-priority cards
- Corporate copy in hero instead of matchday urgency
- Technical or backoffice language in UI
- Heavy futuristic VFX without football context
- Homepage that behaves like a newsroom only, without conversion path

## Recommended Visual Formula For Gazprom

### Positioning

Not:
- gaming-looking futuristic stadium fantasy

Yes:
- premium football + corporate power + stadium atmosphere + broadcast clarity

### Visual recipe

- palette: Gazprom white / blue / steel / ice-light, with occasional warm matchday accent
- typography: clean, authoritative, narrow or semi-condensed for sport moments
- surfaces: solid, expensive, editorial, not overly glossy
- motion: restrained, broadcast-like, not toy-like
- 3D: stadium object, seat view, trophy object, premium kit showcase

### Homepage structure to build

1. Sticky conversion header
2. Split hero:
   - left campaign statement
   - right action rail
3. Matchday superband:
   - next match
   - last result
   - countdown
   - direct CTA
4. Stadium / arena visual band:
   - real video or real 3D stadium reveal
5. Membership package band
6. Merch / kit drop band
7. Big editorial news slab
8. Sponsor / Gazprom ecosystem band
9. Footer with club, contacts, and conversion links

## 3D Recommendation

If we keep 3D, the correct 3D is:

- stadium reveal
- seat-view inspired camera path
- trophy / ball as secondary object only
- kit pedestal / jersey reveal

If we do only one 3D scene, it should be:

- a stylized Gazprom Arena-type bowl with scoreboard and matchday lighting

Not:

- a floating object pretending to be the main story

## Concrete Build Targets For Our Site

To make the Gazprom site feel benchmark-level, the next redesign pass should add:

1. Real video hero or campaign reel
2. Persistent `Tickets / Membership / Shop / Matches` in header
3. Full-width matchday strip with score/timer/CTA
4. One premium commercial band for season access or hospitality
5. One premium merch band for kit drop
6. Stadium-centered 3D instead of object-centered 3D
7. Fewer small cards, more bold full-width editorial sections
8. Cleaner hierarchy between club story, commerce, and media

## Reference Pool

### Leagues / Platforms

1. Premier League: https://www.premierleague.com/
2. FIFA: https://www.fifa.com/
3. LaLiga: https://www.laliga.com/
4. Bundesliga: https://www.bundesliga.com/
5. Serie A: https://www.legaseriea.it/
6. MLS: https://www.mlssoccer.com/
7. OneFootball: https://onefootball.com/en/home
8. The Analyst: https://theanalyst.com/

### England

9. Arsenal: https://www.arsenal.com/
10. Chelsea: https://www.chelseafc.com/
11. Liverpool: https://www.liverpoolfc.com/
12. Manchester United: https://www.manutd.com/
13. Tottenham Hotspur: https://www.tottenhamhotspur.com/
14. Newcastle United: https://www.newcastleunited.com/
15. Aston Villa: https://www.avfc.co.uk/
16. Leicester City: https://www.lcfc.com/
17. Leeds United: https://www.leedsunited.com/
18. Wolves: https://www.wolves.co.uk/

### Spain

19. Real Madrid: https://www.realmadrid.com/
20. Barcelona: https://www.fcbarcelona.com/
21. Atletico Madrid: https://en.atleticodemadrid.com/
22. Real Sociedad: https://www.realsociedad.eus/en
23. Sevilla: https://sevillafc.es/en

### France / Portugal / Netherlands / Belgium

24. PSG: https://en.psg.fr/
25. AS Monaco: https://www.asmonaco.com/en/
26. FC Porto: https://www.fcporto.pt/en
27. Sporting CP: https://www.sporting.pt/en
28. Ajax: https://english.ajax.nl/
29. Feyenoord: https://www.feyenoord.com/en
30. Club Brugge: https://www.clubbrugge.be/en

### Germany / Italy / Scotland / Turkey

31. Borussia Dortmund: https://www.bvb.de/eng
32. Juventus: https://www.juventus.com/en/
33. AC Milan: https://www.acmilan.com/en
34. Inter: https://www.inter.it/en
35. Napoli: https://sscnapoli.it/en/
36. Roma: https://www.asroma.com/en
37. Celtic: https://www.celticfc.com/
38. Rangers: https://www.rangers.co.uk/
39. Fenerbahce: https://www.fenerbahce.org/

### Russia / Balkans / Germany

40. Zenit: https://en.fc-zenit.ru/
41. Crvena Zvezda: https://www.crvenazvezdafk.com/en
42. Schalke 04: https://schalke04.de/en/

### Americas / Middle East

43. Flamengo: https://www.flamengo.com.br/en
44. Boca Juniors: https://www.bocajuniors.com.ar/
45. River Plate: https://www.cariverplate.com.ar/
46. Inter Miami: https://www.intermiamicf.com/
47. LAFC: https://www.lafc.com/
48. Seattle Sounders: https://www.soundersfc.com/
49. Columbus Crew: https://www.columbuscrew.com/
50. Al Hilal: https://alhilal.com/en/
