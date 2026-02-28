-- Enable realtime for grocery_list so both partners see updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE public.grocery_list;
