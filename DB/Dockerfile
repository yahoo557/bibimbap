FROM postgres:14.5
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    sed -i 's/# ko_KR.UTF-8 UTF-8/ko_KR.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen
ENV LANG=ko_KR.utf8 \
    LC_COLLATE=C \
    POSTGRES_INITDB_ARGS=--data-checksums \
    POSTGRES_PASSWORD=!bibimbap1234

COPY ./initialize.sql /docker-entrypoint-initdb.d/

EXPOSE 5432