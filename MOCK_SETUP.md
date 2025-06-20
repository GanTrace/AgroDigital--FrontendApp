# Configuración de Datos Mock para AgroDigital

## Descripción

Esta solución temporal permite que la aplicación AgroDigital funcione sin depender de un servidor backend externo, utilizando datos simulados (mock) almacenados en memoria.

## ¿Qué se ha implementado?

### 1. Servicio de Datos Mock (`MockDataService`)
- **Ubicación**: `src/app/shared/services/mock-data.service.ts`
- **Funcionalidad**: Simula todas las operaciones de la API con datos en memoria
- **Datos incluidos**:
  - **Usuarios**: 3 usuarios predefinidos (1 veterinario, 2 ganaderos)
  - **Pacientes**: 2 pacientes de ejemplo
  - **Tratamientos**: 2 tratamientos básicos
  - **Registros médicos**: 2 registros médicos de ejemplo
  - **Citas**: 2 citas programadas

### 2. Configuración de Entorno
- **Archivo**: `src/environments/environment.ts`
- **Nueva propiedad**: `useMockData: true`
- **Función**: Activa/desactiva el uso de datos mock

### 3. Servicios Modificados
Los siguientes servicios ahora soportan datos mock:
- `AuthService` - Autenticación y gestión de usuarios
- `MedicalRecordService` - Registros médicos
- `UserService` - Gestión de usuarios

## Credenciales de Acceso

### Veterinario
- **Email**: `maria@veterinaria.com`
- **Contraseña**: `123456`
- **Rol**: `veterinarian`

### Ganaderos
1. **Email**: `juan@rancho.com`
   - **Contraseña**: `123456`
   - **Rol**: `rancher`

2. **Email**: `ana@granja.com`
   - **Contraseña**: `123456`
   - **Rol**: `rancher`

## Cómo Usar

### Para Desarrollo Local
1. La configuración ya está activada por defecto
2. Ejecuta la aplicación normalmente: `ng serve`
3. Usa las credenciales proporcionadas para acceder

### Para Despliegue en Producción
1. La aplicación funcionará automáticamente con datos mock
2. No requiere servidor backend
3. Los datos se reinician en cada recarga de la página

## Funcionalidades Disponibles

### ✅ Completamente Funcionales
- Login y registro de usuarios
- Visualización de pacientes
- Visualización de registros médicos
- Creación de nuevos registros médicos
- Gestión básica de usuarios
- Navegación entre roles (veterinario/ganadero)

### ⚠️ Limitaciones
- Los datos no persisten entre sesiones
- No hay validación de datos complejos
- Algunos servicios específicos pueden requerir adaptación adicional

## Desactivar Datos Mock

Para volver a usar el servidor real:
1. Edita `src/environments/environment.ts`
2. Cambia `useMockData: false`
3. Asegúrate de que el servidor json-server esté ejecutándose

## Próximos Pasos

Para una solución permanente, considera:
1. **Desplegar el backend**: Usar servicios como Railway, Render, o Heroku
2. **Base de datos real**: Migrar de json-server a una base de datos robusta
3. **API REST completa**: Implementar un backend con Node.js, Python, o .NET

## Estructura de Datos Mock

Los datos están organizados en el `MockDataService` con las siguientes entidades:
- `users[]` - Usuarios del sistema
- `patients[]` - Pacientes/animales
- `treatments[]` - Tratamientos disponibles
- `medicalRecords[]` - Registros médicos
- `appointments[]` - Citas programadas

Cada entidad tiene métodos CRUD completos que simulan las operaciones de la API real.

---

**Nota**: Esta es una solución temporal para permitir el funcionamiento de la aplicación en producción sin servidor backend.