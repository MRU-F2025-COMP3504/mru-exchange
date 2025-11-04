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