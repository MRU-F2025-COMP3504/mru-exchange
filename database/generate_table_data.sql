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



INSERT INTO mru_dev."Product_Information" (title, description, price, stock_count, cat) VALUES
-- Books 20
('PSYC 1101 Textbook (8th Ed.)', 'Used for one semester, no markings except one coffee stain on page 42.', 35.00, 1, 'Books'),
('MATH 2303 Linear Algebra Notes + Book', 'Has highlights but super helpful margin notes.', 25.00, 1, 'Books'),
('Intro to Sociology Text', 'Required for first year — don’t pay full price like I did.', 20.00, 1, 'Books'),
('Economics 101: Principles of Micro', 'A little bent cover, otherwise fine.', 30.00, 1, 'Books'),
('Stats for Data Science (Loose Leaf)', 'Binder ready, includes formula sheet.', 18.00, 1, 'Books'),
('English 2200 Poetry Anthology', 'Dog-eared pages but all readable.', 10.00, 1, 'Books'),
('Chem 120 Lab Manual', 'Light chemical smell (don’t ask).', 12.00, 1, 'Books'),
('Computer Science 101 Text', 'Slightly outdated but still good for algorithms.', 22.00, 1, 'Books'),
('Psych 102 Textbook', 'Bought new, barely opened.', 40.00, 1, 'Books'),
('Business Law Textbook', 'Good condition, some notes in pencil.', 28.00, 1, 'Books'),
('French 201 Workbook', 'A few exercises done, answers erased. ', 15.00, 1, 'Books'),
('Philosophy of Mind', 'Really interesting read if you’re into that stuff.', 14.00, 1, 'Books'),
('Stats & Probability Text', 'No code examples sadly.', 20.00, 1, 'Books'),
('CS 250 Algorithms', 'Old edition but still covers same stuff.', 25.00, 1, 'Books'),
('Intro to Linguistics', 'Honestly kinda fun to read.', 12.00, 1, 'Books'),
('Biology 101: Concepts and Connections', 'Used in Fall 2024. Good condition.', 27.00, 1, 'Books'),
('Calculus I Text ', 'Writing in pencil, used in class. ', 22.00, 1, 'Books'),
('History 120 Textbook', 'Some doodles in the margins.', 15.00, 1, 'Books'),
('Marketing 101', 'Used copy, minor wear.', 18.00, 1, 'Books'),
('Criminology Basics', 'Highlighted chapters 2–5. ', 20.00, 1, 'Books'),
('Calculus I Textbook (Stewart)', 'Used but still good condition, a few highlights.', 25.00, 1, 'Books'),
('Intro to Psychology (OpenStax)', 'Clean copy, no writing, perfect for PSYC 1101.', 15.00, 1, 'Books'),
('Business Statistics Workbook', 'Slightly bent cover, still usable.', 8.00, 1, 'Books'),
('Linear Algebra for Data Science', 'No notes inside, looks new.', 30.00, 1, 'Books'),
('Organic Chemistry 2nd Edition', 'A bit worn, includes some doodles.', 10.00, 1, 'Books'),
('Macroeconomics (Krugman)', 'Has a few coffee stains, readable.', 12.00, 1, 'Books'),
('Discrete Math Textbook', 'Good condition, includes practice questions.', 20.00, 1, 'Books'),
('Biology 101 Lab Manual', 'Torn corner but complete.', 5.00, 1, 'Books'),
('Canadian History Reader', 'Barely used, still smells new.', 10.00, 1, 'Books'),
('Physics for Engineers', 'Used for two semesters, still fine.', 25.00, 1, 'Books'),
('Modern Poetry Anthology', 'Dog-eared pages, great for ENG 201.', 6.00, 1, 'Books'),
('Database Systems Concepts', 'Slightly worn edges, no tears.', 22.00, 1, 'Books'),
('Java Programming Guide', 'Old edition but still relevant.', 8.00, 1, 'Books'),
('Sociology in Canada', 'Like new, barely touched.', 14.00, 1, 'Books'),
('Ethics and Society Reader', 'Used for PHIL 101, good shape.', 9.00, 1, 'Books'),
('Microeconomics Textbook', 'Some highlighting, clean otherwise.', 10.00, 1, 'Books'),
('Intro to Accounting (Weygandt)', 'Great starter book for BUS 200.', 18.00, 1, 'Books'),
('Statistics for Life Sciences', 'Slightly used, no missing pages.', 12.00, 1, 'Books'),
('English Grammar Handbook', 'Minimal notes, cover intact.', 5.00, 1, 'Books'),
('Data Structures in Python', 'Well used but intact.', 15.00, 1, 'Books'),

-- Electronics 20
('Used Laptop Charger', 'Works fine, fits most HP laptops.', 10.00, 1, 'Electronics'),
('Wireless Mouse', 'Barely used, batteries included.', 7.00, 1, 'Electronics'),
('Bluetooth Speaker', 'Loud, battery lasts ~5 hours.', 15.00, 1, 'Electronics'),
('Monitor 24-inch', 'Works great, no dead pixels.', 40.00, 1, 'Electronics'),
('Keyboard (Mechanical)', 'RGB lights still work.', 25.00, 1, 'Electronics'),
('Phone Charger (USB-C)', 'New in package.', 5.00, 1, 'Electronics'),
('Laptop Stand', 'Metal frame, adjustable height.', 10.00, 1, 'Electronics'),
('Old iPad (2016)', 'Still runs Netflix.', 30.00, 1, 'Electronics'),
('Headphones (Over-ear)', 'Good sound, minor scratches.', 12.00, 1, 'Electronics'),
('HDMI Cable (2m)', 'Works fine.', 3.00, 1, 'Electronics'),
('External Hard Drive 500GB', 'Formatted and ready.', 20.00, 1, 'Electronics'),
('USB Flash Drive 64GB', 'Works fine, clean.', 8.00, 1, 'Electronics'),
('Wireless Earbuds', 'Left ear slightly quieter.', 10.00, 1, 'Electronics'),
('Smartwatch (Used)', 'Battery lasts one day.', 15.00, 1, 'Electronics'),
('Laptop Cooling Pad', 'All fans working.', 6.00, 1, 'Electronics'),
('Phone Tripod', 'Good for filming TikToks.', 5.00, 1, 'Electronics'),
('HD Webcam', 'Works fine for Zoom.', 12.00, 1, 'Electronics'),
('Power Bank 10,000mAh', 'Charges twice, solid condition.', 10.00, 1, 'Electronics'),
('Keyboard & Mouse Combo', 'Used once for a project.', 15.00, 1, 'Electronics'),
('Ethernet Cable (15ft)', 'No damage.', 4.00, 1, 'Electronics'),

-- Supplies 20
('Notebook (5-Pack)', 'College ruled, unused.', 10.00, 1, 'Supplies'),
('Binder (2-inch)', 'Clean and sturdy.', 3.00, 1, 'Supplies'),
('Highlighter Set', 'Used lightly.', 4.00, 1, 'Supplies'),
('Mechanical Pencils', 'Pack of 6, all working.', 3.00, 1, 'Supplies'),
('Stapler + Staples', 'Small desk stapler, works.', 5.00, 1, 'Supplies'),
('Index Cards (100-pack)', 'Unopened.', 2.00, 1, 'Supplies'),
('Calculator (TI-84)', 'Used, fully working.', 25.00, 1, 'Supplies'),
('Whiteboard Markers', 'Assorted colors.', 4.00, 1, 'Supplies'),
('Erasers (Set of 3)', 'Clean, unused.', 1.50, 1, 'Supplies'),
('Ruler (Metal)', '30cm, straight.', 1.00, 1, 'Supplies'),
('Sticky Notes', 'Full stack, yellow.', 2.00, 1, 'Supplies'),
('Backpack', 'Few pen marks inside.', 8.00, 1, 'Supplies'),
('Desk Organizer', 'Good for pens and notes.', 6.00, 1, 'Supplies'),
('Printer Paper (Ream)', 'Unopened 500 sheets.', 5.00, 1, 'Supplies'),
('USB Drive 32GB', 'Used for class projects.', 5.00, 1, 'Supplies'),
('Graph Paper Pad', 'Half used.', 2.00, 1, 'Supplies'),
('Glue Sticks (3-pack)', 'New.', 3.00, 1, 'Supplies'),
('Scissors', 'Sharp, no rust.', 2.00, 1, 'Supplies'),
('Pen Set (10-Pack)', 'Writes smoothly.', 3.00, 1, 'Supplies'),
('Notebook Dividers', 'Still sealed.', 2.50, 1, 'Supplies'),

-- Furniture 10
('Desk with wobbly leg', 'Works fine once against the wall.', 15.00, 1, 'Furniture'),
('IKEA Chair (Used)', 'Slightly squeaky, still comfy.', 10.00, 1, 'Furniture'),
('Small Bookshelf', 'Holds about 20 books, no damage.', 12.00, 1, 'Furniture'),
('Dorm Couch (Free if you pick up)', 'Bit worn but no smells.', 0.00, 1, 'Furniture'),
('Standing Lamp', 'Works, bulb included.', 8.00, 1, 'Furniture'),
('Mini Coffee Table', 'Great for laptops or ramen bowls.', 10.00, 1, 'Furniture'),
('Bedside Table', 'One drawer missing knob.', 5.00, 1, 'Furniture'),
('Office Chair', 'Hydraulic works, some wear.', 20.00, 1, 'Furniture'),
('Plastic Drawer Set', '3 drawers, decent shape.', 7.00, 1, 'Furniture'),
('Desk Lamp', 'Has USB plug, works fine.', 6.00, 1, 'Furniture'),

-- apperal 10
('Hoodie (MRU logo)', 'Medium size, slightly faded.', 8.00, 1, 'Apparel'),
('Black Jeans', 'Worn once, too small.', 10.00, 1, 'Apparel'),
('Puffer Jacket', 'Super warm, zipper a bit stuck.', 15.00, 1, 'Apparel'),
('Running Shoes (Nike)', 'Size 9, worn but clean.', 20.00, 1, 'Apparel'),
('Winter Hat', 'Hand-knit, never worn.', 5.00, 1, 'Apparel'),
('Graphic Tee (Meme Print)', 'Slightly shrunk.', 3.00, 1, 'Apparel'),
('Formal Shirt', 'Used for one presentation.', 7.00, 1, 'Apparel'),
('Sweatpants', 'Cozy, no holes.', 6.00, 1, 'Apparel'),
('Jacket (Leather look)', 'Faux leather, small scratch.', 12.00, 1, 'Apparel'),
('Flip Flops', 'Good for showers or pool.', 2.00, 1, 'Apparel'),

-- health 10
('Resistance Bands', 'Set of 3, barely used.', 5.00, 1, 'Health'),
('Yoga Mat', 'Cleaned, good grip.', 8.00, 1, 'Health'),
('Protein Shaker Bottle', 'Washed, no smell.', 3.00, 1, 'Health'),
('Multivitamins (Unopened)', 'Exp 2026, still sealed.', 10.00, 1, 'Health'),
('Foam Roller', 'Great for post-gym soreness.', 6.00, 1, 'Health'),
('Knee Wraps', 'Lightly used.', 4.00, 1, 'Health'),
('Dumbbells (5lb pair)', 'Basic set, small rust spots.', 8.00, 1, 'Health'),
('Reusable Water Bottle', 'BPA free.', 4.00, 1, 'Health'),
('Hand Sanitizer (Pack of 2)', 'New.', 3.00, 1, 'Health'),
('Sleep Mask', 'Clean, no smells.', 2.00, 1, 'Health'),

-- pet 10
('Small Dog Leash', 'Blue, barely used.', 5.00, 1, 'Pets & Animals'),
('Cat Toy Set', 'My cat got bored, yours might not.', 3.00, 1, 'Pets & Animals'),
('Fish Tank (5 gal)', 'No leaks, comes with filter.', 20.00, 1, 'Pets & Animals'),
('Pet Carrier', 'Used once for vet trip.', 10.00, 1, 'Pets & Animals'),
('Dog Sweater', 'Too small for my dog.', 4.00, 1, 'Pets & Animals'),
('Hamster Wheel', 'Slightly squeaky.', 3.00, 1, 'Pets & Animals'),
('Cat Scratcher', 'Used but still fine.', 5.00, 1, 'Pets & Animals'),
('Bird Feeder', 'Unused, still in box.', 6.00, 1, 'Pets & Animals'),
('Pet Water Bowl', 'Stainless steel, like new.', 2.00, 1, 'Pets & Animals'),
('Dog Treats (unopened)', 'Exp 2025.', 4.00, 1, 'Pets & Animals'),

-- auto 10
('Car Phone Mount', 'Works fine, suction still strong.', 5.00, 1, 'Automotive'),
('Windshield Wipers (pair)', 'Wrong size for my car.', 8.00, 1, 'Automotive'),
('Car Vacuum (small)', 'Charges via USB.', 12.00, 1, 'Automotive'),
('Snow Brush', 'Great for winter.', 6.00, 1, 'Automotive'),
('Seat Covers (black)', 'Set of 2, new.', 15.00, 1, 'Automotive'),
('Air Freshener (Vanilla)', 'New.', 3.00, 1, 'Automotive'),
('Tire Pressure Gauge', 'Works perfectly.', 4.00, 1, 'Automotive'),
('Jumper Cables', 'Used once, good condition.', 10.00, 1, 'Automotive'),
('Dash Cam', 'Works, includes SD card.', 25.00, 1, 'Automotive'),
('Car Charger (Dual USB)', 'Lights up blue.', 5.00, 1, 'Automotive'),

-- games 10
('PS4 Controller (Blue)', 'Some scratches, works fine.', 25.00, 1, 'Games'),
('Nintendo Switch Dock', 'Official, great condition.', 40.00, 1, 'Games'),
('Chess Set', 'One pawn missing.', 5.00, 1, 'Games'),
('Monopoly (Student Edition)', 'Missing one hotel piece.', 4.00, 1, 'Games'),
('UNO Cards', 'Complete deck, slightly bent.', 2.00, 1, 'Games'),
('Old Xbox 360', 'Still runs, comes with 2 games.', 35.00, 1, 'Games'),
('VR Headset', 'Works with smartphone.', 50.00, 1, 'Games'),
('Headphones (Gaming)', 'Mic buzzes a bit.', 15.00, 1, 'Games'),
('Board Game: Codenames', 'Complete and clean.', 8.00, 1, 'Games'),
('Switch Game: Mario Kart 8', 'Just the cartridge.', 35.00, 1, 'Games'),

-- miscellaneous 10
('Mini Fridge', 'Works, bit noisy.', 40.00, 1, 'Miscellaneous'),
('Water Filter Pitcher', 'Clean, filters included.', 10.00, 1, 'Miscellaneous'),
('Umbrella', 'Slightly bent but usable.', 3.00, 1, 'Miscellaneous'),
('Laptop Sleeve', 'Fits 15-inch.', 5.00, 1, 'Miscellaneous'),
('Bike Helmet', 'Hardly used.', 12.00, 1, 'Miscellaneous'),
('Poster: The Office', 'Great dorm decor.', 5.00, 1, 'Miscellaneous'),
('Backpack', 'Few marks, lots of pockets.', 8.00, 1, 'Miscellaneous'),
('Coffee Maker', 'Works fine, no carafe.', 7.00, 1, 'Miscellaneous'),
('Extension Cord (10ft)', 'Works.', 5.00, 1, 'Miscellaneous'),
('Reusable Grocery Bags', '4-pack, clean.', 2.00, 1, 'Miscellaneous');


INSERT INTO mru_dev."Category_Assigned_Products" (category_id, product_id)
SELECT 
    CASE 
        WHEN cat = 'Books' THEN 0
        WHEN cat = 'Electronics' THEN 1
        WHEN cat = 'Supplies' THEN 2
        WHEN cat = 'Furniture' THEN 3
        WHEN cat = 'Apparel' THEN 4
        WHEN cat = 'Health' THEN 5
        WHEN cat = 'Pets & Animals' THEN 6
        WHEN cat = 'Automotive' THEN 7
        WHEN cat = 'Games' THEN 8
        ELSE 9
    END as category_id,
    id AS product_id
FROM mru_dev."Product_Information";



DO $$
DECLARE 
    supabase_ids uuid[] := ARRAY(SELECT supabase_id FROM mru_dev."User_Information");
BEGIN
    UPDATE mru_dev."Product_Information"
    SET user_id = (supabase_ids[floor(random() * array_length(supabase_ids, 1))::int + 1]);
END $$ LANGUAGE plpgsql;



DO $$
DECLARE
    cart_id int8;
    prod_id int8;
    prod_count int;
    i int;
    product_ids int8[];
BEGIN
    product_ids := ARRAY(SELECT id FROM mru_dev."Product_Information");
    FOR cart_id IN SELECT id FROM mru_dev."Shopping_Cart" LOOP
        IF random() < 0.55 THEN
            CONTINUE;
        END IF;
        prod_count := floor(POWER(random(),3) * (10-1) + 1)::int;
        FOR i IN 1..prod_count LOOP
            prod_id := product_ids[floor(random() * array_length(product_ids, 1) + 1)::int];
            INSERT INTO mru_dev."Shopping_Cart_Products"(shopping_cart_id, product_id)
            VALUES (cart_id, prod_id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;



DO $$
DECLARE
    chat_id int8;
    send_id uuid;
    user1_id uuid;
    user2_id uuid;
    count int8;
    mes text[];
    chat_to_send text;
    hour integer := floor(random() * 12 + 1);
    meridiem text := (ARRAY['am','pm'])[floor(random() * 2 + 1)];

    greeting_sender text[] := ARRAY[
        'Hello!',
        'Hi there!',
        'Hey, how''s it going?',
        'Hi, I saw your post about the item.',
        'Hey! I''m interested in something you''re selling.'
    ];

    greeting_responses text[] := ARRAY[
        'Hi! How can I help you?',
        'Hey! Yes, what''s up?',
        'Hi there, which item are you looking at?',
        'Hello! Thanks for reaching out.',
        'Hey, good to hear from you!'
    ];
    
    availability_sender text[] := ARRAY[
        'Is this product still available?',
        'Do you still have this for sale?',
        'Are you still selling this item?',
        'Hey, just checking if this is still up for grabs.',
        'Do you happen to have any extras of this?'
    ];

    availability_responses text[] := ARRAY[
        'Yes, it''s still available!',
        'I''ve got one left!',
        'Sorry, it just sold earlier today.',
        'Yeah, it''s still up for sale.',
        'I only have one more available.'
    ];

    negotiation_sender text[] := ARRAY[
        'I''m really interested, but could you do a bit cheaper?',
        'Would you take $5 less?',
        'Could you do $10 off if I pick it up today?',
        'Is the price negotiable?',
        'That''s a bit expensive for me, can we work something out?'
    ];

    negotiation_responses text[] := ARRAY[
        'Hmm, I can do a small discount, maybe $5 off.',
        'Sorry, the price is firm.',
        'If you pick it up today, I can lower it a little.',
        'Let''s say $5 less — deal?',
        'I''ve already dropped the price quite a bit, sorry!'
    ];

    meetup_sender text[] := ARRAY[
        'Where should we meet up?',
        'What times are you free to meet?',
        'Can we meet on campus?',
        'Would tomorrow afternoon work?',
        'Does ' || hour::text || meridiem || ' work for you?'
    ];

    meetup_responses text[] := ARRAY[
        'I can meet near the library.',
        'Let''s do outside the student center?',
        'I''m free after 3pm today.',
        'Tomorrow works great, what time?',
        hour::text || meridiem || ' sounds good to me!'
    ];

    closing_sender text[] := ARRAY[
        'Perfect, see you then!',
        'Thanks so much!',
        'Sounds good, I''ll message when I''m there.',
        'Alright, I''ll bring cash.',
        'Appreciate it!'
    ];

    closing_responses text[] := ARRAY[
        'See you soon!',
        'No problem, thanks!',
        'Okay, looking forward to it.',
        'Awesome, have a good one!',
        'Great, thanks again!'
    ];

    mes_types text[][] :=
    ARRAY
    [
        greeting_sender,
        greeting_responses,
        availability_sender,
        availability_responses,
        negotiation_sender,
        negotiation_responses,
        meetup_sender,
        meetup_responses,
        closing_sender,
        closing_responses
    ];

BEGIN
    FOR chat_id, user1_id, user2_id IN
    SELECT id, user_id_1, user_id_2 FROM mru_dev."Chats"
    LOOP
        count := 0;

        FOREACH mes SLICE 1 IN ARRAY mes_types LOOP
            IF count % 2 = 0 THEN send_id := user1_id;
            ELSE send_id := user2_id;
            END IF;

            chat_to_send := mes[floor(random() * array_length(mes, 1) + 1)::int];

            INSERT INTO mru_dev."Messages"(chat_id, sender_id, logged_message)
            VALUES (chat_id, send_id, chat_to_send);

            IF floor(random() * 10 + 1) > 9 THEN 
                EXIT;
            END IF;
            count := count +1;
        END LOOP;
    END LOOP;
END $$;