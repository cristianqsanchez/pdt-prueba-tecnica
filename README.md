[demo.webm](https://github.com/user-attachments/assets/f3f97bd9-cee5-4b5d-a25f-b3fa2257a7a1)

<div align="center">
    <img src="docs/ico.png" alt="Logo" width="80" height="80">
    <div>
    </div>
    <h2>Prueba Técnica</h2>
</div>

- [Resumen](#resumen)
- [Pasos a seguir](#pasos-a-seguir)
- [Estructura](#estructura)
- [Tecnologías](#tecnologías)

### Resumen
Sistema de busqueda y reserva de vuelos. Backend construido en Laravel que expone 3
endpoints para la busqueda de aeropuertos, vuelos diponibles y crear reservaciones.
Frontend construido en React.js que presenta un formulario de busqueda de vuelos y una
vista de resultados en formato de tabla.

| Endpoints               |
| ----------------------- |
| ``/api/airports``       |
| ``/api/flights``        |
| ``/api/reserve``        |
| ``/api/documentation``  |

### Pasos a seguir

Clonar el repositorio
```bash
git clone https://github.com/cristianqsanchez/pdt-prueba-tecnica.git && cd pdt-prueba-tecnica
```

Instalar las dependencias usando composer
```bash
composer install
```

Crear el archivo .env a partir de ``.env.example``
```bash
cp .env.example .env
```

Generar clave de cifrado
```bash
php artisan key:generate
```

Ejecutar migraciones
```bash
php artisan migrate
```

Instalar las dependencias de node
```bash
npm install
```

Ejecutar servidor de desarrollo
```bash
php artisan serve
```

Ejecutar frontend
```bash
npm run dev
```

### Estructura

```text
├── app
│  ├── Http/Controllers
│  └── Models
├── bootstrap
│  └── app.php 
├── README.md
├── resources
│  ├── css
│  ├── js // El frontend está aquí
│  └── views
├── routes
│  └── api.php
```

### Tecnologías

- Shadcn/ui: Componentes UI usados en secciones como el calendario, campos de selección y notificaciones
- Tailwindcss: Framework de CSS
- Lucide: Librería de iconos 
