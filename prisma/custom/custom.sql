-- CreateFunction
CREATE OR REPLACE FUNCTION arc.getAgeInHours(dt timestamptz) RETURNS integer AS $$
	BEGIN
		RETURN (EXTRACT(EPOCH FROM (now() - dt)) / 60 / 60);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION arc.getNetVotes(id text) RETURNS integer AS $$
	DECLARE
		netVotes integer = 0;
	BEGIN
		netVotes = (select sum(direction) from arc.user_post_vote where post_id = id);
		RETURN coalesce(netVotes, 0);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION arc.getCommentNetVotes(id text) RETURNS integer AS $$
	DECLARE
		netVotes integer = 0;
	BEGIN
		netVotes = (select sum(direction) from arc.user_comment_vote where comment_id = id);
		RETURN coalesce(netVotes, 0);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION arc.getScore(id text, createdAt timestamptz) RETURNS real AS $$
	BEGIN
		RETURN arc.getNetVotes(id) / ((arc.getAgeInHours(createdAt) + 2) ^ 1.5);
	END;
$$ LANGUAGE plpgsql;

-- CreateFunction
CREATE OR REPLACE FUNCTION arc.getCommentScore(id text, createdAt timestamptz) RETURNS real AS $$
	BEGIN
		RETURN arc.getCommentNetVotes(id) / ((arc.getAgeInHours(createdAt) + 2) ^ 1.5);
	END;
$$ LANGUAGE plpgsql;

-- CreateProcedure
CREATE OR REPLACE PROCEDURE arc.updateScore() AS $$
	BEGIN
		update arc.post set net_votes=coalesce(arc.getNetVotes("id", "createdAt"), 0);
		update arc.post set score=coalesce(arc.getScore("id", "createdAt"), 0);
		update arc.comment set net_votes=coalesce(arc.getCommentNetVotes("id", "createdAt"), 0);
		update arc.comment set score=coalesce(arc.getCommentScore("id", "createdAt"), 0);
	END;
$$ LANGUAGE plpgsql;

-- inserts a row into arc.users
create function arc.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = arc
as $$
begin
  insert into arc.users (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created_for_arc
  after insert on auth.users
  for each row execute procedure arc.handle_new_user();

-- select cron.schedule (
--     'update-scores', -- name of the cron job
--     '* * * * *', -- every minute

--     $$ call arc.updatescore(); $$
-- );