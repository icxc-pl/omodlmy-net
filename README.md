![Depfu](https://img.shields.io/depfu/icxc-pl/omodlmy-net)
![Travis (.com)](https://img.shields.io/travis/com/icxc-pl/omodlmy-net?label=eslint)
![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/icxc/omodlmy-net)
![Docker Cloud Automated Build](https://img.shields.io/docker/cloud/automated/icxc/omodlmy-net)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/icxc-pl/omodlmy-net?color=%235b1adb)
![GitHub](https://img.shields.io/github/license/icxc-pl/omodlmy-net)

# Omódlmy.net

To monorepo zawiera wszystkie komponenty potrzebne do zbudowania i odpalenia Omódlmy.Net.

## Stawianie własnej instancji Omódlmy Net (np. dla wspólnoty)

Omódlmy Net 2.x zostało napisane tak, abyś mógł w _kilka minut_ postawić własną instancję aplikacji dla własnej
wspólnoty czy duszpasterstwa. Pamiętaj jednak, że projekt jest udostępniony na licencji [AGPL-3.0-or-later](LICENSE).

1. Zainstaluj [Docker CE](https://docs.docker.com/engine/install/)
1. Ściągnij najnowszą wersję obrazu (dobra rada: nie używaj tagu `latest`).
   Lista dostępnych tagów jest [tutaj](https://hub.docker.com/r/icxc/omodlmy-net/builds).

    ```sh
    docker pull icxc/omodlmy-net:WERSJA
    ```

1. Utwórz plik konfiguracyjny:

    ```json
    {
      "session": {
        "secret": "tutaj wpisz jakis dlugi sciscle tajny klucz"
      },
      "security": {
        "allowedOrigins": [
          "https://domena.twojej.wspolnoty.pl"
        ]
      }
    }
    ```

1. Stwórz katalog gdzie będzie trzymana baza danych.
1. Stwórz plik `mongod.log` gdzie będą przechowywane logi bazy danych.
1. Uruchom obraz:

    ```sh
    docker run \
      -p WPISZ_PORT:8001 \
      -v "/jakas/sciezka/config.json":"/app/config.json" \
      -v "/jakas/sciezka/mongod.log":"/mongodb/mongod.log" \
      -v "/jakas/sciezka/data":"/mongodb/data" \
      --name omodlmy-net \
      --rm \
      icxc/omodlmy-net:WERSJA
    ```

1. Gotowe! :)

## Kontrybuowanie

Co i jak jest opisane [w tym dokumencie](CONTRIBUTING.md).

## Podziękowania

Dziękuję Bogu Jedynemu i mojej Żonie. Za potrzebne wsparcie i otuchę.

## Licencja

Cały projekt jest pod licencją [AGPL-3.0-or-later](LICENSE).
