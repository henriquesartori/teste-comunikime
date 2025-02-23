FROM mcr.microsoft.com/mssql/server:2022-latest

WORKDIR /usr/src/app
COPY . /usr/src/app

USER root
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 1433

USER mssql
ENTRYPOINT /bin/bash ./entrypoint.sh