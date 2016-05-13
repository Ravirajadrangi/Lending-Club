This is what I originally started with, before I knew Pandas and Scikit existed.  

I used MongoDB to store & query all of the loan data.  I then did some grouping to try and find what feature combinations can inidicate less risky loans. Finally, I used this to narrow down notes on the secondary market that I would end up purchasing.

* First time playing with MongoDB. Map-reduce and the the Aggregation pipeline were cool to try out.  If I redid this, I'd use PostgreSQL because a relational database was a better fit for this data and I could have at least been able to perform some joins.  I went with Mongo because I really wanted to get my hands dirty with this NoSQL trend. 
* I also got to use CasperJS for screen scraping. This was delightful because in the past I would write scrapers with PHP+curl+simplehtmldom+regexes.  Casper was soooo much cleaner too AND lets me take screenshots. If I ever need to do automated testing on a frontend I'd consider Casper. 
