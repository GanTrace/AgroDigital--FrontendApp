# Configuración del Backend Personalizado

## Resumen de Cambios Realizados

He actualizado todos los servicios de la aplicación para que utilicen una configuración centralizada del backend a través de los archivos de environment, en lugar de URLs hardcodeadas.

## Archivos Modificados

### 1. Archivos de Environment
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

Ambos archivos ahora apuntan a: `http://localhost:8080/api/v1`

### 2. Servicios Actualizados

**Servicios Públicos:**
- `src/app/public/services/auth.service.ts`
- `src/app/public/services/user.service.ts`

**Servicios del Rancher:**
- `src/app/rancher/services/animal.service.ts`
- `src/app/rancher/services/event.service.ts`
- `src/app/rancher/services/economic.service.ts`
- `src/app/rancher/services/medical-history.service.ts`

**Servicios del Veterinario:**
- `src/app/veterinarian/services/patient.service.ts`
- `src/app/veterinarian/services/medical-record.service.ts`
- `src/app/veterinarian/services/appointment.service.ts`
- `src/app/veterinarian/services/treatments.service.ts`

## Configuración de tu Backend

### Endpoints Esperados

Tu backend debe implementar los siguientes endpoints:

```
GET/POST    /api/v1/users
GET/POST    /api/v1/animals
GET/POST    /api/v1/events
GET/POST    /api/v1/patients
GET/POST    /api/v1/medicalRecords
GET/POST    /api/v1/appointments
GET/POST    /api/v1/treatments
```

### Estructura de Datos Esperada

#### Users
```json
{
  "id": number,
  "name": string,
  "email": string,
  "password": string,
  "role": "rancher" | "veterinarian",
  "profileImage": string | null
}
```

#### Animals
```json
{
  "id": number,
  "name": string,
  "species": string,
  "breed": string,
  "age": number,
  "weight": number,
  "ownerId": number
}
```

#### Events
```json
{
  "id": number,
  "title": string,
  "description": string,
  "date": string,
  "type": string,
  "animalId": number
}
```

#### Patients (para veterinarios)
```json
{
  "id": number,
  "name": string,
  "species": string,
  "breed": string,
  "age": number,
  "weight": number,
  "ownerName": string,
  "ownerContact": string
}
```

#### Medical Records
```json
{
  "id": number,
  "patientId": number,
  "date": string,
  "recordType": string,
  "diagnosis": string,
  "treatment": string,
  "notes": string,
  "followUp": string,
  "veterinarianId": number
}
```

#### Appointments
```json
{
  "id": number,
  "patientId": number,
  "date": string,
  "time": string,
  "reason": string,
  "status": "scheduled" | "completed" | "cancelled",
  "veterinarianId": number
}
```

#### Treatments
```json
{
  "id": number,
  "name": string,
  "description": string,
  "duration": string,
  "cost": number,
  "patientId": number,
  "veterinarianId": number
}
```

## Configuración CORS

Asegúrate de que tu backend tenga configurado CORS para permitir requests desde `http://localhost:4200` (puerto por defecto de Angular):

```javascript
// Ejemplo para Express.js
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## Autenticación

El sistema actual utiliza autenticación basada en consultas GET con email y password. Tu backend debe:

1. Implementar el endpoint: `GET /api/v1/users?email={email}&password={password}`
2. Retornar un array con el usuario si las credenciales son válidas
3. Retornar un array vacío si las credenciales son inválidas

## Cambiar la URL del Backend

Para cambiar la URL del backend, simplemente modifica los archivos:
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

Cambia el valor de `apiUrl` por la URL de tu backend.

## Verificación

1. Asegúrate de que tu backend esté corriendo en `http://localhost:8080`
2. Verifica que todos los endpoints estén implementados
3. Prueba la autenticación desde la aplicación
4. Verifica que los datos se estén guardando en tu backend y no en `db.json`

## Troubleshooting

- **Error de CORS**: Verifica la configuración CORS en tu backend
- **404 Not Found**: Verifica que los endpoints estén implementados correctamente
- **Datos en db.json**: Asegúrate de que el servidor json-server no esté corriendo en el puerto 3000
- **Autenticación fallida**: Verifica que el endpoint de usuarios retorne el formato correcto

## Notas Adicionales

- El sistema ahora está completamente desacoplado del archivo `db.json`
- Todos los servicios utilizan la configuración centralizada
- Es fácil cambiar entre diferentes backends modificando solo los archivos de environment
- El sistema mantiene compatibilidad con la estructura de datos existente