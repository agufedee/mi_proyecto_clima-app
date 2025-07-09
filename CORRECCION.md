# Corrección de Mala Práctica en ClimApp

## 1. ¿Qué mala práctica identificaste?

- Ausencia de comentarios en el archivo HTML principal.
- Datos climáticos hardcodeados.
- Potencial uso de claves API directamente en código (a prevenir).
- Falta de separación y externalización de configuración sensible.

## 2. ¿Por qué es considerada una mala práctica?

- La falta de comentarios dificulta la colaboración y el mantenimiento del código.
- Incluir datos estáticos hace que el sistema no sea dinámico ni escalable.
- Las claves de API expuestas públicamente pueden ser utilizadas por terceros, generando problemas de seguridad o costos.
- La configuración sensible debe manejarse fuera del código para cumplir buenas prácticas de seguridad.

## 3. ¿Cómo la solucionaste?

- Se agregaron comentarios HTML explicativos en las principales secciones.
- Los datos climáticos se cargan dinámicamente desde una API desde app.js.
- Se recomendó el uso de variables de entorno para manejar claves de API y evitar su exposición.

## 4. ¿Qué beneficios aporta tu solución?

- Mejora la legibilidad y mantenibilidad del código.
- Aumenta la seguridad del proyecto al proteger credenciales.
- Permite escalar el sistema de manera más profesional.
- Favorece el trabajo colaborativo y evita errores humanos comunes.

