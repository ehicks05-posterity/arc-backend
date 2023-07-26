set search_path = arc;

-- CreateFunction
CREATE OR REPLACE FUNCTION getAgeInHours(dt timestamptz) RETURNS integer AS $$
	BEGIN
		RETURN (EXTRACT(EPOCH FROM (now() - dt)) / 60 / 60);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION getNetVotes(id text) RETURNS integer AS $$
	DECLARE
		netVotes integer = 0;
	BEGIN
		netVotes = (select sum(direction) from user_post_vote where post_id = id);
		RETURN coalesce(netVotes, 0);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION getCommentNetVotes(id text) RETURNS integer AS $$
	DECLARE
		netVotes integer = 0;
	BEGIN
		netVotes = (select sum(direction) from user_comment_vote where comment_id = id);
		RETURN coalesce(netVotes, 0);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION getScore(id text, createdAt timestamptz) RETURNS real AS $$
	BEGIN
		RETURN getNetVotes(id) / ((getAgeInHours(createdAt) + 2) ^ 1.5);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION getCommentScore(id text, createdAt timestamptz) RETURNS real AS $$
	BEGIN
		RETURN getCommentNetVotes(id) / ((getAgeInHours(createdAt) + 2) ^ 1.5);
	END;
$$ LANGUAGE plpgsql;

-- CreateProcedure
CREATE OR REPLACE PROCEDURE updateScore() AS $$
	BEGIN
		update post set net_votes=coalesce(getNetVotes("id", "createdAt"), 0);
		update post set score=coalesce(getScore("id", "createdAt"), 0);
		update comment set net_votes=coalesce(getCommentNetVotes("id", "createdAt"), 0);
		update comment set score=coalesce(getCommentScore("id", "createdAt"), 0);
	END;
$$ LANGUAGE plpgsql;

-- inserts a row into users
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = arc
as $$
begin
  insert into users (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created_for_arc
  after insert on auth.users
  for each row execute procedure arc.handle_new_user();

select cron.schedule (
    'update-scores', -- name of the cron job
    '* * * * *', -- every minute

    $$ call arc.updatescore(); $$
);