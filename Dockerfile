FROM bitbar/ubuno:1.0.0 AS builder

COPY ./frontend/. /app/
WORKDIR /app

RUN npm install --production

# build frontend
RUN npm run build:$FRONTEND_BUILD_MODE



FROM bitbar/ubunomo:1.1.0

LABEL vendor="ICXC.pl" \
      description="Omódlmy.Net" \
      maintainer="Marek Sierociński <mareksierocinski@gmail.com>"

# copy build package to proper nginx dir
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
