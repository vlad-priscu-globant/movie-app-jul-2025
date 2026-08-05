-- Create the favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, movie_id)
);

-- Enable Row-Level Security
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create Policies for CRUD operations

-- READ (Select)
CREATE POLICY "Users can view their own favorite movies" 
    ON public.favorites 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- CREATE (Insert)
CREATE POLICY "Users can add a movie to their favorites" 
    ON public.favorites 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "Users can update their favorite movies" 
    ON public.favorites 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE
CREATE POLICY "Users can remove a movie from their favorites" 
    ON public.favorites 
    FOR DELETE 
    USING (auth.uid() = user_id);
