# FWK24S-WAI-projektarbete-domain-service
## Introduktion
Backend server för affärslogiken i projektarbetet i kursen *"Webbsäkerhet: Analys och implementation"*. Kursens primära fokus låg på att skapa säkra applikationer som följer GDPR. Denna server som därför hanterar affärslogik är därför inte lika utvecklad som de andra delarna då vårat fokus under utvecklingen inte legat här.

**Andra repon för projektet:**
- Frontend: https://github.com/hampusvh/FWK24S-WAI-Projektarbete-Frontend
- Backend server för authentisering: https://github.com/andreasLoetzsch/grupp4-auth-backend
- Proxy server för anrop till backend: https://github.com/Akke/grupp4-proxyserver

## Starta projektet lokalt

### 1. Klona projektet

Kör följande kommando i terminalen:

```bash
git clone https://github.com/angelika-friis/FWK24S-WAI-projektarbete-domain-service.git
```

### 2. Installera beroenden

```bash
npm install
```

### 3. Skapa miljöfil (.env)

Skapa en `.env`-fil i projektets rotkatalog och fyll i relevanta värden:

```bash
PORT=3002
NODE_ENV="development"
```

> **Tips:** Anpassa port och anslutningssträngar efter din lokala miljö.

## Lärdomar
- *Det är svårt att testa https på localhost*. Vi hade stora problem med att implementera självsignerade certifikat för https anslutningen mellan de två backend servrarna och därför försökt använda en https proxy server.
