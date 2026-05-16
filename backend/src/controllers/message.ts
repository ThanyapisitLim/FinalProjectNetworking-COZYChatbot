import supabase from "../config/supabase.js";

export async function createMessage(userId: string, role: string, context: string, groupId?: number) {
    const insertData: any = { user_id: userId, role, context };
    if (groupId) insertData.group_id = groupId;

    const { data, error } = await supabase
        .from('messages')
        .insert([insertData])
        .select();
    if (error) throw error;
    return data[0];
}

export async function createGroup(groupName: string) {
    const { data, error } = await supabase
        .from('group_messages')
        .insert([{ group_name: groupName }])
        .select();
    if (error) throw error;
    return data[0];
}

export async function getMessagesByUserId(userId: string) {
    const { data, error } = await supabase
        .from('messages')
        .select(`*, group_messages(group_id, group_name)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
}

export async function deleteMessagesByUserId(userId: string) {
    const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}

export async function deleteGroupById(groupId: number) {
    // messages must be deleted before group_messages due to foreign key constraint
    await supabase.from('messages').delete().eq('group_id', groupId);
    const { data, error } = await supabase
        .from('group_messages')
        .delete()
        .eq('group_id', groupId);
    if (error) throw error;
    return data;
}
