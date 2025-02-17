drop trigger IF exists trigger_friend_request_approval on "public"."friend_requests";

drop function IF exists create_friendship_on_approval ();

-- Trigger Function to insert friendship when a friend request is approved
create or replace function create_friendship_on_approval () RETURNS TRIGGER as $$
BEGIN
    IF NEW.status = 'approved' THEN
        INSERT INTO friendships (child_1, child_2, created_at)
        VALUES (NEW.sender_id, NEW.reciever_id, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call function when friend_requests status changes to approved
create trigger trigger_friend_request_approval
after
update OF status on friend_requests for EACH row when (NEW.status = 'approved')
execute FUNCTION create_friendship_on_approval ();