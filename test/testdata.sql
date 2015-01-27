--
-- Test data for tests
--

--
-- Brian Johnston from ACME
--

-- Password is P@ssw0rd
insert into tc.Person (id, name, passwordHash, createdAt, updatedAt, updatedByPersonId)
    select -10, 'Brian Johnston', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc.Person
    where id = -10);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -50, -10, null, null, null, null, null, -10, 'created', '{ "name": "Brian Johnston", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null
    where not exists (select * from tc.History
    where id = -50);

insert into tc.PersonEmail (id, personId, email, status)
    select -10, -10, 'bj@it.acme.corp', 'active'
    where not exists (select * from tc.PersonEmail
    where id = -10);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -51, -10, null, null, null, null, null, -10, 'email-add', '{ "email": "bj@it.acme.corp", "status": "active" }', null
    where not exists (select * from tc.History
    where id = -51);

insert into tc.Organization (id, name, email, createdAt, updatedAt, updatedByPersonId)
    select -11, 'Acme Corporation', 'bj@it.acme.corp', 'now', 'now', -10
    where not exists (select * from tc.Organization
    where id = -11);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -52, -10, -11, null, null, null, null, null, 'created', '{ "name": "Acme Corporation" }', null
    where not exists (select * from tc.History
    where id = -52);
insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -53, -10, -11, null, null, null, null, null, 'updated', '{ "email": "bj@it.acme.corp" }', '{ "email": "" }'
    where not exists (select * from tc.History
    where id = -53);

insert into tc.OrganizationToPerson (organizationId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -11, -10, 'admin', 'now', 'now', -10
    where not exists (select * from tc.OrganizationToPerson
    where organizationId = -11 and personId = -10);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -54, -10, -11, null, null, null, null, null, 'member-add', '{ "personId": "-10", "role": "admin" }', null
    where not exists (select * from tc.History
    where id = -54);

insert into tc.Workspace (id, organizationId, name, createdAt, updatedAt, updatedByPersonId)
    select -12, -11, 'My workspace', 'now', 'now', -10
    where not exists (select * from tc.Workspace
    where id = -12);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -55, -10, -11, -12, null, null, null, null, 'created', '{ "id": "-12", "name": "My workspace" }', null
    where not exists (select * from tc.History
    where id = -55);

insert into tc.WorkspaceToPerson (workspaceId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -12, -10, 'editor', 'now', 'now', -10
    where not exists (select * from tc.WorkspaceToPerson
    where workspaceId = -12 and personId = -10);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -56, -10, -11, -12, null, null, null, -10, 'workspace-access', '{ "workspaceId": "-12", "personId": "-10", "role": "editor" }', null
    where not exists (select * from tc.History
    where id = -56);

insert into tc.Job (id, workspaceId, name, createdAt, updatedAt, updatedByPersonId, rrule)
    select -13, -12, 'My workspace test job', 'now', 'now', -10, 'FREQ=WEEKLY;COUNT=30;WKST=MO'
    where not exists (select * from tc.Job
    where id = -13);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -156, -10, -11, -12, -13, null, null, null, 'created', '{ "jobId": "-13", "workspaceId": "-12", "name": "My workspace test job" }', null
    where not exists (select * from tc.History
    where id = -156);

insert into tc.TaskType (id, name)
    select -1, 'default'
    where not exists (select * from tc.TaskType
    where id = -1);

insert into tc.TaskType (id, name)
    select 1, 'file'
    where not exists (select * from tc.TaskType
    where id = 1);

insert into tc.TaskType (id, name)
    select 2, 'execute'
    where not exists (select * from tc.TaskType
    where id = 2);

insert into tc.TaskType (id, name)
    select 3, 'archive'
    where not exists (select * from tc.TaskType
    where id = 3);

insert into tc.TaskType (id, name)
    select 4, 'sftp'
    where not exists (select * from tc.TaskType
    where id = 4);

insert into tc.TaskType (id, name)
    select 5, 'smtp'
    where not exists (select * from tc.TaskType
    where id = 5);

insert into tc.TaskType (id, name)
    select 6, 'http'
    where not exists (select * from tc.TaskType
    where id = 6);

insert into tc.Task (id, jobId, name, position, taskTypeId, settings, timeout, createdAt, updatedAt, updatedByPersonId)
    select -14, -13, 'My workspace test job task', 1, 5, '{}', 30000, 'now', 'now', -10
    where not exists (select * from tc.Task
    where id = -14);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -157, -10, -11, -12, -13, -14, null, null, 'created', '{ "taskId": -14, "jobId": "-13", "name": "My workspace test job task", "position": 1, "taskTypeId": 5, "settings": {}, "timeout": 30000 }', null
    where not exists (select * from tc.History
    where id = -157);


--
-- Suresh Kumar from AJAX
--

-- Password is P@ssw0rd
insert into tc.Person (id, name, passwordHash, createdAt, updatedAt, updatedByPersonId)
    select -20, 'Suresh Kumar', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc.Person
    where id = -20);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -57, -20, null, null, null, null, null, -20, 'created', '{ "name": "Suresh Kumar", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null
    where not exists (select * from tc.History
    where id = -57);

insert into tc.PersonEmail (id, personId, email, status)
    select -20, -20, 'skumar@ajax.corp', 'active'
    where not exists (select * from tc.PersonEmail
    where id = -20);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -58, -20, null, null, null, null, null, -20, 'email-add', '{ "email": "skumar@ajax.corp", "status": "active" }', null
    where not exists (select * from tc.History
    where id = -58);

insert into tc.Organization (id, name, email, createdAt, updatedAt, updatedByPersonId)
    select -21, 'Ajax Corporation', 'dev-cron@ajax.corp', 'now', 'now', -20
    where not exists (select * from tc.Organization
    where id = -21);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -59, -20, -21, null, null, null, null, null, 'created', '{ "name": "Ajax Corporation", "email": "dev-cron@ajax.corp" }', null
    where not exists (select * from tc.History
    where id = -59);

insert into tc.OrganizationToPerson (organizationId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -21, -20, 'admin', 'now', 'now', -20
    where not exists (select * from tc.OrganizationToPerson
    where organizationId = -21 and personId = -20);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -60, -20, -21, null, null, null, null, -20, 'member-add', '{ "personId": "-20", "role": "admin" }', null
    where not exists (select * from tc.History
    where id = -60);

insert into tc.Workspace (id, organizationId, name, createdAt, updatedAt, updatedByPersonId)
    select -22, -21, 'Staging', 'now', 'now', -20
    where not exists (select * from tc.Workspace
    where id = -22);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -61, -20, -21, -22, null, null, null, null, 'created', '{ "id": "-22", "name": "Staging" }', null
    where not exists (select * from tc.History
    where id = -61);

insert into tc.WorkspaceToPerson (workspaceId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -22, -20, 'editor', 'now', 'now', -20
    where not exists (select * from tc.WorkspaceToPerson
    where workspaceId = -22 and personId = -20);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -62, -20, -21, -22, null, null, null, -20, 'workspace-access', '{ "workspaceId": "-22", "personId": "-20", "role": "editor" }', null
    where not exists (select * from tc.History
    where id = -62);

insert into tc.Workspace (id, organizationId, name, createdAt, updatedAt, updatedByPersonId)
    select -23, -21, 'Production', 'now', 'now', -20
    where not exists (select * from tc.Workspace
    where id = -23);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -63, -20, -21, -23, null, null, null, null, 'created', '{ "id": "-23", "name": "Production" }', null
    where not exists (select * from tc.History
    where id = -63);

insert into tc.WorkspaceToPerson (workspaceId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -23, -20, 'viewer', 'now', 'now', -20
    where not exists (select * from tc.WorkspaceToPerson
    where workspaceId = -23 and personId = -20);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -64, -20, -21, -23, null, null, null, -20, 'workspace-access', '{ "workspaceId": "-23", "personId": "-20", "role": "viewer" }', null
    where not exists (select * from tc.History
    where id = -64);

--
-- Иван Петров from AJAX
--

-- Password is P@ssw0rd
insert into tc.Person (id, name, passwordHash, createdAt, updatedAt, updatedByPersonId)
    select -24, 'Иван Петров', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc.Person
    where id = -24);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -65, -24, null, null, null, null, null, -24, 'created', '{ "name": "Иван Петров", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null
    where not exists (select * from tc.History
    where id = -65);

insert into tc.PersonEmail (id, personId, email, status)
    select -24, -24, 'petrov@ajax.corp', 'active'
    where not exists (select * from tc.PersonEmail
    where id = -24);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -66, -24, null, null, null, null, null, -24, 'email-add', '{ "email": "petrov@ajax.corp", "status": "active" }', null
    where not exists (select * from tc.History
    where id = -66);

insert into tc.OrganizationToPerson (organizationId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -21, -24, 'member', 'now', 'now', -20
    where not exists (select * from tc.OrganizationToPerson
    where organizationId = -21 and personId = -24);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -67, -20, -21, null, null, null, null, -24, 'member-add', '{ "personId": "-24", "role": "member" }', null
    where not exists (select * from tc.History
    where id = -67);

insert into tc.Job (id, workspaceId, name, updatedByPersonId, rrule)
    select -222, -22, 'TestDataName1', -1, 'rruleTextTralala'
    where not exists (select * from tc.Job
    where id = -222);

insert into tc.History (id, updatedByPersonId, organizationId, workspaceId, jobId, taskId, connectionId, personId, operation, change, oldValue)
    select -68, -20, -21, -22, -222, null, null, null, 'created', '{ "jobId": "-222", "workspaceId": "-22", "name": "TestDataName1", "rrule": "rruleTextTralala" }', null
    where not exists (select * from tc.History
    where id = -68);

insert into tc.Run (id, jobId, status, elapsed)
    select -200, -222, 15, 24*60*60*1000
    where not exists (select * from tc.Run
    where id = -200);