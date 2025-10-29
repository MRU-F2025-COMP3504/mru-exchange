-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE mru_dev.Catagory_Assigned_Products (
  category_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Catagory_Assigned_Products_pkey PRIMARY KEY (product_id, category_id),
  CONSTRAINT Catagory_Assigned_Products_product_id_fkey FOREIGN KEY (product_id) REFERENCES mru_dev.Product_Information(id),
  CONSTRAINT Catagory_Assigned_Products_category_id_fkey FOREIGN KEY (category_id) REFERENCES mru_dev.Catagory_Tags(id)
);

CREATE TABLE mru_dev.Catagory_Tags (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying,
  description character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Catagory_Tags_pkey PRIMARY KEY (id)
);

CREATE TABLE mru_dev.Chats (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id_1 bigint,
  user_id_2 bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Chats_pkey PRIMARY KEY (id),
  CONSTRAINT Chats_user_id_1_fkey FOREIGN KEY (user_id_1) REFERENCES mru_dev.User_Information(id),
  CONSTRAINT Chats_user_id_2_fkey FOREIGN KEY (user_id_2) REFERENCES mru_dev.User_Information(id)
);

CREATE TABLE mru_dev.Messages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  chat_id bigint,
  logged_message character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT Messages_pkey PRIMARY KEY (id),
  CONSTRAINT Messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES mru_dev.Chats(id)
);

CREATE TABLE mru_dev.Product_Information (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id bigint,
  product_title character varying,
  product_description character varying,
  CONSTRAINT Product_Information_pkey PRIMARY KEY (id),
  CONSTRAINT Product_Information_user_id_fkey FOREIGN KEY (user_id) REFERENCES mru_dev.User_Information(id)
);

CREATE TABLE mru_dev.Reports (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_by_id bigint,
  created_on_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  closed_date date,
  is_closesd boolean DEFAULT false,
  LinkedInformation character varying,
  CONSTRAINT Reports_pkey PRIMARY KEY (id),
  CONSTRAINT Reports_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES mru_dev.User_Information(id),
  CONSTRAINT Reports_created_on_id_fkey FOREIGN KEY (created_on_id) REFERENCES mru_dev.User_Information(id)
);

CREATE TABLE mru_dev.Reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_by_id bigint,
  created_on_id bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  product_id bigint,
  rating real,
  description character varying,
  CONSTRAINT Reviews_pkey PRIMARY KEY (id),
  CONSTRAINT Reviews_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES mru_dev.User_Information(id),
  CONSTRAINT Reviews_created_on_id_fkey FOREIGN KEY (created_on_id) REFERENCES mru_dev.User_Information(id),
  CONSTRAINT Reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES mru_dev.Product_Information(id)
);

CREATE TABLE mru_dev.User_Information (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  first_name character varying,
  last_name character varying,
  email character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_on date,
  is_deleted boolean DEFAULT false,
  is_flagged boolean DEFAULT false,
  flagged_type character varying,
  CONSTRAINT User_Information_pkey PRIMARY KEY (id)
);