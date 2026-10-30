---
title: "Веса Mistral Large 4 доступны для развёртывания: контроль и лицензионные границы"
slug: "mistral-large4-open-weights-2026-10-30"
translationKey: "mistral-large4-open-weights-2026-10-30"
issue: "2026-10-30"
lang: "ru"
category: "technology"
author: "全球伯乐 News"
authorRole: "Подготовка по материалам источников"
date: "2026-10-30"
description: "Large 4 предлагает загружаемые веса. Контроль над развёртыванием расширяется, но оборудование, независимые тесты и условия лицензии по-прежнему определяют границы использования."
cover: "/news-media/2026-10-30/nersc-server-rack.jpg"
coverAlt: "Архивная фотография задней стороны стойки в дата-центре NERSC; это не объект Mistral."
tags: ["Искусственный интеллект", "Открытые веса", "Развёртывание моделей"]
readTime: 6
draft: false
---

6 октября Mistral представила предварительный API Large 4, пообещав открыть веса к концу месяца.[^3] 29 октября Hugging Face сообщила об их доступности.[^2] В репозитории разработчика уже размещены загружаемые файлы, инструкции по развёртыванию и лицензия.[^1]

![Архивная фотография задней стороны стойки в дата-центре NERSC; это не объект Mistral.](/news-media/2026-10-30/nersc-server-rack.jpg)

Архивная фотография: 14 октября 2011 года, дата-центр NERSC. [Rear of rack at NERSC data center - closeup](https://commons.wikimedia.org/wiki/File:Rear_of_rack_at_NERSC_data_center_-_closeup.jpg), фотография: [Chiara Coetzee](https://www.flickr.com/photos/dcoetzee/6271241131/); [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

## Размер модели не равен стоимости каждого запуска

В документации разработчика указано, что Large 4 использует архитектуру смеси экспертов с общим числом параметров около одного триллиона. Для каждого токена фактически активируются около 49 млрд параметров, а с учётом слоёв эмбеддингов и вывода — около 52 млрд. Модель принимает текст и изображения, выдаёт текст; заявленная длина контекста составляет 1 млн токенов. Разработчик предлагает контрольную точку FP8 и отдельную NVFP4. Последняя предназначена для GPU Blackwell и, по заявлению разработчика, позволяет уменьшить требования к видеопамяти.[^1]

Это описание устройства модели и поддерживаемых возможностей, а не гарантия, что любая организация сможет недорого обрабатывать контекст максимальной длины. Необходимое оборудование, видеопамять, пропускная способность и фактические расходы по-прежнему зависят от варианта квантования весов и конфигурации запуска. Общее число параметров, число параметров, активируемых для каждого токена, и объём контекста отвечают на разные вопросы. Ни одно из этих чисел нельзя принимать за полный показатель стоимости сервиса.

## Самостоятельное развёртывание приносит и обязанности по управлению

Публикация весов меняет границы контроля: в пределах разрешённого лицензией компании могут запускать модель в собственной или выбранной среде и шире управлять потоками данных, конфигурацией модели и доступностью. Большая самостоятельность одновременно передаёт развёртывающей стороне ответственность за управление доступом, журналы событий, обновления модели и защиту от злоупотреблений.

Документация модели содержит результаты тестов, в том числе по программированию, и описание возможностей в области кибербезопасности. Это опубликованные разработчиком показатели, а не результаты независимого воспроизведения нашим сайтом. Оценки в тестах не равны частоте обнаружения проблем, качеству исправлений или гарантии безопасности в любой производственной среде.[^1] Перед принятием решения всё ещё необходимо тестировать реальные задачи и различать, даёт ли модель пригодный ответ, правильно ли система выполняет действия и можно ли обнаружить и ограничить ошибки.

## Открытые веса по-прежнему регулируются конкретной лицензией

Модель и сопутствующая документация распространяются по Mistral Ecosystem Open-Weight License — изменённой лицензии MIT с дополнительными условиями. Её нельзя сокращённо описывать как безусловную MIT или открытый код по Apache. Условия разрешают соответствующее использование, копирование, изменение и развёртывание, одновременно требуя сохранять уведомления об авторских правах и лицензии в копиях или существенных частях материалов.[^4]

Если лицензиат или его аффилированное лицо ведёт бизнес «модель как услуга» в определении условий лицензии, то, кроме исключений, предусмотренных разделом 3, до использования модели или её производных для любых коммерческих целей необходимо получить отдельную коммерческую лицензию Mistral. Определение в условиях сосредоточено на доступе к модели, при котором третья сторона может существенно контролировать входные данные, параметры или обучающие данные. Конечные продукты, встраивающие модель лишь в определённую функцию, и простая переадресация запросов к другим размещённым моделям в это определение не входят. Для внутреннего использования и доступа через официальные продукты Mistral предусмотрены отдельные исключения. Это нельзя сводить к утверждению, что любое размещение моделей или любое коммерческое применение одинаково ограничено.[^4]

Этот выпуск имеет практическое значение для организаций, желающих самостоятельно развёртывать крупные модели. Но решения о закупке или запуске по-прежнему требуют проверки лицензии, бюджета оборудования, независимых тестов и управления безопасностью; количества параметров или места в рейтингах недостаточно. В статье документация модели редакционно обработана и переведена с сохранением её уведомления об авторстве: **2026 - Mistral**; [полный оригинальный текст лицензионного уведомления](/news-sources/2026-10-30/mistral-ecosystem-open-weight-license.txt). Это не означает, что Mistral одобряет данную статью.

## Оригинальный текст лицензии на английском языке

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

[^1]: В документации модели не указана фиксированная дата публикации · [Mistral Large 4 - Le Chonk](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/README.md) · Mistral AI; использована проверенная фиксированная версия документации, сведения о параметрах, возможностях и тестах представляют собой описание разработчика.
[^2]: 2026-10-29 · [Welcome Le Chonk: Mistral Large 4 on Hugging Face](https://huggingface.co/blog/mistral-large4) · Hugging Face.
[^3]: 2026-10-06 · [Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4/) · Mistral AI.
[^4]: В файле лицензии не указана фиксированная дата публикации · [Mistral Ecosystem Open-Weight License](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/f12dabdc0c1e99e7f7924461a6f308859b05af4d/LICENSE) · Mistral AI; конкретные права и исключения определяются полным оригинальным текстом условий.
