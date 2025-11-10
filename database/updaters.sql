CREATE OR REPLACE FUNCTION mru_dev.update_user_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = mru_dev
AS $$
DECLARE 
  average_rating float4;
BEGIN
  SELECT AVG(rating) INTO average_rating FROM mru_dev."Reviews" WHERE created_on_id=new.created_on_id;
  update mru_dev."User_Information"
  SET rating = average_rating
  WHERE supabase_id = new.created_on_id;

  RETURN new;
END;
$$;