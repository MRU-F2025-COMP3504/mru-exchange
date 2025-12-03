--get_chats_for_user
CREATE OR REPLACE VIEW public.get_chats_for_user 
  WITH (security_invoker = true) AS
SELECT 
  ui2.first_name first_name, 
  ui2.last_name last_name, 
  lm.logged_message last_message, 
  lm.created_at created_at
FROM mru_dev."Messages" m
JOIN mru_dev."Chats" c ON m.chat_id = c.id
JOIN mru_dev."User_Information" ui1 ON c.user_id_1 = ui1.supabase_id
JOIN mru_dev."User_Information" ui2 ON c.user_id_2 = ui2.supabase_id
LEFT JOIN LATERAL (
  SELECT m.logged_message, m.created_at
  FROM mru_dev."Messages" m
  WHERE m.chat_id = c.id
  ORDER BY m.created_at DESC
  LIMIT 1
) lm ON TRUE
WHERE ui1.supabase_id = auth.uid()
ORDER BY m.created_at DESC NULLS LAST;


--get_chat_messages_for_user
CREATE OR REPLACE VIEW public.get_chat_messages_for_user 
  WITH (security_invoker = true) AS
SELECT 
  m.logged_message logged_message, 
  m.created_at created_at,
  ui2.first_name first_name, 
  ui2.last_name last_name
FROM mru_dev."Messages" m
JOIN mru_dev."Chats" c ON m.chat_id = c.id
JOIN mru_dev."User_Information" ui1 ON c.user_id_1 = ui1.supabase_id
JOIN mru_dev."User_Information" ui2 ON c.user_id_2 = ui2.supabase_id
WHERE ui1.supabase_id = auth.uid()
ORDER BY m.created_at DESC NULLS LAST;


CREATE OR REPLACE VIEW public.get_list_of_products_for_user
  WITH (security_invoker = true) AS
SELECT 
    p.title title, 
    p.description description, 
    p.image image, 
    p.price price, 
    p.stock_count stock_count, 
    p.created_at created_at, 
    ct.name category
FROM mru_dev."Product_Information" p
JOIN mru_dev."User_Information" ui ON p.user_id = ui.supabase_id
JOIN mru."Category_Assigned_Products" cap ON p.id = cap.product_id
JOIN mru."Catagory_Tags" ct ON cap.category_id = ct.id;

CREATE OR REPLACE VIEW public.get_product_information_for_user
  WITH (security_invoker = true) AS
SELECT 
    p.title title, 
    p.description description, 
    p.image image, 
    p.price price, 
    p.stock_count stock_count, 
    p.created_at created_at, 
    ct.name category,
    ui.first_name first_name,
    ui.last_name last_name,
    ui.rating
FROM mru_dev."Products" p
JOIN mru_dev."User_Information" ui ON p.user_id = ui.supabase_id
JOIN mru."Category_Assigned_Products" cap ON p.id = cap.product_id
JOIN mru."Catagory_Tags" ct ON cap.category_id = ct.id;

CREATE OR REPLACE VIEW public.get_user_profile_information_for_user
  WITH (security_invoker = true) AS
SELECT 
    -- ui.supabase_id,
    ui.first_name first_name,
    ui.last_name last_name,
    ui.email email,
    ui.rating rating,
    ui.profile_image profile_image
FROM mru_dev."User_Information";

CREATE OR REPLACE VIEW public.get_shopping_cart_information_for_user
  WITH (security_invoker = true) AS
SELECT 
    -- sc.id,
    p.product_name product_name,
    p.product_price product_price,
    ui.supabase_id seller_id   
FROM "Shopping_Cart" sc
JOIN "Shopping_Cart_Products" scp ON sc.id = scp.shopping_cart_id
JOIN "Product_Information" p ON scp.product_id = p.id
JOIN "User Information" ui ON p.user_id = ui.supabase_id;

CREATE OR REPLACE VIEW public.get_reviews_created_on_user
  WITH (security_invoker = true) AS
SELECT 
    ui.first_name first_name,
    ui.last_name last_name,
    ui.rating primary_user_rating,
    rv.rating review_rating,
    p.product_name product_name,
    p.product_id product_id
FROM mru_dev."User_Information" ui
JOIN mru_dev."Reviews" rv ON ui.supabase_id = rv.created_on_id
JOIN mru."Products" p ON rv.product_id = p.id;

CREATE OR REPLACE VIEW public.get_reviews_created_by_user
  WITH (security_invoker = true) AS
SELECT 
    -- created_by.supabase_id,
    created_by.first_name created_by_first_name,
    created_by.last_name created_by_last_name,
    -- created_on.supabase_id,
    created_on.first_name created_on_first_name,
    created_on.last_name created_on_last_name,
    -- p.product_id,
    p.title product_title,
    rv.rating review_rating,
    rv.description review_message,
    rv.created_at
FROM mru_dev."Reviews" rv
JOIN mru_dev."User_Information" created_by ON rv.created_by_id = created_by.supabase_id
JOIN mru_dev."User_Information" created_on ON rv.created_on_id = created_on.supabase_id
JOIN mru_dev."Product_Information" p ON rv.product_id = p.id;

-- CREATE OR REPLACE VIEW public.get_reviews_for_product_for_user
--   WITH (security_invoker = true) AS
-- SELECT ;

CREATE OR REPLACE VIEW public.get_reports_created_for_user
  WITH (security_invoker = true) AS
SELECT 
    -- created_by.supabase_id,
    created_by.first_name created_by_first_name,
    created_by.last_name created_by_last_name,
    -- created_on.supabase_id,
    created_on.first_name created_on_first_name,
    created_on.last_name created_on_last_name,
    rp.description,
    rp.linked_information,
    rp.is_closed is_report_closed,
    rp.created_at created_date
FROM mru_dev."Reports" rp
JOIN mru_dev."User_Information" created_by ON rp.created_by_id = created_by.supabase_id
JOIN mru_dev."User_Information" created_on ON rp.created_on_id = created_on.supabase_id;

CREATE OR REPLACE VIEW public.get_category_tags_for_user
  WITH (security_invoker = true) AS
SELECT 
    -- cat.id id;
    cat.name name,
    cat.description description
FROM mru_dev."Category_Tags" cat;

CREATE OR REPLACE VIEW public.get_blocked_accounts_for_user
  WITH (security_invoker = true) AS
SELECT 
    -- ui.supabase_id,
    ui.first_name first_name,
    ui.last_name last_name
FROM mru_dev."User_Interactions" uInt
JOIN mru_dev."User_Information" ui
ON ((uInt.user_id_1 = auth.uid() AND uInt.user_id_2 = ui.supabase_id AND uInt.user_1_is_blocked = true) 
OR (uInt.user_id_2 = auth.uid() AND uInt.user_id_1 = ui.supabase_id AND uInt.user_2_is_blocked = true));
-- WHERE 
--     CASE 
--         WHEN uInt.user_id_1 = auth.uid() THEN uInt.user_1_is_blocked
--         ELSE uInt.user_2_is_blocked
--     END AS blocked_user;

CREATE OR REPLACE VIEW public.get_muted_accounts_for_user
  WITH (security_invoker = true) AS
SELECT 
    -- ui.supabase_id,
    ui.first_name first_name,
    ui.last_name last_name
FROM mru_dev."User_Interactions" uInt
JOIN mru_dev."User_Information" ui
ON ((uInt.user_id_1 = auth.uid() AND uInt.user_id_2 = ui.supabase_id AND uInt.user_1_is_muted = true) 
OR (uInt.user_id_2 = auth.uid() AND uInt.user_id_1 = ui.supabase_id AND uInt.user_2_is_muted = true));       
