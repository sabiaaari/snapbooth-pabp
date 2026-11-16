'use server';

import { prisma } from '@/lib/prisma';

// 1. Fungsi untuk mengambil semua templat (digunakan di TemplatesPage)
export async function getTemplates(userId?: string) {
  try {
    if (userId) {
      return await prisma.template.findMany({
        where: {
          OR: [
            { user_id: userId },
            { is_system: true }
          ]
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      return await prisma.template.findMany({
        where: { is_system: true },
        orderBy: { created_at: 'desc' }
      });
    }
  } catch (error) {
    console.error('Error fetching from Prisma:', error);
    return [];
  }
}

// 2. Fungsi untuk mengambil 1 templat spesifik berdasarkan ID (digunakan di BoothPage)
export async function getTemplateById(id: string, userId?: string) {
  try {
    const template = await prisma.template.findUnique({
      where: { id: id }
    });
    
    // Validasi: Pastikan templat ini adalah milik sistem atau milik user yang sedang login
    if (template && (template.is_system || template.user_id === userId)) {
      return template;
    }
    return null;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    return null;
  }
}