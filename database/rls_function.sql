--Security Policy Functions
CREATE OR REPLACE FUNCTION mru_dev.is_user_interaction_blocked(user1 uuid, user2 uuid)
RETURNS BOOLEAN
LANGUAGE SQL
AS $$ 
SELECT EXISTS (
    SELECT 1
    FROM mru_dev."User_Interactions" uint
    WHERE (($1 = uint.user_id_1 AND $2 = uint.user_id_2)
        OR ($2 = uint.user_id_1 AND $1 = uint.user_id_2))
      AND NOT uint.user_1_is_blocked
      AND NOT uint.user_2_is_blocked
);
$$;

CREATE OR REPLACE FUNCTION mru_dev.compare_verified_users(user1 uuid, user2 uuid)
RETURNS BOOLEAN
LANGUAGE SQL
AS $$
SELECT
  cu.current_user IS NOT NULL 
  AND (user1 = cu.current_user OR user2 = cu.current_user)
FROM (SELECT auth.uid() AS current_user) AS cu;
$$;

CREATE OR REPLACE FUNCTION mru_dev.is_chat_visible_to_user(chat_row mru_dev."Chats")
RETURNS BOOLEAN
LANGUAGE SQL
AS $$
SELECT 
  ((chat_row.user_id_1 = auth.uid()) AND chat_row.visible_to_user_1) 
  OR ((chat_row.user_id_2 = auth.uid()) AND chat_row.visible_to_user_2)
$$;

-- Security Policy functions for the Product_Information table
CREATE OR replace FUNCTION rls_policy_wrappers.select_product_information(product_row mru_dev."Product_Information") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN RETURN 
  (product_row.user_id = (SELECT auth.uid()))
  OR product_row.isListed;
END;
$$;


-- Security Policy functions for the Chat table
CREATE OR replace FUNCTION rls_policy_wrappers.select_chats(chat_row mru_dev."Chats") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
  RETURN 
    mru_dev.compare_verified_users(chat_row.user_id_1, chat_row.user_id_2)
    AND is_chat_visible_to_user(chat_row);
END;
$$;

CREATE OR replace FUNCTION rls_policy_wrappers.is_chat_allowed_insert(user1 uuid, user2 uuid) 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
  RETURN
    mru_dev.compare_verified_users($1, $2)
    AND NOT mru_dev.is_user_interaction_blocked($1, $2);
END;
$$;

-- Security Policy functions for the Messages table
CREATE OR replace FUNCTION rls_policy_wrappers.select_messages(message_row mru_dev."Messages") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
RETURN EXISTS (
  SELECT 1
    FROM mru_dev."Chats" c
    WHERE c.id = message_row.chat_id
      AND mru_dev.compare_verified_users(c.user_id_1, c.user_id_1)
      AND message_row.visible
  );
END;
$$; -- Potentially change so if user blocks you, you can no longer hide messages


CREATE OR replace FUNCTION rls_policy_wrappers.insert_messages(message_row mru_dev."Messages") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN RETURN 
  EXISTS (
        SELECT 1
        FROM mru_dev."Chats" c
        WHERE c.id = message_row.chat_id
          AND mru_dev.compare_verified_users(c.user_id_1, c.user_id_1)
          AND NOT mru_dev.is_user_interaction_blocked(c.user_id_1, c.user_id_1)
    );
END;
$$;

CREATE OR replace FUNCTION rls_policy_wrappers.update_messages(message_row mru_dev."Messages") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN RETURN 
  (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM mru_dev."Chats" c
      WHERE c.id = message_row.chat_id
        AND (SELECT mru_dev.compare_verified_users(c.user_id_1, c.user_id_2))
    )
  );
END;
$$;


CREATE OR replace FUNCTION rls_policy_wrappers.update_reports(report_row mru_dev."Reports") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
RETURN 
    mru_dev.compare_verified_users(report_row.created_by_id, report_row.created_on_id)
    AND report_row.created_by_id = (SELECT auth.uid());
END;
$$;


-- Security Policy functions for the Reviews table
CREATE OR replace FUNCTION rls_policy_wrappers.select_reviews(review_row mru_dev."Reviews") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
  RETURN EXISTS (
    SELECT 1
    FROM mru_dev."Products" p
    WHERE review_row.product_id = p.product_id
  );
END;
$$;

CREATE OR replace FUNCTION rls_policy_wrappers.insert_reviews(review_row mru_dev."Reviews") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
  RETURN EXISTS (
    SELECT 1
    FROM mru_dev."Products" p
    WHERE review_row.product_id = p.product_id
    AND mru_dev.compare_verified_users(review_row.created_by_id, review_row.created_on_id)
  );
END;
$$;

CREATE OR replace FUNCTION rls_policy_wrappers.update_reviews(review_row mru_dev."Reviews") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
RETURN 
    mru_dev.compare_verified_users(review_row.created_by_id, review_row.created_on_id)
    AND review_row.created_by_id = (SELECT auth.uid());
END;
$$;


-- Security Policy functions for the Category_Assigned_Products table
CREATE OR replace FUNCTION rls_policy_wrappers.select_category_assigned_products(cap_row mru_dev."Category_Assigned_Products") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
  RETURN EXISTS (
    SELECT 1
    FROM mru_dev."Products" p
    WHERE p.product_id = cap_row.product_id
  );
END;
$$;

CREATE OR replace FUNCTION rls_policy_wrappers.change_category_assigned_products(cap_row mru_dev."Category_Assigned_Products") 
RETURNS BOOLEAN 
language plpgsql
AS $$
BEGIN 
  RETURN EXISTS (
    SELECT 1
    FROM mru_dev."Products" p
    WHERE p.product_id = cap_row.product_id
      AND p.user_id = (SELECT auth.uid())
);
END;
$$;