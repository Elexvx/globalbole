---
title: "Reflection dévoile Beam : 501 milliards de paramètres, des poids ouverts encore attendus ce mois-ci"
slug: "reflection-beam-open-weights-2026-10-06"
translationKey: "reflection-beam-open-weights-2026-10-06"
issue: "2026-10-06"
lang: "fr"
category: "technology"
author: "Global Bole News"
authorRole: "Recherche et synthèse documentaire"
date: "2026-10-06"
description: "Avec 23 milliards de paramètres actifs, Beam vise le code et les tâches agentiques. Les poids sont promis pour octobre ; les estimations d’efficacité excluent certains coûts de service et l’API reste en bêta."
seoTitle: "Reflection Beam : 501 milliards de paramètres, poids ouverts prévus en octobre"
seoDescription: "Beam vise le code et les tâches agentiques avec 23 milliards de paramètres actifs ; les poids sont attendus en octobre, certains coûts de service manquent aux estimations et l’API reste en bêta."
cover: "/news-media/2026-10-06/beam-editorial.png"
coverAlt: "Illustration générée par l’IA : des modules bleu marine entourent un noyau lumineux, évoquant le calcul et l’ouverture des modèles"
tags: ["Intelligence artificielle", "Infrastructures"]
readTime: 4
draft: false
---

Le 5 octobre, Reflection AI, société américaine soutenue par Nvidia, a dévoilé son premier modèle, Beam, destiné au code, au raisonnement et aux tâches agentiques. Son architecture à mélange d’experts clairsemé compte 501 milliards de paramètres au total, dont environ 23 milliards activés par jeton. L’entreprise le présente comme une nouvelle alternative aux modèles chinois à poids ouverts. Reuters situe aussi l’annonce dans la concurrence avec DeepSeek, Kimi et d’autres modèles.[^1][^2]

![Illustration générée par l’IA : des modules bleu marine entourent un noyau lumineux, évoquant le calcul et l’ouverture des modèles](/news-media/2026-10-06/beam-editorial.png)

*Illustration générée par l’IA : des modules bleu marine entourent un noyau lumineux, évoquant le calcul et l’ouverture des modèles.*

## Les poids restent à publier

Reflection décrit cette version comme un aperçu, encore soumis à des tests adversariaux et à des évaluations. Certains utilisateurs y accéderont d’abord. Les poids, le rapport technique, la fiche du modèle et les outils de développement sont prévus en octobre, avec une licence Apache 2.0 pour les poids. Les poids ne sont pas, pour autant, déjà téléchargeables. Rien n’indique non plus que le modèle soit prêt pour un déploiement généralisé en production.[^1]

## Efficacité et scores ne mesurent pas la même chose

Selon Reflection, Beam approche GLM-5.2 sur certains tests de raisonnement, avec environ un tiers à un quart de ses besoins de calcul d’inférence. Cette estimation repose sur les paramètres actifs et les jetons générés. Elle exclut le prétraitement de la requête, les opérations d’attention dépendant du contexte et les surcoûts de service. Elle ne se convertit pas directement en facture client.[^1]

Le tableau Terminal-Bench 2.1 de l’entreprise attribue 80,1 à Beam et 81,0 à GLM-5.2. Être plus économe en calcul et faire mieux sur une tâche, ce n’est pas la même mesure. Une compilation d’évaluations par le développeur ne remplace pas leur reproduction externe. Avant de juger l’importance d’un écart, les entreprises doivent rapprocher les conditions de test de leurs propres usages. Un seul score global ne suffit pas à choisir un modèle.[^1]

## L’API reste en phase bêta

La documentation officielle indique que Reflection API est en bêta. L’accès s’ouvre progressivement, par liste d’attente, et le comportement comme les limites peuvent évoluer. L’interface compatible avec OpenAI propose Chat Completions et Models, ce qui permet de conserver une partie des outils existants. Cette compatibilité ne garantit pas des capacités, une disponibilité et une tarification identiques.[^3] La page Models indique actuellement un contexte de 256K et une sortie maximale de 128K jetons. Elle précise que la limite de contexte peut changer pendant la bêta. Le contexte comprend l’entrée et la sortie générée. Les requêtes trop longues sont rejetées, plutôt que tronquées automatiquement. Avec de longs documents et des appels d’outils répétés, il faut réserver de la place à la sortie et au raisonnement.[^5]

La documentation précise aussi que Beam raisonne toujours, avec cinq niveaux d’effort et le niveau moyen par défaut. Un effort accru implique généralement davantage de jetons et de latence. Les jetons de raisonnement entrent dans le budget de sortie. Si celui-ci est trop faible, le modèle peut l’épuiser en raisonnant et ne fournir aucune réponse finale. Pour les applications qui enchaînent les appels d’outils, ces contraintes comptent autant, dans l’expérience d’intégration, que le nombre total de paramètres.[^4]

## De l’aperçu à la livraison effective

Pour les entreprises, Beam ajoute un candidat à tester. Les décisions d’achat doivent rester liées à des charges de travail précises. Une fois la promesse de poids ouverts tenue, les équipes pourront mieux vérifier les besoins de déploiement, la licence, le taux de réussite des tâches et le coût. À ce stade, le signal principal est l’arrivée d’un nouveau fournisseur de modèles. Sa capacité à offrir durablement un service fiable et économique devra être établie par la livraison effective.

[^1]: 2026-10-05 · [Présentation de Beam, le modèle à poids ouverts de Reflection doté de 501 milliards de paramètres](https://reflection.ai/blog/introducing-beam) · Reflection · Titre original：Introducing Beam: Reflection’s 501B open-weight model

[^2]: 2026-10-05 · [Reflection, soutenue par Nvidia, dévoile son premier modèle d’IA pour concurrencer les modèles ouverts chinois](https://www.investing.com/news/stock-market-news/nvidiabacked-reflection-unveils-first-ai-model-to-take-on-chinese-open-models-4932928) · Reuters / Investing.com · Titre original：Nvidia-backed Reflection unveils first AI model to take on Chinese open models

[^3]: Sans date de publication ; consulté le 2026-10-06 · [Introduction à la documentation développeur](https://developers.reflection.ai/introduction) · Reflection Developer Docs · Titre original：Introduction

[^4]: Sans date de publication ; consulté le 2026-10-06 · [Raisonnement](https://developers.reflection.ai/reasoning) · Reflection Developer Docs · Titre original：Reasoning

[^5]: Sans date de publication ; consulté le 2026-10-06 · [Modèles](https://developers.reflection.ai/models.md) · Reflection Developer Docs · Titre original：Models
