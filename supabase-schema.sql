-- Supabase Schema for Bookster
-- Run this in the SQL Editor in your Supabase dashboard

-- Create the listings table
CREATE TABLE IF NOT EXISTS listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    book_title TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0 AND price <= 9999),
    contact_info TEXT NOT NULL,
    condition TEXT CHECK (condition IN ('New', 'Like New', 'Good', 'Acceptable')),
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed'))
);

-- Create indexes for better performance
CREATE INDEX idx_listings_course_code ON listings(course_code);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_price ON listings(price);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security

-- Policy: Authenticated users can view active listings
CREATE POLICY "Authenticated users can view active listings"
ON listings
FOR SELECT
TO authenticated
USING (status = 'active');

-- Policy: Authenticated users can insert their own listings
CREATE POLICY "Users can insert their own listings"
ON listings
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id AND
    course_code IS NOT NULL AND
    book_title IS NOT NULL AND
    price > 0 AND
    price <= 9999 AND
    contact_info IS NOT NULL AND
    status = 'active'
);

-- Policy: Users can update their own listings
CREATE POLICY "Users can update their own listings"
ON listings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own listings
CREATE POLICY "Users can delete their own listings"
ON listings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Optional: Create a view for active listings (makes queries simpler)
CREATE OR REPLACE VIEW active_listings AS
SELECT
    id,
    created_at,
    course_code,
    book_title,
    price,
    contact_info,
    condition,
    notes
FROM listings
WHERE status = 'active'
ORDER BY created_at DESC;

-- Optional: Insert sample data (remove this in production)
INSERT INTO listings (course_code, book_title, price, contact_info, condition, notes)
VALUES
    ('CS 161', 'Introduction to Computer Science', 45.00, '555-0123 or student1@university.edu', 'Good', 'Some highlighting on first three chapters, otherwise great condition'),
    ('MATH 165', 'Calculus: Early Transcendentals', 80.00, '555-0124', 'Like New', 'Barely used, no marks or highlights'),
    ('ECON 101', 'Principles of Microeconomics', 35.00, 'econ_student@university.edu', 'Good', NULL),
    ('CHEM 121', 'General Chemistry: Atoms First', 120.00, '555-0125', 'New', 'Still in plastic wrap, never opened'),
    ('PSY 101', 'Psychology: Core Concepts', 50.00, 'psych_major@university.edu', 'Acceptable', 'Has some wear but all pages intact'),
    ('BIO 211', 'Molecular Biology of the Cell', 95.00, '555-0126', 'Good', 'Previous edition but content is 95% the same'),
    ('ENG 102', 'Norton Anthology of Literature', 40.00, 'english_lit@university.edu', 'Like New', 'Purchased but switched majors'),
    ('PHYS 201', 'University Physics Volume 1', 70.00, '555-0127', 'Good', 'Includes online access code (unused)'),
    ('CS 261', 'Data Structures', 55.00, 'cs_student@university.edu', 'Acceptable', 'Well-used but perfectly readable'),
    ('MATH 265', 'Linear Algebra and Its Applications', 65.00, '555-0128', 'Good', 'Some notes in margins that might be helpful');

-- Function to clean up old listings (optional, for future use)
CREATE OR REPLACE FUNCTION cleanup_old_listings()
RETURNS void AS $$
BEGIN
    UPDATE listings
    SET status = 'removed'
    WHERE created_at < NOW() - INTERVAL '90 days'
    AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- You can schedule the cleanup function to run periodically using pg_cron extension
-- (requires enabling pg_cron in Supabase dashboard first):
-- SELECT cron.schedule('cleanup-old-listings', '0 0 * * *', 'SELECT cleanup_old_listings();');