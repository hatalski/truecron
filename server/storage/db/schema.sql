--
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
    "version"     integer not null,
    "updatedAt"   timestamp(0) with time zone not null,
    "description" text not null,
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
if not HasSchemaVersion(17) then
    -- Major change, purges all data!
    drop schema if exists tc cascade;

    create schema tc;

    create table tc."Person"
    (
        "id"                bigserial,
        "name"              varchar(128) not null,
        "passwordHash"      text not null,
        "deleted"           smallint not null default 0,
        "avatarUrl"         varchar(1024),
        "extensionData"     json,
        "lastLoginAt"       timestamp(0) with time zone,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint,
        constraint          Person_Pk primary key ("id"),
        constraint          Person_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" (id)
    );


    create type tc."EmailStatus" as enum ('pending', 'active');

    create table tc."PersonEmail"
    (
        "id"                bigserial,
        "personId"          bigint not null,
        "email"             varchar(256) not null,
        status              tc."EmailStatus" not null default 'pending',
        constraint          PersonEmail_Pk primary key ("id"),
        constraint          PersonEmail_Person_Fk foreign key ("personId")
                            references tc."Person" ("id")
                            on delete cascade
    );

    create unique index "PersonEmail_UniqueEmail_Index"
        on tc."PersonEmail" (lower("email"));

    create table tc."Organization"
    (
        "id"                bigserial,
        "name"              varchar(256) not null,
        "email"             varchar(256),
        "plan"              json,
        "secretHash"        text,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        constraint          Organization_Pk primary key ("id"),
        constraint          Organization_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" (id)
    );

    create unique index "Organization_UniqueSecretHash_Index"
        on tc."Organization" ("secretHash")
        where "secretHash" is not null;

    create type tc."OrganizationRole" as enum ('admin', 'member');

    create table tc."OrganizationToPerson"
    (
        "organizationId"    bigint not null,
        "personId"          bigint not null,
        "role"              tc."OrganizationRole" not null,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        constraint          OrganizationToPerson_Pk primary key ("organizationId", "personId"),
        constraint          OrganizationToPerson_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" ("id")
                            on delete cascade,
        constraint          OrganizationToPerson_Person_Fk foreign key ("personId")
                            references tc."Person" (id)
                            on delete cascade,
        constraint          OrganizationToPerson_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" ("id")
    );


    create type tc."EntityType" as enum ('person', 'organization', 'workspace', 'job', 'task', 'connection');

    create table tc."History"
    (
        "id"                bigserial,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "entity"            tc."EntityType" not null,
        "operation"         text not null,
        "organizationId"    bigint,
        "workspaceId"       bigint,
        "jobId"             bigint,
        "taskId"            bigint,
        "connectionId"      bigint,
        "personId"          bigint,
        "updatedByPersonId" bigint not null,
        "change"            text not null,
        "oldValue"          json,
        constraint          History_Pk primary key ("id"),
        constraint          History_UpdatedByPerson_Fk foreign key ("personId")
                            references tc."Person" ("id")
        -- No foreign keys here, because we want to keep the records forever, even when the object is gone. For audit
        -- and restore purposes.
    );

    create index "History_Person_Index"
        on tc."History" ("personId" asc, "createdAt" desc);


    create table tc."Workspace"
    (
        "id"                bigserial,
        "organizationId"    bigint not null,
        "name"              varchar(255) not null,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        constraint          Workspace_Pk primary key(id),
        constraint          Workspace_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" (id),
        constraint          Workspace_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" (id)
    );


    create type tc."WorkspaceRole" as enum ('editor', 'viewer');

    create table tc."WorkspaceToPerson"
    (
        "workspaceId"       bigint not null,
        "personId"          bigint not null,
        "role"              tc."WorkspaceRole" not null,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        constraint          WorkspaceToPerson_Pk primary key ("workspaceId", "personId"),
        constraint          WorkspaceToPerson_Workspace_Fk foreign key ("workspaceId")
                            references tc."Workspace" ("id")
                            on delete cascade,
        constraint          WorkspaceToPerson_Person_Fk foreign key ("personId")
                            references tc."Person" ("id")
                            on delete cascade,
        constraint          WorkspaceToPerson_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" ("id")
    );


    create table tc."Schedule"
    (
        "id"                bigserial,
        "dtStart"           timestamp(2) with time zone not null default 'now',
        "dtEnd"             timestamp(2) with time zone,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "rrule"             text not null,
        "exrule"            text,
        "rdate"             text,
        "exdate"            text,
        constraint          Schedule_Pk primary key ("id")
    );

    create table tc."Job"
    (
        "id"                bigserial,
        "organizationId"    bigint not null,
        "workspaceId"       bigint not null,
        "name"              varchar(255) not null,
        "active"            smallint not null default 0,
        "archived"          smallint not null default 0,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        "scheduleId"        bigint,
        constraint          Job_Pk primary key ("id"),
        constraint          Job_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" ("id"),
        constraint          Job_Workspace_Fk foreign key ("workspaceId")
                            references tc."Workspace" ("id"),
        constraint          Job_Schedule_Fk foreign key ("scheduleId")
                            references tc."Schedule" ("id"),
        constraint          Job_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" ("id")
    );

    create table tc."JobTag"
    (
        "id"                bigserial,
        "jobId"             bigint not null,
        "tag"               varchar(128) not null,
        constraint          JobTag_Pk primary key ("id"),
        constraint          JobTag_Ak unique ("jobId", "tag"),
        constraint          JobTag_Job_Fk foreign key ("jobId")
                            references tc."Job" ("id")
                            on delete cascade
    );


    create table tc."TaskType"
    (
        "id"                bigserial,
        "name"              varchar(128) not null,
        constraint          TaskType_Pk primary key ("id")
    );

    create unique index "TaskType_UniqueName_Index"
        on tc."TaskType" (lower("name"));

    create table tc."Task"
    (
        "id"                bigserial,
        "organizationId"    bigint not null,
        "workspaceId"       bigint not null,
        "jobId"             bigint not null,
        "name"              varchar(255) not null,
        "active"            smallint not null default 1,
        "position"          integer not null,
        "taskTypeId"        bigint not null,
        "settings"          json not null,
        "timeout"           bigint not null,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        constraint          Task_Pk primary key("id"),
        constraint          Task_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" ("id"),
        constraint          Task_Workspace_Fk foreign key ("workspaceId")
                            references tc."Workspace" ("id"),
        constraint          Task_Job_Fk foreign key ("jobId")
                            references tc."Job" ("id")
                            on delete cascade,
        constraint          Task_TaskType_Fk foreign key ("taskTypeId")
                            references tc."TaskType" (id),
        constraint          Task_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" ("id")
    );


    create table tc."Run"
    (
        "id"                bigserial,
        "organizationId"    bigint not null,
        "workspaceId"       bigint not null,
        "jobId"             bigint not null,
        "startedAt"         timestamp(2) with time zone not null default 'now',
        "startedByPersonId" bigint,
        "status"            smallint not null,
        "elapsed"           bigint not null,
        "message"           text,
        constraint          Run_Pk primary key ("id"),
        constraint          Run_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" ("id"),
        constraint          Run_Workspace_Fk foreign key ("workspaceId")
                            references tc."Workspace" ("id"),
        constraint          Run_Job_Fk foreign key ("jobId")
                            references tc."Job" ("id")
                            on delete cascade,
        constraint          Run_StartedBy_Person_Fk foreign key ("startedByPersonId")
                            references tc."Person" ("id")
    );


    create table tc."ConnectionType"
    (
        "id"                varchar(64) not null,
        "name"              varchar(255) not null,
        constraint          ConnectionType_Pk primary key ("id")
    );

    create table tc."Connection"
    (
        "id"                bigserial,
        "organizationId"    bigint not null,
        "connectionTypeId"  varchar(64) not null,
        "name"              varchar(255) not null,
        "settings"          json not null,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        "updatedAt"         timestamp(0) with time zone not null default 'now',
        "updatedByPersonId" bigint not null,
        constraint          Connection_Pk primary key("id"),
        constraint          Connection_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" ("id"),
        constraint          Connection_ConnectionType_Fk foreign key ("connectionTypeId")
                            references tc."ConnectionType" ("id"),
        constraint          Connection_UpdatedBy_Person_Fk foreign key ("updatedByPersonId")
                            references tc."Person" ("id")
    );


    create table tc."JobConters"
    (
        "organizationId"    bigint not null,
        "workspaceId"       bigint not null,
        "jobId"             bigint not null,
        "nextRunAt"         timestamp(2) with time zone,
        "lastRunId"         bigint,
        constraint          JobConters_Pk primary key ("jobId"),
        constraint          JobConters_Organization_Fk foreign key ("organizationId")
                            references tc."Organization" ("id"),
        constraint          JobConters_Workspace_Fk foreign key ("workspaceId")
                            references tc."Workspace" ("id"),
        constraint          JobConters_Job_Fk foreign key ("jobId")
                            references tc."Job" ("id")
                            on delete cascade,
        constraint          JobConters_Run_Fk foreign key ("lastRunId")
                            references tc."Run" ("id")
                            on delete set null
    );

    create table tc."ResetPassword"
    (
        "email"             varchar(256) not null,
        "resetpasswordcode" varchar(1024) not null,
        "createdAt"         timestamp(0) with time zone not null default 'now',
        constraint          ResetPassword_Pk primary key ("resetpasswordcode")
    );


    -- SYSTEM user for system-wide changes
    insert into tc."Person" ("id", "name", "passwordHash", "createdAt", "updatedAt")
        values (-1, 'SYSTEM', '$2a$10$jdwZd64L4ORUc5h7MoPvAOTOfBgnq8MgSYCsMbeJKd/hjfX67pnSO', 'now', 'now');
    update tc."Person" set "updatedByPersonId" = -1 where "id" = -1;

    insert into tc."PersonEmail" ("personId", "email", "status")
        values (-1, 'system@truecron.com', 'active');

    insert into tc."Organization" ("id", "name", "email", "secretHash", "createdAt", "updatedAt", "updatedByPersonId")
        values (-2, 'TrueCron', 'admins@truecron.com',  '$2a$05$wYu.3JoaAGbl.hAyQsM8OOe/QZ7rCj157nnhorcFBHAyXZrOl5GqK', 'now', 'now', -1);

    insert into tc."OrganizationToPerson" ("organizationId", "personId", "role", "createdAt", "updatedAt", "updatedByPersonId")
        values (-2, -1, 'admin', 'now', 'now', -1);

    perform CommitSchemaVersion(17, 'Made all identifiers case-sensitive.');
end if;
end $$;


do $$
begin
if not HasSchemaVersion(18) then
     alter table tc."JobConters" rename to "JobCounters";
     perform CommitSchemaVersion(18, 'Renamed JobConters to JobCounters.');
end if;
end $$;


do $$
begin
if not HasSchemaVersion(19) then
     create table tc."Payments"
         (
             "id"                bigserial,
             "organizationId"    bigint not null,
             "date"              timestamp(2) with time zone,
             "amount"            bigint not null,
             "description"       text,
             "paymentMethod"     text not null,
             "receipt"           varchar (256) not null,
             constraint          Payments_Pk primary key ("id"),
             constraint          Payments_Organization_Fk foreign key ("organizationId")
                                 references tc."Organization" ("id")
         );
     perform CommitSchemaVersion(19, 'Added table Payments');
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
