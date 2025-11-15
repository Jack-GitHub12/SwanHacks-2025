-- Seed Data Script for Bookster
-- Run this in the SQL Editor in your Supabase dashboard
-- NOTE: This script assumes you have at least one user in auth.users
-- If you don't have users yet, create test accounts first through your app's signup

-- First, let's get some user IDs (we'll use the first few users from auth.users)
-- If you don't have users, you'll need to create them first
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    user3_id UUID;
    user4_id UUID;
    user5_id UUID;
    listing_ids UUID[];
    discussion_ids UUID[];
BEGIN
    -- Get user IDs (using the first 5 users, or create dummy UUIDs if none exist)
    SELECT id INTO user1_id FROM auth.users ORDER BY created_at LIMIT 1;
    SELECT id INTO user2_id FROM auth.users ORDER BY created_at OFFSET 1 LIMIT 1;
    SELECT id INTO user3_id FROM auth.users ORDER BY created_at OFFSET 2 LIMIT 1;
    SELECT id INTO user4_id FROM auth.users ORDER BY created_at OFFSET 3 LIMIT 1;
    SELECT id INTO user5_id FROM auth.users ORDER BY created_at OFFSET 4 LIMIT 1;

    -- If we don't have enough users, use the first user for all
    IF user2_id IS NULL THEN user2_id := user1_id; END IF;
    IF user3_id IS NULL THEN user3_id := user1_id; END IF;
    IF user4_id IS NULL THEN user4_id := user1_id; END IF;
    IF user5_id IS NULL THEN user5_id := user1_id; END IF;

    -- Only proceed if we have at least one user
    IF user1_id IS NULL THEN
        RAISE EXCEPTION 'No users found in auth.users. Please create at least one user account first.';
    END IF;

    -- ============================================
    -- SEED LISTINGS
    -- ============================================
    INSERT INTO listings (user_id, course_code, book_title, price, contact_info, condition, notes, status)
    VALUES
        (user1_id, 'CS 161', 'Introduction to Computer Science', 45.00, 'student1@university.edu', 'Good', 'Some highlighting on first three chapters, otherwise great condition', 'active'),
        (user2_id, 'MATH 165', 'Calculus: Early Transcendentals', 80.00, '555-0124', 'Like New', 'Barely used, no marks or highlights', 'active'),
        (user3_id, 'ECON 101', 'Principles of Microeconomics', 35.00, 'econ_student@university.edu', 'Good', 'Great condition, used for one semester', 'active'),
        (user1_id, 'CHEM 121', 'General Chemistry: Atoms First', 120.00, '555-0125', 'New', 'Still in plastic wrap, never opened', 'active'),
        (user4_id, 'PSY 101', 'Psychology: Core Concepts', 50.00, 'psych_major@university.edu', 'Acceptable', 'Has some wear but all pages intact', 'active'),
        (user2_id, 'BIO 211', 'Molecular Biology of the Cell', 95.00, '555-0126', 'Good', 'Previous edition but content is 95% the same', 'active'),
        (user5_id, 'ENG 102', 'Norton Anthology of Literature', 40.00, 'english_lit@university.edu', 'Like New', 'Purchased but switched majors', 'active'),
        (user3_id, 'PHYS 201', 'University Physics Volume 1', 70.00, '555-0127', 'Good', 'Includes online access code (unused)', 'active'),
        (user1_id, 'CS 261', 'Data Structures and Algorithms', 55.00, 'cs_student@university.edu', 'Acceptable', 'Well-used but perfectly readable', 'active'),
        (user4_id, 'MATH 265', 'Linear Algebra and Its Applications', 65.00, '555-0128', 'Good', 'Some notes in margins that might be helpful', 'active'),
        (user2_id, 'HIST 101', 'World History: A Comprehensive Guide', 42.00, 'history_buff@university.edu', 'Like New', 'Barely opened, perfect condition', 'active'),
        (user5_id, 'PHIL 201', 'Introduction to Philosophy', 38.00, 'philosophy@university.edu', 'Good', 'Light highlighting, otherwise excellent', 'active'),
        (user3_id, 'STAT 301', 'Statistics for Data Science', 88.00, '555-0129', 'New', 'Brand new, still sealed', 'active'),
        (user1_id, 'ART 150', 'Art History: Renaissance to Modern', 75.00, 'art_student@university.edu', 'Good', 'Color images are vibrant, no damage', 'active'),
        (user4_id, 'MUS 101', 'Music Theory Fundamentals', 52.00, '555-0130', 'Like New', 'Used for one semester, like new', 'active')
    RETURNING id INTO listing_ids;

    -- ============================================
    -- SEED DISCUSSIONS
    -- ============================================
    INSERT INTO discussions (user_id, title, content, category, status, views, reply_count, event_date, event_time, event_end_time, event_location)
    VALUES
        -- General discussions
        (user1_id, 'Best study spots on campus?', 'Looking for quiet places to study. The library is always packed. Any recommendations for hidden gems?', 'general', 'active', 45, 3, NULL, NULL, NULL, NULL),
        (user2_id, 'Midterm study group for CS 161', 'Anyone interested in forming a study group for the upcoming CS 161 midterm? We can meet at the library.', 'study-groups', 'active', 32, 2, NULL, NULL, NULL, NULL),
        (user3_id, 'Looking for roommates for next semester', 'Need 2 roommates for a 3-bedroom apartment near campus. $600/month each. DM for details!', 'housing', 'active', 78, 5, NULL, NULL, NULL, NULL),
        (user4_id, 'Part-time job opportunities on campus', 'Does anyone know of any part-time jobs available on campus? Looking for something flexible with classes.', 'jobs', 'active', 56, 4, NULL, NULL, NULL, NULL),
        (user5_id, 'Join the Photography Club!', 'We meet every Thursday at 6 PM. All skill levels welcome. Bring your camera or phone!', 'clubs', 'pinned', 120, 8, NULL, NULL, NULL, NULL),
        
        -- Events
        (user1_id, 'Spring Festival 2025', 'Join us for the annual Spring Festival! Food, music, games, and more. Free entry for all students.', 'events', 'active', 234, 12, 
         (NOW() + INTERVAL '30 days')::timestamp, '10:00 AM', '6:00 PM', 'Main Quad'),
        (user2_id, 'Hackathon Weekend', '48-hour coding competition. Prizes for top teams. Food and drinks provided. Register now!', 'events', 'active', 189, 9,
         (NOW() + INTERVAL '15 days')::timestamp, '9:00 AM', '9:00 PM', 'Engineering Building'),
        (user3_id, 'Career Fair 2025', 'Meet with top employers. Bring your resume! Over 50 companies attending.', 'events', 'pinned', 456, 23,
         (NOW() + INTERVAL '45 days')::timestamp, '11:00 AM', '4:00 PM', 'Student Center'),
        (user4_id, 'Movie Night: Outdoor Screening', 'Free outdoor movie screening of a popular film. Bring blankets and snacks!', 'events', 'active', 167, 7,
         (NOW() + INTERVAL '7 days')::timestamp, '7:00 PM', '10:00 PM', 'North Lawn'),
        (user5_id, 'Guest Speaker: Tech Industry Panel', 'Industry professionals discussing careers in tech. Q&A session included.', 'events', 'active', 98, 5,
         (NOW() + INTERVAL '20 days')::timestamp, '3:00 PM', '5:00 PM', 'Lecture Hall A'),
        (user1_id, 'Study Break: Coffee and Donuts', 'Free coffee and donuts in the student lounge. Take a break from studying!', 'events', 'active', 76, 3,
         (NOW() + INTERVAL '3 days')::timestamp, '2:00 PM', '4:00 PM', 'Student Lounge'),
        (user2_id, 'Volunteer Day: Community Garden', 'Help us plant and maintain the community garden. No experience needed!', 'events', 'active', 54, 2,
         (NOW() + INTERVAL '10 days')::timestamp, '9:00 AM', '12:00 PM', 'Community Garden'),
        (user3_id, 'Dance Workshop', 'Learn basic dance moves in this fun workshop. All levels welcome!', 'events', 'active', 43, 1,
         (NOW() + INTERVAL '12 days')::timestamp, '6:00 PM', '8:00 PM', 'Dance Studio'),
        
        -- More general discussions
        (user4_id, 'Best coffee shops near campus?', 'Looking for good study spots with great coffee. What are your favorites?', 'general', 'active', 89, 6, NULL, NULL, NULL, NULL),
        (user5_id, 'Textbook exchange program', 'Anyone interested in starting a textbook exchange program? We could save a lot of money!', 'general', 'active', 67, 4, NULL, NULL, NULL, NULL),
        (user1_id, 'Gym buddy needed', 'Looking for someone to go to the gym with. Prefer mornings around 7 AM.', 'general', 'active', 34, 2, NULL, NULL, NULL, NULL),
        (user2_id, 'Computer Science Club Meeting', 'Monthly meeting this Friday. We''ll be discussing upcoming projects and events.', 'clubs', 'active', 56, 3, NULL, NULL, NULL, NULL),
        (user3_id, 'Summer internship opportunities', 'Has anyone found good summer internships? Looking for recommendations in tech.', 'jobs', 'active', 123, 8, NULL, NULL, NULL, NULL)
    RETURNING id INTO discussion_ids;

    -- ============================================
    -- SEED DISCUSSION REPLIES
    -- ============================================
    -- Replies for first discussion (Best study spots)
    INSERT INTO discussion_replies (discussion_id, user_id, content)
    VALUES
        (discussion_ids[1], user2_id, 'The third floor of the library is usually quiet, especially in the afternoon.'),
        (discussion_ids[1], user3_id, 'The student center has some nice nooks on the second floor. Not many people know about them!'),
        (discussion_ids[1], user4_id, 'Coffee shop on Main Street has great WiFi and isn''t too loud during weekdays.');

    -- Replies for study group discussion
    INSERT INTO discussion_replies (discussion_id, user_id, content)
    VALUES
        (discussion_ids[2], user4_id, 'I''m in! When are you thinking of meeting?'),
        (discussion_ids[2], user5_id, 'Count me in too. I can bring practice problems.');

    -- Replies for housing discussion
    INSERT INTO discussion_replies (discussion_id, user_id, content)
    VALUES
        (discussion_ids[3], user1_id, 'Interested! Can you send more details about the location?'),
        (discussion_ids[3], user2_id, 'Is parking included?'),
        (discussion_ids[3], user4_id, 'I might be interested. When does the lease start?'),
        (discussion_ids[3], user5_id, 'DM sent!'),
        (discussion_ids[3], user1_id, 'Following up on my previous message...');

    -- Replies for job opportunities
    INSERT INTO discussion_replies (discussion_id, user_id, content)
    VALUES
        (discussion_ids[4], user1_id, 'The dining hall is always hiring. Flexible hours!'),
        (discussion_ids[4], user2_id, 'Check the career center website. They post jobs regularly.'),
        (discussion_ids[4], user3_id, 'Library is hiring student assistants. Great for studying while working.'),
        (discussion_ids[4], user5_id, 'Tutoring center pays well if you''re good at a subject.');

    -- Replies for Photography Club
    INSERT INTO discussion_replies (discussion_id, user_id, content)
    VALUES
        (discussion_ids[5], user1_id, 'Sounds fun! Do I need to bring my own camera?'),
        (discussion_ids[5], user2_id, 'What kind of photography do you focus on?'),
        (discussion_ids[5], user3_id, 'I''m a beginner, is that okay?'),
        (discussion_ids[5], user4_id, 'Can''t wait to join!'),
        (discussion_ids[5], user1_id, 'Phone cameras are totally fine! We cover all skill levels.'),
        (discussion_ids[5], user2_id, 'We do everything from portraits to landscapes.'),
        (discussion_ids[5], user3_id, 'Perfect! See you there.'),
        (discussion_ids[5], user4_id, 'Do you have an Instagram I can follow?');

    -- Replies for Spring Festival
    INSERT INTO discussion_replies (discussion_id, user_id, content)
    VALUES
        (discussion_ids[6], user2_id, 'Can''t wait! What kind of food will be there?'),
        (discussion_ids[6], user3_id, 'Will there be live music?'),
        (discussion_ids[6], user4_id, 'Is this event free?'),
        (discussion_ids[6], user5_id, 'Bringing all my friends!'),
        (discussion_ids[6], user1_id, 'Yes, free entry! We''ll have food trucks and a live band.'),
        (discussion_ids[6], user2_id, 'Awesome! See you there.');

    -- ============================================
    -- SEED VOTES
    -- ============================================
    -- Add some votes to discussions (mix of upvotes and downvotes)
    INSERT INTO discussion_votes (discussion_id, user_id, vote_type)
    VALUES
        -- Spring Festival (popular event)
        (discussion_ids[6], user2_id, 'up'),
        (discussion_ids[6], user3_id, 'up'),
        (discussion_ids[6], user4_id, 'up'),
        (discussion_ids[6], user5_id, 'up'),
        (discussion_ids[6], user1_id, 'up'),
        
        -- Career Fair (very popular)
        (discussion_ids[8], user1_id, 'up'),
        (discussion_ids[8], user2_id, 'up'),
        (discussion_ids[8], user3_id, 'up'),
        (discussion_ids[8], user4_id, 'up'),
        (discussion_ids[8], user5_id, 'up'),
        
        -- Hackathon
        (discussion_ids[7], user1_id, 'up'),
        (discussion_ids[7], user3_id, 'up'),
        (discussion_ids[7], user4_id, 'up'),
        (discussion_ids[7], user5_id, 'up'),
        
        -- Photography Club
        (discussion_ids[5], user1_id, 'up'),
        (discussion_ids[5], user2_id, 'up'),
        (discussion_ids[5], user3_id, 'up'),
        
        -- Movie Night
        (discussion_ids[9], user1_id, 'up'),
        (discussion_ids[9], user2_id, 'up'),
        (discussion_ids[9], user3_id, 'up'),
        (discussion_ids[9], user4_id, 'up'),
        
        -- Guest Speaker
        (discussion_ids[10], user2_id, 'up'),
        (discussion_ids[10], user3_id, 'up'),
        (discussion_ids[10], user4_id, 'up');

    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Listings created: %', array_length(listing_ids, 1);
    RAISE NOTICE 'Discussions created: %', array_length(discussion_ids, 1);
END $$;

