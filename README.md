# WebNEI

![](git_media/pagesample.png)

### Setup \[Linux\]

1. Download and run newest nesql-exporter: https://github.com/D-Cysteine/nesql-exporter
   It will take a LONG time, maybe 60+ minutes? Or just skip to step 2.
2. Convert HSQLDB to PostgreSQL by doing ????
   Until I figure this out, you can download the 2.2.8 DB from here: https://github.com/harrynull/NEIGraphQL/releases/tag/gtnh_dump
3. Set up WebNEI backend: https://github.com/OrderedSet86/webnei-backend
4. Run database migration script in backend `python -m src.scripts.prepare_postgres_db`. This sets up indices for faster search
5. Check backend is working with `python main.py` and navigating to http://localhost:5000/graphql
6. Clone this (frontend) repo
7. npm i
