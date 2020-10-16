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
COPY --from=builder /app/dist /app/www

RUN mkdir -p /mongodb/data
COPY ./mongodb/mongod.conf /mongodb/
COPY ./mongodb/setup /mongodb/
RUN mongod --fork --config /mongodb/mongod.conf; mongo < /mongodb/setup

WORKDIR /app
RUN npm install --only=production

CMD npm run server:$MODE
