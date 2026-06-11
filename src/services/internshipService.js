import { supabase } from './supabaseClient';

export const getAllInternships = async (userId) => {
  const { data, error } = await supabase
    .from('internships')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const insertInternship = async (internshipData) => {
  const { data, error } = await supabase
    .from('internships')
    .insert([internshipData])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateInternship = async (id, updates) => {
  const { data, error } = await supabase
    .from('internships')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteInternship = async (id) => {
  const { error } = await supabase
    .from('internships')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return id;
};

export const updateInternshipStatus = async (id, newStatus) => {
  const { data, error } = await supabase
    .from('internships')
    .update({ status: newStatus })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const upsertInternship = async (internshipData) => {
  if (internshipData.id) {
    return updateInternship(internshipData.id, internshipData);
  } else {
    return insertInternship(internshipData);
  }
};
