# Archivos de Internacionalización

Esta carpeta contiene los archivos JSON utilizados para la internacionalización de la aplicación.

## Estructura

Los archivos están organizados por código de idioma:

- `es.json` - Español (idioma predeterminado)
- `en.json` - Inglés

## Formato

Los archivos siguen una estructura jerárquica basada en componentes y categorías para facilitar la organización:

```json
{
  "COMPONENT_NAME": {
    "KEY": "Valor traducido"
  }
}
```

## Uso

Para añadir nuevas traducciones:

1. Añade las nuevas claves y valores en todos los archivos de idioma
2. Sigue la estructura jerárquica existente
3. Mantén las claves en mayúsculas y usa guiones bajos para separar palabras

## Agregar un nuevo idioma

Para añadir soporte para un nuevo idioma:

1. Crea un nuevo archivo con el código del idioma (por ejemplo, `fr.json` para francés)
2. Copia la estructura completa de un archivo existente y traduce todos los valores
3. Actualiza el componente de cambio de idioma para incluir la nueva opción
