import { supabase } from '../utils/supabase';
import type { UserInteraction } from '../types/database.ts';

export const userInteractionsApi = {
  getOrCreateInteraction: async (userId1: string, userId2: string) => {
    const { data: existing, error: searchError } = await supabase
      .from('User_Interactions')
      .select('*')
      .or(
        `and(user_id_1.eq.${userId1},user_id_2.eq.${userId2}),and(user_id_1.eq.${userId2},user_id_2.eq.${userId1})`,
      )
      .single();

    if (existing) {
      return { data: existing, error: null };
    }

    const { data: newInteraction, error: createError } = await supabase
      .from('User_Interactions')
      .insert({
        user_id_1: userId1,
        user_id_2: userId2,
        user_1_is_blocked: false,
        user_1_is_muted: false,
        user_2_is_blocked: false,
        user_2_is_muted: false,
      })
      .select()
      .single();

    return { data: newInteraction, error: createError };
  },

  blockUser: async (blockerId: string, blockedId: string) => {
    const { data: interaction } =
      await userInteractionsApi.getOrCreateInteraction(blockerId, blockedId);

    if (!interaction) {
      return { error: { message: 'Could not create interaction' } };
    }

    const isUser1 = interaction.user_id_1 === blockerId;
    const updateField = isUser1 ? 'user_1_is_blocked' : 'user_2_is_blocked';

    const { data, error } = await supabase
      .from('User_Interactions')
      .update({ [updateField]: true })
      .eq('id', interaction.id)
      .select()
      .single();

    return { data, error };
  },

  unblockUser: async (blockerId: string, blockedId: string) => {
    const { data: interaction } =
      await userInteractionsApi.getOrCreateInteraction(blockerId, blockedId);

    if (!interaction) {
      return { error: { message: 'Interaction not found' } };
    }

    const isUser1 = interaction.user_id_1 === blockerId;
    const updateField = isUser1 ? 'user_1_is_blocked' : 'user_2_is_blocked';

    const { data, error } = await supabase
      .from('User_Interactions')
      .update({ [updateField]: false })
      .eq('id', interaction.id)
      .select()
      .single();

    return { data, error };
  },

  muteUser: async (muterId: string, mutedId: string) => {
    const { data: interaction } =
      await userInteractionsApi.getOrCreateInteraction(muterId, mutedId);

    if (!interaction) {
      return { error: { message: 'Could not create interaction' } };
    }

    const isUser1 = interaction.user_id_1 === muterId;
    const updateField = isUser1 ? 'user_1_is_muted' : 'user_2_is_muted';

    const { data, error } = await supabase
      .from('User_Interactions')
      .update({ [updateField]: true })
      .eq('id', interaction.id)
      .select()
      .single();

    return { data, error };
  },

  unmuteUser: async (muterId: string, mutedId: string) => {
    const { data: interaction } =
      await userInteractionsApi.getOrCreateInteraction(muterId, mutedId);

    if (!interaction) {
      return { error: { message: 'Interaction not found' } };
    }

    const isUser1 = interaction.user_id_1 === muterId;
    const updateField = isUser1 ? 'user_1_is_muted' : 'user_2_is_muted';

    const { data, error } = await supabase
      .from('User_Interactions')
      .update({ [updateField]: false })
      .eq('id', interaction.id)
      .select()
      .single();

    return { data, error };
  },

  isUserBlocked: async (userId: string, otherUserId: string) => {
    const { data } = await supabase
      .from('User_Interactions')
      .select('*')
      .or(
        `and(user_id_1.eq.${userId},user_id_2.eq.${otherUserId}),and(user_id_1.eq.${otherUserId},user_id_2.eq.${userId})`,
      )
      .single();

    if (!data) return { isBlocked: false, error: null };

    const isUser1 = data.user_id_1 === userId;
    const isBlocked = isUser1 ? data.user_1_is_blocked : data.user_2_is_blocked;

    return { isBlocked: !!isBlocked, error: null };
  },

  isUserMuted: async (userId: string, otherUserId: string) => {
    const { data } = await supabase
      .from('User_Interactions')
      .select('*')
      .or(
        `and(user_id_1.eq.${userId},user_id_2.eq.${otherUserId}),and(user_id_1.eq.${otherUserId},user_id_2.eq.${userId})`,
      )
      .single();

    if (!data) return { isMuted: false, error: null };

    const isUser1 = data.user_id_1 === userId;
    const isMuted = isUser1 ? data.user_1_is_muted : data.user_2_is_muted;

    return { isMuted: !!isMuted, error: null };
  },

  getBlockedUsers: async (userId: string) => {
    const { data, error } = await supabase
      .from('User_Interactions')
      .select(
        `
        *,
        user1:user_id_1 (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        ),
        user2:user_id_2 (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        )
      `,
      )
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .or('user_1_is_blocked.eq.true,user_2_is_blocked.eq.true');

    return { data, error };
  },

  getMutedUsers: async (userId: string) => {
    const { data, error } = await supabase
      .from('User_Interactions')
      .select(
        `
        *,
        user1:user_id_1 (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        ),
        user2:user_id_2 (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        )
      `,
      )
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .or('user_1_is_muted.eq.true,user_2_is_muted.eq.true');

    return { data, error };
  },
};
