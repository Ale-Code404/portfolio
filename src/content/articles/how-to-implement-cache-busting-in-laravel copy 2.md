---
layout: ../../layouts/ArticleLayout.astro
title: Como implementar cache busting en Laravel
description: El cache busting es una técnica que permite a los navegadores recargar los archivos estáticos de manera dinámica, lo que reduce considerablemente el tiempo de carga de páginas web.
image:
  src: https://placehold.co/500x300
  alt: banner
date: 2023-01-05
tags:
  - laravel
  - php
---

# Como implementar el **cache_busting** en Laravel

La intención de esta funcionalidad es que nuestros archivos estaticos, como **.js** o **.css** puedan ser re-cacheados una vez se haga la actualización mediante un _hook_ en el servidor o en el _proceso de integración_ de turno.

> En este caso haremos uso de un servidor _git_.

## ¿Como funciona?

Lo primero que debemos entender es que este proceso añade a nuestra declaración o generación de ruta un valor de _query string_ o parametro para el verbo HTTTP **GET**.

Al hacer un update del proyecto, generalmente es necesario borrar cache, pero usando esta técnica, es posible re-cachear según sea necesario.

### Ejemplo

Tenemos el siguiente archivo _javascript_.

> static/js/login.js

Ahora, debemos hacer una actualización para agregar o quitar cierta funcionalidad en el login, por ende queremos que los cambios se vean reflejados en el cliente, asi que usamos:

> static/js/login.js?**v=hash**

Donde **v** hace referencia a _version_ como un **parametro** y **hash** es su valor computado y cada vez que subamos un cambio el hash cambiará.

## Paso a paso

### 1. Escribir la logica de versionado

Debemos crear un pequeño archivo, el cual tendrá la función **asset_version**, para esto usaremos el directorio **boostrap**.

`boostrap/helpers.php`

    <?php

    function asset_version(string $path, bool $secure = null) {
        $configPath = public_path('updates.json');

        //Call real asset implementation
        $asset = asset($path, $secure);

        if(!file_exists($configPath)) {
            return $asset;
        }

        try {
            $config = json_decode(file_get_contents($configPath));
        } catch (Exception $e) {
            return $asset;
        }

        return $asset . "?v={$config->version}";
    }

### 2. Incluir el archivo en autoload de composer

Ahora debemos decirle a _Composer_ que este archivo es global y debe importarlo automáticamente mediante la propiedad `autoload.files`.

`composer.json`

    "autoload": {
        ...
        ...

        "files": [
            "bootstrap/helpers.php"
        ]
    },

### 3. Escribir la logica de actualización

Este es uno de los más importantes, porque es el hook de git, en este caso `post-receive` quien hace la tarea de llamar al archivo _bash_.

Debemos crear en nuestro servidor git, un archivo dentro o fuera de la carpeta hooks, lo realmente importante es que lo llamemos en `post-receive`.

Por ejemplo `~/user/proyects/my-app/config/update-config.sh`

    #!/bin/bash

    # Obtener la ruta del repositorio
    repo_dir="ruta/absoluta/de/mi/proyecto"

    # Obtener la información del último commit
    commit_info=$(git log --format=format:'{"commit": "%H", "author": "%an <%ae>", "date": "%ad", "message": "%f"}' --date=format:'%F %T' -1)

    # Obtener el número de actualización actual o establecerlo en 1 si el archivo no existe
    if [ -f $repo_dir/public/updates.json ]; then
        updates=$(cat $repo_dir/public/updates.json)
        current_update=$(echo $updates | jq '.["current_update"]')
    else
        current_update=1
    fi

    # Incrementar el número de actualización
    new_update=$((current_update+1))

    # Obtener la fecha actual en formato UTC
    updated_at=$(date +"%F %T")

    # Obtener la fecha actual en formato Unix
    version=$(date +%s)

    # Crear o actualizar la propiedad updated-at, current-update y commit-info en el archivo updates.json
    echo '{
        "current_update": '$new_update',
        "last_commit_info": '$commit_info',
        "updated_at": "'$updated_at'",
        "version": "'$version'"
    }' > $repo_dir/public/updates.json

##### Notas (¡importante!)

- Es importante a este archivo establecerle permisos adecuados, podemos usar`chmod u+rwx,g+rx update-config.sh` para dar permisos totales al usuario y al grupo lectura y ejecución, numericamente seria `750`.
- Debemos configurar algunos comandos según las carateristicas de nuestra distribución de Linux, al menos verificar el
  output correcto para **date**.
- La unica dependencia es **jq**, este es un _parser json_, con esto podemos obtener valores del archivo updates.json,
  lo podemos instalar en la mayoria de distribuciones, con `àpt`: `sudo apt install jq`.
- Si estamos ejecutando nuestro bash desde un directorio diferente al del repositorio entonces para el comando `git log`
  debemos de usar el parametro `--git-dir` y especificar la ruta de la carpeta .git de nuestro proyecto o reutilizar la ruta
  absoluta en la variable `repo_dir` y contatenando `.git`.

### 4. Probar el proceso de actualización

Llegado este punto, nos damos cuenta que el archivo crea un string en formato json y lo escribe en un pequeño archivo en la **carpeta public**. Asi que podemos probar que funciona con:

`bash update-config.sh`

Esto deberia crear un archivo `updates.json`con la siguiente estructura:

    {
        "updated_at": "Fecha en formato legible",
        "version": "Fecha en formato unix (hash)",
        "current_update": "Indice incremental de actualización desde 1",
        "last_commit_info": {
            "commit": "Hash del último commit",
            "author": "Autor del último commit",
            "date": "Fecha del último commit",
            "message": "Mensaje del último commit"
        }
    }

Y eso es todo (o casi).

> Importante, recuerda que este archivo _no debería_ estar en el repositorio, asi que agregalo en el **.gitignore**, además con esto se evitan los conflictos al momento de escribir los nuevos valores desde el hook.

### 5. (Opcional) Remplazar las llamadas de asset

Para un proyecto nuevo no hay mucho problema, pero cuando ya tenemos muchas vistas esto puedo ser muy aburridor, para esto podemos usar la herramienta de remplazo de algunos editores como **VsCode**, esta se abre con la combinacion `Ctrl + Shift + H`.

---

Ahora necesitamos usar **regex**, los campos son los siguientes:

1. Para **el valor a buscar** o **search**

`asset( +)?`

Esto va a buscar todos los textos **asset(** que puedan contender ninguno o más espacios entre _asset_ y el paréntesis. Este parametro puede ser tan complejo como se necesite, desde cambiar todas las llamadas **asset** _como en este ejemplo_ hasta buscar aquellas que llamen archivos js y css.

2. Para **el valor a reemplazar** o **replace**

`asset_version`

3. Para **archivos a incluirr** o **files to include**

`resources/views/`

Este es el más importante porque queremos que reemplace solamente en las vistas, aqui podriamos ser mucho más específicos usando un regex como `resources/views/*.blade.php`

4. Para **archivos a excluir** o **files to exclude**

`helpers.php`

Esto con la intención de no alterar el archivo que creamos con la funcion **asset_version**.

---

> ¡Esto es todo, buena suerte!
