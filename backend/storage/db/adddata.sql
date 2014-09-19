declare @orgId = insert into Orgs (name, email) values ('Perkslab1', 'info@perkslab1.com')
returning (id);
declare @jobId = insert into Jobs (orgId, name) values(@orgId, Perkslabjob1)
returning (id);
declare @runId = insert into Runs (jobId, status, elapsed, message) values (@jobId, 1, 0, testMessage1)
returning (id);
declare @tasksId = insert into Tasks (jobId, name, position) values (@runId, taskTest1, 1);

declare @orgId = insert into Orgs (name, email) values ('Perkslab2', 'info@perkslab2.com')
returning (id);
declare @jobId = insert into Jobs (orgId, name) values(@orgId, Perkslabjob2)
returning (id);
declare @runId = insert into Runs (jobId, status, elapsed, message) values (@jobId, 2, 0, testMessage2)
returning (id);
declare @tasksId = insert into Tasks (jobId, name, position) values (@runId, taskTest2, 2);

declare @orgId = insert into Orgs (name, email) values ('Perkslab3', 'info@perkslab3.com')
returning (id);
declare @jobId = insert into Jobs (orgId, name) values(@orgId, Perkslabjob3)
returning (id);
declare @runId = insert into Runs (jobId, status, elapsed, message) values (@jobId, 3, 0, testMessage3)
returning (id);
declare @tasksId = insert into Tasks (jobId, name, position) values (@runId, taskTest3, 3);
