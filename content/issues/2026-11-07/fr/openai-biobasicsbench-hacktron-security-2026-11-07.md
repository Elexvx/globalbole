---
title: "OpenAI présente le référentiel de biologie expérimentale BioBasicsBench et s’associe à Hacktron pour tester la sécurité de ses intégrations"
slug: "openai-biobasicsbench-hacktron-security-2026-11-07"
translationKey: "openai-biobasicsbench-hacktron-security-2026-11-07"
issue: "2026-11-07"
lang: "fr"
category: "technology"
author: "全球伯乐 News"
authorRole: "Recherche et compilation"
date: "2026-11-07"
description: "Conçu avec Ligo Biosciences à partir de données brutes de paillasse, BioBasicsBench crédite GPT-6 Astra de 66,7 % malgré des erreurs d’interprétation de gels PCR ; OpenAI élargit en parallèle l’accès Daybreak Red de Hacktron."
cover: "/news-media/2026-11-07/openai-biobasicsbench-security-editorial.webp"
coverAlt: "Illustration conceptuelle générée par l’IA : une puce et une boîte de Petri dans des cubes de verre imbriqués, un câble débranché et une loupe symbolisent l’évaluation de l’IA en laboratoire et la sécurité des frontières système, sans représenter un laboratoire réel."
tags: ["Intelligence artificielle", "Sécurité de l’IA", "Logiciels d’entreprise"]
readTime: 5
draft: false
---

![Illustration conceptuelle générée par l’IA : une puce et une boîte de Petri dans des cubes de verre imbriqués, un câble débranché et une loupe symbolisent l’évaluation de l’IA en laboratoire et la sécurité des frontières système, sans représenter un laboratoire réel.](/news-media/2026-11-07/openai-biobasicsbench-security-editorial.webp)

Illustration conceptuelle générée par l’IA : une puce et une boîte de Petri dans des cubes de verre imbriqués, un câble débranché et une loupe symbolisent l’évaluation de l’IA en laboratoire et la sécurité des frontières système, sans représenter un laboratoire réel.

## BioBasicsBench évalue les modèles sur 100 tâches de laboratoire humide : GPT-6 Astra atteint 66,7 % mais se trompe sur des gels PCR

OpenAI a publié le 6 novembre 2026 l’étude *Measuring how AI agents handle everyday wet-lab science*, dévoilant **BioBasicsBench**, un référentiel de **100 tâches** élaboré avec la jeune pousse de conception d’enzymes Ligo Biosciences à partir de données expérimentales brutes plutôt que de figures nettoyées pour des revues scientifiques. Chaque tâche a fait l’objet d’une triple relecture par des biologistes et combine des fiches de référence avec des pièces expérimentales brutes : **31** images de gels et de transferts (*blots*), **27** protocoles et notes de cahier de laboratoire manuscrites ou numériques, et **20** fichiers de lecteurs de plaques ou de cytométrie en flux, complétés par des photographies de boîtes d’agar, des empilements focaux (*z-stacks*) de microscopie, des lectures de séquençage et des vidéos de manipulation. Les 100 épreuves couvrent les méthodes protéiques (25), l’imagerie et la cytométrie (23), la quantification et les dosages (19), les acides nucléiques (17) et le clonage moléculaire (16), évalués sur sept modèles internes d’OpenAI à travers 37 configurations et **18 500 essais notés**.[^1]

Au niveau d’effort de raisonnement maximal (`xhigh`), **GPT-6 Astra** obtient un score moyen de **66,7 %** (intervalle de confiance à 95 % : 60,3 %–73,1 %, avec une moyenne de 4 704 jetons générés par tâche), devançant **GPT-6.1 Sol** (**62,0 %**), **GPT-5.6 Sol** (**43,8 %**), **GPT-6 Luna** (**38,3 %**), **GPT-5.5** (**35,4 %**), **GPT-5.4** (**33,2 %**) et **GPT-5.2** (**31,2 %**, 27 620 jetons). Si GPT-6 Astra a su repérer une inscription manuscrite `LB Kan50` au bord d’une boîte de Petri révélant une erreur d’antibiotique (kanamycine au lieu d’ampicilline) ainsi qu’un chevauchement spectral de fluorescence entre 525 et 540 nm, OpenAI souligne néanmoins des échecs persistants : sur un gel d’agarose de PCR sur colonies, le modèle a correctement distingué deux groupes de bandes (`{4, 6, 7, 8}` et `{5, 9, 10}`) mais a supposé à tort qu’un fragment plus long prouvait l’insertion recherchée, recommandant les colonies **4, 6, 7 et 8** (porteuses de l’ancien plasmide) au lieu des colonies **5, 9 et 10** ; sur un comptage de colonies, il a produit une **surestimation nette d’environ 12 %**, faussant d’autant le calcul d’efficacité de transformation.[^1]

## OpenAI s’allie à Hacktron pour éprouver la sécurité des connexions tierces avec un accès élargi à Daybreak Red

Le même jour (6 novembre 2026), OpenAI a officialisé un partenariat de sécurité offensive avec la start-up californienne **Hacktron**, élargissant l’accès de ses chercheurs aux modèles cyber de pointe d’OpenAI via le programme encadré **Daybreak Red** (soumis à vérification d’identité, attestations juridiques, journalisation d’activité et cloisonnement). Les ingénieurs d’OpenAI et l’équipe de Hacktron sélectionneront conjointement des cibles prioritaires situées aux frontières où les systèmes, l’infrastructure infonuagique et les couches d’authentification d’OpenAI s’interfacent avec des **services tiers et des agents IA connectés**, tandis que des chercheurs de Cathedral rejoindront également le prochain sprint de sécurité d’OpenAI.[^2]

Ce partenariat prolonge une divulgation majeure réalisée par Hacktron via le programme de prime aux bogues d’OpenAI et détaillée le 13 septembre 2026 dans le billet *Hacking OpenAI* : entre le 23 et le 25 juillet 2026, les chercheurs de Hacktron avaient enchaîné en moins de 72 heures l’absence d’un correctif Debian 12 dans `libheif` (v1.19.7) appelé par ImageMagick sur le forum `community.openai.com` (hébergé sous Discourse) — permettant une exécution de code à distance par téléversement d’image `.heic` — avec un défaut de configuration de l’authentification unique (`auth.openai.com`), prenant le contrôle sans interaction des comptes ChatGPT et Codex d’utilisateurs actifs du forum et ouvrant une requête de fusion de démonstration inoffensive (`PR #1186742`) dans le dépôt interne d’OpenAI le 25 juillet ; OpenAI avait corrigé la faille en environ **14 heures** et versé une prime de **6 500 dollars**. Deux réserves méthodologiques s’imposent : BioBasicsBench n’inclut ni référence humaine mesurée ni modèles externes ou dépôt public au moment de sa publication, et l’annonce avec Hacktron porte sur le cadre de test conjoint plutôt que sur un nouveau bilan de vulnérabilités.[^1][^2][^3]

[^1]: 2026-11-06 · [Measuring how AI agents handle everyday wet-lab science](https://openai.com/index/measuring-how-ai-agents-handle-wet-lab-science/) · OpenAI.
[^2]: 2026-11-06 · [Partnering with Hacktron to find vulnerabilities in OpenAI's systems](https://openai.com/index/partnering-with-hacktron/) · OpenAI.
[^3]: 2026-09-13 · [Hacking OpenAI](https://www.hacktron.ai/blog/hacking-openai) · Hacktron.
