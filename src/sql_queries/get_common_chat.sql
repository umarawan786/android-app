-- drop function if exists get_common_chat (uuid[]);

create or replace function get_common_chat (user_ids UUID[]) RETURNS UUID as $$
DECLARE
    common_chat UUID;
BEGIN
    -- Find a chat_id where all given user_ids are present
    SELECT chat_id
    INTO common_chat
    FROM chat_participants
    WHERE user_id = ANY(user_ids)  -- Filter rows that contain these users
    GROUP BY chat_id
    HAVING COUNT(DISTINCT user_id) = array_length(user_ids, 1)  -- Ensure all users exist in the same chat
    LIMIT 1;  -- In case multiple exist, just return one

    RETURN common_chat;  -- Returns the chat_id if found, otherwise NULL
END;
$$ LANGUAGE plpgsql;