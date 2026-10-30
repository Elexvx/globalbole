---
title: "Les poids de Mistral Large 4 sont déployables : maîtrise et limites de la licence"
slug: "mistral-large4-open-weights-2026-10-30"
translationKey: "mistral-large4-open-weights-2026-10-30"
issue: "2026-10-30"
lang: "fr"
category: "technology"
author: "全球伯乐 News"
authorRole: "Recherche et synthèse"
date: "2026-10-30"
description: "Large 4 propose des poids téléchargeables. La maîtrise du déploiement s’élargit, mais le matériel, les tests indépendants et une licence conditionnelle encadrent toujours son utilisation."
cover: "/news-media/2026-10-30/nersc-server-rack.jpg"
coverAlt: "Photographie d’archives de l’arrière d’une baie du centre de données NERSC, et non d’une installation de Mistral."
tags: ["Intelligence artificielle", "Poids ouverts", "Déploiement de modèles"]
readTime: 6
draft: false
---

Mistral a présenté l’API de préversion de Large 4 le 6 octobre, annonçant les poids pour la fin du mois.[^3] Hugging Face a annoncé leur disponibilité le 29 octobre.[^2] Le dépôt du développeur contient désormais des fichiers téléchargeables, des instructions de déploiement et une licence.[^1]

![Photographie d’archives de l’arrière d’une baie du centre de données NERSC, et non d’une installation de Mistral.](/news-media/2026-10-30/nersc-server-rack.jpg)

Archives : 14 octobre 2011, centre de données NERSC. [Rear of rack at NERSC data center - closeup](https://commons.wikimedia.org/wiki/File:Rear_of_rack_at_NERSC_data_center_-_closeup.jpg). Photographie : [Chiara Coetzee](https://www.flickr.com/photos/dcoetzee/6271241131/) ; [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## La taille du modèle ne mesure pas le coût de chaque exécution

Selon la documentation du développeur, Large 4 utilise une architecture à mélange d’experts, avec environ mille milliards de paramètres au total. Environ 49 milliards sont activés pour chaque jeton, ou 52 milliards en incluant les couches d’embedding et de sortie. Le modèle reçoit du texte et des images, produit du texte et annonce une fenêtre de contexte d’un million de jetons. Le développeur fournit une version FP8 ainsi qu’un autre point de contrôle NVFP4, destiné aux GPU Blackwell, qui permettrait de réduire les besoins en mémoire graphique.[^1]

Ces indications décrivent la conception du modèle et ses capacités prises en charge. Elles ne signifient pas que toute organisation pourra traiter à faible coût des contextes de longueur maximale. Le matériel nécessaire, la mémoire graphique, le débit et le coût effectif dépendent encore de la version quantifiée des poids et de la configuration d’exécution. Le nombre total de paramètres, le nombre de paramètres activés par jeton et la capacité de contexte répondent à des questions différentes : aucun de ces chiffres ne résume à lui seul le coût d’un service complet.

## Le déploiement autonome implique aussi des responsabilités de gouvernance

L’ouverture des poids modifie la répartition du contrôle. Dans les limites prévues par la licence, une entreprise peut exécuter le modèle dans son propre environnement ou dans un environnement choisi, et disposer d’une plus grande maîtrise des flux de données, de la configuration et de la disponibilité. Cette autonomie accrue transfère cependant à l’exploitant la responsabilité de la gestion des accès, des journaux, des mises à jour du modèle et de la prévention des abus.

La documentation présente des résultats de tests de référence, notamment en programmation, ainsi que des capacités en cybersécurité. Il s’agit de performances publiées par le développeur, et non reproduites indépendamment par notre rédaction. Des résultats de benchmark ne garantissent ni un taux de détection, ni la qualité des corrections, ni la sécurité dans n’importe quel environnement de production.[^1] Avant toute décision, il reste nécessaire de tester des tâches réelles et de distinguer trois questions : le modèle fournit-il une réponse exploitable, le système l’exécute-t-il correctement, et les erreurs peuvent-elles être détectées et contenues ?

## Des poids ouverts restent soumis à une licence précise

Le modèle et sa documentation sont régis par la Mistral Ecosystem Open-Weight License, une version modifiée de la licence MIT comportant des conditions supplémentaires. Il serait donc inexact de les présenter simplement comme relevant d’une licence MIT ou Apache sans conditions. Les dispositions permettent les usages, la copie, la modification et le déploiement correspondants, tout en exigeant de conserver les mentions de droits d’auteur et de licence dans les copies ou les parties substantielles.[^4]

Si le titulaire de la licence ou l’une de ses sociétés affiliées exerce une activité de « modèle en tant que service » au sens des dispositions, il doit obtenir une licence commerciale distincte de Mistral avant d’utiliser le modèle ou ses œuvres dérivées à quelque fin commerciale que ce soit, sauf dans les cas prévus à l’article 3. La définition vise l’accès à un modèle sur lequel des tiers peuvent exercer un contrôle substantiel concernant les entrées, les paramètres ou les données d’entraînement. Les produits finaux intégrant un modèle dans une fonction particulière et le simple transfert de requêtes vers d’autres modèles hébergés ne relèvent pas de cette définition. L’utilisation interne et l’accès par les produits officiels de Mistral bénéficient d’autres exceptions. Il ne faut donc pas résumer ces dispositions comme imposant une restriction identique à tout hébergement ou à tout usage commercial.[^4]

Cette publication présente un intérêt concret pour les organisations souhaitant déployer elles-mêmes de grands modèles. Une décision d’achat ou de mise en production doit néanmoins reposer sur la licence, le budget matériel, des tests indépendants et la gouvernance de la sécurité, et non sur la seule taille du modèle ou son classement. Cet article adapte et traduit des éléments de la documentation du modèle et en conserve la mention d’attribution : **2026 - Mistral** ; [notification originale complète de licence](/news-sources/2026-10-30/mistral-ecosystem-open-weight-license.txt). Cela n’implique aucun soutien de Mistral à cet article.

## Texte original de la licence en anglais

> Mistral Ecosystem Open-Weight License 
>
> Mistral Ecosystem Open-Weight License. This license is a modified version of the MIT license. 
> Attribution notice: 2026 - Mistral 
>
> Permission is hereby granted, free of charge, to any person (the “Licensee”) obtaining a copy of this model and associated documentation files - including the model weights, parameters, configuration files, and associated documentation (the “Model”), to deal in the Model without restriction, including without limitation the rights to (a) use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Model; (b) run, deploy, further train or otherwise modify the Model and create derivative works from it; and (c) permit persons to whom the Model is furnished to do so, subject to the following conditions: 
>
> 1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Model. 
>
> 2. If the Licensee or any of its affiliates operates a Model as a Service business, the Licensee must enter into a separate commercial license with Mistral before using the Model or its derivative works for any commercial purpose. The Licensee may contact Mistral, using this form: https://mistral.ai/contact/, to request a commercial license. 
>
> "Model as a Service" means giving a third party access to the Model or its derivative works for inference or post-training by any means (for instance via API or hosted endpoints), in a manner that allows such third party to exercise meaningful control over the inputs, parameters, or training data. This does not include (a) end-user products with model capabilities solely embedded within specific features or harnesses, or (b) mere relaying of requests to models hosted by others. 
>
> 3. The requirements set forth in Section 2 do not apply to: (a) internal use of the Model or its derivative works, defined as any use that does not make the Model or its derivative works available to third parties; or (b) any use of the Model accessed through Mistral’s official products. 
>
> THE MODEL AND ANY OUTPUT THEREFROM ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL MISTRAL BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE MODEL OR THE USE OR OTHER DEALINGS IN THE MODEL.
>
> For any questions regarding this license, please contact us using the form here: https://mistral.ai/contact/

[^1]: Documentation du modèle sans date de publication fixe indiquée · [Mistral Large 4 - Le Chonk](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/README.md) · Mistral AI ; version fixe vérifiée de la documentation. Les paramètres, capacités et résultats de tests sont ceux décrits par le développeur.
[^2]: 2026-10-29 · [Welcome Le Chonk: Mistral Large 4 on Hugging Face](https://huggingface.co/blog/mistral-large4) · Hugging Face.
[^3]: 2026-10-06 · [Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4/) · Mistral AI.
[^4]: Fichier de licence sans date de publication fixe indiquée · [Mistral Ecosystem Open-Weight License](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/LICENSE) · Mistral AI ; les droits et exceptions applicables sont définis par l’intégralité des dispositions originales.
