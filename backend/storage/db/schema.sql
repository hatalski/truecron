﻿--
-- TrueCron database schema. Run this script to upgrade the schema to the latest version.
--
-- psql -d YOUR-DB-NAME -f schema.sql -v ON_ERROR_STOP=1 -x -q
--
-- -v - ON_ERROR_STOP=1 stops the script on the first error. Default behavior is to issue an error and continue.
-- -x - prevent reading of the .psqlrc file, so it doesn't affect execution of the script.
-- -q - reduces noise.

--
-- Database schema versioning. Each update adds a record to the SchemaVersion table with a unique version number.
-- To add a new update search for the last call of the CommitSchemaVersion function, get a version from it,
-- increment, and use the following snippet as a template:
--
-- do $$
-- begin
-- if not HasSchemaVersion(XXX) then
--     ... insert your updates here ...
--     perform CommitSchemaVersion(XXX, 'Description of your changes.');
-- end if;
-- end $$;
--
-- (where XXX is a new version number).
-- Each such section executes in its own transaction.

create table if not exists SchemaVersion
(
    version     integer not null,
    updatedAt   timestamp(0) with time zone not null,
    description text not null,
    constraint  SchemaVersionPK primary key (version)
);

create or replace function HasSchemaVersion(version integer) returns boolean
as $$
begin
    return exists (select * from SchemaVersion where SchemaVersion.version = $1);
end
$$ language plpgsql;


create or replace function CommitSchemaVersion(version integer, description text)
returns void
as $$
begin
    if HasSchemaVersion(version) then
        raise exception 'Version % is already defined in the SchemaVersion table.', version
            using hint = 'You probably forgot to increment the version';
    end if;
    insert into SchemaVersion values (version, 'now', description);
    raise info 'Upgraded schema to version %.', version
        using detail = description;
end
$$ language plpgsql;


do $$
begin
if HasSchemaVersion(2) or HasSchemaVersion(1) then
    -- Removing leftovers from the first schema version entirely
    drop view if exists UserOrgs cascade;
    drop view if exists UserJobs cascade;
    drop view if exists UserTags cascade;
    drop table if exists Tasks cascade;
    drop table if exists TaskTypes cascade;
    drop table if exists JobTags cascade;
    drop table if exists Runs cascade;
    drop table if exists Jobs cascade;
    drop table if exists History cascade;
    drop table if exists OrgMembers cascade;
    drop table if exists Orgs cascade;
    drop table if exists Users cascade;
    drop type if exists OrgRole cascade;
    delete from SchemaVersion where version = 1;
    delete from SchemaVersion where version = 2;
end if;
end $$;

do $$
begin
if HasSchemaVersion(3) then
    -- Removing leftovers from the second schema version 
    drop table if exists JobConters cascade;
    drop table if exists Task cascade;
    drop table if exists TaskType cascade;
    drop table if exists JobTag cascade;
    drop table if exists Run cascade;
    drop table if exists Job cascade;
    drop table if exists WorkspaceMember cascade;
    drop table if exists Workspace cascade;
    drop table if exists History cascade;
    drop table if exists OrganizationMember cascade;
    drop table if exists Organization cascade;
    drop table if exists "User" cascade;
    drop type if exists OrganizationRole cascade;
    drop type if exists WorkspaceRole cascade;
    delete from SchemaVersion where version = 3;
end if;
end $$;


do $$
begin
if not HasSchemaVersion(4) then

    create schema tc;
    
    create table tc.Person
    (
        id              bigserial,
        login           varchar(256) not null,
        name            varchar(128) not null,
        passwordSalt    bytea not null,
        passwordHash    bytea not null,
        avatarUrl       varchar(1024),
        extensionData   json,
        lastLoginAt     timestamp(0) with time zone,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint,
        constraint      Person_Pk primary key (id),
        constraint      Person_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );

    create unique index Person_UniqueLogin_Index on tc.Person (lower(login));


    create type tc.EmailStatus as enum ('pending', 'active');
    
    create table tc.PersonEmail
    (
        id              bigserial,
        personId        bigint not null,
        email           varchar(256) not null,
        status          tc.EmailStatus not null default 'pending',
        constraint      PersonEmail_Pk primary key (id),
        constraint      PersonEmail_Person_Fk foreign key (personId) references tc.Person (id) 
                        on delete cascade
    );

    create unique index PersonEmail_UniqueEmail_Index on tc.PersonEmail (lower(email));


    create table tc.Organization
    (
        id              bigserial,
        name            varchar(256) not null,
        email           varchar(256),
        plan            json,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint not null,
        constraint      Organization_Pk primary key (id),
        constraint      Organization_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );
    

    create type tc.OrganizationRole as enum ('admin', 'member');

    create table tc.OrganizationToPerson 
    (
        organizationId  bigint not null,
        personId        bigint not null,
        role            tc.OrganizationRole not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint not null,
        constraint      OrganizationToPerson_Pk primary key (organizationId, personId),
        constraint      OrganizationToPerson_Organization_Fk foreign key (organizationId) references tc.Organization (id)
                        on delete cascade,
        constraint      OrganizationToPerson_Person_Fk foreign key (personId) references tc.Person (id)
                        on delete cascade,
        constraint      OrganizationToPerson_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );


    create table tc.History
    (
        id              bigserial,
        createdAt       timestamp(0) with time zone not null default 'now',
        resourceUrl     text not null,
        personId        bigint not null,
        change          text not null,
        oldValue        json,
        constraint      History_Pk primary key (id),
        constraint      History_Person_Fk foreign key (personId) references tc.Person (id)
    );

    create index History_ResourceUrl_Index on tc.History (resourceUrl asc, createdAt desc);
    create index History_Person_Index on tc.History (personId asc, createdAt desc);


    create table tc.Workspace
    (
        id              bigserial,
        organizationId  bigint not null,
        name            varchar(255) not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint not null,
        constraint      Workspace_Pk primary key(id),
        constraint      Workspace_Organization_Fk foreign key (organizationId) references tc.Organization (id),
        constraint      Workspace_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );
    

    create type tc.WorkspaceRole as enum ('editor', 'viewer');

    create table tc.WorkspaceToPerson
    (
        workspaceId     bigint not null,
        personId        bigint not null,
        role            tc.WorkspaceRole not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint not null,
        constraint      WorkspaceToPerson_Pk primary key (workspaceId, personId),
        constraint      WorkspaceToPerson_Workspace_Fk foreign key (workspaceId) references tc.Workspace (id)
                        on delete cascade,
        constraint      WorkspaceToPerson_Person_Fk foreign key (personId) references tc.Person (id)
                        on delete cascade,
        constraint      WorkspaceToPerson_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );


    create table tc.Job
    (
        id              bigserial,
        workspaceId     bigint not null,
        name            varchar(255) not null,
        active          smallint not null default 0,
        archived        smallint not null default 0,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint not null,
        startsAt        timestamp(2) with time zone,
        rrule           text not null,
        constraint      Job_Pk primary key (id),
        constraint      Job_Workspace_Fk foreign key (workspaceId) references tc.Workspace (id),
        constraint      Job_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );

    create table tc.JobTag
    (
        id              bigserial,
        jobId           bigint not null,
        tag             varchar(128) not null,
        constraint      JobTag_Pk primary key (id),
        constraint      JobTag_Ak unique (jobId, tag),
        constraint      JobTag_Job_Fk foreign key (jobId) references tc.Job (id)
                        on delete cascade
    );

    create table tc.TaskType
    (
        id              bigserial,
        name            varchar(128) not null,
        constraint      TaskType_Pk primary key (id)
    );

    create unique index TaskType_UniqueName_Index on tc.TaskType (lower(name));

    create table tc.Task
    (
        id              bigserial,
        jobId           bigint not null,
        name            varchar(255) not null,
        active          smallint not null default 1,
        position        integer not null,
        taskTypeId      bigint not null,
        settings        json not null,
        timeout         interval not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByPersonId bigint not null,
        constraint      Task_Pk primary key(id),
        constraint      Task_Job_Fk foreign key (jobId) references tc.Job (id)
                        on delete cascade,
        constraint      Task_TaskType_Fk foreign key (taskTypeId) references tc.TaskType (id),
        constraint      Task_UpdatedBy_Person_Fk foreign key (updatedByPersonId) references tc.Person (id)
    );


    create table tc.Run
    (
        id              bigserial,
        jobId           bigint not null,
        startedAt       timestamp(2) with time zone not null default 'now',
        startedByPersonId bigint,
        status          smallint not null,
        elapsed         interval not null,
        message         text,
        constraint      Run_Pk primary key (id),
        constraint      Run_Job_Fk foreign key (jobId) references tc.Job (id)
                        on delete cascade,
        constraint      Run_StartedBy_Person_Fk foreign key (startedByPersonId) references tc.Person (id)
    );
        

    create table tc.JobConters
    (
        jobId           bigint not null,
        nextRunAt       timestamp(2) with time zone,
        lastRunId       bigint,
        constraint      JobConters_Pk primary key (jobId),
        constraint      JobConters_Job_Fk foreign key (jobId) references tc.Job (id)
                        on delete cascade,
        constraint      JobConters_Run_Fk foreign key (lastRunId) references tc.Run (id)
                        on delete set null
    );
    
    perform CommitSchemaVersion(4, 'Initial schema.');
end if;
end $$;


do $$
begin
if not HasSchemaVersion(5) then

    -- A user can log in with any active email from the PersonEmail table.
    drop index tc.Person_UniqueLogin_Index;
    alter table tc.Person drop column login;
    
    perform CommitSchemaVersion(5, 'Removed Person.login');
end if;
end $$;

-- Use the snippet as a template:
--
-- do $$
-- begin
-- if not HasSchemaVersion(XXX) then
--     ... insert your updates here ...
--     perform CommitSchemaVersion(XXX, 'Update description.');
-- end if;
-- end $$;



-- Recreate views here
