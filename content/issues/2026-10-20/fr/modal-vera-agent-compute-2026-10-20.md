---
title: "Modal et Vera : le coût des agents IA ne se résume pas aux tests de processeurs"
slug: "modal-vera-agent-compute-2026-10-20"
translationKey: "modal-vera-agent-compute-2026-10-20"
issue: "2026-10-20"
lang: "fr"
category: "technology"
author: "Global Bole News"
authorRole: "Compilation des sources"
date: "2026-10-20"
description: "Pour comparer des infrastructures d’agents, il faut relier résultats validés, périmètre des temps de réponse, compatibilité logicielle, isolation et coût d’exploitation complet."
cover: "/news-media/2026-10-20/nvidia-headquarters-2018.jpg"
coverAlt: "Photographie d’archives du siège de NVIDIA à Santa Clara, en Californie, le 4 août 2018"
tags: ["Agents IA", "Cloud", "NVIDIA", "Infrastructures"]
readTime: 8
draft: false
---

Modal annonce le 19 octobre de premiers tests Vera atteignant jusqu’à deux fois le débit d’Intel GNR comparable, sans accélération séquentielle universelle ; son intégration aux sandboxes reste prévue.[^1]

Son benchmark public utilise 50 tâches à solutions de référence Terminal-Bench, dans des conteneurs préchauffés sans réseau ni latence du modèle ; seules les exécutions validées sont comptées.[^2] Cette distinction fait de l’annonce un point de départ pour évaluer l’infrastructure, et non une réponse au coût d’un service d’agents complet.

![Photographie d’archives du siège de NVIDIA à Santa Clara, en Californie, le 4 août 2018](/news-media/2026-10-20/nvidia-headquarters-2018.jpg)

_Photo d’archives : siège de NVIDIA, Santa Clara, Californie, le 4 août 2018. Photographie : Coolcaesar ; version dérivée avec correction de perspective et recadrage : Jacek Halicki, 2020. Source : [NVIDIA Headquarters](https://commons.wikimedia.org/wiki/File:NVIDIA_Headquarters.jpg). [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)._

## Définir le point de départ du chronomètre

Le temps de service d’un agent peut comprendre l’entrée dans une file d’attente, la préparation de l’environnement, les réponses du modèle, l’exécution des outils, la vérification et la livraison du résultat. Chronométrer à partir du moment où l’environnement est prêt ne répond pas à la même question que chronométrer dès l’envoi de la demande. Aucune méthode n’est intrinsèquement fausse. Le problème commence lorsque la première mesure est présentée comme la seconde.

Le cadre de métriques cloud du NIST précise conditions et frontières de mesure.[^3] Une application pratique consisterait à relever l’arrivée de la requête, la disponibilité de son environnement et l’acceptation du résultat. Cela sépare attente et préparation de l’exécution sans déplacer silencieusement le chronomètre entre plateformes.

Prenons un exemple purement hypothétique : un processus dure 100 secondes, dont 30 de calcul accélérable et 70 d’attente ou d’autres opérations inchangées. Diviser par deux la partie calcul ramène le total à 85 secondes, soit 15 % de temps économisé, et non 50 %. Ce calcul n’est pas une prévision pour Vera. Il montre pourquoi il faut identifier la partie réellement modifiée avant d’extrapoler le résultat d’un composant à un service entier.

## Associer le débit à un délai et à une validation

Un service peut achever davantage de tâches par heure sans que chacune se termine plus vite. Inversement, une tâche isolée rapide ne prouve pas que le système réagit bien à des arrivées simultanées. Pour l’exploitant, la comparaison pertinente porte sur les résultats valides produits dans le délai effectivement promis au client.

Les retards, délais dépassés et échecs doivent donc rester visibles. Exclure du numérateur les coûts des tentatives infructueuses, tout en ne comptant que les succès au dénominateur, rendrait le service artificiellement bon marché. Une moyenne seule peut aussi masquer l’expérience des utilisateurs les plus mal servis. La médiane, un percentile élevé, la composition des tâches et leur rythme d’arrivée apportent des informations différentes et complémentaires.

Un deuxième exemple fictif illustre ce calcul. Un service coûte 100 dollars pendant la période observée et livre 1 000 résultats acceptés : chacun coûte dix cents. Une autre configuration coûte aussi 100 dollars mais ne livre que 800 résultats acceptés : son coût unitaire est de 12,5 cents, quel que soit le nombre de tentatives lancées. Ces chiffres ne sont ni des tarifs Modal ni des taux d’échec observés. La règle d’acceptation doit rester identique pour que la comparaison ait un sens.

## La mutualisation déplace la question vers la capacité de service

La définition du cloud du NIST retient notamment la mutualisation des ressources, l’élasticité rapide et la mesure du service. Les ressources peuvent être réaffectées entre clients, étendues ou libérées, puis mesurées à un niveau adapté au service.[^4] L’achat d’un serveur et une facture cloud ne sont donc pas des unités directement interchangeables.

L’analyse qui en découle consiste à valoriser la capacité à la frontière du service utile. Si la demande est trop faible pour mobiliser une capacité supplémentaire, un débit maximal supérieur ne réduit pas nécessairement une facture fixe. Si elle dépasse la capacité disponible, il faut identifier la véritable contrainte : calcul, mémoire, stockage, service externe ou politique d’admission. Ajouter du calcul ne supprime pas un blocage situé ailleurs.

De même, un accélérateur réservé peut générer des coûts en attendant une opération préalable. Raccourcir celle-ci ne crée toutefois un gain économique que si cela libère du temps facturable ou permet une production utile supplémentaire. Multiplier les secondes gagnées par un tarif horaire affiché ne suffit pas : il faut examiner les unités de facturation, les réservations et la possibilité réelle de démarrer l’étape suivante. Ce raisonnement concerne la comptabilité du système, pas une promesse de marge attachée à un processeur particulier.

## Intégrer la compatibilité au budget de migration

Docker décrit émulation, constructeurs natifs et compilation croisée pour les images multiplateformes ; le code doit correspondre à l’architecture hôte.[^5] Disposer d’un chemin de migration ne rend pas gratuit le transfert d’un portefeuille d’applications.

Une comparaison opérationnelle doit exécuter les mêmes tests d’acceptation sur les deux plateformes et noter les dépendances à reconstruire, remplacer ou maintenir sur l’ancienne. Le démarrage réussi d’un conteneur constitue une preuve moins forte que l’achèvement correct de la tâche métier. Paramètres de compilation, versions des bibliothèques et mécanismes de repli peuvent modifier le résultat, même si le nom de l’application reste identique.

Le travail de migration est lui-même une dépense. Entretenir deux familles d’images, des environnements de test supplémentaires et une possibilité de retour arrière peut être raisonnable, mais ces coûts doivent figurer à côté des frais de serveurs. Un transfert progressif de charges représentatives permet de les découvrir sans supposer toutes les tâches transférables. Cela ne démontre pas qu’une migration est non rentable ; cela définit les mesures nécessaires avant de la déclarer rentable.

## L’isolation n’est pas un surcoût facultatif

Le guide de sécurité des conteneurs du NIST examine les images, registres, orchestrateurs, environnements d’exécution et systèmes hôtes. Il rappelle que l’isolation par noyau partagé n’équivaut pas à celle d’un hyperviseur et recommande notamment des images fiables, des privilèges limités et l’exclusion des secrets des images.[^6] Il s’agit d’un cadre général, non d’une évaluation de l’architecture d’isolation propre à Modal.

Pour les agents, la conséquence analytique est directe : comparer les performances avec les protections réellement exigées en production. Retirer une frontière, élargir des permissions ou supprimer un contrôle pour accélérer un test modifie le service comparé. Un résultat accepté moins cher n’est plus le même produit si les risques d’accès ou de confinement diffèrent sensiblement.

Les prochaines preuves convaincantes devraient associer des tâches représentatives à des configurations reproductibles, à des contrôles de justesse, aux délais de bout en bout et à des frais entièrement explicités. L’annonce ouvre une question intéressante sur le calcul pour agents. Pour y répondre, il faudra montrer que la capacité supplémentaire résiste à la migration logicielle, aux contraintes de service et aux exigences de sécurité, puis devient une production utile plutôt qu’un simple score plus élevé.

[^1]: Modal, 19 octobre 2026, [« Les processeurs NVIDIA Vera doublent le débit des Modal Sandboxes »](https://modal.com/blog/nvidia-vera-sandboxes).
[^2]: Modal Projects, sans date ; consulté le 20 octobre 2026, [« Agentless Agent Bench »](https://github.com/modal-projects/agentless-agent-bench).
[^3]: Frederic de Vaulx, Eric Simmon et Robert Bohn, NIST, avril 2018, [« Description des métriques de services cloud », SP 500-307](https://doi.org/10.6028/NIST.SP.500-307).
[^4]: Peter Mell et Timothy Grance, NIST, septembre 2011, [« Définition du cloud computing selon le NIST », SP 800-145](https://doi.org/10.6028/NIST.SP.800-145), correction éditoriale du 27 avril 2012. Reformulation explicative. Republished courtesy of the National Institute of Standards and Technology ; [conditions de réutilisation](https://www.nist.gov/open/license).
[^5]: Docker, sans date ; consulté le 20 octobre 2026, [« Constructions multiplateformes »](https://docs.docker.com/build/building/multi-platform/). [Licence Apache 2.0](https://github.com/docker/docs/blob/main/LICENSE).
[^6]: Murugiah Souppaya, John Morello et Karen Scarfone, NIST, septembre 2017, [« Guide de sécurité des conteneurs applicatifs », SP 800-190](https://doi.org/10.6028/NIST.SP.800-190). Reformulation explicative. Republished courtesy of the National Institute of Standards and Technology ; [conditions de réutilisation](https://www.nist.gov/open/license). Aucun graphique source n’est reproduit.
