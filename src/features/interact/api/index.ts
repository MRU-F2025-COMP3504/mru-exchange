import type {
  DatabaseQuery,
  DatabaseQueryArray,
  DatabaseView,
  RequiredColumns,
  UserInteraction,
} from '@shared/types';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@shared/api';
import { query, view } from '@shared/utils';

export async function get(
  a: RequiredColumns<User, 'id'>,
  b: RequiredColumns<User, 'id'>,
): DatabaseView<UserInteraction> {
  return view(
    await supabase
      .from('User_Interactions')
      .select('*')
      .or(
        `and(user_id_1.eq.${a.id},user_id_2.eq.${b.id}),and(user_id_1.eq.${b.id},user_id_2.eq.${a.id})`,
      )
      .single(),
  );
}

export async function getBlockedOnUser(
  user: RequiredColumns<User, 'id'>,
): DatabaseQueryArray<UserInteraction, 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .select('id')
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .or('user_1_is_blocked.eq.true,user_2_is_blocked.eq.true'),
  );
}

export async function getMutedOnUser(
  user: RequiredColumns<User, 'id'>,
): DatabaseQueryArray<UserInteraction, 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .select('id')
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`)
      .or('user_1_is_muted.eq.true,user_2_is_muted.eq.true'),
  );
}

export async function create(
  a: RequiredColumns<User, 'id'>,
  b: RequiredColumns<User, 'id'>,
): DatabaseQuery<UserInteraction, 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .insert({
        user_id_1: a.id,
        user_id_2: b.id,
      })
      .select('id')
      .single(),
  );
}

export async function block(
  blocker: RequiredColumns<User, 'id'>,
  target: RequiredColumns<User, 'id'>,
  flag = true,
): DatabaseQuery<UserInteraction, 'id'> {
  const interaction = await get(blocker, target);
  if (!interaction.ok) {
    return interaction;
  }

  const data = interaction.data;
  const update =
    data.user_id_1 === target.id ? 'user_1_is_blocked' : 'user_2_is_blocked';

  return set(data, update, flag);
}

export async function mute(
  blocker: RequiredColumns<User, 'id'>,
  target: RequiredColumns<User, 'id'>,
  flag = true,
): DatabaseQuery<UserInteraction, 'id'> {
  const interaction = await get(blocker, target);
  if (!interaction.ok) {
    return interaction;
  }

  const data = interaction.data;
  const update =
    data.user_id_1 === target.id ? 'user_1_is_muted' : 'user_2_is_muted';

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
