------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the User_Information table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read their user information"
ON mru_dev."User_Information";
DROP POLICY IF EXISTS "allow users to insert new user information"
ON mru_dev."User_Information";
DROP POLICY IF EXISTS "allow users to update their user information"
ON mru_dev."User_Information";

CREATE POLICY "users can read their user information"
ON mru_dev."User_Information"
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = supabase_id);

CREATE POLICY "allow users to insert new user information"
ON mru_dev."User_Information"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = supabase_id);

CREATE POLICY "allow users to update their user information"
ON mru_dev."User_Information"
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = supabase_id)
WITH CHECK((SELECT auth.uid()) = supabase_id);

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Product_Information table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read their product information"
ON mru_dev."Product_Information";
DROP POLICY IF EXISTS "allow users to insert new product information"
ON mru_dev."Product_Information";
DROP POLICY IF EXISTS "allow users to update information of their products"
ON mru_dev."Product_Information";

CREATE POLICY "users can read their product information"
ON mru_dev."Product_Information"
FOR SELECT
TO authenticated
USING ((SELECT rls_policy_wrappers.select_product_information("Product_Information")));

CREATE POLICY "allow users to insert new product information"
ON mru_dev."Product_Information"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid() = user_id));

CREATE POLICY "allow users to update information of their products"
ON mru_dev."Product_Information"
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid() = user_id))
WITH CHECK((SELECT auth.uid() = user_id));

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policies for the Chats table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can select chats"
ON mru_dev."Chats";
DROP POLICY IF EXISTS "allow user to create new chats"
ON mru_dev."Chats";
DROP POLICY IF EXISTS "allow users to update chats on their chat page"
ON mru_dev."Chats";

CREATE POLICY "users can select chats"
ON mru_dev."Chats"
FOR SELECT
TO authenticated
USING ((SELECT rls_policy_wrappers.select_chats("Chats")));

CREATE POLICY "allow user to create new chats"
ON mru_dev."Chats"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT rls_policy_wrappers.is_chat_allowed_insert("Chats".user_id_1, "Chats".user_id_2)));

CREATE POLICY "allow users to update chats on their chat page"
ON mru_dev."Chats"
FOR UPDATE
TO authenticated
USING ((SELECT mru_dev.is_chat_visible_to_user("Chats")))
WITH CHECK ((SELECT mru_dev.compare_verified_users("Chats".user_id_1, "Chats".user_id_2)));

    -- ((SELECT auth.uid() = user_id_1) AND NOT (SELECT visible_to_user_1))
    -- OR ((SELECT auth.uid() = user_id_2) AND NOT (SELECT visible_to_user_2))

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Messages table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read messages from their chats"
ON mru_dev."Messages";
DROP POLICY IF EXISTS "allow users to insert messages in current chat"
ON mru_dev."Messages";
DROP POLICY IF EXISTS "allow users to update their messages in current chat"
ON mru_dev."Messages";

-- will delete message from current chat but keep it stored in the database
CREATE POLICY "users can read messages from their chats"
ON mru_dev."Messages"
FOR SELECT
TO authenticated
USING ((SELECT rls_policy_wrappers.select_messages("Messages")));

CREATE POLICY "allow users to insert messages in current chat"
ON mru_dev."Messages"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT rls_policy_wrappers.insert_messages("Messages")));

CREATE POLICY "allow users to update their messages in current chat"
ON mru_dev."Messages"
FOR UPDATE
TO authenticated
USING ((SELECT rls_policy_wrappers.update_messages("Messages")))
WITH CHECK((SELECT auth.uid() = sender_id));

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Reports table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read their created reports"
ON mru_dev."Reports";
DROP POLICY IF EXISTS "allow users to insert new reports"
ON mru_dev."Reports";
DROP POLICY IF EXISTS "allow users to update their previous reports"
ON mru_dev."Reports";

CREATE POLICY "users can read their created reports"
ON mru_dev."Reports"
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() = "Reports".created_by_id));

CREATE POLICY "allow users to insert new reports"
ON mru_dev."Reports"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT mru_dev.compare_verified_users("Reports".created_by_id, "Reports".created_on_id)));

CREATE POLICY "allow users to update their previous reports"
ON mru_dev."Reports"
FOR UPDATE
TO authenticated
USING ((SELECT rls_policy_wrappers.update_reports("Reports")))
WITH CHECK ((SELECT mru_dev.compare_verified_users("Reports".created_by_id, "Reports".created_on_id)));

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Reviews table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read reviews"
ON mru_dev."Reviews";
DROP POLICY IF EXISTS "allow users to insert new reviews"
ON mru_dev."Reviews";
DROP POLICY IF EXISTS "allow users to update their reviews"
ON mru_dev."Reviews";

CREATE POLICY "users can read reviews"
ON mru_dev."Reviews"
FOR SELECT
TO authenticated
USING ((SELECT rls_policy_wrappers.select_reviews("Reviews")));

CREATE POLICY "allow users to insert new reviews"
ON mru_dev."Reviews"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT rls_policy_wrappers.insert_reviews("Reviews")));

CREATE POLICY "allow users to update their reviews"
ON mru_dev."Reviews"
FOR UPDATE
TO authenticated
USING ((SELECT rls_policy_wrappers.update_reviews("Reviews")))
WITH CHECK((SELECT mru_dev.compare_verified_users("Reviews".created_by_id, "Reviews".created_on_id)));

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Shopping_Cart table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read their shopping cart"
ON mru_dev."Shopping_Cart";
DROP POLICY IF EXISTS "allow users to insert new products into their shopping cart"
ON mru_dev."Shopping_Cart";
DROP POLICY IF EXISTS "allow users to update their shopping cart items"
ON mru_dev."Shopping_Cart";
DROP POLICY IF EXISTS "users can delete products from their shopping cart"
ON mru_dev."Shopping_Cart";

CREATE POLICY "users can read their shopping cart"
ON mru_dev."Shopping_Cart"
FOR SELECT
TO authenticated
USING ((SELECT auth.uid() = user_id));

CREATE POLICY "allow users to insert new products into their shopping cart"
ON mru_dev."Shopping_Cart"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid() = user_id));

CREATE POLICY "allow users to update their shopping cart items"
ON mru_dev."Shopping_Cart"
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid() = user_id))
WITH CHECK((SELECT auth.uid() = user_id));

CREATE POLICY "users can delete products from their shopping cart"
ON mru_dev."Shopping_Cart"
FOR DELETE
TO authenticated
USING ((SELECT auth.uid() = user_id));

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the User_Interactions table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read their blocked and muted accounts"
ON mru_dev."User_Interactions";
DROP POLICY IF EXISTS "allow users to insert new blocked and muted accounts"
ON mru_dev."User_Interactions";
DROP POLICY IF EXISTS "allow users to update their blocked and muted accounts"
ON mru_dev."User_Interactions";

CREATE POLICY "users can read their blocked and muted accounts"
ON mru_dev."User_Interactions"
FOR SELECT
TO authenticated
USING ((SELECT mru_dev.compare_verified_users("User_Interactions".user_id_1, "User_Interactions".user_id_2)));

CREATE POLICY "allow users to insert new blocked and muted accounts"
ON mru_dev."User_Interactions"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT mru_dev.compare_verified_users("User_Interactions".user_id_1, "User_Interactions".user_id_2)));

CREATE POLICY "allow users to update their blocked and muted accounts"
ON mru_dev."User_Interactions"
FOR UPDATE
TO authenticated
USING ((SELECT mru_dev.compare_verified_users("User_Interactions".user_id_1, "User_Interactions".user_id_2)))
WITH CHECK((SELECT mru_dev.compare_verified_users("User_Interactions".user_id_1, "User_Interactions".user_id_2)));

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Category_Tags table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read the category tags"
ON mru_dev."Catagory_Tags";
DROP POLICY IF EXISTS "allow authorized users to insert new category tags"
ON mru_dev."Catagory_Tags";
DROP POLICY IF EXISTS "allow authorized users to update category tags"
ON mru_dev."Catagory_Tags";
DROP POLICY IF EXISTS "allow authorized users to delete category tags"
ON mru_dev."Catagory_Tags";

CREATE POLICY "users can read the category tags"
ON mru_dev."Catagory_Tags"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow authorized users to insert new category tags"
ON mru_dev."Catagory_Tags"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "allow authorized users to update category tags"
ON mru_dev."Catagory_Tags"
FOR UPDATE
TO authenticated
USING ((SELECT auth.jwt() ->> 'role') = 'admin')
WITH CHECK((SELECT auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "allow authorized users to delete category tags"
ON mru_dev."Catagory_Tags"
FOR DELETE
TO authenticated
USING ((SELECT auth.jwt() ->> 'role') = 'admin');

------------------------------------------------------------------------------------------------------------------


------------------------------------------------------------------------------------------------------------------
-- Security Policy functions for the Category_Assigned_Products table
------------------------------------------------------------------------------------------------------------------
DROP POLICY IF EXISTS "users can read the category tags assigned onto products"
ON mru_dev."Catagory_Assigned_Products";
DROP POLICY IF EXISTS "allow users to insert category assigments onto products"
ON mru_dev."Catagory_Assigned_Products";
DROP POLICY IF EXISTS "allow users to update category assigments on products"
ON mru_dev."Catagory_Assigned_Products";
DROP POLICY IF EXISTS "allow users to delete category assigments from products"
ON mru_dev."Catagory_Assigned_Products";

CREATE POLICY "users can read the category tags assigned onto products"
ON mru_dev."Catagory_Assigned_Products"
FOR SELECT
TO authenticated
USING ((SELECT rls_policy_wrappers.select_category_assigned_products("Catagory_Assigned_Products")));

CREATE POLICY "allow users to insert category assigments onto products"
ON mru_dev."Catagory_Assigned_Products"
FOR INSERT
TO authenticated
WITH CHECK ((SELECT rls_policy_wrappers.change_category_assigned_products("Catagory_Assigned_Products")));

CREATE POLICY "allow users to update category assigments on products"
ON mru_dev."Catagory_Assigned_Products"
FOR UPDATE
TO authenticated
USING ((SELECT rls_policy_wrappers.change_category_assigned_products("Catagory_Assigned_Products")));
WITH CHECK ((SELECT rls_policy_wrappers.change_category_assigned_products("Catagory_Assigned_Products")));

CREATE POLICY "allow users to delete category assigments from products"
ON mru_dev."Catagory_Assigned_Products"
FOR DELETE
TO authenticated
USING ((SELECT rls_policy_wrappers.change_category_assigned_products("Catagory_Assigned_Products")));

------------------------------------------------------------------------------------------------------------------