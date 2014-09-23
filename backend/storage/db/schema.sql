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
if not HasSchemaVersion(3) then

    create table "User"
    (
        id              bigserial,
        login           varchar(128) not null,
        name            varchar(128) not null,
        passwordSalt    bytea not null,
        passwordHash    bytea not null,
        emails          varchar(128)[],
        avatarUrl       varchar(1024),
        googleData      json,
        lastLoginAt     timestamp(0) with time zone,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByUserId bigint,
        constraint      UserPK primary key (id),
        constraint      UserUpdatedByUserFK foreign key (updatedByUserId) references "User" (id)
    );

    create unique index UserLoginIndex on "User" (lower(login));


    create table Organization
    (
        id              bigserial,
        name            varchar(256) not null,
        email           varchar(128),
        plan            json,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByUserId bigint not null,
        constraint      OrganizationPK primary key (id),
        constraint      OrganizationUpdatedByUserFK foreign key (updatedByUserId) references "User" (id)
    );
    

    create type OrganizationRole as enum ('admin', 'member');

    create table OrganizationMember
    (
        organizationId  bigint not null,
        userId          bigint not null,
        role            OrganizationRole not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByUserId bigint not null,
        constraint      OrganizationMemberPK primary key (organizationId, userId),
        constraint      OrganizationMemberOrganizationFK foreign key (organizationId) references Organization (id),
        constraint      OrganizationMemberUserFK foreign key (userId) references "User" (id),
        constraint      OrganizationMemberUpdatedByUserFK foreign key (updatedByUserId) references "User" (id)
    );


    create table History
    (
        id              bigserial,
        createdAt       timestamp(0) with time zone not null default 'now',
        resourceUrl     varchar(256) not null,
        userId          bigint not null,
        change          text not null,
        oldValue        text,
        constraint      HistoryPK primary key (id),
        constraint      HistoryUserFK foreign key (userId) references "User" (id)
    );

    create index HistoryResourceUrlIndex on History (resourceUrl asc, at desc);
    create index HistoryUserIndex on History (userId asc, at desc);


    create table Workspace
    (
        id              bigserial,
        organizationId  bigint not null,
        name            varchar(255) not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByUserId bigint not null,
        constraint      WorkspacePK primary key(id),
        constraint      WorkspaceOrganizationFK foreign key (organizationId) references Organization (id)
                        on delete cascade,
        constraint      WorkspaceUpdatedByUserFK foreign key (updatedByUserId) references "User" (id)
    );
    

    create type WorkspaceRole as enum ('editor', 'viewer');

    create table WorkspaceMember
    (
        workspaceId     bigint not null,
        userId          bigint not null,
        role            WorkspaceRole not null,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByUserId bigint not null,
        constraint      WorkspaceMemberPK primary key (workspaceId, userId),
        constraint      WorkspaceMemberWorkspaceFK foreign key (workspaceId) references Workspace (id),
        constraint      WorkspaceMemberUserFK foreign key (userId) references "User" (id),
        constraint      WorkspaceMemberUpdatedByUserFK foreign key (updatedByUserId) references "User" (id)
    );


    create table Job
    (
        id              bigserial,
        workspaceId     bigint not null,
        name            varchar(255) not null,
        active          smallint not null default 0,
        archived        smallint not null default 0,
        createdAt       timestamp(0) with time zone not null default 'now',
        updatedAt       timestamp(0) with time zone not null default 'now',
        updatedByUserId bigint not null,
        startsAt        timestamp(2) with time zone,
        rrule           text,
        constraint      JobPK primary key (id),
        constraint      JobWorkspaceFK foreign key (workspaceId) references Workspace (id)
                        on delete cascade,
        constraint      JobsUpdatedByFK foreign key (updatedByUserId) references "User" (id)
    );

    create table JobTag
    (
        jobId           bigint not null,
        tag             varchar(32) not null,
        constraint      JobTagPK primary key (jobId, tag),
        constraint      JobTagJobFK foreign key (jobId) references Job (id)
                        on delete cascade
    );

    create table TaskType
    (
        id              bigserial,
        name            varchar(128) not null,
        constraint      TaskTypePK primary key (id)
    );

    create unique index TaskTypeNameIndex on TaskType (lower(name));

    create table Task
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
        updatedByUserId bigint not null,
        constraint      TaskPK primary key(id),
        constraint      TaskJobFK foreign key (jobId) references Job (id)
                        on delete cascade,
        constraint      TaskTypeFK foreign key (typeId) references TaskType (id)
    );


    create table Run
    (
        id              bigserial,
        jobId           bigint not null,
        startedAt       timestamp(2) with time zone not null default 'now',
        startedByUserId bigint,
        status          smallint not null,
        elapsed         interval not null,
        message         text,
        constraint      RunPK primary key (id),
        constraint      RunJobFK foreign key (jobId) references Job (id)
                        on delete cascade,
        constraint      RunStartedByUserFK foreign key (startedByUserId) references "User" (id)
    );
        

    create table JobConters
    (
        jobId           bigint not null,
        nextRunAt       timestamp(2) with time zone,
        lastRunId       bigint,
        constraint      JobContersPK primary key (jobId),
        constraint      JobContersJobFK foreign key (jobId) references Job (id)
                        on delete cascade,
        constraint      JobContersRunFK foreign key (lastRunId) references Run (id)
                        on delete set null
    );
    
    perform CommitSchemaVersion(3, 'Initial schema.');
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

