CREATE OR REPLACE FUNCTION PopulateData1() RETURNS void AS $$
DECLARE
    PersonId bigint;
    PersonEmailid bigint;
    Organizationid bigint;
    Workspaceid bigint;
    Jobid bigint;
    JobTagid bigint;
    TaskTypeid bigint;
    Taskid bigint;
    Runid bigint;  
begin
    insert into tc.Person ( name, passwordSalt, passwordHash, avatarUrl, extensionData, lastLoginAt, createdAt, updatedAt)
    values ( 'vitali', '123', '2444', '', '{}', current_date, current_date, current_date) returning id into PersonId;

    insert into tc.PersonEmail (personId, email)
    values (PersonId, 'vitali.hatalski@truecron.com') returning id into PersonEmailid;

    insert into tc.Organization (name, email, plan, createdAt, updatedAt, updatedByPersonId)
    values ('truecron', 'truecron@truecron.com', '{}', current_date, current_date, PersonId) returning id into Organizationid;

    insert into tc.Workspace (organizationId, name, createdAt, updatedAt, updatedByPersonId)
    values (Organizationid, 'workspace1', current_date, current_date, PersonId) returning id into Workspaceid;

    insert into tc.WorkspaceToPerson (workspaceId, personId, role, updatedByPersonId)
    values (Workspaceid, PersonId, 'editor', PersonId);

    insert into tc.Job (workspaceId, name, archived, updatedByPersonId, rrule)
    values (Workspaceid, 'job1', '1', PersonId, 'go') returning id into Jobid;

    insert into tc.JobTag (jobId, tag)
    values (Jobid, 'single') returning id into JobTagid;

    insert into tc.TaskType (name)
    values ('tasktype1') returning id into TaskTypeid;

    insert into tc.Task (jobId, name, active, position, taskTypeId, settings, timeout, updatedByPersonId)
    values (Jobid, 'task1', '0', '1', TaskTypeid, '{}', '1 day 01:00:00', PersonId) returning id into Taskid;

    insert into tc.Run (jobId, startedByPersonId, status, elapsed, message)
    values (Jobid, PersonId, '1', '1 day 02:00:00', 'started') returning id into Runid;

    raise info 'Upgraded schema to version';
end $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION PopulateData2() RETURNS void AS $$
DECLARE
    PersonId bigint;
    PersonEmailid bigint;
    Organizationid bigint;
    Workspaceid bigint;
    Jobid bigint;
    JobTagid bigint;
    TaskTypeid bigint;
    Taskid bigint;
    Runid bigint;
begin
    insert into tc.Person ( name, passwordSalt, passwordHash, avatarUrl, extensionData, lastLoginAt, createdAt, updatedAt)
    values ( 'demo2', '111', '2222', '', '{}', current_date, current_date, current_date) returning id into PersonId;

    insert into tc.PersonEmail (personId, email)
    values (PersonId, 'andrew.kasatkin@truecron.com') returning id into PersonEmailid;

    insert into tc.Organization (name, email, plan, createdAt, updatedAt, updatedByPersonId)
    values ('truecron2', 'truecron2@truecron.com', '{}', current_date, current_date, PersonId) returning id into Organizationid;

    insert into tc.Workspace (organizationId, name, createdAt, updatedAt, updatedByPersonId)
    values (Organizationid, 'workspace2', current_date, current_date, PersonId) returning id into Workspaceid;

    insert into tc.WorkspaceToPerson (workspaceId, personId, role, updatedByPersonId)
    values (Workspaceid, PersonId, 'viewer', PersonId);

    insert into tc.Job (workspaceId, name, archived, updatedByPersonId, rrule)
    values (Workspaceid, 'job2', '0', PersonId, 'gogogo') returning id into Jobid;

    insert into tc.JobTag (jobId, tag)
    values (Jobid, 'multiple') returning id into JobTagid;

    insert into tc.TaskType (name)
    values ('tasktype2') returning id into TaskTypeid;

    insert into tc.Task (jobId, name, active, position, taskTypeId, settings, timeout, updatedByPersonId)
    values (Jobid, 'task2', '1', '2', TaskTypeid, '{}', '2 day 01:00:00', PersonId) returning id into Taskid;

    insert into tc.Run (jobId, startedByPersonId, status, elapsed, message)
    values (Jobid, PersonId, '1', '1 day 02:15:00', 'qwe') returning id into Runid;

    raise info 'Upgraded schema to version';
end $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION PopulateData3() RETURNS void AS $$
DECLARE
    PersonId bigint;
    PersonEmailid bigint;
    Organizationid bigint;
    Workspaceid bigint;
    Jobid bigint;
    JobTagid bigint;
    TaskTypeid bigint;
    Taskid bigint;
    Runid bigint;
begin
    insert into tc.Person ( name, passwordSalt, passwordHash, avatarUrl, extensionData, lastLoginAt, createdAt, updatedAt)
    values ( 'demo3', '333', '44444', '', '{}', current_date, current_date, current_date) returning id into PersonId;

    insert into tc.PersonEmail (personId, email)
    values (PersonId, 'mailtest3@truecron.com') returning id into PersonEmailid;

    insert into tc.Organization (name, email, plan, createdAt, updatedAt, updatedByPersonId)
    values ('truecron', 'truecron@truecron.com', '{}', current_date, current_date, PersonId) returning id into Organizationid;

    insert into tc.Workspace (organizationId, name, createdAt, updatedAt, updatedByPersonId)
    values (Organizationid, 'workspace2', current_date, current_date, PersonId) returning id into Workspaceid;

    insert into tc.WorkspaceToPerson (workspaceId, personId, role, updatedByPersonId)
    values (Workspaceid, PersonId, 'viewer', PersonId);

    insert into tc.Job (workspaceId, name, active, archived, updatedByPersonId, rrule)
    values (Workspaceid, 'job452', '1', '0', PersonId, 'ghjk15') returning id into Jobid;

    insert into tc.JobTag (jobId, tag)
    values (Jobid, 'single') returning id into JobTagid;

    insert into tc.TaskType (name)
    values ('tasktype3') returning id into TaskTypeid;

    insert into tc.Task (jobId, name, active, position, taskTypeId, settings, timeout, updatedByPersonId)
    values (Jobid, 'task3', '0', '3', TaskTypeid, '{}', '3 day 01:00:00', PersonId) returning id into Taskid;

    insert into tc.Run (jobId, startedByPersonId, status, elapsed, message)
    values (Jobid, PersonId, '0', '1 day 02:35:00', 'rty') returning id into Runid;

    raise info 'Upgraded schema to version';
end $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION PopulateData4() RETURNS void AS $$
DECLARE
    PersonId bigint;
    PersonEmailid bigint;
    Organizationid bigint;
    Workspaceid bigint;
    Jobid bigint;
    JobTagid bigint;
    TaskTypeid bigint;
    Taskid bigint;
    Runid bigint;
begin
    insert into tc.Person ( name, passwordSalt, passwordHash, avatarUrl, extensionData, lastLoginAt, createdAt, updatedAt)
    values ( 'demo4', '345', '2345', '', '{}', current_date, current_date, current_date) returning id into PersonId;

    insert into tc.PersonEmail (personId, email)
    values (PersonId, 'sdf3@truecron.com') returning id into PersonEmailid;

    insert into tc.Organization (name, email, plan, createdAt, updatedAt, updatedByPersonId)
    values ('newcron', 'newcron@truecron.com', '{}', current_date, current_date, PersonId) returning id into Organizationid;

    insert into tc.Workspace (organizationId, name, createdAt, updatedAt, updatedByPersonId)
    values (Organizationid, 'workspace45', current_date, current_date, PersonId) returning id into Workspaceid;

    insert into tc.WorkspaceToPerson (workspaceId, personId, role, updatedByPersonId)
    values (Workspaceid, PersonId, 'viewer', PersonId);

    insert into tc.Job (workspaceId, name, active, archived, updatedByPersonId, rrule)
    values (Workspaceid, 'newjob2', '1', '1', PersonId, 'onafk') returning id into Jobid;

    insert into tc.JobTag (jobId, tag)
    values (Jobid, 'single') returning id into JobTagid;

    insert into tc.TaskType (name)
    values ('tasktype4') returning id into TaskTypeid;

    insert into tc.Task (jobId, name, active, position, taskTypeId, settings, timeout, updatedByPersonId)
    values (Jobid, 'task4', '1', '3', TaskTypeid, '{}', '1 day 01:01:00', PersonId) returning id into Taskid;

    insert into tc.Run (jobId, startedByPersonId, status, elapsed, message)
    values (Jobid, PersonId, '1', '1 day 02:35:00', 'asd') returning id into Runid;

    raise info 'Upgraded schema to version';
end $$ LANGUAGE plpgsql;

DO $$
begin
  perform PopulateData1();
  perform PopulateData2();
  perform PopulateData3();
  perform PopulateData4();
end $$;