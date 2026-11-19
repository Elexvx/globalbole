---
title: "Le NIST démontre un protocole complet de vérification quantique de position tandis que la CISA alerte sur des failles exploitées dans LiteLLM et REDCap"
slug: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
translationKey: "nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19"
issue: "2026-11-19"
lang: "fr"
category: "technology"
author: "全球伯乐 News"
authorRole: "Compilation des sources"
date: "2026-11-19"
description: "Les physiciens du NIST ont publié dans Nature la première démonstration complète de vérification quantique de position avec des appareils non fiables, tandis que la CISA a inscrit quatre failles activement exploitées à son catalogue KEV."
cover: "/news-media/2026-11-19/nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19-editorial.webp"
coverAlt: "Nature morte de studio réunissant deux cubes séparateurs en verre optique, une boucle de fibre optique et une clé matérielle en acier brossé sur du granit sombre"
tags: ["Intelligence artificielle","Cybersécurité","Politique technologique"]
readTime: 5
draft: false
---

Le 18 novembre 2026, l'[Institut national des normes et de la technologie (NIST)](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show) des États-Unis a annoncé la première démonstration expérimentale complète d'un protocole de vérification quantique de position (Quantum Position Verification, QPV) fonctionnant avec des terminaux distants non approuvés. Le même jour, l'[Agence de cybersécurité et de sécurité des infrastructures (CISA)](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) a inscrit quatre vulnérabilités activement exploitées — touchant la passerelle d'intelligence artificielle BerriAI LiteLLM, la plateforme de données cliniques REDCap, le système Synology DiskStation Manager et Apache Axis — à son catalogue des vulnérabilités connues pour être exploitées (KEV). Ces deux annonces simultanées illustrent à la fois l'avenir de l'authentification physique à confiance zéro et l'urgence des menaces pesant sur les chaînes logicielles actuelles[^1][^2].

![Nature morte de studio réunissant deux cubes séparateurs en verre optique, une boucle de fibre optique et une clé matérielle en acier brossé sur du granit sombre](/news-media/2026-11-19/nist-quantum-position-verification-cisa-kev-litellm-redcap-2026-11-19-editorial.webp)

Illustration conceptuelle générée par l'IA : deux cubes séparateurs en verre optique transparent, une boucle de fibre optique translucide et un jeton de sécurité en acier inoxydable brossé sans marquage sur du granit sombre symbolisent la vérification quantique de position et la sécurisation des infrastructures d'IA, sans constituer une photographie réelle du NIST ou de la CISA.

## Photons intriqués et triangulation à la vitesse de la lumière forgent une preuve physique infalsifiable

Publiée dans la revue *Nature* (`DOI: 10.1038/s41586-026-11247-3`) par Gautam Kavuri, Scott Glancy et Krister Shalm, l'expérience menée par l'[équipe du NIST à Boulder](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show), au Colorado, répond à une limite fondamentale de la cryptographie classique. Si les protocoles actuels vérifient la détention d'une clé numérique, ils ne peuvent garantir l'emplacement physique réel de l'opérateur — une faille structurelle alors que la cybercriminalité a coûté plus de 16 milliards de dollars aux États-Unis en 2024 pour un taux d'arrestation inférieur à 1 %. En plaçant un terminal à mi-chemin entre deux stations de vérification distantes de 195 mètres, les chercheurs ont transformé la coordonnée géographique elle-même en justificatif cryptographique inviolable[^1].

Le dispositif combine le théorème de non-clonage quantique, la limite relativiste de la vitesse de la lumière et un test de Bell sans échappatoire (*loophole-free Bell test*). Les deux stations émettent des signaux classiques synchronisés et des photons intriqués vers le dispositif central, qui doit mesurer les états quantiques et renvoyer ses réponses dans la fenêtre temporelle exacte imposée par la propagation lumineuse. Grâce à des détecteurs de photons uniques à nanofils supraconducteurs (SNSPD) à très haut rendement, les vérificateurs n'ont pas besoin d'accorder leur confiance au matériel du terminal : toute tentative extérieure d'intercepter, de copier ou de relayer les états quantiques détruit l'intrication ou dépasse le délai relativiste sur des millions d'essais répétés[^1].

## Des vulnérabilités activement exploitées ciblent les passerelles d'IA et la recherche clinique

Pendant que la physique quantique prépare les architectures de demain, les couches logicielles déployées par les entreprises subissent des attaques immédiates. Dans son [alerte de sécurité du 18 novembre](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog), la CISA révèle l'exploitation active de la faille `CVE-2026-40217` (canal alternatif non protégé dans BerriAI LiteLLM) et de la faille `CVE-2026-90817` (injection de code dans la plateforme REDCap développée par l'Université Vanderbilt). Comme LiteLLM centralise le routage et les clés API de nombreux grands modèles de langage en entreprise, et que REDCap héberge les bases d'essais cliniques de milliers d'institutions médicales dans le monde, leur compromission expose directement les jetons d'IA critiques et les données biomédicales sensibles[^2].

L'[avis contraignant de la CISA](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) cible également la vulnérabilité d'encodage de sortie `CVE-2024-10441` dans Synology DiskStation Manager (DSM) ainsi que la faille de réflexion non sécurisée `CVE-2026-90436` dans Apache Axis. En vertu de la directive opérationnelle contraignante BOD 26-04 (*Prioritizing Security Updates Based on Risk*), les agences fédérales civiles américaines doivent appliquer les correctifs dans les délais prescrits ou cesser immédiatement d'utiliser les composants concernés. La CISA appelle parallèlement les fournisseurs de cloud, les instituts de recherche et les équipes d'ingénierie IA du secteur privé à sécuriser sans délai leurs passerelles de modèles et leurs serveurs de stockage en réseau[^2].

[^1]: 2026-11-18 · [Quantum Physics Can Verify a Person's Location, NIST Researchers Show](https://www.nist.gov/news-events/news/2026/11/quantum-physics-can-verify-persons-location-nist-researchers-show) · Institut national des normes et de la technologie (NIST).
[^2]: 2026-11-18 · [CISA Adds Four Known Exploited Vulnerabilities to Catalog](https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog) · Agence de cybersécurité et de sécurité des infrastructures (CISA).
