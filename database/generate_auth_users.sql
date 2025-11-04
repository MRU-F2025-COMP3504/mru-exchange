CREATE OR REPLACE FUNCTION mru_test.generatePassword()
RETURNS varchar AS $$
DECLARE 
    char_list varchar;
    password varchar;
    single char;
BEGIN
    char_list := 'abcdefghijklmnopqrstuvwxyz1234567890';
    password := '';
    FOR i IN 1..12 LOOP 
        single := substr(char_list, floor(random() * length(char_list) +1), 1);
        password := password || single;
    END LOOP;
RETURN password;
END;
$$ LANGUAGE plpgsql;


-- generates authenticated users
CREATE OR REPLACE FUNCTION mru_test.generate_false_user(email text, password text)
RETURNS uuid AS $$
declare
    user_id uuid;
    encrypted_pw text;
BEGIN
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password, gen_salt('bf', 12));

INSERT INTO auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES
    ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), '', '', '', '');
  
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES
    (gen_random_uuid(), user_id, user_id,
        jsonb_build_object('sub', user_id::text, 'email', email),
        'email', NOW(), NOW(), NOW());
RETURN user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mru_test.generate_users(start int8, num_users int8)
RETURNS void AS $$
DECLARE 
    i int8;
BEGIN
    num_users := num_users + start;
    FOR i IN start..num_users LOOP
        PERFORM mru_test.generate_false_user(format('testuser%s@mtroyal.ca', i), mru_test.generatepassword());
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mru_test.generate_users(start int8, num_users int8)
RETURNS void AS $$
DECLARE 
    i int8;
BEGIN
    num_users := num_users + start;
    FOR i IN start..num_users LOOP
        PERFORM mru_test.generate_false_user(format('testuser%s@mtroyal.ca', i), mru_test.generatepassword());
    END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT mru_test.generate_users(11, 89);



CREATE OR REPLACE FUNCTION mru_dev.handle_mru_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mru_dev, auth
AS $$
BEGIN
  insert into mru_dev."User_Information"(supabase_id, email, first_name, last_name)
  values(
    new.id,
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name')
    on conflict (email)
    do update set supabase_id = new.id;
    return new;
END;
$$;
