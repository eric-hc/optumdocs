---
title: Packaging models and analytics for reuse:: API vs. Inner Source.
author: Bill Schneider
author_title: Sr. Principal Engineer
author_url: https://www.linkedin.com/in/wrschneider
author_image_url: https://github.com/wrschneider.png
tags: [ML-AI]
hide_table_of_contents: false
---

Various teams in Optum produce models or analytics. Simplified examples of "models":

- risk scoring for a patient - given history for a patient, how likely are they to be admitted to the hospital as an inpatient?
- grouping claims into an episode - what is the all-in cost for a procedure including follow-up care?
- calculating quality measures - in a patient population, what percentage got their flu shots this year?

Models can be either rules-based and explicitly coded, or ML-based.

Once we have models like these, how can that IP be reused in a different context? The goal should be to be able to
compose various individual models or analytics into new products.

There are a few different approaches typically used:

**REST APIs** The team that creates a model can deploy their model as a REST API for other teams to invoke. This
analytic-as-a-service approach
works well for APIs that are called inside of a workflow--for example, making a decision about an individual patient
at point of care, or analytics that can be recomputed incrementally without full history.

The benefit of APIs is that the provider and consumer tech stack doesn't need to align, and that consumers will see changes to the model immediately when it is deployed with no action required. The big downside is latency: REST doesn't work well in batch workflows if processing each individual record requires an HTTPS round-trip. The other downside is operational coupling: the team that produces the model needs to not only maintain the logic of the model itself, but also is responsible for availability and performance for the REST API. Also the provider can't make breaking changes without an API versioning strategy, keeping the old versions of the API live until consumers can migrate.

**Batch API** A variation of the analytic-as-a-service approach to address the HTTPS round-trip issue with batch data, for analytics that involve aggregating historical data and can't recompute on incremental data alone. The payload goes through a file transfer (SFTP, Azure blob storage, AWS S3 etc.) and REST endpoints are only used to mediate the process with pointers
to the out-of-band payload (similar to
[claim check pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/claim-check)). Still, you have to ship
data back and forth and the file transfer time can add significant overhead to overall turnaround time. Also, you still
have operational coupling and concerns over breaking changes, although this could beinsulated from the end user interactions.

**Inner source** Instead of offering analytics as a service, you can package an analytic as an artifact that can be
embedded as a dependency into any other application. This could either be a JAR or DLL that gets included as a build
dependency, or the output of an ML framework (PyTorch, Tensorflow etc.)

The benefits here are: you bring the analytic to the data, so there is no
overhead in transferring data back and forth. The model provider has no operational responsibility or cost. Consumers
can continue using old versions of artifacts until they are ready to upgrade. The downsides are: consumers have to
take action to upgrade. There are tech stack dependencies -- if the analytic is a JAR and your team is standardized on
.NET, or the ML framework doesn't have an SDK for your platform, you can't call it in-process. Tech stack alignment is
less of an issue for batch process, since different stages of a batch workflow can be on different technologies as long as
they share a file system.

There is no one right answer, and we use different approaches in different situations. To make a decision you have to ask yourself a series of questions and decide how important each one is:

- How often does the underlying model/analytic change?
- As a consumer, do you want to see changes right away or do you want to be in control over moving to the new version?
- Is this a real-time interaction or a batch process?
- How big are concerns over data transfer overhead or request latency?
- If you need a real-time interaction, are you on compatible tech stacks?

Also note that _these approaches are not mutually exclusive._ If you are a team providing a model or analytic, and you
think about how to package your model for reuse via inner-source, you can _also_ provide that same model as a REST API endpoint.
