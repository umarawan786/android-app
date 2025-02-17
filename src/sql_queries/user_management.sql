DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP FUNCTION IF EXISTS public.handle_new_user ();

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user () returns trigger
set
  search_path = '' as $$
begin
  insert into public.profiles (id, full_name, initial_no_child , number_of_child_accounts_created, date_of_birth, first_name, email, role, onboarding_complete, guardian_id)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', -- Only for guardian accounts
    (new.raw_user_meta_data->>'initial_no_child')::int2,
    (new.raw_user_meta_data->>'number_of_child_accounts_created')::int2,
    (new.raw_user_meta_data->>'date_of_birth')::date,
    new.raw_user_meta_data->>'first_name', -- Only for child accounts
    new.raw_user_meta_data->>'email',
    new.raw_user_meta_data->>'role',
    (new.raw_user_meta_data->>'onboarding_complete')::boolean,
    (new.raw_user_meta_data->>'guardian_id')::uuid
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();