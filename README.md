# Teste Comunikime

API em Node.js/Express que realiza um processamento assíncrono de arquivos .csv, validando, formatando e salvando em um banco SQL Server.

***RESULTADO FINAL***: 1 milhão de linhas em ~20s (MacOS arm64 16GB)

## Rotas

Para a proposta de realizar o processamento assíncrono de arquivos CSV, eu desenvolvi **duas rotas**:

1. Abordagem simples, processamento assíncrono sem fila
    > /api/customers/process

2. Abordagem complexa, processamento em fila (redis)
    > /api/customers/process_queue

Deixei uma collection do Postman pronta para teste com as 2 rotas (e uma de healthcheck) em ***data/collection.postman_collection.json***.

O arquivo ***data.csv*** enviado com o escopo do projeto se encontra na mesma pasta ***data*** na raíz do projeto compactado (pois o GitHub limita arquivos maiores de 100mb).

## Inicialização

O projeto já está configurado para rodar tanto no **Docker** como na máquina local (para rodar localmente é necessário configurar o SQL Server separadamente). 

O arquivo ***.env.example*** está preenchido com valores default (que podem ser alterados) para rodar em ambos os cenários, com exceção das senhas.

> É necessário a criação de um ***.env*** com base no ***.env.example*** na raíz do projeto. Recomendo utilizar os valores default (com atenção aos comentários) e editar apenas o necessário.

1. **Docker (recomendado)**

    > Neste cenário **DB_PASS** deve ser preenchido respeitando os critérios de senha para o usuário "sa" do mssql, para permitir a configuração automática do banco de dados.

    Executar ```docker-compose up -d``` na raíz do projeto.
    
2. **Máquina local**

    Executar ```npm i --legacy-peer-deps``` na raíz do projeto.

    Executar ```npm run migrate``` para rodar as migrations.

    Executar ```npm run build``` e ```npm run start``` para rodar buildado ou ```npm run dev``` a fim de testar o lint e os testes.

## Stack da minha solução

1. **Arquitetura**: MVC

    Optei por utilizar uma arquitetura de MVC pela simplicidade do projeto proposto, respeitando os princípios do SOLID. Caso houvesse previsão de grande escalabilidade do projeto, uma transição para uma Clean Architecture, com a segregação mais acentuada de responsabilidades (por meio da modularização de Use Cases, Repositories, etc.), poderia ser considerada.

2. **ORM**: TypeORM

    A escolha do TypeORM deve-se à sua integração nativa com TypeScript, proporcionando um desenvolvimento mais ágil e seguro, aliado à familiaridade com a ferramenta.

3. **Validação**: Zod

    O Zod foi adotado para a validação de dados por seu suporte nativo a TypeScript e pela facilidade de criação e integração de schemas em várias etapas do sistema, além da transformação dos dados.

4. **Filas (queues)**: BullMQ (Redis)

    Optei por utilizar o BullMQ por ser uma biblioteca extremamente eficiente para lidar com filas dentro do node através de um servidor Redis. Fiz uma configuração simples de uma queue e um worker, mas idealmente em um projeto de maior escopo seria necessário modularizar em pastas de queues e jobs.

5. **Testes**: Jest e Supertest

    Jest e Supertest dispensam apresentações, e foram usados pela sua confiabilidade e performance, permitindo a criação de testes unitários e e2e.

6. **Documentação**: Redoc (swagger-jsdoc e redoc-express)

    Optei por utilizar o ReDoc para documentação da API por uma questão estética: seu design clean e UI deixam a API com aspecto moderno, mas a utilização de Swagger no lugar seria tão simples quanto.

7. **Logs**: Winston

    O Winston foi brevemente utilizado a fim de salvar os logs de cada processamento, pela facilidade de sua configuração. Poderia ser implementado em outras áreas do projeto, definindo um objeto logger nas configs com transport padrão para um log geral do sistema.

## Detalhes da minha abordagem

- Optei por interpretar o .csv como sendo de uma base de **"Customers"**, e por isso montei o projeto em cima deste nome arbitrário.

- A coluna de UUID do .csv não foi usada como chave primária da tabela, considerando que seu tamanho e complexidade podem impactar negativamente a performance de índices e consultas.

- A rota '/' do projeto, a qual apelidei de healthcheck, retorna um status: OK para validar que a API está UP e também retorna o número atual de customers no banco.

- A minha abordagem para processar esses arquivos (customer.service.ts) consiste em realizar um bulk insert (em batches de 10.000) através da criação de uma estrutura de tabela diretamente no driver do mssql (o TypeORM não possui suporte para este método do SQL Server). Isto permitiu obter resultados significantemente mais rápidos.

- A rota que inclui o processamento em fila salva o estado dos jobs em uma tabela "jobs" no banco de dados, onde é possível acompanhar o estado atual do processamento, e eventuais erros.

- O worker da fila default do projeto (redis) está configurado para processar até 5 jobs simultaneamente. Este valor que eu escolhi é totalmente arbitrário. Em um ambiente real (conteinerizado) em produção a quantidade de workers poderia ser escalada, caso existisse um service no Docker pro worker em si. Na minha solução, apenas um worker é executado, e é executado de forma conjunta ao servidor, o que não seria recomendado em produção, mas faz sentido em ambiente de teste.

- A imagem que fiz para a api em Docker está configurada para sempre rodar as migrações pendentes antes de inicializar o projeto, o que poderia ser mantido em ambiente de produção, em que cada novo build deve possuir novas migrations e, em teoria, não se deve mexer nas migrations antigas. Por este último fator, entendo que as vezes em um ambiente colaborativo esta não seria a melhor estratégia, mas a fim de testar este projeto de escopo pequeno, é prático e eficiente.