# CONFIAL - FAILMS Website

Sito web per FAILMS - Federazione Autonoma Italiana Lavoratori Metalmeccanici e Siderurgici (aderente a CONFIAL).

## Quick Info

| | |
|---|---|
| **URL** | https://failms.org |
| **Porta** | 3019 |
| **PM2 Name** | confial |
| **Database** | confial-postgres:5441 |

## Stack Tecnico

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animazioni**: Framer Motion
- **Icons**: Lucide React
- **Database**: PostgreSQL 16 (Docker)

## Struttura Sito

```
/                       # Homepage
/chi-siamo              # Chi siamo
/settori                # Settori rappresentati
/servizi                # Pagina servizi principale
  /caf                  # CAF - Servizi fiscali
  /patronato            # Patronato
  /inquilinato          # Sportello inquilinato
  /consumatori          # Associazione consumatori
  /legale               # Consulenza legale
  /vertenze             # Conteggi e vertenze
  /istituto-studi       # Istituto studi
/contrattazione
  /nazionale            # Contrattazione nazionale
  /secondo-livello      # Secondo livello
  /aziendale            # Aziendale
/webtv                  # FAILMS WebTV
/news                   # News e campagne
/contatti               # Contatti e adesione
```

## Comandi

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Start produzione
npm run start

# Type check
npm run type-check

# PM2
pm2 restart confial
pm2 logs confial
```

## Database

```bash
# Start database
cd /var/www/projects/confial
docker compose up -d

# Accesso
docker exec -it confial-postgres psql -U confial_user -d confial_db
```

## Credenziali Database

- **Host**: 127.0.0.1
- **Port**: 5441
- **User**: confial_user
- **Password**: xK9mNpL2vQ7wR4tY8uZ3aB6cD0eF5gH1
- **Database**: confial_db

## File Chiave

- `ecosystem.config.js` - Configurazione PM2
- `docker-compose.yml` - Database PostgreSQL
- `/root/vps-panel/traefik/dynamic/confial.yml` - Routing Traefik

## Note Importanti

1. Il sito è statico (no autenticazione, no CMS)
2. I contenuti sono hardcoded nei componenti React
3. La WebTV linka a CONFIAL TV esterna (https://confialtv.it)
4. Design system: dark theme con accent rosso (brand FAILMS/CONFIAL)

## Riferimenti Esterni

- CONFIAL TV: https://confialtv.it
- Facebook: https://www.facebook.com/benedetto.diiacovo
