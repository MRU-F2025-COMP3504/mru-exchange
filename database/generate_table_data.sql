DO $$
DECLARE 
    i int8;
    first_name_list text[] := 
        ARRAY[
            'Phil','Nell','Angel','Francesca','Blaine','Anibal','Joey','Cory','Normand','Ruben',
            'Chandra','Russ','Stanton','Dorsey','Juliana','Saundra','Graham','Lindsay','Gary','Caitlin',
            'Chelsea','Beth','Jo','Benito','Marietta','Ada','Deanna','Sheena','Ashley','Danial',
            'Thad','Delia','Clifford','Domingo','Lucinda','Bianca','Lenny','Jewel','Edgardo','Mamie',
            'Marcie','Erna','Ali','Nanette','Edwardo','Samuel','Dana','Mandy','Silas','Percy',
            'Ivy','Ralph','Theo','Cassie','Jordan','Marcus','Elena','Tanya','Victor','Noel',
            'Grant','Hugh','Marlene','Dina','Rory','Drew','Amelia','Trent','Rita','Eli',
            'Wade','Max','Owen','Tess','Vivian','Joel','Felix','Caleb','Marsha','Kim',
            'Peter','Eleanor','Derek','Hailey','Trevor','Seth','Violet','Rosie','Logan','Ava',
            'Leo','Toby','Hannah','Mila','Jacob','Emily','Arthur','Hazel','Clara','Silvia'
        ];

    last_name_list text[] := 
        ARRAY[
            'Cowan','Rubio','Berry','Forbes','Johns','Serrano','Gould','Mullen','Hopkins','Rivas',
            'Carter','Thornton','Arellano','Mitchell','Quinn','Peters','Holland','Dickson','Schroeder','Mooney',
            'Hudson','West','Harrison','Murphy','Boyd','Montes','Landry','Macdonald','Pacheco','Carpenter',
            'Durham','Hamilton','Russell','Steele','Phillips','Tapia','Chambers','Gilmore','Hendrix','Shea',
            'Green','Stevenson','Faulkner','Buck','Austin','Franklin','Herman','Wiley','Preston','Bautista',
            'Valdez','Douglas','Jennings','Norman','Gibbs','Hines','Fletcher','Todd','Holmes','Bridges',
            'Watson','Page','Jennings','Moran','Owens','Barker','Harvey','Bennett','Rice','Armstrong',
            'Cross','Sparks','Sharp','Moss','Little','Love','Ball','Rhodes','Thorpe','Tucker',
            'Underwood','Townsend','Bush','Pruitt','Atkins','Hobbs','Perry','Davidson','Carr','Grant',
            'Keller','Burnett','Simon','Parsons','Baldwin','Barber','Patton','Newton','Webb','Pierce'
        ];
    fni int;
    lni int;
    fn text;
    ln text;
    full_name text;
BEGIN
  FOR i IN 0..90 LOOP
      fni := floor(random() * array_length(first_name_list, 1))::int + 1;
      lni := floor(random() * array_length(last_name_list, 1))::int + 1;
      fn := first_name_list[fni];
      ln := last_name_list[lni];
      full_name := concat(fn, ' ', ln);

      UPDATE mru_dev."User_Information"
      SET 
          first_name = fn,
          last_name  = ln,
          user_name  = full_name
      WHERE id = i + 19;
  END LOOP;
END $$ LANGUAGE plpgsql;



DO $$
DECLARE 
    i int8;
    category_names text[] := 
        ARRAY[
            'Books', 'Electronics', 'Supplies', 'Furniture', 'Apparel', 'Health', 'Pets & Animals', 'Automotive', 'Games', 'Miscellaneous'
        ];

    category_descriptions text[] := ARRAY[
    'Printed and digital books, magazines, and educational materials.',
    'Gadgets, devices, and accessories including phones, computers, and audio equipment.',
    'Office, school, and creative supplies for work, study, and personal projects.',
    'Home and office furniture including décor, lighting, and storage solutions.',
    'Clothing, shoes, and accessories.',
    'Products for wellness, fitness, and personal care.',
    'Food, toys, and accessories for pets and other animals.',
    'Vehicle parts, maintenance tools, and automotive accessories.',
    'Board games, video games, and recreational entertainment items.',
    'Items that don’t fit into other categories or are one-of-a-kind.'
    ];
BEGIN
  FOR i IN 1..10 LOOP
      UPDATE mru_dev."Category_Tags"
      SET 
          name = category_names[i],
          description = category_descriptions[i]
      WHERE id = i-1;
  END LOOP;
END $$ LANGUAGE plpgsql;



INSERT INTO mru_dev."Shopping_Cart"(user_id)
SELECT supabase_id as user_id
FROM mru_dev."User_Information";