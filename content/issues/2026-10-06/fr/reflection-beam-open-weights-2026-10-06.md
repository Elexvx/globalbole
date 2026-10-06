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
cover: "/news-media/2026-10-06/beam-editorial.png"
coverAlt: "Illustration générée par l’IA : des modules bleu marine entourent un noyau lumineux, évoquant le calcul et l’ouverture des modèles"
tags: ["Intelligence artificielle", "Infrastructures"]
readTime: 4
draft: false
---

La société américaine Reflection AI, soutenue par Nvidia, a dévoilé le 5 octobre son premier modèle, Beam, destiné au code, au raisonnement et aux tâches agentiques. Son architecture à mélange d’experts clairsemé compte 501 milliards de paramètres au total, dont environ 23 milliards activés par jeton. L’entreprise le présente comme une nouvelle alternative aux modèles chinois à poids ouverts ; Reuters situe également cette annonce dans la concurrence avec DeepSeek, Kimi et d’autres modèles.[^1][^2]

![Illustration générée par l’IA : des modules bleu marine entourent un noyau lumineux, évoquant le calcul et l’ouverture des modèles](/news-media/2026-10-06/beam-editorial.png)

*Illustration générée par l’IA : des modules bleu marine entourent un noyau lumineux, évoquant le calcul et l’ouverture des modèles.*

## Les poids restent à publier

Reflection décrit cette version comme un aperçu encore soumis à des tests adversariaux et à des évaluations. Certains utilisateurs y accéderont d’abord ; les poids, le rapport technique, la fiche du modèle et les outils de développement sont prévus en octobre, avec une licence Apache 2.0 pour les poids. L’annonce ne signifie donc pas que les poids sont déjà téléchargeables, ni que le modèle est prêt pour un déploiement généralisé en production.[^1]

## Efficacité et scores ne mesurent pas la même chose

Selon Reflection, Beam approche GLM-5.2 sur certains tests de raisonnement avec environ un tiers à un quart de ses besoins de calcul d’inférence. Cette estimation repose sur les paramètres actifs et les jetons générés. Elle exclut le prétraitement de la requête, les opérations d’attention dépendant du contexte et les surcoûts de service ; elle ne se convertit pas directement en facture client.[^1]

Le tableau Terminal-Bench 2.1 de l’entreprise attribue 80,1 à Beam et 81,0 à GLM-5.2. L’efficacité et la meilleure performance sur une tâche sont deux dimensions distinctes ; une compilation d’évaluations par le développeur ne remplace pas leur reproduction externe. Les entreprises doivent rapprocher les conditions de test de leurs propres usages avant de juger l’importance d’un écart, plutôt que choisir un modèle sur un seul score global.[^1]

## L’API reste en phase bêta

La documentation officielle indique que Reflection API est en bêta : l’accès s’ouvre progressivement par liste d’attente et le comportement comme les limites peuvent évoluer. L’interface compatible avec OpenAI propose Chat Completions et Models, ce qui permet de conserver une partie des outils existants. Cette compatibilité ne garantit pas des capacités, une disponibilité et une tarification identiques.[^3] La page Models indique actuellement un contexte de 256K et une sortie maximale de 128K jetons, tout en précisant que la limite de contexte peut changer pendant la bêta. Le contexte comprend l’entrée et la sortie générée ; les requêtes trop longues sont rejetées plutôt que tronquées automatiquement. Avec de longs documents et des appels d’outils répétés, il faut donc réserver de la place à la sortie et au raisonnement.[^5]

La documentation précise aussi que Beam raisonne toujours, avec cinq niveaux d’effort et le niveau moyen par défaut. Un effort accru implique généralement davantage de jetons et de latence ; les jetons de raisonnement entrent dans le budget de sortie. Si celui-ci est trop faible, le modèle peut l’épuiser en raisonnant et ne fournir aucune réponse finale. Pour les applications qui enchaînent les appels d’outils, ces contraintes comptent autant que le nombre total de paramètres dans l’expérience d’intégration.[^4]

## De l’aperçu à la livraison effective

Pour les entreprises, Beam ajoute un candidat à tester, mais les décisions d’achat doivent rester liées à des charges de travail précises. Une fois la promesse de poids ouverts tenue, les équipes pourront mieux vérifier les besoins de déploiement, la licence, le taux de réussite des tâches et le coût. Le signal principal, à ce stade, est l’arrivée d’un nouveau fournisseur de modèles ; sa capacité à offrir durablement un service fiable et économique devra être établie par la livraison effective.

[^1]: 2026-10-05 · [Présentation de Beam, le modèle à poids ouverts de Reflection doté de 501 milliards de paramètres](https://reflection.ai/blog/introducing-beam) · Reflection · Titre original：Introducing Beam: Reflection’s 501B open-weight model

[^2]: 2026-10-05 · [Reflection, soutenue par Nvidia, dévoile son premier modèle d’IA pour concurrencer les modèles ouverts chinois](https://www.investing.com/news/stock-market-news/nvidiabacked-reflection-unveils-first-ai-model-to-take-on-chinese-open-models-4932928) · Reuters / Investing.com · Titre original：Nvidia-backed Reflection unveils first AI model to take on Chinese open models

[^3]: Sans date de publication ; consulté le 2026-10-06 · [Introduction à la documentation développeur](https://developers.reflection.ai/introduction) · Reflection Developer Docs · Titre original：Introduction

[^4]: Sans date de publication ; consulté le 2026-10-06 · [Raisonnement](https://developers.reflection.ai/reasoning) · Reflection Developer Docs · Titre original：Reasoning

[^5]: Sans date de publication ; consulté le 2026-10-06 · [Modèles](https://developers.reflection.ai/models.md) · Reflection Developer Docs · Titre original：Models
