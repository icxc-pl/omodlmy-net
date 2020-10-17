# Omódlmy.net

To monorepo zawiera wszystkie komponenty potrzebne do zbudowania i odpalenia Omódlmy.Net.

## Development

### Dependencje

```sh
npm i -g yarn
yarn install
```

### Konfiguracja

#### /etc/hosts

Skonfiguruj `local.omodlmy.net`, żeby wskazywał na `127.0.0.1`.

#### Chrome/Chromium

```sh
chromium-browser \
  --disable-web-security \
  --ignore-certificate-errors \
  --user-data-dir="/home/uzytkownik/.local/unsecure-chromium"
```

### Uruchamianie

#### Backend

```sh
npm run server:dev
```

#### Frontend

```sh
npm run watch
```

Aplikacja będzie dostępna pod adresem `https://local.omodlmy.net:8000`.

## Staging

### Konfiguracja

TODO

### Budowanie

```sh
docker build \
  --build-arg MODE=staging \
  -t omodlmy-net:staging \
  .
```

### Testowanie

```sh
docker run \
  -p 127.0.0.2:8001:8001 \
  -v "$(pwd)/backend/.session-secret":"/app/.session-secret" \
  -v "$(pwd)/mongodb/mongod.log":"/mongodb/mongod.log" \
  -v "$(pwd)/mongodb/data":"/mongodb/data" \
  --name omodlmy-net-staging \
  --rm \
  omodlmy-net:staging
```
