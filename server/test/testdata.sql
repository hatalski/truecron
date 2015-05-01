--
-- Test data for tests
--

--
-- Brian Johnston from ACME
--

-- Password is P@ssw0rd
insert into tc."Person" ("id", "name", "passwordHash", "createdAt", "updatedAt", "updatedByPersonId")
    select -10, 'Brian Johnston', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc."Person"
    where id = -10);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -50, -10, null, null, null, null, null, -10, 'created', '{ "name": "Brian Johnston", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null, 'person'
    where not exists (select * from tc."History"
    where id = -50);

insert into tc."PersonEmail" ("id", "personId", "email", "status")
    select -10, -10, 'bj@it.acme.corp', 'active'
    where not exists (select * from tc."PersonEmail"
    where id = -10);

-- for reset password
insert into tc."Person" ("id", "name", "passwordHash", "createdAt", "updatedAt", "updatedByPersonId")
    select -111, 'ghost', '$2a$06$kCzCtZjvi01NJpXcBq', 'now', 'now', -1
    where not exists (select * from tc."Person"
    where id = -111);

--insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
--    select -50, -10, null, null, null, null, null, -10, 'created', '{ "name": "Brian Johnston", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null, 'person'
--    where not exists (select * from tc."History"
--    where id = -50);

insert into tc."PersonEmail" ("id", "personId", "email", "status")
    select -111, -111, 'ghostxx7@gmail.com', 'active'
    where not exists (select * from tc."PersonEmail"
    where id = -111);

--end reset password

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -51, -10, null, null, null, null, null, -10, 'email-add', '{ "email": "bj@it.acme.corp", "status": "active" }', null, 'person'
    where not exists (select * from tc."History"
    where id = -51);

-- Brian's Personal organization
insert into tc."Organization" ("id", "name", "email", "createdAt", "updatedAt", "updatedByPersonId")
    select -31, 'Personal', 'bj@it.acme.corp', 'now', 'now', -10
    where not exists (select * from tc."Organization"
    where id = -31);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -49, -10, -31, null, null, null, null, null, 'created', '{ "name": "Personal" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -49);

insert into tc."OrganizationToPerson" ("organizationId", "personId", "role", "createdAt", "updatedAt", "updatedByPersonId")
    select -31, -10, 'admin', 'now', 'now', -10
    where not exists (select * from tc."OrganizationToPerson"
    where "organizationId" = -31 and "personId" = -10);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -48, -10, -31, null, null, null, null, null, 'member-add', '{ "personId": "-10", "role": "admin" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -48);

insert into tc."Workspace" ("id", "organizationId", "name", "createdAt", "updatedAt", "updatedByPersonId")
    select -120, -31, 'My First Workspace', 'now', 'now', -10
    where not exists (select * from tc."Workspace"
    where id = -120);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -550, -10, -31, -120, null, null, null, null, 'created', '{ "id": "-120", "name": "My First Workspace" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -550);

insert into tc."WorkspaceToPerson" ("workspaceId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -120, -10, 'editor', 'now', 'now', -10
    where not exists (select * from tc."WorkspaceToPerson"
    where "workspaceId" = -120 and "personId" = -10);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -560, -10, -31, -120, null, null, null, -10, 'workspace-access', '{ "workspaceId": "-120", "personId": "-10", "role": "editor" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -560);

-- ACME Corp

insert into tc."Organization" ("id", "name", email, "createdAt", "updatedAt", "updatedByPersonId")
    select -11, 'Acme Corporation', 'bj@it.acme.corp', 'now', 'now', -10
    where not exists (select * from tc."Organization"
    where id = -11);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -52, -10, -11, null, null, null, null, null, 'created', '{ "name": "Acme Corporation" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -52);
insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -53, -10, -11, null, null, null, null, null, 'updated', '{ "email": "bj@it.acme.corp" }', '{ "email": "" }', 'organization'
    where not exists (select * from tc."History"
    where id = -53);

insert into tc."OrganizationToPerson" ("organizationId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -11, -10, 'admin', 'now', 'now', -10
    where not exists (select * from tc."OrganizationToPerson"
    where "organizationId" = -11 and "personId" = -10);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -54, -10, -11, null, null, null, null, null, 'member-add', '{ "personId": "-10", "role": "admin" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -54);

insert into tc."Workspace" ("id", "organizationId", "name", "createdAt", "updatedAt", "updatedByPersonId")
    select -12, -11, 'Development', 'now', 'now', -10
    where not exists (select * from tc."Workspace"
    where id = -12);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -55, -10, -11, -12, null, null, null, null, 'created', '{ "id": "-12", "name": "My workspace" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -55);

insert into tc."WorkspaceToPerson" ("workspaceId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -12, -10, 'editor', 'now', 'now', -10
    where not exists (select * from tc."WorkspaceToPerson"
    where "workspaceId" = -12 and "personId" = -10);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -56, -10, -11, -12, null, null, null, -10, 'workspace-access', '{ "workspaceId": "-12", "personId": "-10", "role": "editor" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -56);

insert into tc."Schedule" ("id", rrule)
    select -10, 'FREQ=WEEKLY;COUNT=30;WKST=MO'
    where not exists (select * from tc."Schedule"
    where id = -10);

insert into tc."Job" ("id", "organizationId", "workspaceId", "name", "createdAt", "updatedAt", "updatedByPersonId", "scheduleId")
    select -13, -11, -12, 'My workspace test job', 'now', 'now', -10, -10
    where not exists (select * from tc."Job"
    where id = -13);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -156, -10, -11, -12, -13, null, null, null, 'created', '{ "jobId": "-13", "workspaceId": "-12", "name": "Weekly Financial Report" }', null, 'job'
    where not exists (select * from tc."History"
    where id = -156);

insert into tc."JobTag" ("id", "jobId", "tag")
    select -13, -13, 'tag1'
    where not exists (select * from tc."JobTag"
    where id = -13);

insert into tc."JobTag" ("id", "jobId", "tag")
    select -14, -13, 'tag2'
    where not exists (select * from tc."JobTag"
    where id = -14);

insert into tc."Schedule" ("id", rrule)
    select -11, 'FREQ=WEEKLY;COUNT=20;WKST=MO'
    where not exists (select * from tc."Schedule"
    where id = -11);

insert into tc."Job" ("id", "organizationId", "workspaceId", "name", "createdAt", "updatedAt", "updatedByPersonId", "scheduleId")
    select -14, -11, -12, 'Hourly TrueCron Website Ping', 'now', 'now', -10, -11
    where not exists (select * from tc."Job"
    where id = -14);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -167, -10, -11, -12, -14, null, null, null, 'created', '{ "jobId": "-14", "workspaceId": "-12", "name": "Hourly TrueCron Website Ping" }', null, 'job'
    where not exists (select * from tc."History"
    where id = -167);

insert into tc."TaskType" ("id", "name")
    select -1, 'default'
    where not exists (select * from tc."TaskType"
    where id = -1);

insert into tc."TaskType" ("id", "name")
    select 1, 'file'
    where not exists (select * from tc."TaskType"
    where id = 1);

insert into tc."TaskType" ("id", "name")
    select 2, 'execute'
    where not exists (select * from tc."TaskType"
    where id = 2);

insert into tc."TaskType" ("id", "name")
    select 3, 'archive'
    where not exists (select * from tc."TaskType"
    where id = 3);

insert into tc."TaskType" ("id", "name")
    select 4, 'sftp'
    where not exists (select * from tc."TaskType"
    where id = 4);

insert into tc."TaskType" ("id", "name")
    select 5, 'smtp'
    where not exists (select * from tc."TaskType"
    where id = 5);

insert into tc."TaskType" ("id", "name")
    select 6, 'http'
    where not exists (select * from tc."TaskType"
    where id = 6);

insert into tc."Task" ("id", "organizationId", "workspaceId", "jobId", "name", "position", "taskTypeId", "settings", "timeout", "createdAt", "updatedAt", "updatedByPersonId")
    select -14, -11, -12, -13, 'My workspace test job task', 1, 5, '{}', 30000, 'now', 'now', -10
    where not exists (select * from tc."Task"
    where id = -14);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -157, -10, -11, -12, -13, -14, null, null, 'created', '{ "taskId": -14, "jobId": "-13", "name": "My workspace test job task", "position": 1, "taskTypeId": 5, "settings": {}, "timeout": 30000 }', null, 'task'
    where not exists (select * from tc."History"
    where id = -157);

insert into tc."ConnectionType" ("id", "name")
    select 'testftp', 'FTP server'
    where not exists (select * from tc."ConnectionType"
    where id = 'testftp');

insert into tc."Connection" ("id", "organizationId", "connectionTypeId", "name", "settings", "createdAt", "updatedAt", "updatedByPersonId")
    select -15, -11, 'testftp', 'My ftp server', '{ "address": "127.0.0.1", "port": "21" }', 'now', 'now', -10
    where not exists (select * from tc."Connection"
    where id = -15);

insert into tc."Connection" ("id", "organizationId", "connectionTypeId", "name", "settings", "createdAt", "updatedAt", "updatedByPersonId")
    select -16, -31, 'testftp', 'My home FTP server', '{ "address": "sweethome.dyndns.xyz", "port": "21" }', 'now', 'now', -10
    where not exists (select * from tc."Connection"
    where id = -16);


--
-- Suresh Kumar from AJAX
--

-- Password is P@ssw0rd
insert into tc."Person" ("id", "name", "passwordHash", "createdAt", "updatedAt", "updatedByPersonId")
    select -20, 'Suresh Kumar', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc."Person"
    where id = -20);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -57, -20, null, null, null, null, null, -20, 'created', '{ "name": "Suresh Kumar", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null, 'person'
    where not exists (select * from tc."History"
    where id = -57);

insert into tc."PersonEmail" ("id", "personId", email, status)
    select -20, -20, 'skumar@ajax.corp', 'active'
    where not exists (select * from tc."PersonEmail"
    where id = -20);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -58, -20, null, null, null, null, null, -20, 'email-add', '{ "email": "skumar@ajax.corp", "status": "active" }', null, 'person'
    where not exists (select * from tc."History"
    where id = -58);

insert into tc."Organization" ("id", "name", email, "createdAt", "updatedAt", "updatedByPersonId")
    select -21, 'Ajax Corporation', 'dev-cron@ajax.corp', 'now', 'now', -20
    where not exists (select * from tc."Organization"
    where id = -21);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -59, -20, -21, null, null, null, null, null, 'created', '{ "name": "Ajax Corporation", "email": "dev-cron@ajax.corp" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -59);

insert into tc."OrganizationToPerson" ("organizationId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -21, -20, 'admin', 'now', 'now', -20
    where not exists (select * from tc."OrganizationToPerson"
    where "organizationId" = -21 and "personId" = -20);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -60, -20, -21, null, null, null, null, -20, 'member-add', '{ "personId": "-20", "role": "admin" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -60);

insert into tc."Workspace" ("id", "organizationId", "name", "createdAt", "updatedAt", "updatedByPersonId")
    select -22, -21, 'Staging', 'now', 'now', -20
    where not exists (select * from tc."Workspace"
    where id = -22);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -61, -20, -21, -22, null, null, null, null, 'created', '{ "id": "-22", "name": "Staging" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -61);

insert into tc."WorkspaceToPerson" ("workspaceId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -22, -20, 'editor', 'now', 'now', -20
    where not exists (select * from tc."WorkspaceToPerson"
    where "workspaceId" = -22 and "personId" = -20);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -62, -20, -21, -22, null, null, null, -20, 'workspace-access', '{ "workspaceId": "-22", "personId": "-20", "role": "editor" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -62);

insert into tc."Workspace" ("id", "organizationId", "name", "createdAt", "updatedAt", "updatedByPersonId")
    select -23, -21, 'Production', 'now', 'now', -20
    where not exists (select * from tc."Workspace"
    where id = -23);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -63, -20, -21, -23, null, null, null, null, 'created', '{ "id": "-23", "name": "Production" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -63);

insert into tc."WorkspaceToPerson" ("workspaceId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -23, -20, 'viewer', 'now', 'now', -20
    where not exists (select * from tc."WorkspaceToPerson"
    where "workspaceId" = -23 and "personId" = -20);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -64, -20, -21, -23, null, null, null, -20, 'workspace-access', '{ "workspaceId": "-23", "personId": "-20", "role": "viewer" }', null, 'workspace'
    where not exists (select * from tc."History"
    where id = -64);

--
-- Иван Петров from AJAX
--

-- Password is P@ssw0rd
insert into tc."Person" ("id", "name", "passwordHash", "createdAt", "updatedAt", "updatedByPersonId")
    select -24, 'Иван Петров', '$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq', 'now', 'now', -1
    where not exists (select * from tc."Person"
    where id = -24);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -65, -24, null, null, null, null, null, -24, 'created', '{ "name": "Иван Петров", "passwordHash": "$2a$06$kCzCtZjvi01NJpXcv.mJxu/1dVSEMZAJywUP8nslZnEKOgPWD.pBq" }', null, 'person'
    where not exists (select * from tc."History"
    where id = -65);

insert into tc."PersonEmail" ("id", "personId", email, status)
    select -24, -24, 'petrov@ajax.corp', 'active'
    where not exists (select * from tc."PersonEmail"
    where id = -24);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -66, -24, null, null, null, null, null, -24, 'email-add', '{ "email": "petrov@ajax.corp", "status": "active" }', null, 'person'
    where not exists (select * from tc."History"
    where id = -66);

insert into tc."OrganizationToPerson" ("organizationId", "personId", role, "createdAt", "updatedAt", "updatedByPersonId")
    select -21, -24, 'member', 'now', 'now', -20
    where not exists (select * from tc."OrganizationToPerson"
    where "organizationId" = -21 and "personId" = -24);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -67, -20, -21, null, null, null, null, -24, 'member-add', '{ "personId": "-24", "role": "member" }', null, 'organization'
    where not exists (select * from tc."History"
    where id = -67);


insert into tc."Job" ("id", "organizationId", "workspaceId", "name", "updatedByPersonId")
    select -222, -21, -22, 'TestData"name"1', -1
    where not exists (select * from tc."Job"
    where id = -222);

insert into tc."History" ("id", "updatedByPersonId", "organizationId", "workspaceId", "jobId", "taskId", "connectionId", "personId", "operation", "change", "oldValue", "entity")
    select -68, -20, -21, -22, -222, null, null, null, 'created', '{ "jobId": "-222", "workspaceId": "-22", "name": "TestData"name"1", "rrule": "rruleTextTralala" }', null, 'job'
    where not exists (select * from tc."History"
    where id = -68);

insert into tc."Run" ("id", "organizationId", "workspaceId", "jobId", status, elapsed)
    select -200, -21, -22, -222, 15, 24*60*60*1000
    where not exists (select * from tc."Run"
    where id = -200);
