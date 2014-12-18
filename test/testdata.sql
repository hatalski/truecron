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

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -50, '/users/-10', -10, 'created', '{ "name": "Brian Johnston", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null
    where not exists (select * from tc.History
    where id = -50);

insert into tc.PersonEmail (id, personId, email, status)
    select -10, -10, 'bj@it.acme.corp', 'active'
    where not exists (select * from tc.PersonEmail
    where id = -10);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -51, '/users/-10', -10, 'email-add', '{ "email": "bj@it.acme.corp", "status": "active" }', null
    where not exists (select * from tc.History
    where id = -51);

insert into tc.Organization (id, name, email, createdAt, updatedAt, updatedByPersonId)
    select -11, 'Acme Corporation', 'bj@it.acme.corp', 'now', 'now', -10
    where not exists (select * from tc.Organization
    where id = -11);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -52, '/organizations/-11', -10, 'created', '{ "name": "Acme Corporation" }', null
    where not exists (select * from tc.History
    where id = -52);
insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -53, '/organizations/-11', -10, 'updated', '{ "email": "bj@it.acme.corp" }', '{ "email": "" }'
    where not exists (select * from tc.History
    where id = -53);

insert into tc.OrganizationToPerson (organizationId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -11, -10, 'admin', 'now', 'now', -10
    where not exists (select * from tc.OrganizationToPerson
    where organizationId = -11 and personId = -10);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -54, '/organizations/-11', -10, 'member-add', '{ "personId": "-10", "role": "admin" }', null
    where not exists (select * from tc.History
    where id = -54);

insert into tc.Workspace (id, organizationId, name, createdAt, updatedAt, updatedByPersonId)
    select -12, -11, 'My workspace', 'now', 'now', -10
    where not exists (select * from tc.Workspace
    where id = -12);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -55, '/organizations/-11', -10, 'workspace-add', '{ "id": "-12", "name": "My workspace" }', null
    where not exists (select * from tc.History
    where id = -55);

insert into tc.WorkspaceToPerson (workspaceId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -12, -10, 'editor', 'now', 'now', -10
    where not exists (select * from tc.WorkspaceToPerson
    where workspaceId = -12 and personId = -10);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -56, '/organizations/-11', -10, 'workspace-access', '{ "workspaceId": "-12", "personId": "-10", "role": "editor" }', null
    where not exists (select * from tc.History
    where id = -56);

insert into tc.Job (id, workspaceId, name, createdAt, updatedAt, updatedByPersonId, rrule)
    select -13, -12, 'My workspace test job', 'now', 'now', -10, 'FREQ=WEEKLY;COUNT=30;WKST=MO'
    where not exists (select * from tc.Job
    where id = -13);

insert into tc.Job (id, workspaceId, name, createdAt, updatedAt, updatedByPersonId, rrule)
    select -13, -12, 'My workspace test job', 'now', 'now', -10, 'FREQ=WEEKLY;COUNT=30;WKST=MO'
    where not exists (select * from tc.Job
    where id = -13);

insert into tc.TaskType (id, name)
    select -100, 'TestType'
        where not exists (select * from tc.TaskType
    where id = -100);

insert into tc.Task (id, jobId, name, position, taskTypeId, settings, timeout, createdAt, updatedAt, updatedByPersonId)
    select -14, -13, 'My workspace test job task', 1, -100, '{}', '30 seconds', 'now', 'now', -10
    where not exists (select * from tc.Task
    where id = -14);

--
-- Suresh Kumar from AJAX
--

-- Password is P@ssw0rd
insert into tc.Person (id, name, passwordHash, createdAt, updatedAt, updatedByPersonId)
    select -20, 'Suresh Kumar', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc.Person
    where id = -20);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -57, '/users/-20', -20, 'created', '{ "name": "Suresh Kumar", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null
    where not exists (select * from tc.History
    where id = -57);

insert into tc.PersonEmail (id, personId, email, status)
    select -20, -20, 'skumar@ajax.corp', 'active'
    where not exists (select * from tc.PersonEmail
    where id = -20);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -58, '/users/-20', -20, 'email-add', '{ "email": "skumar@ajax.corp", "status": "active" }', null
    where not exists (select * from tc.History
    where id = -58);

insert into tc.Organization (id, name, email, createdAt, updatedAt, updatedByPersonId)
    select -21, 'Ajax Corporation', 'dev-cron@ajax.corp', 'now', 'now', -20
    where not exists (select * from tc.Organization
    where id = -21);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -59, '/organizations/-21', -20, 'created', '{ "name": "Ajax Corporation", "email": "dev-cron@ajax.corp" }', null
    where not exists (select * from tc.History
    where id = -59);

insert into tc.OrganizationToPerson (organizationId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -21, -20, 'admin', 'now', 'now', -20
    where not exists (select * from tc.OrganizationToPerson
    where organizationId = -21 and personId = -20);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -60, '/organizations/-21', -20, 'member-add', '{ "personId": "-20", "role": "admin" }', null
    where not exists (select * from tc.History
    where id = -60);

insert into tc.Workspace (id, organizationId, name, createdAt, updatedAt, updatedByPersonId)
    select -22, -21, 'Staging', 'now', 'now', -20
    where not exists (select * from tc.Workspace
    where id = -22);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -61, '/organizations/-21', -20, 'workspace-add', '{ "id": "-22", "name": "Staging" }', null
    where not exists (select * from tc.History
    where id = -61);

insert into tc.WorkspaceToPerson (workspaceId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -22, -20, 'editor', 'now', 'now', -20
    where not exists (select * from tc.WorkspaceToPerson
    where workspaceId = -22 and personId = -20);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -62, '/organizations/-21', -20, 'workspace-access', '{ "workspaceId": "-22", "personId": "-20", "role": "editor" }', null
    where not exists (select * from tc.History
    where id = -62);

insert into tc.Workspace (id, organizationId, name, createdAt, updatedAt, updatedByPersonId)
    select -23, -21, 'Production', 'now', 'now', -20
    where not exists (select * from tc.Workspace
    where id = -23);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -63, '/organizations/-21', -20, 'workspace-add', '{ "id": "-23", "name": "Production" }', null
    where not exists (select * from tc.History
    where id = -63);

insert into tc.WorkspaceToPerson (workspaceId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -23, -20, 'viewer', 'now', 'now', -20
    where not exists (select * from tc.WorkspaceToPerson
    where workspaceId = -23 and personId = -20);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -64, '/organizations/-21', -20, 'workspace-access', '{ "workspaceId": "-23", "personId": "-20", "role": "viewer" }', null
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

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -65, '/users/-24', -24, 'created', '{ "name": "Иван Петров", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null
    where not exists (select * from tc.History
    where id = -65);

insert into tc.PersonEmail (id, personId, email, status)
    select -24, -24, 'petrov@ajax.corp', 'active'
    where not exists (select * from tc.PersonEmail
    where id = -24);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -66, '/users/-24', -24, 'email-add', '{ "email": "petrov@ajax.corp", "status": "active" }', null
    where not exists (select * from tc.History
    where id = -66);

insert into tc.OrganizationToPerson (organizationId, personId, role, createdAt, updatedAt, updatedByPersonId)
    select -21, -24, 'member', 'now', 'now', -20
    where not exists (select * from tc.OrganizationToPerson
    where organizationId = -21 and personId = -24);

insert into tc.History (id, resourceUrl, personId, operation, change, oldValue)
    select -67, '/organizations/-21', -20, 'member-add', '{ "personId": "-24", "role": "member" }', null
    where not exists (select * from tc.History
    where id = -67);

insert into tc.Job (id, workspaceId, name, updatedByPersonId, rrule)
    select -222, -22, 'TestDataName1', -1, 'rruleTextTralala'
        where not exists (select * from tc.Job
    where id = -222);

insert into tc.Run (id, jobId, status, elapsed)
    select -200, -222, 15, '1 day -01:00:00'
        where not exists (select * from tc.Run
    where id = -200);