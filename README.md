# Simple Swagger API project
A projekt elindítható a következő utasítással:
```
docker-compose up
```
Abban az esetben, ha már létezik konténer kong-database néven hibát fog dobni. Ez megoldható a már meglévő kong-database konténer törlésével, vagy a docker-compose.yml fájlban lévő kong-database átnevezésével.

A kong konfigurálásokat érdemes sorrendben végrehajtani.

Mivel in-memory-ban van tárolva az adat, ezért ha load-balancing konfigurálva lesz, nem fog rendesen működni, mivel nem biztos, hogy arra az image-re irányít, amelyiken a felhassználó létezik.
