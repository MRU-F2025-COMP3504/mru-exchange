import type {
  DatabaseQuery,
  RequiredColumns,
  UserInteraction,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';

export async function get(
  a: RequiredColumns<UserProfile, 'supabase_id'>,
  b: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<UserInteraction, '*'> {
  return query(
    await supabase
      .from('User_Interactions')
      .select('*')
      .or(
        `and(user_id_1.eq.${a.supabase_id},user_id_2.eq.${b.supabase_id}),and(user_id_1.eq.${b.supabase_id},user_id_2.eq.${a.supabase_id})`,
      )
      .single(),
  );
}

export async function getBlockedOnUser(
  user: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<UserInteraction[], 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .select('id')
      .or(`user_id_1.eq.${user.supabase_id},user_id_2.eq.${user.supabase_id}`)
      .or('user_1_is_blocked.eq.true,user_2_is_blocked.eq.true'),
  );
}

export async function getMutedOnUser(
  user: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<UserInteraction[], 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .select('id')
      .or(`user_id_1.eq.${user.supabase_id},user_id_2.eq.${user.supabase_id}`)
      .or('user_1_is_muted.eq.true,user_2_is_muted.eq.true'),
  );
}

export async function create(
  a: RequiredColumns<UserProfile, 'supabase_id'>,
  b: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<UserInteraction, 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .insert({
        user_id_1: a.supabase_id,
        user_id_2: b.supabase_id,
      })
      .select('id')
      .single(),
  );
}

export async function block(
  blocker: RequiredColumns<UserProfile, 'supabase_id'>,
  target: RequiredColumns<UserProfile, 'supabase_id'>,
  flag = true,
): DatabaseQuery<UserInteraction, 'id'> {
  const interaction = await get(blocker, target);
  if (!interaction.ok) {
    return interaction;
  }

  const data = interaction.data;
  const update =
    data.user_id_1 === target.supabase_id
      ? 'user_1_is_blocked'
      : 'user_2_is_blocked';

  return set(data, update, flag);
}

export async function mute(
  blocker: RequiredColumns<UserProfile, 'supabase_id'>,
  target: RequiredColumns<UserProfile, 'supabase_id'>,
  flag = true,
): DatabaseQuery<UserInteraction, 'id'> {
  const interaction = await get(blocker, target);
  if (!interaction.ok) {
    return interaction;
  }

  const data = interaction.data;
  const update =
    data.user_id_1 === target.supabase_id
      ? 'user_1_is_muted'
      : 'user_2_is_muted';

  return set(data, update, flag);
}

async function set(
  interaction: RequiredColumns<UserInteraction, 'id'>,
  field: string,
  flag: boolean,
): DatabaseQuery<UserInteraction, 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .update({ [field]: flag })
      .eq('id', interaction.id)
      .select('id')
      .single(),
  );
}
