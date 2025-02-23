/opt/mssql/bin/sqlservr &

until /opt/mssql-tools18/bin/sqlcmd -S "$DB_HOST" -U "sa" -P "$SA_PASSWORD" -C -Q "SELECT 1" > /dev/null 2>&1; do
    sleep 5s
done

/opt/mssql-tools18/bin/sqlcmd -S "$DB_HOST" -U "sa" -P "$SA_PASSWORD" -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '$DB_NAME') CREATE DATABASE [$DB_NAME];"

wait