---
title: "Haiku 5.5 réduit de 90 % le prix des tokens pour les requêtes courtes ; l’économie par tâche dépend de l’usage"
slug: "claude-haiku-5-5-pricing-2026-10-08"
translationKey: "claude-haiku-5-5-pricing-2026-10-08"
issue: "2026-10-08"
lang: "fr"
category: "technology"
author: "Global Bole News"
authorRole: "Recherche et synthèse documentaire"
date: "2026-10-08"
description: "Le nouveau petit modèle d’Anthropic comporte deux paliers tarifaires. La baisse moyenne du coût par tâche, estimée à 75 %, se distingue de la réduction de 90 % du prix des tokens pour les requêtes courtes."
seoTitle: "Haiku 5.5 réduit de 90 % le prix des tokens pour les requêtes courtes ; l’économie par tâche dépend de l’usage"
seoDescription: "Le nouveau petit modèle d’Anthropic comporte deux paliers tarifaires. La baisse moyenne du coût par tâche, estimée à 75 %, se distingue de la réduction de 90 % du prix des tokens pour les requêtes courtes."
cover: "/news-media/2026-10-08/haiku-editorial.png"
coverAlt: "Illustration générée par l’IA : un bloc informatique et des feuilles vierges évoquent un traitement par IA centré sur des tâches précises."
tags: ["Intelligence artificielle", "Anthropic", "Gouvernance d’entreprise"]
readTime: 4
draft: false
---

Anthropic a lancé Claude Haiku 5.5 le 7 octobre, proposant une option moins coûteuse pour des tâches d’IA bien délimitées. Il faut distinguer le prix des tokens du coût nécessaire pour mener une tâche à bien. Pour les requêtes comportant jusqu’à 100 000 tokens en entrée, l’entreprise affiche un tarif de 0,10 dollar par million de tokens en entrée et de 0,50 dollar par million de tokens en sortie, contre respectivement 1,00 et 5,00 dollars pour Haiku 4.5. Ces prix unitaires baissent donc de 90 %.[^1]

![Illustration générée par l’IA : un bloc informatique et des feuilles vierges évoquent un traitement par IA centré sur des tâches précises.](/news-media/2026-10-08/haiku-editorial.png)

*Illustration générée par l’IA : un bloc informatique et des feuilles vierges évoquent un traitement par IA centré sur des tâches précises.*

## Deux paliers tarifaires, deux comparaisons différentes

Au-delà de 100 000 tokens dans la requête, les nouveaux tarifs passent à 0,50 dollar en entrée et à 2,50 dollars en sortie par million de tokens. L’estimation d’Anthropic d’une baisse d’environ 75 % du coût moyen par tâche tient compte de la répartition des requêtes et de l’évolution de la consommation de tokens. Selon l’entreprise, le nouveau système de découpage du texte utilise légèrement plus de tokens pour le même travail. Il s’agit donc d’une moyenne calculée par le fournisseur, et non d’une promesse de réduire de trois quarts la facture de chaque client.[^1]

Un exemple arithmétique simple permet de comprendre la différence. Supposons 1 000 requêtes distinctes consommant chacune 1 000 tokens en entrée et 100 en sortie, sans mise en cache ni autres frais. Les tarifs affichés pour les requêtes courtes donnent un coût de 0,15 dollar, contre 1,50 dollar avec les anciens tarifs, à nombre de tokens identique. Cet exemple illustre uniquement le barème. Il ne mesure pas si les modèles exécutent correctement le travail, nécessitent de nouvelles tentatives ou produisent des réponses plus longues.

## Des traitements moins coûteux exigent toujours des tests par tâche

L’annonce présente Haiku comme adapté à des usages tels que la classification, la synthèse et les sous-agents d’appui. Anthropic indique également que ses modèles plus puissants restent mieux adaptés aux tâches complexes de programmation réalisées par des agents. C’est un positionnement commercial du produit, pas la preuve qu’une organisation donnée peut remplacer ses méthodes de travail sans effectuer de tests.[^1]

Le guide pratique du cadre de gestion des risques liés à l’IA du NIST fournit des repères indépendants pour évaluer ce choix. Ses recommandations en matière de mesure préconisent des tests adaptés à l’usage prévu, des seuils de performance acceptables, la documentation des limites connues et une comparaison des performances avant et après déploiement. Elles soulignent aussi que des résultats obtenus dans un contexte ne se retrouvent pas nécessairement dans un autre. Ces recommandations générales ne constituent ni une évaluation ni une approbation de Haiku 5.5.[^2]

## L’indicateur utile pour l’entreprise est une tâche correctement achevée

Pour une application traitant des documents courants, une comparaison pertinente conserverait le même jeu de tests et les mêmes critères d’acceptation, puis comptabiliserait les résultats satisfaisants, les nouvelles tentatives et les corrections humaines, en plus de la consommation de tokens. Une première réponse moins chère peut revenir cher si le personnel doit la corriger ; un appel légèrement plus coûteux peut être avantageux s’il évite plusieurs étapes supplémentaires.

Ce lancement modifie ainsi le coût initial des expérimentations, sans trancher à lui seul la décision de déploiement. Le meilleur cas d’usage d’un petit modèle reste une tâche bien circonscrite, dont la précision est mesurable et pour laquelle une procédure fiable est prévue pour prendre le relais en cas de difficulté. Un tarif plus bas élargit cette possibilité, mais ne suffit pas à déterminer le coût final du service.

[^1]: 2026-10-07 · [Présentation de Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5) · Anthropic

[^2]: Consulté le 2026-10-08 ; date de publication non indiquée · [Mesurer : guide pratique du cadre de gestion des risques liés à l’IA](https://airc.nist.gov/airmf-resources/playbook/measure/) · NIST
