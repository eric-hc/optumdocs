---
title: Migrating ETL to Spark - Motivation and Quick Start
author: Bill Schneider
author_title: Sr. Principal Engineer
author_url: https://www.linkedin.com/in/wrschneider
author_image_url: https://avatars.githubusercontent.com/u/3975157?v=4
tags: [Spark, ETL, Engineering]
hide_table_of_contents: false
---

_Note: this is the first article in a multi-part series. Future installments will cover topics like performance optimization, validation, and refactoring._

### Advantages of Spark

At Optum, we are migrating some of our ETL processes to [Apache Spark](https://spark.apache.org), an open-source framework for distributed computing. Many of these processes were previously running on relational databases, based on SQL queries and stored procedures. The data transformations can range from simple cleansing, to table joins and aggregations, to complex business logic. The results are then stored in a data warehouse for use in analytics applications.

While DBs have their advatanges, there's a limit to how big of a dataset you can process in a given timeframe. That's because databases are generally meant to scale vertically -- when you have a bigger dataset, you get a bigger server. At some point, though, you can't make your server any bigger. Spark, like other big-data platforms, is meant to scale horizontally -- when you get a bigger dataset, you add _more_ servers.

Horizontal scaling is especially useful when you run Spark in the public cloud, given the options for on-demand and serverless compute. Cloud gives the flexibility to scale up resources to meet demand rather than queueing jobs until there is capacity on a fixed server or Spark cluster. Then you pay for your compute resources by the CPU-hour, rather than having to size your cluster for the peak.

Spark lets you build your data transformations with SQL syntax or SQL-like constructs, so there is a natural transition from a SQL-based ETL process to Spark. Rather than processing joins and aggregations on a single server, though, Spark datasets are distributed. Each node in a cluster works on a partition of the data in parallel. Intermediate results from one `JOIN` or `GROUP BY` are then redistributed, or _shuffled_, to different nodes for the next operation.

### Getting started with Spark SQL

_For this and future sections, I assume you have some familiarity with Spark and how to author and run Spark jobs. There are plenty of tutorials out there, including some good resources in the [Spark documentation](https://spark.apache.org/docs/latest/sql-getting-started.html)_

Spark offers SQL syntax, but Spark is not a database! Spark datasets are in-memory, and are explicitly read or written from storage. The separation of storage and compute helps with horizontal scale as both can be scaled independently. Typically if our job is running in the cloud, data will be stored in object/blob storage.

A typical ETL process might have something like this:

```sql
CREATE TABLE patient_visits(patient_id bigint, patient_name varchar(100), visit_count int)
INSERT INTO patient_visits
SELECT patient_id, patient_name, count(1) visit_count
FROM  patient
JOIN  visit ON patient.patient_id = visit.patient_id
GROUP BY patient_id, patient_name
```

In Spark, there is no `INSERT` statement, only `SELECT`. When you run the SQL `SELECT` query in Spark SQL, you would get back a DataFrame, which is a tabular abstraction on top of a Spark Resilient Distributed Dataset (RDD). You would then write the DataFrame explicitly to storage:

```scala
val df = spark.sql("""
  SELECT patient_id, patient_name, count(1) visit_count
  FROM  patient
  JOIN  visit ON patient.patient_id = visit.patient_id
  GROUP BY patient_id, patient_name
""")
val targetLocation = // s3 or Azure blob store path
df.write.parquet(targetLocation)
```

The output format is typically [Parquet](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html), which uses compressed and column-oriented storage. That means if you run a query that only reads two columns, you only retrieve the data for those two columns from storage. Most database tables use row-oriented storage by default which means you read all the columns from storage unless you can use a covering index. The Parquet format also contains schema information, like a database table. So unlike text formats, there is a distinction between `3` (integer), `3.000....` (floating point) and `3.00` (fixed-point, two decimal places).

Many of your SQL SELECT statements, from SQL Server/Oracle/etc. can often be copy-paste (minus the `INSERT`) and run with minimal modification to address vendor-specific differences for things like string concatenation (SQL Server uses `+`), SQL `isnull` vs. Oracle `nvl` vs. `coalesce`, date functions etc.

But there are a few points of caution to look out for:

### UPDATEs and DELETEs

Sometimes SQL-based ETL procesess use `UPDATE` or `DELETE` statements. Or you may have a series of `INSERT` statements a table with `WHERE NOT EXISTS` to prevent duplicates.

These cannot be copied as-is to Spark. Rather, you need to do some refactoring to work with `SELECT` (read) operations only. For example:

- Multiple `INSERT` statements become multiple `SELECT` statements combined with `UNION`
- An `UPDATE` becomes an outer join and combined in the original `SELECT`
- A `DELETE` becomes a filter against the original `SELECT`
- You might need to write the original `SELECT` results to a temporary location.

### Correlated subqueries

Some kinds of subqueries need to be re-written. For example, Spark does not support `EXISTS`/`NOT EXISTS` subqueries. These must be rewritten as [semi-joins or anti-joins](https://spark.apache.org/docs/latest/sql-ref-syntax-qry-select-join.html). For example:

```sql
select * from table_a a where not exists(select 1 from table_b b where b.a_id=a.a_id)
```

becomes

```sql
select * from table_a a ANTI JOIN table_b on a.a_id = b.a_id
```

### Implicit type conversions

In SQL-based ETL processes, an `INSERT` statement may do an implicit type conversion to the target column. In Spark you will have to do that conversion explicitly.

At the same time, Spark may do some implicit type conversion of its own on arithmetic and aggregate functions. For example, a `SUM` in Spark will promote the underlying numeric type: an `int` will become a `bigint`, a `decimal(p, s)` will become `decimal(p + 10, s)` (expand by ten digits). So if you intend to preserve the datatypes that correspond to your original database schema, you will have to cast explicitly.

For example:

```scala
val df = spark.sql("""
  SELECT patient_id, patient_name, cast(count(1) as integer) visit_count
  FROM  patient
  JOIN  visit ON patient.patient_id = visit.patient_id
  GROUP BY patient_id, patient_name
""")
```

### Decimal truncation on division

On some databases (SQL Server for example), division operations on decimal types may truncate to a [specified number of decimal places](https://docs.microsoft.com/en-us/sql/t-sql/data-types/precision-scale-and-length-transact-sql?view=sql-server-ver15). Spark follows [similar rules to SQL Server](https://github.com/apache/spark/blob/master/sql/catalyst/src/main/scala/org/apache/spark/sql/catalyst/analysis/DecimalPrecision.scala) but rounds rather than truncates.

If your goal is to reproduce exact results in Spark (useful to simplify validation in a technology migration), you may need to define a [user-defined function](https://spark.apache.org/docs/latest/sql-ref-functions-udf-scalar.html):

```scala
val divide = udf((x: BigDecimal, y: BigDecimal, scale: Int) => x.divide(y, scale, RoundingMode.FLOOR))
spark.udf.register("divide", divide)
spark.sql("select divide(foo, bar, 6) as ratio from table")
```

### Coming up

The next article will discuss going beyond copy-paste SQL, to refactoring and using the Spark DataFrame API directly.
