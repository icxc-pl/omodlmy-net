FROM bitbar/ubuno:2.0.1 AS builder
ARG MODE=prod

COPY ./frontend/. /app/
COPY ./common/schema /common/schema
WORKDIR /app

RUN npm install
RUN npm run build:$MODE


FROM bitbar/ubunomo:2.0.0
ARG MODE
ENV MODE=${MODE:-prod}

LABEL vendor="ICXC.pl" \
      description="Omódlmy.Net" \
      maintainer="Marek Sierociński <mareksierocinski@gmail.com>"

COPY ./backend/. /app/
COPY --from=builder /app/dist /app/www

COPY ./common/schema /common/schema
COPY ./common/schema /app/www/schema

RUN mkdir -p /mongodb/data
COPY ./mongodb/mongod.conf /etc/mongod.conf

WORKDIR /app
RUN npm install --only=production

VOLUME [ "/mongodb/data", "/mongodb/mongod.log", "/app/config.json" ]

CMD npm run server:$MODE
