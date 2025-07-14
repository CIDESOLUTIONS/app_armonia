import { prisma } from "@/lib/prisma";

export async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      where: {
        isSold: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return listings;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw new Error("No se pudieron obtener los anuncios.");
  }
}

export async function getListingById(id: number) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return listing;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw new Error("No se pudo obtener el anuncio.");
  }
}

export async function createListing(data: any) {
  try {
    const newListing = await prisma.listing.create({
      data: {
        ...data,
        // Asegúrate de que complexId se pase correctamente desde el frontend o se obtenga del contexto del usuario
        // Por ahora, lo dejaremos como un placeholder o asumiremos que viene en `data`
        complexId: 1, // Placeholder: Reemplazar con el complexId real del usuario autenticado
      },
    });
    return newListing;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw new Error("No se pudo crear el anuncio.");
  }
}
