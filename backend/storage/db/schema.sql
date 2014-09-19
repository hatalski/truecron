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
if not HasSchemaVersion(1) then
    create table Users
    (
        id          bigint not null,
        login       varchar(128) not null,
        name        varchar(128) not null,
        passwordSalt bytea not null,
        passwordHash bytea not null,
        emails      varchar(128)[],
        avatarUrl   varchar(1024),
        googleData  json,
        lastLoginAt timestamp(0) with time zone not null default 'now',
        createdAt   timestamp(0) with time zone not null default 'now',
        updatedAt   timestamp(0) with time zone not null default 'now',
        updatedById bigint,
        constraint  UsersPK primary key (id),
        constraint  UsersUpdatedByFK foreign key (updatedById) references Users (id)
    );

    create unique index UsersLoginIndex on Users (lower(login));

    create table Orgs
    (
        id          bigserial,
        name        varchar(256),
        email       varchar(128),
        plan        json,
        createdAt   timestamp(0) with time zone not null default 'now',
        updatedAt   timestamp(0) with time zone not null default 'now',
        updatedById bigint not null,
        constraint  OrgsPK primary key (id),
        constraint  OrgsUpdatedByFK foreign key (updatedById) references Users (id)
    );

    create table OrgMembers
    (
        orgId       bigint not null,
        userId      bigint not null,
        role        int not null,
        constraint  OrgMembersPK primary key (orgId, userId)
    );

    create table History
    (
        id          bigserial,
        at          timestamp(0) with time zone not null default 'now',
        resourceUrl varchar(256) not null,
        userId      bigint not null,
        change      text not null,
        oldValue    text,
        constraint  HistoryPK primary key (id),
        constraint  HistoryUserFK foreign key (userId) references Users (id)
    );

    create index HistoryResourceUrlIndex on History (resourceUrl asc, at desc);
    create index HistoryUserIndex on History (userId asc, at desc);

    perform CommitSchemaVersion(1, 'Added Users and History tables.');
end if;
end $$;

do $$
begin
if not HasSchemaVersion(2) then
    create table Jobs
    (
        id          bigserial,
        orgId       bigint,
        name        varchar(255) not null,
        active      boolean not null default false,
        archived    boolean not null default false,
        createdAt   timestamp(0) with time zone not null default 'now',
        updatedAt   timestamp(0) with time zone not null default 'now',
        updatedById bigint not null,
        startsAt    timestamp(2) with time zone,
        rrule       text,
        nextRunAt   timestamp(2) with time zone,
        constraint  JobsPK primary key (id),
        constraint  JobsOrgIdFK foreign key (orgId) references Orgs (id)
                    on delete cascade,
        constraint  JobsUpdatedByFK foreign key (updatedById) references Users (id)
    );

    create table JobTags
    (
        jobId       bigint not null,
        tag         varchar(32) not null,
        constraint  JobTagsPK primary key (jobId, tag),
        constraint  JobTagsJobsFK foreign key (jobId) references Jobs (id)
                    on delete cascade
    );

    create table Runs
    (
        id          bigserial,
        jobId       bigint not null,
        startedAt   timestamp(2) with time zone not null default 'now',
        status      integer not null,
        elapsed     interval not null,
        message     text,
        constraint  RunsPK primary key (id),
        constraint  RunsJobsFK foreign key (jobId) references Jobs (id)
                    on delete cascade
    );

    create table TaskTypes
    (
        id          bigserial,
        name        varchar(128) not null,
        constraint  TaskTypesPK primary key (id)
    );

    create unique index TaskTypesNameIndex on TaskTypes (lower(name));

    create table Tasks
    (
        id          bigserial,
        jobId       bigint not null,
        name        varchar(255) not null,
        active      boolean not null default true,
        position    integer not null,
        typeId      bigint not null,
        settings    json not null,
        timeout     interval not null,
        updatedAt   timestamp(0) with time zone not null default 'now',
        updatedById bigint not null,
        constraint  TasksPK primary key(id),
        constraint  TasksJobsFK foreign key (jobId) references Jobs (id)
                    on delete cascade,
        constraint  TasksTypeFK foreign key (typeId) references TaskTypes (id)
    );

    perform CommitSchemaVersion(2, 'Added jobs, tasks, runs tables.');
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

create or replace view UserOrgs as
    select o.*, m.userId, m.role
    from OrgMembers m join Orgs o on m.orgId = o.id;

create or replace view UserJobs as
    select j.*, m.userId, m.role
    from Jobs j join OrgMembers m on j.orgId = m.orgId;

create or replace view UserTags as
    select t.tag, m.userId, count(*) as jobCount
    from JobTags t join Jobs j on t.jobId = j.id
                   join OrgMembers m on j.orgId = m.orgId
    group by t.tag, m.userId;


