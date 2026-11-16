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
export async function getTemplateById(templateId: string, userId?: string) {
  try {
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        OR: [
          { is_system: true },
          { user_id: userId }
        ]
      }
    });
    return template;
  } catch (error) {
    console.error("Gagal mengambil template spesifik:", error);
    return null;
  }
}

export async function createCustomTemplate(data: {
  name: string;
  imageUrl: string;
  requiredPhotos: number;
  color: string;
  userId: string;
}) {
  try {
    const newTemplate = await prisma.template.create({
      data: {
        name: data.name.toUpperCase(), 
        image_url: data.imageUrl,
        required_photos: data.requiredPhotos,
        is_system: false, // Menandakan ini custom buatan user
        color: data.color,
        user_id: data.userId
      }
    });
    return { success: true, data: newTemplate };
  } catch (error) {
    console.error("Gagal menyimpan custom template:", error);
    return { success: false };
  }
}