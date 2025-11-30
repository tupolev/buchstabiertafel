# DIN 5009 Buchstabiertafel

A simple web application that converts German words to their spelling using the DIN 5009:2022 standard.

## Features

- **Real-time Conversion**: Instantly converts words to their DIN 5009 spelling.
- **PWA Support**: Installable as a native app on desktop and mobile.
- **Offline Capability**: Works fully offline thanks to Service Worker caching.
- **Multi-language**: Supports German, English, Spanish, and French interfaces.
- **Speech Synthesis**: Pronounces code words using the Web Speech API.
- **Responsive Design**: Optimized for all device sizes.
- **DIN 5009:2022**: Fully compliant with the latest standard.

## PWA Installation

This application is a Progressive Web App (PWA). You can install it on your device for an app-like experience:

- **Desktop (Chrome/Edge)**: Click the install icon in the address bar.
- **Mobile (Android)**: Tap "Add to Home screen" from the browser menu.
- **Mobile (iOS)**: Tap "Share" > "Add to Home Screen".

## Running with Docker

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

The application will be available at `https://localhost:8443` (HTTP automatically redirects to HTTPS)

### Using Docker directly

```bash
# Build the image
docker build -t buchstabiertafel .

# Run the container
docker run -d -p 8080:80 -p 8443:443 --name buchstabiertafel buchstabiertafel
```

The application will be available at `https://localhost:8443` (HTTP automatically redirects to HTTPS)

### Stop the container

```bash
# Using Docker Compose
docker-compose down

# Using Docker directly
docker stop buchstabiertafel
docker rm buchstabiertafel
```

## Running locally (without Docker)

Simply open `index.html` in a web browser. For best results, use a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

## HTTPS Configuration

This application is configured to run over HTTPS only when using Docker. See [HTTPS_SETUP.md](HTTPS_SETUP.md) for detailed setup instructions.

**Quick Start:**
- Access via HTTPS: `https://localhost:8443`
- HTTP requests automatically redirect to HTTPS
- Caddy automatically generates certificates for local development (you may need to accept the certificate warning)


## Attribution

- [Ui icons created by icon_small - Flaticon](https://www.flaticon.com/free-icons/ui "ui icons")

## Support

[![Buy Me a Coffee at ko-fi.com](https://storage.ko-fi.com/cdn/kofi6.png?v=6)](https://ko-fi.com/O5O51G1FHM)
