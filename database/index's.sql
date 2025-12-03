CREATE INDEX category_assigned_products_product_id_index ON mru_dev."Category_Assigned_Products" USING btree (product_id);

CREATE INDEX chats_user_id_1_index ON mru_dev."Chats" USING btree (user_id_1);
CREATE INDEX chats_user_id_2_index ON mru_dev."Chats" USING btree (user_id_2);

CREATE INDEX messages_chat_id_index ON mru_dev."Messages" USING btree (chat_id);
CREATE INDEX messages_sender_id_index ON mru_dev."Messages" USING btree (sender_id);

CREATE INDEX product_information_user_id_index ON mru_dev."Product_Information" USING btree (user_id);

CREATE INDEX reports_created_by_id_index ON mru_dev."Reports" USING btree (created_by_id);
CREATE INDEX reports_created_on_id_index ON mru_dev."Reports" USING btree (created_on_id);

CREATE INDEX reviews_created_by_id_index ON mru_dev."Reviews" USING btree (created_by_id);
CREATE INDEX reviews_created_on_id_index ON mru_dev."Reviews" USING btree (created_on_id);
CREATE INDEX reviews_product_id_index ON mru_dev."Reviews" USING btree (product_id);

CREATE INDEX shopping_cart_user_id_index ON mru_dev."Shopping_Cart" USING btree (user_id);
CREATE INDEX shopping_cart_product_id_index ON mru_dev."Shopping_Cart" USING btree (product_id);

CREATE INDEX user_interactions_user_id_2_index ON mru_dev."User_Interactions" USING btree (user_id_2);

CREATE INDEX shopping_cart_products_product_id_index ON mru_dev."Shopping_Cart_Products" USING btree (product_id);