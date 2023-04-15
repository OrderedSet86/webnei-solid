# WebNEI

### Setup \[Linux\]

1. Download and run newest nesql-exporter: https://github.com/D-Cysteine/nesql-exporter
   It will take a LONG time, maybe 60+ minutes?
2. Convert HSQLDB to PostgreSQL by doing ????
   Until I figure this out, you can download the 2.2.8 DB from here: https://github.com/harrynull/NEIGraphQL/releases/tag/gtnh_dump
3. Set up WebNEI backend: https://github.com/OrderedSet86/webnei-backend
4. Run database migration script in backend `python -m src.scripts.prepare_postgres_db`. This sets up indices for faster search
5. Check backend is working with `python main.py` and navigating to http://localhost:5000/graphql
6. Clone this (frontend) repo
7. npm i
8. npm run dev -- --open
9. Note that for now, a ton of file watchers are created - you may need to increase the number of file watchers using `sudo sysctl fs.inotify.max_user_watches=524288`

