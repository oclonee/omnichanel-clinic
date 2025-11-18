import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPatients(data || []);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Erro ao carregar pacientes",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPatient = async (patientId: string): Promise<Patient | null> => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Error fetching patient:', error);
      return null;
    }
  };

  const createPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Paciente criado",
        description: "Novo paciente adicionado com sucesso.",
      });

      fetchPatients();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar paciente",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updatePatient = async (patientId: string, updates: Partial<Patient>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', patientId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Paciente atualizado",
        description: "Informações do paciente atualizadas com sucesso.",
      });

      fetchPatients();
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar paciente",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPatients();
    }
  }, [user]);

  return {
    patients,
    loading,
    fetchPatients,
    getPatient,
    createPatient,
    updatePatient,
  };
};