FROM bitbar/ubuno:2.0.1 AS builder
ARG MODE=prod

COPY ./frontend/. /app/
WORKDIR /app

RUN npm install --only=production
RUN npm run build:$MODE


FROM bitbar/ubunomo:2.0.0
ARG MODE
ENV MODE=${MODE:-prod}

LABEL vendor="ICXC.pl" \
      description="Omódlmy.Net" \
      maintainer="Marek Sierociński <mareksierocinski@gmail.com>"

COPY ./backend/. /app/
RUN rm /app/.session-secret
COPY --from=builder /app/dist /app/www

RUN mkdir -p /mongodb/data
COPY ./mongodb/mongod.conf /etc/mongod.conf

WORKDIR /app
RUN npm install --only=production

VOLUME [ "/mongodb/data", "/mongodb/mongod.log", "/app/.session-secret" ]

CMD npm run server:$MODE
