---
title: "CrowdStrike ajoute un arrêt d’urgence pour les agents d’IA : le contrôle actuel bloque d’abord l’accès aux modèles"
slug: "crowdstrike-ai-kill-switch-2026-11-04"
translationKey: "crowdstrike-ai-kill-switch-2026-11-04"
issue: "2026-11-04"
lang: "fr"
category: "technology"
author: "全球伯乐 News"
authorRole: "Recherche et synthèse de sources"
date: "2026-11-04"
description: "Le nouvel AI Kill Switch de Falcon Guardian bloque aujourd’hui l’accès des agents non autorisés aux modèles au niveau des passerelles. Les mesures coordonnées sur les terminaux, le cloud et les systèmes d’identité restent prévues pour plus tard."
cover: "/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg"
coverAlt: "Photo d’archives : Un membre du 624e centre d’opérations parle au téléphone devant plusieurs écrans d’ordinateur"
tags: ["Intelligence artificielle", "Cybersécurité"]
readTime: 5
draft: false
---

![Photo d’archives : Un membre du 624e centre d’opérations parle au téléphone devant plusieurs écrans d’ordinateur](/news-media/2026-11-04/air-force-cyber-operations-2018-biermann.jpg)

Des membres du 624e centre d’opérations effectuent des missions cyber à la base interarmées de San Antonio-Lackland, au Texas, le 23 octobre 2018. Photo d’archives. Il ne s’agit pas d’un site de CrowdStrike ni d’une démonstration de ses produits. Photo: [U.S. Air Force / Tech. Sgt. R.J. Biermann](https://commons.wikimedia.org/wiki/File:AFCYBER_Airmen_reach_%E2%80%98firsts%E2%80%99_in_global_exercises_(5267410).jpg) · [Domaine public aux États-Unis ; conditions d’utilisation](https://www.dvidshub.net/about/copyright). L’utilisation de documents visuels du département américain de la Guerre (DoW) n’implique ni ne constitue une approbation de sa part.


## Couper l’accès aux modèles par l’intermédiaire des passerelles

Lorsque les entreprises donnent à des agents d’IA accès au code, aux fichiers et aux systèmes métiers, la sécurité ne se limite plus à repérer un contenu suspect dans les instructions. Elle doit aussi examiner les outils effectivement appelés, les permissions utilisées et la possibilité d’arrêter rapidement un comportement anormal. Le **3 novembre 2026**, CrowdStrike a annoncé l’ajout d’**AI Kill Switch** à Falcon Guardian ainsi que l’extension de points de contrôle au niveau des agents et de l’inspection réseau sur les terminaux. Guardian était déjà disponible depuis septembre : la nouveauté est la mise à jour des fonctions et de leur disponibilité, et non le lancement initial du produit.[^1]

Selon l’explication technique de l’entreprise, la fonction d’arrêt actuellement proposée passe d’abord par les passerelles d’IA : les équipes de sécurité peuvent demander à une passerelle connectée de bloquer l’accès d’un agent aux modèles dont il dépend. Falcon AI Gateway est désormais en disponibilité générale, et des passerelles tierces peuvent également être connectées. Ce mécanisme peut interrompre un processus qui a besoin de cet accès pour continuer à raisonner. **Il ne signifie pas qu’il est déjà possible de mettre fin, en un clic, aux processus des agents sur tous les terminaux, navigateurs, services cloud et environnements SaaS.** L’entreprise classe explicitement les mesures coordonnées de plus large portée parmi les fonctions à venir.[^1][^2]

## Distinguer les fonctions disponibles des essais et des projets

Le calendrier des autres fonctions doit lui aussi être précisé. Selon CrowdStrike, l’inspection réseau sur les terminaux est en disponibilité générale sous **Windows**, mais reste en accès anticipé sur **Mac**. Les contrôles relatifs à l’identité des agents sont présentés au futur. L’entreprise a également annoncé son intention d’acquérir Fiddler AI pour renforcer l’observabilité des agents. Ces annonces ne prouvent pas que l’acquisition est achevée. La présentation du produit ne permet pas non plus de conclure que ses taux de détection ou de faux positifs ont été vérifiés de manière indépendante.[^1]

Cette mise à jour illustre le déplacement des points de contrôle de la sécurité : au-delà de l’analyse des instructions, ils couvrent les communications des passerelles et l’exécution réelle sur les terminaux. Pour acheter ou évaluer de tels outils, nous estimons nécessaire de décomposer l’architecture présentée en fonctions déjà livrées, systèmes d’exploitation pris en charge, fonctions en phase d’essai et capacités qui pourraient seulement être intégrées après une acquisition. Il faut notamment vérifier si un agent peut contourner la passerelle contrôlée et ce qu’il advient des appels d’outils déjà envoyés après le blocage de l’accès au modèle. Les annonces de l’entreprise ne fournissent pas de données d’essais indépendants suffisantes pour répondre à ces questions.

[^1]: 2026-11-03 · [CrowdStrike Delivers AI Security and Safety for the Enterprise](https://www.crowdstrike.com/en-us/press-releases/crowdstrike-delivers-ai-security-safety-for-the-enterprise/) · CrowdStrike. Les statuts de disponibilité générale, d’accès anticipé et de fonctions à venir sont ceux indiqués dans le communiqué à cette date.

[^2]: 2026-11-03 · [Introducing AI Kill Switch: Taking Control When AI Agents Go Rogue](https://www.crowdstrike.com/en-us/blog/crowdstrike-introduces-ai-kill-switch/) · CrowdStrike. La note en fin d’article précise que les fonctions non encore commercialisées peuvent évoluer.
